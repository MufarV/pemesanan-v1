import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from '../../firebase-applet-config.json';

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// CRITICAL: Harus menyertakan parameter database ID ini agar terhubung ke database spesifik
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
