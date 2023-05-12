var firebaseConfig = {
    apiKey: "AIzaSyCKAGLqB9lcBkowH-oTUvlorFJGvEZvFJ0",
    authDomain: "comp2800-bby5.firebaseapp.com",
    projectId: "comp2800-bby5",
    storageBucket: "comp2800-bby5.appspot.com",
    messagingSenderId: "1038968543123",
    appId: "1:1038968543123:web:d54566658044831591fa66"
  };

  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const storage = firebase.storage();

  