import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { credential } from 'firebase-admin';

const firebaseAdminConfig = {
  credential: credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')
  })
};

const apps = getApps();
const app = apps.length === 0 ? initializeApp(firebaseAdminConfig) : apps[0];
const adminDb = getFirestore(app);

export { adminDb };