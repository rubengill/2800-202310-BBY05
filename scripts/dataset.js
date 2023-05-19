// const admin = require('firebase-admin');
// const csv = require('csv-parser');
// const fs = require('fs');

// let serviceAccount = require('../serviceAccountKey.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// let dbs = admin.firestore();

// let data = [];

// fs.createReadStream('../gutiarDB.csv')
//   .pipe(csv())
//   .on('data', (row) => {
//     data.push(row);
//   })
//   .on('end', () => {
//     console.log('CSV file successfully processed');
//     uploadToFirestore(data);
//   });

//   function uploadToFirestore(data) {
//     data.forEach((row, index) => {
//       dbs.collection('database').doc(`document_${index}`).set(row)
//         .then(() => console.log(`Document_${index} successfully written!`))
//         .catch((error) => console.error("Error writing document: ", error));
//     });
//   }

// async function addRandomField() {
//     // Get all song documents
//     const songDocs = await firebase.firestore().collection('database').get();

//     // Initialize a batch
//     let batch = firebase.firestore().batch();
//     let count = 0;

//     // Iterate over each song document
//     for (const doc of songDocs.docs) {
//         // For each song, add a 'Random' field with a random number
//         const songRef = firebase.firestore().collection('database').doc(doc.id);
//         batch.update(songRef, { 'Random': Math.random() });

//         count++;

//         // If count reaches 500, commit the batch and start a new one
//         if (count === 500) {
//             await batch.commit();
//             batch = firebase.firestore().batch();
//             count = 0;
//         }
//     }

//     // Commit any remaining operations in the current batch
//     if (count > 0) {
//         await batch.commit();
//     }
// }

// // Call the function
// addRandomField().then(() => {
//     console.log('Random field added to all songs.');
// }).catch((error) => {
//     console.error('Error adding random field: ', error);
// });
