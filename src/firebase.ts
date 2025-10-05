// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBA_xipzYJIZnR0KSGeamEUzCh-kZtei2E",
  authDomain: "legal-ded14.firebaseapp.com",
  projectId: "legal-ded14",
  storageBucket: "legal-ded14.firebasestorage.app",
  messagingSenderId: "890570875097",
  appId: "1:890570875097:web:9b4b8d45f7efddf5635ec8",
  measurementId: "G-74DWFGV97V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
