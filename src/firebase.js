// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLwAFUx1AZp25bokXM6VcAsDOU2f4U840",
  authDomain: "nep-survey-89184.firebaseapp.com",
  projectId: "nep-survey-89184",
  storageBucket: "nep-survey-89184.firebasestorage.app",
  messagingSenderId: "713078794899",
  appId: "1:713078794899:web:8990bb7e6bbb6eadcffb66"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
export default app;