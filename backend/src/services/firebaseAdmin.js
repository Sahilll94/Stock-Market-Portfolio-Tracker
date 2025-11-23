import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Initialize Firebase Admin SDK
 * This function initializes Firebase Admin SDK using service account credentials
 */
export const initializeFirebaseAdmin = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length > 0) {
      console.log('Firebase Admin SDK already initialized');
      return admin;
    }

    // Try to load service account from environment variable or file
    let serviceAccount;

    // First try: environment variable with JSON string
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      } catch (error) {
        console.warn('Could not parse FIREBASE_SERVICE_ACCOUNT_JSON environment variable');
      }
    }

    // Second try: environment variables (individual fields)
    if (!serviceAccount && process.env.FIREBASE_PROJECT_ID) {
      serviceAccount = {
        type: 'service_account',
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
      };
    }

    // Third try: service account file
    if (!serviceAccount) {
      const serviceAccountPath = path.join(__dirname, '../../serviceAccountKey.json');
      if (fs.existsSync(serviceAccountPath)) {
        const rawData = fs.readFileSync(serviceAccountPath);
        serviceAccount = JSON.parse(rawData);
      }
    }

    if (!serviceAccount) {
      throw new Error(
        'Firebase service account not found. Please set FIREBASE_SERVICE_ACCOUNT_JSON or individual Firebase environment variables.'
      );
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID
    });

    console.log('Firebase Admin SDK initialized successfully');
    return admin;

  } catch (error) {
    console.error('Failed to initialize Firebase Admin SDK:', error.message);
    throw error;
  }
};

/**
 * Verify Firebase ID Token
 * @param {string} idToken - Firebase ID token from frontend
 * @returns {object} - Decoded token payload
 */
export const verifyIdToken = async (idToken) => {
  try {
    if (!idToken) {
      throw new Error('ID token is required');
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;

  } catch (error) {
    console.error('Firebase ID token verification failed:', error.message);
    throw new Error('Invalid or expired Firebase ID token: ' + error.message);
  }
};

/**
 * Get Firebase user info
 * @param {string} uid - Firebase user UID
 * @returns {object} - Firebase user record
 */
export const getFirebaseUser = async (uid) => {
  try {
    const userRecord = await admin.auth().getUser(uid);
    return userRecord;
  } catch (error) {
    console.error('Failed to get Firebase user:', error.message);
    throw new Error('Firebase user not found');
  }
};

export default { initializeFirebaseAdmin, verifyIdToken, getFirebaseUser };
