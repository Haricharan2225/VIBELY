import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyPlaceholderVibelyApiKey12345678',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'vibely-app.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'vibely-app',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef123456',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set persistent login — user stays logged in across browser restarts
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('Firebase persistence warning:', err);
});

export { auth };
export default app;
