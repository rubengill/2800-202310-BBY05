

// An empty array to store the questions
let questions = [];
// An empty array to store the user's answers to the questions
let userAnswers = [];
// A number to keep track of the current question index
let currentQuestionIndex = 0;

// Retrieve the 'next-question' button DOM element
const nextQuestionButton = document.getElementById('next-question');

// Add an event listener to the 'next-question' button
nextQuestionButton.addEventListener('click', () => {
  // Increment the currentQuestionIndex
  currentQuestionIndex++;

  // Hide the "Next Question" button
  nextQuestionButton.style.display = 'none';

  // Display the next question
  displayQuestion(currentQuestionIndex);
});

// Retrieve the questions from the "questions" collection in Firestore
db.collection('questions').get().then((querySnapshot) => {
  // Iterate through each question in the collection and add data to the "questions" array
  querySnapshot.forEach((doc) => {
    questions.push(doc.data());
  });
  // Display first question after adding each question to the array
  displayQuestion(currentQuestionIndex);
});

// Displays the questions from the question collection
function displayQuestion(index) {
  // Ensures that index is less than the array length 
  if (index < questions.length) {
    // If question index is in bounds, retrieve appropiate DOM elements
    const question = questions[index];
    const questionText = document.getElementById('question-text');
    const choicesContainer = document.getElementById('choices-container');
    // Update the question text content with the question text
    questionText.textContent = question.question;

    // Remove any pre existing choices
    choicesContainer.innerHTML = '';

    // Loop through the questions collection 
    question.choices.forEach((choice, i) => {
      // Create a new button for each question 
      const button = document.createElement('button');
      button.textContent = choice.answer;
      // Add an event listener to the button to store the user's answer and the points when it is clicked
      button.addEventListener('click', () => {
        // Store the user's answer and its points as an object in the "userAnswers" array
        userAnswers.push({ answer: i, points: choice.points });

        // Show the "Next Question" button
        nextQuestionButton.style.display = 'block';
      });
      // Append the button to the choices container
      choicesContainer.appendChild(button);
    });
  } else {
    // If the index is out of bounds, calculate the total score and display the results
    calculateTotalScore();
  }
}

function calculateTotalScore() {
  let totalScore = 0;

  // Iterate through the userAnswers array and add up the points for each answer
  userAnswers.forEach((answer) => {
    totalScore += answer.points;
  });

  // Display the total score 
  console.log('Total score:', totalScore);

  // Get the current user's UID
  const uid = firebase.auth().currentUser.uid;

  // Update the user's score in Firestore
  db.collection('users').doc(uid).update({
    score: totalScore
  })
    .then(() => {
      console.log("Score successfully updated!");

      // Fetch the user's score from Firestore
      db.collection('users').doc(uid).get()
        .then((doc) => {
          if (doc.exists) {
            // Retrieve the score from the document
            const score = doc.data().score;
            // Calculate the skill level based on the score
            const skillLevel = calculateSkillLevel(score);
            console.log("Skill level:", skillLevel);

            // Update the user's skill level in Firestore
            db.collection('users').doc(uid).update({
              skillLevel: skillLevel
            })
              .then(() => {
                console.log("Skill level successfully updated!");

                // Call showUserSkill function when skill level is successfully updated
                showUserSkill();
              })
              .catch((error) => console.error("Error updating skill level: ", error));
          } else {
            console.error("No such document!");
          }
        })
        .catch((error) => {
          console.error("Error getting document:", error);
        });
    })
    //Log any errors to the console if user score cannot be added
    .catch((error) => console.error("Error updating score: ", error));
}


//Function that calculates skill level depending on the users' score
function calculateSkillLevel(score) {
  let skillLevel;
  //If less than 600, skill level = novice
  if (score < 600) {
    skillLevel = 'Novice';
    //If less than 1200, skill level = intermediate
  } else if (score < 1200) {
    skillLevel = 'Intermediate';
    //If greater than 1200 skill level = advanced
  } else {
    skillLevel = 'Advanced';
  }
  return skillLevel;
}

//If the user has a user skill level, direct them to userskill.html, where they will
//be presented with their skill level 
function showUserSkill() {
  // Get the current user's UID
  const uid = firebase.auth().currentUser.uid;

  // Fetch the user's data from Firestore
  db.collection('users').doc(uid).get()
    .then((doc) => {
      if (doc.exists) {
        // Redirect to the userskill page
        window.location.href = '/userskill';
      } else {
        console.error("No such document!");
      }
    })
    .catch((error) => {
      console.error("Error getting document:", error);
    });
}



