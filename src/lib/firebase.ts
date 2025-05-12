import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAc7fdJwc_m2SGzIS52yuqQHwOPbRT-gl0",
  authDomain: "click-and-done-51e0d.firebaseapp.com",
  projectId: "click-and-done-51e0d",
  storageBucket: "click-and-done-51e0d.firebasestorage.app",
  messagingSenderId: "434201404491",
  appId: "1:434201404491:web:142994c931d44b361e99ce",
  measurementId: "G-MFXXQ9C7Z8"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage }; 