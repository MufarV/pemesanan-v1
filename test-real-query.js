import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import fs from 'fs';

const fbConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(fbConfig);
const db = getFirestore(app, fbConfig.firestoreDatabaseId);

async function test() {
  try {
    const q = query(
      collection(db, 'pesanan'),
      where('ownerId', '==', 'MCggQBt70BeNWsg7mDJooJ9jJ003'),
      where('status', '!=', 'Dibatalkan')
    );
    const snap = await getDocs(q);
    console.log('Orders:', snap.docs.length);
  } catch(e) {
    console.error("Error length:", e.message.length);
    console.error(e.message);
  }
  process.exit();
}
test();
