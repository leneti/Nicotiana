import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAlj0PrQcYtLKs3z2E1tqy2_y0jWWM4Q4M",
  authDomain: "nicotiana-2a0b8.firebaseapp.com",
  databaseURL: "https://nicotiana-2a0b8.firebaseio.com",
  projectId: "nicotiana-2a0b8",
  storageBucket: "nicotiana-2a0b8.appspot.com",
  messagingSenderId: "386162334155",
  appId: "1:386162334155:web:2f8ededc8b9b3ffdc5fe4e",
  measurementId: "G-WG2MMSXWRB",
};

if (!firebase.apps.length) {
  try {
    firebase.initializeApp(firebaseConfig);
    firebase.firestore().settings({ experimentalForceLongPolling: true });
  } catch (err) {
    console.log(err);
  }
}

const db = firebase.firestore();

export { firebase, db };
