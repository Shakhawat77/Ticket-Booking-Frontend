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

  const fetchToken = async (email) => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/jwt`, { params: { email } });
      if (data?.token) {
        localStorage.setItem("accessToken", data.token);
        return data.token;
      } else {
        console.warn("JWT token not returned from backend");
        localStorage.removeItem("accessToken");
        return null;
      }
    } catch (err) {
      console.error("Error fetching token:", err.response?.data || err.message);
      localStorage.removeItem("accessToken");
      return null;
    }
  };

  const createUser = async (email, password, name) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      await axios.post(`${BACKEND_URL}/users`, {
        name: name || newUser.displayName || "New User",
        email: newUser.email,
      });

      await fetchToken(newUser.email);

      setUser(newUser);
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

      const token = await fetchToken(userCredential.user.email);
      if (!token) throw new Error("Failed to get JWT token");

      setUser(userCredential.user);
      return userCredential;
    } catch (error) {
      console.error("User sign-in failed:", error);
      localStorage.removeItem("accessToken");
      throw error;
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
        setUser(currentUser);
      } else {
        console.error("JWT token not returned after Google login");
        await signOut(auth);
        setUser(null);
      }
    } catch (err) {
      console.error("Google login failed:", err.response?.data || err.message);
      await signOut(auth);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      localStorage.removeItem("accessToken");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser || null);

      if (currentUser && !localStorage.getItem("accessToken")) {
        await fetchToken(currentUser.email);
      }

      if (!currentUser) localStorage.removeItem("accessToken");

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    signInUser,
    googleLogin,
    logOut,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
