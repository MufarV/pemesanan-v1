import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const fbConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(fbConfig);
const db = getFirestore(app, fbConfig.firestoreDatabaseId);

async function test() {
  try {
    const snap = await getDoc(doc(db, 'pengaturan', 'pengaturan_toko'));
    console.log(Object.keys(snap.data() || {}));
    
    // maybe there's a collection tracking tools? Look at other collections.
  } catch(e) {
    console.error(e.message);
  }
  process.exit();
}
test();
