import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const fbConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(fbConfig);
const db = getFirestore(app, fbConfig.firestoreDatabaseId);

async function test() {
  const c = collection(db, 'pengaturan');
  const d = await getDocs(c);
  d.forEach(doc => {
      console.log(doc.id, Object.keys(doc.data() || {}));
      if (doc.id !== 'pengaturan_toko') console.log(JSON.stringify(doc.data()));
  });

  process.exit();
}
test();
