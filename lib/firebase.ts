import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

function cleanEnv(val: string | undefined, fallback: string): string {
  if (!val || typeof val !== 'string' || val.trim() === '') return fallback;
  return val.replace(/^["']|["']$/g, '').trim();
}

const firebaseConfig = {
  apiKey: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY, "AIzaSyFakeKeyForPrerenderingBuildOnly123456"),
  authDomain: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, "davici-ba722.firebaseapp.com"),
  projectId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, "davici-ba722"),
  storageBucket: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, "davici-ba722.firebasestorage.app"),
  messagingSenderId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, "665124241465"),
  appId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_APP_ID, "1:665124241465:web:abcdef1234567890"),
};

// Initialize Firebase client instance once
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, storage, googleProvider };

