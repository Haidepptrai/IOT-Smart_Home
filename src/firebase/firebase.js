import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "iot-smarthome-bedfe.firebaseapp.com",
  databaseURL: process.env.REACT_APP_DB_URL,
  projectId: "iot-smarthome-bedfe",
  storageBucket: "iot-smarthome-bedfe.appspot.com",
  messagingSenderId: "571829585703",
  appId: process.env.REACT_APP_APP_ID,
  measurementId: "G-5KDMQTCNS1",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);
export { database, auth };
