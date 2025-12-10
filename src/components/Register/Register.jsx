import React, { useState } from "react";
import { useAuth } from "../../context/AuthProvider.jsx";
import { useNavigate, Link, useLocation } from "react-router";
import { GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import { auth } from "../../firebase/firebase.init";
import toast, { Toaster } from "react-hot-toast";

const Register = () => {
  const { createUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Password Validation
  const validatePassword = (password) => {
    const uppercase = /[A-Z]/.test(password);
    const lowercase = /[a-z]/.test(password);
    const minLength = password.length >= 6;
    return uppercase && lowercase && minLength;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      toast.error("Password must include uppercase, lowercase & min 6 characters.");
      return;
    }

    setLoading(true);

    try {
      // Create user in Firebase
      const result = await createUser(email, password);

      // Update profile with name + photo
      await updateProfile(result.user, {
        displayName: name,
        photoURL: photoURL || null,
      });

      // Store in your database (optional)
      const userData = {
        name,
        password,
        email,
        photoURL: photoURL || null,
        role: "USER",
      };

      await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      toast.success("Registration successful!");
      navigate(from, { replace: true });

    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      toast.success("Google login successful!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="hero bg-gradient-to-r from-[#49c9a5] to-[#4db4d7] min-h-screen">
      <Toaster />

      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Register now!</h1>
          <p className="py-6">Create your account to access TicketBari services.</p>
        </div>

        <div className="card bg-gradient-to-r from-[#47aa8e] to-[#6497a8] w-full max-w-sm shadow-2xl">
          <div className="card-body">
            
            <form onSubmit={handleRegister} className="space-y-4">

              {/* Name */}
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered w-full bg-[#3a826d] text-white"
                required
              />

              {/* Photo URL */}
              <input
                type="text"
                placeholder="Photo URL"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                className="input input-bordered w-full bg-[#3a826d] text-white"
              />

              {/* Email */}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full bg-[#3a826d] text-white"
                required
              />

              {/* Password */}
              <input
                type="password"
                placeholder="Password (A-Z, a-z, 6+ chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full bg-[#3a826d] text-white"
                required
              />

              <button
                className="btn btn-neutral w-full mt-2"
                type="submit"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>

            <div className="divider">OR</div>

            {/* Google Login */}
            <button onClick={handleGoogleLogin} className="btn btn-outline w-full">
              Continue with Google
            </button>

            <p className="mt-4 text-center">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Login
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
