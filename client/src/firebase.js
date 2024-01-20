// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-fbdb7.firebaseapp.com",
  projectId: "mern-estate-fbdb7",
  storageBucket: "mern-estate-fbdb7.appspot.com",
  messagingSenderId: "459242912677",
  appId: "1:459242912677:web:efcede846a53a58ca1c64c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);