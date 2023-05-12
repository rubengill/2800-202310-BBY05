// An empty array to store the questions
let questions = [];
// An empty array to store the user's answers to the questions
let userAnswers = [];
// A number to keep track of the current question index
let currentQuestionIndex = 0;

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
        document.getElementById('next-question').style.display = 'block';
      });
        // Append the button to the choices container
        choicesContainer.appendChild(button);
      });
    } else {
      // If the index is out of bounds, calculate the total score and display the results
      calculateTotalScore();
    }
  }

    //Add an event listener to the "Next Question" button
document.getElementById('next-question').addEventListener('click', () => {
  //increments the current question index by 1
  currentQuestionIndex++;
  //hides the "Next Question" button, and displays the next question
  document.getElementById('next-question').style.display = 'none';
  displayQuestion(currentQuestionIndex);
});

  function calculateTotalScore() {
    let totalScore = 0;
    //iterate through the userAnswers array and add up the points for each answer
    userAnswers.forEach((answer) => {
      totalScore += answer.points;
    });

    // Display the total score or navigate to the results page
    console.log('Total score:', totalScore);
  }
  