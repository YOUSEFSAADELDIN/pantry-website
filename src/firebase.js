// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";  

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9--_6ZdcBmoYYwycggxABz-OR5yro2yM",
  authDomain: "inventory-management-439d2.firebaseapp.com",
  projectId: "inventory-management-439d2",
  storageBucket: "inventory-management-439d2.appspot.com",
  messagingSenderId: "552517957261",
  appId: "1:552517957261:web:12ae93a6934455add554c4",
  measurementId: "G-YP1NZW9X41"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };