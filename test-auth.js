import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function run() {
  try {
    const userCredential = await signInAnonymously(auth);
    console.log("Success:", userCredential.user.uid);
    process.exit(0);
  } catch (error) {
    console.error("Auth Error:", error);
    process.exit(1);
  }
}
run();
