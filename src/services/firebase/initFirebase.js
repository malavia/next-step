//initialise Firebase afin de commencer à exploiter les SDK pour les produits que vous souhaitez utiliser

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwgQbI2304NXuprIj-Ew4RMIc7qbmdx3k",
  authDomain: "plateformewellbeing.firebaseapp.com",
  projectId: "plateformewellbeing",
  storageBucket: "plateformewellbeing.appspot.com",
  messagingSenderId: "390332869930",
  appId: "1:390332869930:web:9d54bb6d1a4f00208cc253",
  measurementId: "G-YFVGJQF2SD"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, app };