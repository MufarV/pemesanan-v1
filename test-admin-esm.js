import admin from 'firebase-admin';
import fs from 'fs';

const fbConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));

if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore(admin.app(), fbConfig.firestoreDatabaseId);

async function test() {
  try {
    const colls = await db.listCollections();
    for (let c of colls) {
        console.log("Collection Name:", c.id);
    }
  } catch(e) {
    console.error("ADMIN ERROR:", e);
  }
}
test();
