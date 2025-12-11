// /src/firebase/firebase.init.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore"; // 1. Import getFirestore

const firebaseConfig = {
    // ... your configuration variables from .env ...
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize the Firebase App
const app = initializeApp(firebaseConfig);

// Initialize and EXPORT Firebase Authentication
export const auth = getAuth(app); 

// 2. Initialize and EXPORT Firebase Firestore Database 
export const db = getFirestore(app); // <-- 🎯 FIX: Add this line