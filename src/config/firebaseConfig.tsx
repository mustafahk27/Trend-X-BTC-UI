// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNrcmWLZkA46-lJlwfC51TI--QkCLxXZg",
  authDomain: "trend-x-btc-c7d80.firebaseapp.com",
  databaseURL: "https://trend-x-btc-c7d80-default-rtdb.firebaseio.com",
  projectId: "trend-x-btc-c7d80",
  storageBucket: "trend-x-btc-c7d80.firebasestorage.app",
  messagingSenderId: "873033239854",
  appId: "1:873033239854:web:5dc6fec76cb7bfd6d7bebf",
  measurementId: "G-5Z7P4X1P0J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Storage
const storage = getStorage(app);

// Only initialize analytics on client side
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export default storage;
export { analytics }; 