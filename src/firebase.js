import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCO7RqDaBJPMWLdXGNPMr9awYta8lM_EyE",
    authDomain: "whosaidthis-cff7a.firebaseapp.com",
    projectId: "whosaidthis-cff7a",
    storageBucket: "whosaidthis-cff7a.appspot.com",
    messagingSenderId: "351336100953",
    appId: "1:351336100953:web:bf69dd1866679c2da2ad48",
    measurementId: "G-NXDKL702H9"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }