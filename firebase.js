import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDFE60cRR-1wLN6nvc2z9wHve-lvzbLJvg",
  authDomain: "budgetplannerwithvisualization.firebaseapp.com",
  projectId: "budgetplannerwithvisualization",
  storageBucket: "budgetplannerwithvisualization.firebasestorage.app",
  messagingSenderId: "803228441384",
  appId: "1:803228441384:web:180f7400c075b4b86b0e1d",
  measurementId: "G-2M769QZYJN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
