import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import api from './api';

export const firebaseAuthService = {
  // Google Sign In/Sign Up
  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Get Firebase ID token
      const token = await user.getIdToken();
      
      // Send token to backend for verification and user creation/login
      const response = await api.post('/auth/google-signin', {
        idToken: token,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
      
      return {
        success: true,
        data: {
          user: response.data.data.user,
          token: response.data.token,
          firebaseToken: token,
        }
      };
    } catch (error) {
      console.error('Google Sign In Error:', error);
      return {
        success: false,
        error: error.message || 'Google sign in failed',
      };
    }
  },

  // Sign Out
  signOut: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Sign Out Error:', error);
      return {
        success: false,
        error: error.message || 'Sign out failed',
      };
    }
  },

  // Listen to auth state changes
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback);
  },

  // Get current user
  getCurrentUser: () => {
    return auth.currentUser;
  },

  // Get Firebase token
  getFirebaseToken: async () => {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  },

  // Email/Password Registration (optional - Firebase)
  registerWithEmail: async (email, password, displayName) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      // Update user profile with display name
      if (displayName) {
        await updateProfile(user, { displayName });
      }
      
      const token = await user.getIdToken();
      
      // Send to backend for user creation
      const response = await api.post('/auth/register', {
        email: user.email,
        displayName: displayName || user.email.split('@')[0],
        firebaseUid: user.uid,
      });
      
      return {
        success: true,
        data: {
          user: response.data.user,
          token: response.data.token,
          firebaseToken: token,
        }
      };
    } catch (error) {
      console.error('Email Registration Error:', error);
      return {
        success: false,
        error: error.message || 'Registration failed',
      };
    }
  },

  // Email/Password Login (optional - Firebase)
  loginWithEmail: async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const token = await user.getIdToken();
      
      // Send to backend for token validation and user fetch
      const response = await api.post('/auth/firebase-login', {
        idToken: token,
        firebaseUid: user.uid,
      });
      
      return {
        success: true,
        data: {
          user: response.data.user,
          token: response.data.token,
          firebaseToken: token,
        }
      };
    } catch (error) {
      console.error('Email Login Error:', error);
      return {
        success: false,
        error: error.message || 'Login failed',
      };
    }
  },
};

export default firebaseAuthService;
