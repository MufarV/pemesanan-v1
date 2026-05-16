import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  try {
    const docRef = await addDoc(collection(db, "pesanan"), {
        customerName: "Test",
        items: "[]",
        tanggal_po: "2024-05-15",
        waktu_po: "pagi",
        totalHarga: 1000,
        status: "Baru"
    });
    console.log(`Success! Created document id: ` + docRef.id);
    process.exit(0);
  } catch (error) {
    console.error("Firestore Error:", error);
    process.exit(1);
  }
}
run();
