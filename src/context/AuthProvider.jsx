import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase/firebase.init";
import axios from "axios";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch JWT token safely
  const fetchToken = async (email) => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/jwt`, {
        params: { email },
      });
      if (data?.token) {
        localStorage.setItem("accessToken", data.token);
      } else {
        console.warn("JWT token not returned from backend");
        localStorage.removeItem("accessToken");
      }
    } catch (err) {
      console.error("Error fetching token:", err.response?.data || err.message);
      localStorage.removeItem("accessToken");
      throw err;
    }
  };

  // ------------------- Authentication Functions -------------------
  const createUser = async (email, password, name) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // Create user record in MongoDB
      await axios.post(`${BACKEND_URL}/users`, {
        name: name || newUser.displayName || "New User",
        email: newUser.email,
      });

      // Fetch JWT AFTER backend user is created
      await fetchToken(newUser.email);
setLoading(false)
      return userCredential;
    } catch (error) {
      console.error("User creation failed:", error);
      localStorage.removeItem("accessToken");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInUser = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await fetchToken(userCredential.user.email);
      return userCredential;
    } catch (error) {
      console.error("User sign-in failed:", error);
      localStorage.removeItem("accessToken");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      localStorage.removeItem("accessToken");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const currentUser = result.user;

      const { data } = await axios.post(`${BACKEND_URL}/users/google-login`, {
        name: currentUser.displayName,
        email: currentUser.email,
        photoURL: currentUser.photoURL,
        uid: currentUser.uid,
      });

      if (data?.token) {
        localStorage.setItem("accessToken", data.token);
      } else {
        console.error("JWT token not returned after Google login");
        await signOut(auth);
      }
    } catch (err) {
      console.error("Google login failed:", err.response?.data || err.message);
      await signOut(auth);
    } finally {
      setLoading(false);
    }
  };

  // ------------------- Auth State Observer -------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      // Do NOT auto-fetch JWT here; registration or login flow already fetches it
      if (!currentUser) localStorage.removeItem("accessToken");

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    createUser,
    signInUser,
    logOut,
    googleLogin,
    user,
    loading,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
