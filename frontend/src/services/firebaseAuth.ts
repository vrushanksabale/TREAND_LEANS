import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  Auth
} from 'firebase/auth';
import { UserProfile } from '../types';

// Read configuration from Vite environment variables (.env.local)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
};

export let app: FirebaseApp | null = null;
export let auth: Auth | null = null;
export let analytics: Analytics | null = null;

export function isFirebaseConfigured(): boolean {
  const key = import.meta.env.VITE_FIREBASE_API_KEY;
  return Boolean(
    key &&
    key.length > 10 &&
    !key.includes('your_') &&
    !key.includes('ReplaceWithYourOwnKey')
  );
}

try {
  if (firebaseConfig.apiKey) {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    auth = getAuth(app);

    // Initialize Firebase Analytics if in a supported browser environment
    if (typeof window !== 'undefined' && app && firebaseConfig.measurementId) {
      isSupported().then(supported => {
        if (supported && app) {
          analytics = getAnalytics(app);
        }
      }).catch(err => {
        console.warn('Firebase Analytics not supported in current environment:', err);
      });
    }
  }
} catch (e) {
  console.error('Firebase initialization error:', e);
}

const STORAGE_SESSION_KEY = 'trendlens_auth_profile';

export function getCachedUserProfile(): UserProfile | null {
  const data = localStorage.getItem(STORAGE_SESSION_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  return null;
}

export function setCachedUserProfile(profile: UserProfile | null) {
  if (profile) {
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(profile));
  } else {
    localStorage.removeItem(STORAGE_SESSION_KEY);
  }
}

// User-friendly error message formatter for Firebase codes
export function formatAuthError(err: any): string {
  if (!err) return 'Authentication operation failed.';
  const code = err.code || '';
  const message = err.message || '';

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password. Please verify your credentials.';
    case 'auth/email-already-in-use':
      return 'An investigator account with this email already exists. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password is too weak. Please choose a password with at least 6 characters.';
    case 'auth/invalid-email':
      return 'The email address format is invalid.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in popup was closed before completing authentication.';
    case 'auth/popup-blocked':
      return 'Google sign-in popup was blocked by your browser. Please allow popups for this site.';
    case 'auth/network-request-failed':
      return 'Network connection failure. Please check your internet connectivity.';
    case 'auth/invalid-api-key':
    case 'auth/api-key-not-valid.':
      return 'Firebase API key is invalid. Please verify VITE_FIREBASE_API_KEY in .env.local.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled in the Firebase Console (Authentication > Sign-in method).';
    case 'auth/too-many-requests':
      return 'Access temporarily blocked due to repeated failed attempts. Please try again later.';
    default:
      if (message.includes('API key')) {
        return 'Please provide your active Firebase API key in .env.local to authenticate.';
      }
      return message || 'Authentication failed. Please check your credentials.';
  }
}

/**
 * Sign in using Firebase Email & Password
 */
export async function loginWithEmail(email: string, pass: string): Promise<UserProfile> {
  if (!auth) {
    throw new Error('Firebase authentication is not initialized. Please configure your Firebase keys in .env.local.');
  }

  try {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    const user = res.user;
    const profile: UserProfile = {
      uid: user.uid,
      displayName: user.displayName || email.split('@')[0],
      email: user.email || email,
      photoURL: user.photoURL || undefined,
      isGuest: false,
      createdAt: user.metadata.creationTime || new Date().toISOString()
    };
    setCachedUserProfile(profile);
    return profile;
  } catch (err: any) {
    throw new Error(formatAuthError(err));
  }
}

/**
 * Register a new researcher account using Firebase Email & Password
 */
export async function registerWithEmail(email: string, pass: string, name?: string): Promise<UserProfile> {
  if (!auth) {
    throw new Error('Firebase authentication is not initialized. Please configure your Firebase keys in .env.local.');
  }

  try {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    const user = res.user;

    if (name) {
      try {
        await updateProfile(user, { displayName: name });
      } catch (e) {
        console.warn('Could not set displayName on new user:', e);
      }
    }

    const profile: UserProfile = {
      uid: user.uid,
      displayName: name || user.displayName || email.split('@')[0],
      email: user.email || email,
      photoURL: user.photoURL || undefined,
      isGuest: false,
      createdAt: user.metadata.creationTime || new Date().toISOString()
    };
    setCachedUserProfile(profile);
    return profile;
  } catch (err: any) {
    throw new Error(formatAuthError(err));
  }
}

/**
 * Sign in with Google Popup via Firebase Authentication
 */
export async function loginWithGoogle(): Promise<UserProfile> {
  if (!auth) {
    throw new Error('Firebase authentication is not initialized. Please configure your Firebase keys in .env.local.');
  }

  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const res = await signInWithPopup(auth, provider);
    const user = res.user;

    const profile: UserProfile = {
      uid: user.uid,
      displayName: user.displayName || 'NASA Earth Detective',
      email: user.email || '',
      photoURL: user.photoURL || undefined,
      isGuest: false,
      createdAt: user.metadata.creationTime || new Date().toISOString()
    };
    setCachedUserProfile(profile);
    return profile;
  } catch (err: any) {
    throw new Error(formatAuthError(err));
  }
}

/**
 * Send password reset email via Firebase Authentication
 */
export async function resetPassword(email: string): Promise<void> {
  if (!auth) {
    throw new Error('Firebase authentication is not initialized. Please configure your Firebase keys in .env.local.');
  }

  try {
    await sendPasswordResetEmail(auth, email);
  } catch (err: any) {
    throw new Error(formatAuthError(err));
  }
}

/**
 * Sign out from Firebase Authentication
 */
export async function logOut(): Promise<void> {
  setCachedUserProfile(null);
  if (auth) {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.warn('Sign out error:', e);
    }
  }
}

/**
 * Subscribe to real Firebase authentication state changes
 */
export function subscribeToAuth(callback: (user: UserProfile | null) => void): () => void {
  if (!auth) {
    callback(getCachedUserProfile());
    return () => {};
  }

  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      const profile: UserProfile = {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Researcher',
        email: firebaseUser.email || '',
        photoURL: firebaseUser.photoURL || undefined,
        isGuest: false,
        createdAt: firebaseUser.metadata.creationTime || new Date().toISOString()
      };
      setCachedUserProfile(profile);
      callback(profile);
    } else {
      setCachedUserProfile(null);
      callback(null);
    }
  });
}
