import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const fbConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(fbConfig);
const db = getFirestore(app, fbConfig.firestoreDatabaseId);

async function test() {
  const colls = [
    'operasional_toko'
  ];

  for (let c of colls) {
    try {
      const snap = await getDocs(collection(db, c));
      snap.forEach(doc => {
        console.log(`FOUND IN COLLECTION: ${c}, DOC: ${doc.id}`);
        console.log(JSON.stringify(doc.data(), null, 2));
      });
    } catch(e) {
       console.error(e);
    }
  }
  process.exit();
}
test();
