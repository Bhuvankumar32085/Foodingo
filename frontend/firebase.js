// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQMILXsXesonYXdAcIEj9uCFDPc_RSRLI",
  // authDomain: "foodingo-2c3b8.firebaseapp.com",
  authDomain: "foodingo-g39f.onrender.com",
  projectId: "foodingo-2c3b8",
  storageBucket: "foodingo-2c3b8.firebasestorage.app",
  messagingSenderId: "495102796463",
  appId: "1:495102796463:web:782127e565be7c96aa2a5a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { app, auth };
