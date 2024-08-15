// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2_x0bVeeGmiEio171pzbsS25cxnGxViE",
  authDomain: "authen-7a7f1.firebaseapp.com",
  projectId: "authen-7a7f1",
  storageBucket: "authen-7a7f1.appspot.com",
  messagingSenderId: "184143758703",
  appId: "1:184143758703:web:e622a1ce65f5f5b50d949a",
  measurementId: "G-7XJ7CG40YK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
export default app;
 