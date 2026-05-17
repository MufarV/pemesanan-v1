import { initializeApp } from 'firebase/app';
import { getFirestore, getDocs, collection } from 'firebase/firestore';
import { readFile } from 'fs/promises';

async function test() {
  const configStr = await readFile('./firebase-applet-config.json', 'utf-8');
  const config = JSON.parse(configStr);
  const app = initializeApp(config);
  const db = getFirestore(app, config.firestoreDatabaseId);

  try {
    const s1 = await getDocs(collection(db, 'digital_tools'));
    console.log('digital_tools collection:', s1.docs.map(d => ({id: d.id, data: d.data()})));
  } catch (e) {
    console.error('digital_tools ERROR:', e.message);
  }

  try {
    const s2 = await getDocs(collection(db, 'operasional_toko_online'));
    console.log('operasional_toko_online collection:', s2.docs.map(d => ({id: d.id, data: d.data()})));
  } catch (e) {
    console.error('operasional_toko_online ERROR:', e.message);
  }
}
test();
