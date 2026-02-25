import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCchWvvWsMIk6g5cICdoOJWfYqAEFdObAU",
  authDomain: "healthcare-data-manageme-79dcd.firebaseapp.com",
  projectId: "healthcare-data-manageme-79dcd",
  storageBucket: "healthcare-data-manageme-79dcd.firebasestorage.app",
  messagingSenderId: "586916873782",
  appId: "1:586916873782:web:48ef627cda1726e1157a97",
  measurementId: "G-Y8NLYWP1EZ",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
