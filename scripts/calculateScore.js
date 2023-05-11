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

  function displayQuestion(index) {
    if (index < questions.length) {
      const question = questions[index];
      const questionText = document.getElementById('question-text');
      const choicesContainer = document.getElementById('choices-container');
      questionText.textContent = question.question;
  
      choicesContainer.innerHTML = '';
      question.choices.forEach((choice, i) => {
        const button = document.createElement('button');
        button.textContent = choice.answer;
        button.addEventListener('click', () => {
          // Store the user's answer and its points
          userAnswers.push({ answer: i, points: choice.points });
  
          // Show the "Next Question" button
          document.getElementById('next-question').style.display = 'block';
        });
        choicesContainer.appendChild(button);
      });
    } else {
      // Calculate the total score and display the results
      calculateTotalScore();
    }
  }

  document.getElementById('next-question').addEventListener('click', () => {
    currentQuestionIndex++;
    document.getElementById('next-question').style.display = 'none';
    displayQuestion(currentQuestionIndex);
  });

  function calculateTotalScore() {
    let totalScore = 0;
    userAnswers.forEach((answer) => {
      totalScore += answer.points;
    });
  
    // Display the total score or navigate to the results page
    console.log('Total score:', totalScore);
  }