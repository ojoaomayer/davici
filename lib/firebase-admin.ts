import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function getServiceAccount() {
  const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!key) return undefined;
  
  try {
    const serviceAccount = JSON.parse(key);
    // Next.js dotenv loads single-quoted strings literally, meaning \n becomes backslash+n.
    // We must replace them with actual newlines AFTER JSON parsing so the crypto module can read the PEM.
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
    return serviceAccount;
  } catch (e) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Please ensure it is valid JSON.", e);
    return undefined;
  }
}

if (!getApps().length) {
  try {
    const serviceAccount = getServiceAccount();

    if (serviceAccount) {
      initializeApp({
        credential: cert(serviceAccount),
      });
    } else {
      console.warn("Using application default credentials because FIREBASE_SERVICE_ACCOUNT_KEY is invalid or missing.");
      initializeApp();
    }
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

export const db = getFirestore();
