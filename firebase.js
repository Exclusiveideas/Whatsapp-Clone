import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCM00WOnUAsOoGsJD-oyj0qLGEWp5ys0eo",
  authDomain: "whatsapp-clone-1c980.firebaseapp.com",
  projectId: "whatsapp-clone-1c980",
  storageBucket: "whatsapp-clone-1c980.appspot.com",
  messagingSenderId: "677865561469",
  appId: "1:677865561469:web:95cf452e65569a31118014"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = initializeFirestore(app, {
    experimentalForceLongPolling: true
});

export function signIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
}


export function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
}