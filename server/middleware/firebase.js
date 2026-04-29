// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDlId84iqW_0w3itOzh7rrxNOBcIryGso",
  authDomain: "petes-plan.firebaseapp.com",
  projectId: "petes-plan",
  storageBucket: "petes-plan.firebasestorage.app",
  messagingSenderId: "1083857039972",
  appId: "1:1083857039972:web:193144ffa1845d32df2571",
  measurementId: "G-PQL9L3BW6D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);