import { initializeApp } from "firebase/app";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDcNyNX-Ug3noLEGtRIcPENow_1XZGgTCM",
  authDomain: "tp-multitema-suez-dyner.firebaseapp.com",
  projectId: "tp-multitema-suez-dyner",
  storageBucket: "tp-multitema-suez-dyner.appspot.com",
  messagingSenderId: "59627792642",
  appId: "1:59627792642:web:6b157964b8af2d14e13a1b",
  measurementId: "G-6C6XMWN7DE"
};

// Inicializa Firebase
export const app = initializeApp(firebaseConfig);