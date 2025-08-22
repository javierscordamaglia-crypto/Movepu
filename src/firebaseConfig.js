// firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDL21l2LfeEo3sD33kFBkk8HCATLHqtH_M",
  authDomain: "moveup-8379f.firebaseapp.com",
  projectId: "moveup-8379f",
  storageBucket: "moveup-8379f.appspot.com",
  messagingSenderId: "629036677717",
  appId: "1:629036677717:web:e8fbde76512fc2f1b232dc"
};

// Inizializza Firebase solo una volta
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Esporta auth e db
export const auth = getAuth(app);
export const db = getFirestore(app);
