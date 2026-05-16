import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  try {
    const snap = await getDoc(doc(db, "pengaturan", "pengaturan_toko"));
    if (snap.exists()) {
      console.log(`Success! Fetched document.`);
    } else {
        console.log("Document not found");
    }
    process.exit(0);
  } catch (error) {
    console.error("Firestore Error:", error);
    process.exit(1);
  }
}
run();
