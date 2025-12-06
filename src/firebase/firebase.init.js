// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAC2XTuCxDvwaEkKyl7jpSgzNVH76gc6kA",
  authDomain: "ticket-booking-platform-9ca9d.firebaseapp.com",
  projectId: "ticket-booking-platform-9ca9d",
  storageBucket: "ticket-booking-platform-9ca9d.firebasestorage.app",
  messagingSenderId: "663586781324",
  appId: "1:663586781324:web:3313b0fa17adeb29e823a9",
  measurementId: "G-4FZS7X7YC8"
};


const app = initializeApp(firebaseConfig);
// Initialize Firebase
export const auth = getAuth(app);
export default app;