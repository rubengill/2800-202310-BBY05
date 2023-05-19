// // Function that adds each question from the question.json file to firestore
// const addQuestionsToFirestore = async (questions) => {
//     // Create an object so we can write every question with one call 
//     const batch = db.batch();
  
//     // Loop through each question
//     questions.forEach((question) => {
//       // Create a new reference in the questions collection
//       const newQuestionRef = db.collection('questions').doc();
//       // Add the question data to the batch, setting it to the new reference
//       batch.set(newQuestionRef, question);
//     });
  
//     // Execute the batch write operation
//     try {
//       // Commit the batch operation to Firestore
//       await batch.commit();
//       // Log success message
//       console.log('All questions have been added.');
//     } catch (error) {
//       // Log an error message
//       console.error('Error adding questions:', error);
//     }
//   };
  
//  //Fetch questions.json
// fetch('/data/questions.json')
// .then((response) => {
//   // Set condition if the response is successful 
//   if (!response.ok) {
//     // If not succcessful, throw error 
//     throw new Error(`HTTP error ${response.status}`);
//   }
//   // Parse data 
//   return response.json();
// })
// .then((questions) => {
//   // Once the JSON data is parsed, call the function to add the questions to Firestore
//   addQuestionsToFirestore(questions);
// })
// .catch((error) => {
//   //log error message to console if there is an error
//   console.error('Error fetching or parsing the JSON file:', error);
// });

  