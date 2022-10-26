import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBhXtKtJy5DoqQOq6U6xE0Hy5tEV3SKxvo",
    authDomain: "dsa3101-project.firebaseapp.com",
    projectId: "dsa3101-project",
    storageBucket: "dsa3101-project.appspot.com",
    messagingSenderId: "7578463665",
    appId: "1:7578463665:web:f0a6e7e95ab436c7c4a190",
    databaseURL: "https://dsa3101-project-default-rtdb.asia-southeast1.firebasedatabase.app"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firebase Realtime Database
export const db = getDatabase(app);