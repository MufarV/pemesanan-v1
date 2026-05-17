const admin = require('firebase-admin');
const fs = require('fs');
const fbConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));

if (!admin.apps.length) {
    admin.initializeApp();
}

// Pass databaseId to firestore()
const db = admin.firestore(admin.app(), fbConfig.firestoreDatabaseId);

async function test() {
  try {
    const snap = await db.collection('operasional_toko').get();
    snap.forEach(doc => {
        console.log("DOC:", doc.id);
        console.log(JSON.stringify(doc.data(), null, 2));
    });
    
    // Check all subcollections of root maybe? No, admin sdk doesn't list root collections easily if we are limited
    const colls = await db.listCollections();
    for (let c of colls) {
        console.log("Collection Name:", c.id);
    }
  } catch(e) {
    console.error("ADMIN ERROR:", e);
  }
}
test();
