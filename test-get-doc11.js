import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import fs from 'fs';

const fbConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(fbConfig);
const db = getFirestore(app, fbConfig.firestoreDatabaseId);

async function test() {
  const docs = [
    'pengaturan/operasional_toko_online',
    'pengaturan/digital_tools',
    'pengaturan/operasional',
    'pengaturan/front_end',
    'digital_tools/operasional_toko_online',
    'operasional_toko_online/keterangan_front_end'
  ];

  for (let path of docs) {
    try {
      const [coll, id] = path.split('/');
      const snap = await getDoc(doc(db, coll, id));
      if (snap.exists()) {
        console.log(`FOUND: ${path}`);
        console.log(JSON.stringify(snap.data(), null, 2));
      }
    } catch(e) {
       console.error(`Error on ${path}: ${e.message}`);
    }
  }
  process.exit();
}
test();
