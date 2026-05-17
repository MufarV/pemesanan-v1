import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const fbConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(fbConfig);
const db = getFirestore(app, fbConfig.firestoreDatabaseId);

async function test() {
  const colls = [
    'users', 'pesanan', 'pengaturan', 'operasional', 'tools', 'digital_tools', 
    'admin', 'settings', 'config', 'data', 'toko', 'online', 'front_end', 'frontend',
    'keterangan', 'operasional_toko', 'operasional_toko_online', 'targets'
  ];

  for (let c of colls) {
    try {
      const snap = await getDocs(collection(db, c));
      snap.forEach(doc => {
        const str = JSON.stringify(doc.data());
        if (str.toLowerCase().includes('front')) {
          console.log(`FOUND IN COLLECTION: ${c}, DOC: ${doc.id}`);
          console.log(str);
        }
      });
    } catch(e) {
       // skip
    }
  }
  process.exit();
}
test();
