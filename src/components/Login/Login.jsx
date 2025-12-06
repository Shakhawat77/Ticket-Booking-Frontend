import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/firebase.init";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../../context/AuthProvider";

const Login = () => {
  const {signInUser}=useAuth()
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInUser(email, password);
      toast.success("Login successful!");
     navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Google login successful!");
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="hero bg-gradient-to-r from-[#49c9a5] to-[#4db4d7] min-h-screen">
      <Toaster />
      <div className="hero-content flex-col lg:flex-row-reverse ">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">
            Access your account to post jobs or apply for work.
          </p>
        </div>

        <div className="card bg-gradient-to-r from-[#49c9a5] to-[#4db4d7] w-full max-w-sm shadow-2xl">
          <div className="card-body">
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full bg-[#3a826d] text-white"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full bg-[#3a826d] text-white"
                required
              />

              <div className="text-right">
                <span className="text-sm text-blue-600 cursor-pointer">
                  Forgot password?
                </span>
              </div>

              <button
                className="btn btn-neutral w-full mt-2"
                type="submit"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="divider">OR</div>

            <button
              onClick={handleGoogleLogin}
              className="btn btn-outline w-full"
            >
              Continue with Google
            </button>

            <p className="mt-4 text-center">
              Don't have an account?{" "}
              <Link to="/register" className="link link-primary">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
