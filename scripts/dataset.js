// Import required dependencies
const admin = require('firebase-admin');
const csv = require('csv-parser');
const fs = require('fs');

// Load the service account key JSON file for Firebase Admin SDK
let serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Create a reference to the Firestore service
let dbs = admin.firestore();

// Create an array to store data read from CSV
let data = [];

// Create a readable stream from the CSV file and pipe it through the csv-parser
fs.createReadStream('../gutiarDB.csv')
  .pipe(csv())
  .on('data', (row) => {
    // For each row in the CSV file, push the row data to our array
    data.push(row);
  })
  .on('end', () => {
    // Once we're done reading the CSV file, log a completion message and start uploading the data to Firestore
    console.log('CSV file successfully processed');
    uploadToFirestore(data);
  });

function uploadToFirestore(data) {
  // Iterate through each row of data
  data.forEach((row, index) => {
    // For each row, create a new document in the 'database' collection of Firestore with ID as 'document_index'
    // The data for the document is the row data
    dbs.collection('database').doc(`document_${index}`).set(row)
      .then(() => console.log(`Document_${index} successfully written!`))
      .catch((error) => console.error("Error writing document: ", error));
  });
}

async function addRandomField() {
  // Get all song documents
  const songDocs = await firebase.firestore().collection('database').get();

  // Initialize a batch
  let batch = firebase.firestore().batch();
  let count = 0;

  // Iterate over each song document
  for (const doc of songDocs.docs) {
    // For each song, add a 'Random' field with a random number
    const songRef = firebase.firestore().collection('database').doc(doc.id);
    batch.update(songRef, { 'Random': Math.random() });

    count++;

    // If count reaches 500, commit the batch and start a new one
    // This is done because a batch in Firestore can only support 500 operations
    if (count === 500) {
      await batch.commit();
      batch = firebase.firestore().batch();
      count = 0;
    }
  }

  // Commit any remaining operations in the current batch
  if (count > 0) {
    await batch.commit();
  }
}

// Call the function to start the process of adding random field to all songs
addRandomField().then(() => {
  console.log('Random field added to all songs.');
}).catch((error) => {
  console.error('Error adding random field: ', error);
});