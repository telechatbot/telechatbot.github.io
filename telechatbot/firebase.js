// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js";
import { getFirestore, collection, doc, addDoc, getDocs, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA7gJ0WJD9Z2gS-3zc8KNXIyYOwbCsLWaU",
    authDomain: "telechatbot-d41ef.firebaseapp.com",
    projectId: "telechatbot-d41ef",
    storageBucket: "telechatbot-d41ef.appspot.com",
    messagingSenderId: "900836002309",
    appId: "1:900836002309:web:7dc7468c26069015bd2a6c",
    measurementId: "G-Z8T3L47B52"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const collectionRef = collection(db, "users");
const loginRef = doc(db, "login", "2vYvrMbgRB7ftIPWd6RU");
const getUsers = async () => {
  try {
    const querySnapshot = await getDocs(collectionRef);
    return querySnapshot;
  } catch (error) {
    console.error("Error reading collection:", error);
  }
};

const readData = async () => {
    const collectionRef = collection(db, "Portfolio");

    try {
      const querySnapshot = await getDocs(collectionRef);

      querySnapshot.forEach((doc) => {
        console.log("Document ID:", doc.id);
        console.log("Data:", doc.data());
      });
    } catch (error) {
      console.error("Error reading collection:", error);
    }
  };

  // Call the readData function when needed
  //readData();

const LOGIN = async (count) =>{
    try {
        const documentSnapshot = await getDoc(loginRef);
        if (documentSnapshot.exists()) {
          try {
          await updateDoc(loginRef,{
            totalLogin:documentSnapshot.data().totalLogin+1
          });
          console.log("Document successfully updated");
        } catch (error) {
          console.error("Error updating document:", error);
        }
        } else {
          console.log("Document does not exist");
        }
      } catch (error) {
        console.error("Error reading document:", error);
      }
}



const SIGNUP = async ( chatId, pin) =>{
    const newUser = { chatID: parseInt(chatId) , pin:parseInt(pin)};
      try {
        const docRef = await addDoc(collectionRef, newUser);
        console.log("Document written with ID: ", docRef.id);
      } catch (error) {
        console.error("Error adding document: ", error);
      }
      try {
        const documentSnapshot = await getDoc(loginRef);
        if (documentSnapshot.exists()) {
          try {
          await updateDoc(loginRef,{
            totalNumberOfUsers:documentSnapshot.data().totalNumberOfUsers+1
          });
          console.log("Document successfully updated");
        } catch (error) {
          console.error("Error updating document:", error);
        }
        } else {
          console.log("Document does not exist");
        }
      } catch (error) {
        console.error("Error reading document:", error);
      }
}
// Export Firebase modules
export {
  db,
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  getUsers,
  SIGNUP,
  LOGIN
};
