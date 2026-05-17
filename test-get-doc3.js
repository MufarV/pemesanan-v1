import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const fbConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(fbConfig);
const db = getFirestore(app, fbConfig.firestoreDatabaseId);

async function test() {
  try {
    const snap = await getDocs(collection(db, 'digital_tools'));
    snap.forEach(doc => {
      console.log('digital_tools doc:', doc.id, doc.data());
    });
  } catch(e) {
    if (!e.message.includes("Missing or insufficient permissions")) {
      console.log(e.message);
    }
  }
  process.exit();
}
test();
