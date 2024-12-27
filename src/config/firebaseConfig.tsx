// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDNrcmWLZkA46-lJlwfC51TI--QkCLxXZg",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "trend-x-btc-c7d80.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://trend-x-btc-c7d80-default-rtdb.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "trend-x-btc-c7d80",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "trend-x-btc-c7d80.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "873033239854",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:873033239854:web:5dc6fec76cb7bfd6d7bebf",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-5Z7P4X1P0J"
};

// Initialize Firebase properly
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Storage with error handling
let firebaseStorage: FirebaseStorage;
try {
  firebaseStorage = getStorage(app);
} catch (error) {
  console.error("Error initializing Firebase Storage:", error);
  // Provide a fallback or throw error as needed
  throw new Error("Failed to initialize Firebase Storage");
}

// Only initialize analytics on client side
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export default firebaseStorage;