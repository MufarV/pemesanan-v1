import fs from 'fs';

const fbConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));

async function test() {
  const url = `https://firestore.googleapis.com/v1/projects/${fbConfig.projectId}/databases/${fbConfig.firestoreDatabaseId}/documents/pengaturan`;
  console.log("Fetching:", url);
  
  const res = await fetch(url);
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

test();
