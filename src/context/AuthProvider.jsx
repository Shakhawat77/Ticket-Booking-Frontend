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
  // Ensure VITE_BACKEND_URL is set (e.g., http://localhost:3000)
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
      // Logs the specific error message from the backend (e.g., "User not found")
      console.error("Error fetching token:", err.response?.data || err.message);
      localStorage.removeItem("accessToken");
      // Re-throw the error so it can be caught by the caller if needed
      throw err; 
    }
  };

  /* ---------------------- Authentication Functions ---------------------- */

  const createUser = async (email, password, name) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser = userCredential.user;
      
      // 1. CRITICAL FIX: Create user record in MongoDB immediately
      await axios.post(`${BACKEND_URL}/users`, {
        name: name || newUser.displayName || "New User", 
        email: newUser.email,
        // password is null/ignored on the backend as Firebase handles it
      }); 

      // 2. Fetch the JWT token (Now the user exists in MongoDB)
      await fetchToken(newUser.email);
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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const signedInUser = userCredential.user;

      // After successful sign-in in Firebase, fetch the JWT token from your backend.
      // This will succeed because the user should already be in MongoDB.
      await fetchToken(signedInUser.email);
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

      // Send user info to backend to create/update user in MongoDB and get JWT
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
        await signOut(auth); // Force sign out if token fetch fails
      }
    } catch (err) {
      console.error("Google login failed:", err.response?.data || err.message);
      await signOut(auth);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------- Auth State Observer ---------------------- */

  // Listen to auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser?.email) {
        const existingToken = localStorage.getItem("accessToken");
        
        // Only fetch token if it's missing (e.g., first load/refresh)
        if (!existingToken) {
          try {
            // This is the call that was failing on initial register, but should succeed now
            // since the user is created in MongoDB inside createUser().
            await fetchToken(currentUser.email);
          } catch (error) {
            // If fetching token fails here (e.g., user exists in Firebase but was deleted from DB)
            // The console.error inside fetchToken will handle the log.
          }
        }
      } else {
        localStorage.removeItem("accessToken");
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /* ---------------------- Context Value ---------------------- */
  
  const authInfo = {
    createUser,
    signInUser,
    logOut,
    googleLogin,
    user,
    loading,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;