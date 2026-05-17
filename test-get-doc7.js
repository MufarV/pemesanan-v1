import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import fs from 'fs';

const fbConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(fbConfig);
const db = getFirestore(app, fbConfig.firestoreDatabaseId);

async function test() {
  const docsToTry = [
    { c: 'pengaturan', d: 'operasional_toko_online' },
    { c: 'operasional_toko_online', d: 'front_end' },
    { c: 'pengaturan', d: 'operasional' },
    { c: 'pengaturan', d: 'digital_tools' },
    { c: 'digital_tools', d: 'operasional_toko_online' },
    { c: 'digital_tools', d: 'operasional' }
  ];

  for (let {c, d} of docsToTry) {
    try {
      const snap = await getDoc(doc(db, c, d));
      if (snap.exists()) {
        console.log(`FOUND: ${c}/${d}`, snap.data());
      }
    } catch(e) {
      if (!e.message.includes('permission')) {
          console.warn(`Error on ${c}/${d}:`, e.message);
      }
    }
  }
  process.exit();
}
test();
