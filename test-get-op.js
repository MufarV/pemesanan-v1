import { initializeApp } from 'firebase/app';
import { getFirestore, getDoc, doc } from 'firebase/firestore';
import { readFile } from 'fs/promises';

async function test() {
  const configStr = await readFile('./firebase-applet-config.json', 'utf-8');
  const config = JSON.parse(configStr);
  const app = initializeApp(config);
  const db = getFirestore(app, config.firestoreDatabaseId);

  try {
    const d1 = await getDoc(doc(db, 'pengaturan', 'operasional_toko_online'));
    console.log('operasional_toko_online:', d1.exists() ? d1.data() : 'NOT FOUND');
    
    const d2 = await getDoc(doc(db, 'pengaturan', 'digital_tools'));
    console.log('digital_tools:', d2.exists() ? d2.data() : 'NOT FOUND');
  } catch (e) {
    console.error('ERROR:', e.message);
  }
}
test();
