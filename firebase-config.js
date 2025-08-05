// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOdDEfI5_LA9wtk8WAdSq3XBn-ppoUHvY",
  authDomain: "tasks-web-app-new.firebaseapp.com",
  projectId: "tasks-web-app-new",
  storageBucket: "tasks-web-app-new.appspot.com",
  messagingSenderId: "757740956566",
  appId: "1:757740956566:web:1602a1c68d442591008bb7",
  measurementId: "G-TZTG841QNJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export db for use in script.js
export { db };