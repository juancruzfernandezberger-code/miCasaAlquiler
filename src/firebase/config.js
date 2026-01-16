// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBf1EHlGG4EtUBb7JvHkUCdukRaSA3Qkfk",
  authDomain: "portafoliocasa.firebaseapp.com",
  projectId: "portafoliocasa",
  storageBucket: "portafoliocasa.firebasestorage.app",
  messagingSenderId: "599448558570",
  appId: "1:599448558570:web:a0d78324f52be8a93cf093"
};
// Inicializamos Firebase
const app = initializeApp(firebaseConfig);

// Exportamos los servicios que usaremos
export const db = getFirestore(app);
export const auth = getAuth(app);