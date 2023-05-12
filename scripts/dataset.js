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