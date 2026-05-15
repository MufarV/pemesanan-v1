import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "gen-lang-client-0151673203",
  appId: "1:765853185976:web:645f1c238c9399531a414d",
  apiKey: "AIzaSyDICNAnVv1tfruFERfryij_pROBfs3-_QU",
  authDomain: "gen-lang-client-0151673203.firebaseapp.com",
  storageBucket: "gen-lang-client-0151673203.firebasestorage.app",
  messagingSenderId: "765853185976",
  measurementId: ""
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// CRITICAL: Harus menyertakan parameter database ID ini agar terhubung ke database spesifik
export const db = getFirestore(app, "ai-studio-0f662e5f-e75c-43b6-802f-9de8794d2bcf");
