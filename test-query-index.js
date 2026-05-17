import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { readFile } from 'fs/promises';

async function test() {
  const configStr = await readFile('./firebase-applet-config.json', 'utf-8');
  const config = JSON.parse(configStr);
  const app = initializeApp(config);
  const db = getFirestore(app, config.firestoreDatabaseId);

  try {
    console.log('Listing all pesanan docs...');
    const snap = await getDocs(collection(db, "pesanan"));
    console.log('Success! Docs found:', snap.docs.length);
    if (snap.docs.length > 0) {
      console.log('First doc data:', snap.docs[0].data());
    }
  } catch (e) {
    console.error('LIST ERROR:', e.message);
  }

  process.exit();
}
test();
