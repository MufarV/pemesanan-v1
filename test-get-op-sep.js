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
  } catch (e) {
    console.error('ERROR d1:', e.message);
  }

  try {
    const d2 = await getDoc(doc(db, 'pengaturan', 'digital_tools'));
    console.log('digital_tools:', d2.exists() ? d2.data() : 'NOT FOUND');
  } catch (e) {
    console.error('ERROR d2:', e.message);
  }

  try {
    const d3 = await getDoc(doc(db, 'pengaturan', 'operasional_toko'));
    console.log('operasional_toko:', d3.exists() ? d3.data() : 'NOT FOUND');
  } catch (e) {
    console.error('ERROR d3:', e.message);
  }

  try {
    const d4 = await getDoc(doc(db, 'digital_tools', 'keterangan'));
    console.log('digital_tools/keterangan:', d4.exists() ? d4.data() : 'NOT FOUND');
  } catch (e) {
    console.error('ERROR d4:', e.message);
  }

  process.exit();
}
test();
