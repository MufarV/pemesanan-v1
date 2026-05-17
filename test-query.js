import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const fbConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(fbConfig);
const db = getFirestore(app, fbConfig.firestoreDatabaseId);

async function test() {
  try {
    const snap = await getDocs(collection(db, 'pesanan'));
    console.log('Orders:', snap.docs.length);
  } catch(e) {
    console.error(e.message);
  }
}
test();
