// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9i4n0zK0Xsvx6mDVofKQcQhtLV_hzwb4",
  authDomain: "frankzone-a75ae.firebaseapp.com",
  databaseURL: "https://frankzone-a75ae-default-rtdb.firebaseio.com",
  projectId: "frankzone-a75ae",
  storageBucket: "frankzone-a75ae.appspot.com",
  messagingSenderId: "251194184034",
  appId: "1:251194184034:web:99ed695ef02d1f49611c3b",
  measurementId: "G-LBM1E36B6P",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
const analytics = getAnalytics(app);
export const db = getDatabase(app);