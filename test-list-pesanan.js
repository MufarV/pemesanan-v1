import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { readFile } from 'fs/promises';

async function test() {
  const configStr = await readFile('./firebase-applet-config.json', 'utf-8');
  const config = JSON.parse(configStr);
  const app = initializeApp(config);
  const db = getFirestore(app, config.firestoreDatabaseId);

  try {
    const q = query(collection(db, "pesanan"), where("ownerId", "==", "MCggQBt70BeNWsg7mDJooJ9jJ003"));
    const snap = await getDocs(q);
    console.log('pesanan docs:', snap.docs.length);
  } catch (e) {
    console.error('ERROR list pesanan:', e.message);
  }

  process.exit();
}
test();
