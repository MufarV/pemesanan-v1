import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const fbConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(fbConfig);
const db = getFirestore(app, fbConfig.firestoreDatabaseId);

async function test() {
  try {
    const snap = await getDocs(collection(db, 'pengaturan'));
    snap.forEach(doc => {
      console.log('pengaturan doc:', doc.id, JSON.stringify(doc.data(), null, 2));
    });
  } catch(e) {
    console.error(e.message);
  }
  process.exit();
}
test();
