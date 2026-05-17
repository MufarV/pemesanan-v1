import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import fs from 'fs';

const fbConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(fbConfig);
const db = getFirestore(app, fbConfig.firestoreDatabaseId);

async function test() {
  const docsToTry = [
    'operasional',
    'operasional_toko',
    'frontEnd',
    'digital_tools',
    'settings'
  ];
  const collectionsToTry = ['pengaturan', 'settings', 'config', 'admin', 'digital_tools', 'toko_online', 'operasional'];

  for (let c of collectionsToTry) {
    for (let d of docsToTry) {
      try {
        const snap = await getDoc(doc(db, c, d));
        if (snap.exists()) {
          console.log(`FOUND: ${c}/${d}`, snap.data());
        }
      } catch(e) {
        // ignore
      }
    }
  }
  process.exit();
}
test();
