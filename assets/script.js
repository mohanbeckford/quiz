// QUIZ QUESTIONS

var quizQuestions = [
  {
    question: "A coder who can develop both client-side and server-side software is known as?",
    options: ["Developer", "Full Stack", "Designer", "Java"],
    correctAnswer: 1
  },
  {
    question: "Which programming language is used for web development?",
    options: ["JavaScript", "Python", "Java", "C++"],
    correctAnswer: 0
  },
  {
    question: "In the programming world, the acronym SaaS stands for software as a WHAT?",
    options: ["Service", "System", "Source", "Style"],
    correctAnswer: 0
  },
  {
    question: "Who is the developer of this application?",
    options: ["Jennifer", "Sean", "Mohan", "Morris"],
    correctAnswer: 2
  },
  
];

// VARIABLES
var startButton = document.getElementById("start-button");
var questionElement = document.getElementById("question");
var optionsElement = document.getElementById("options");
var feedbackElement = document.getElementById("feedback");
var timerElement = document.getElementById("time");
var scoreElement = document.getElementById("user-score");
var submitButton = document.getElementById("submit-button");
var finalScoreElement = document.getElementById("final-score");
var initialsForm = document.getElementById("initials-form");
var initialsInput = document.getElementById("initials");
var scoresContainer = document.getElementById("scores-container");
var scoresList = document.getElementById("scores-list");
var clearScoresButton = document.getElementById("clear-scores-button");
var goBackButton = document.getElementById("go-back-button");
// var scoresButton = document.getElementById("scores-buttons");
var mainSection = document.getElementById("main-section");
var submitScoreButton = document.getElementById("submit-score-button");
var initialsContainer = document.getElementById("initials-container");
var topHead = document.getElementById("tophead");
var quizContainer = document.getElementById("quiz-container");

// Event listeners
startButton.addEventListener("click", startQuiz);
// document.getElementById("tophead").addEventListener("click", showPermanentLink); //THIS IS NOT REALLY NECESSARY
document.getElementById("permanent-link-text").addEventListener("click", showPermanentLink);



// QUIZ VARIABLES
var currentQuestionIndex = 0;
var score = 0;
var timeLeft = 60;
var timerInterval;
var quizOver = false;
var scoresArray = [];

//START QUIZ

function startQuiz() {
  // initialsContainer.style.display = "block";
 topHead.style.display = "block";
  startButton.style.display = "none";
  submitButton.style.display = "block";
  showQuestion();
  startTimer();
}

function showQuestion() {
  var currentQuestion = quizQuestions[currentQuestionIndex];
  questionElement.textContent = currentQuestion.question;
  optionsElement.innerHTML = "";
  feedbackElement.textContent = "";

  for (var i = 0; i < currentQuestion.options.length; i++) {
    var option = document.createElement("li");
    option.textContent = currentQuestion.options[i];
    option.setAttribute("data-index", i);
    option.addEventListener("click", checkAnswer);
    optionsElement.appendChild(option);
  }
}

function checkAnswer(event) {
  var selectedOption = event.target;
  var selectedIndex = selectedOption.getAttribute("data-index");
  var correctIndex = quizQuestions[currentQuestionIndex].correctAnswer;

  if (selectedIndex == correctIndex) {
    feedbackElement.textContent = "Correct!";
    score++;
    scoreElement.textContent = score;
  } else {
    feedbackElement.textContent = "Wrong!";
    timeLeft -= 10;
  }

  currentQuestionIndex++;

  if (currentQuestionIndex < quizQuestions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  clearInterval(timerInterval);
  timerElement.textContent = "0";
  questionElement.textContent = "All done!";
  optionsElement.innerHTML = "";
  feedbackElement.textContent = "";

  var finalScoreMessage = document.createElement("p");
  finalScoreMessage.textContent = "Your final score is: ";
  var finalScoreSpan = document.createElement("span");
  finalScoreSpan.textContent = score;
  finalScoreMessage.appendChild(finalScoreSpan);
  optionsElement.appendChild(finalScoreMessage);

  initialsContainer.style.display = "block";
  submitButton.style.display = "none";
  startButton.style.display = "none";

  quizOver = true;
}

function startTimer() {
  timerInterval = setInterval(function () {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft <= 0 || quizOver) {
      clearInterval(timerInterval);
      endQuiz();
    }
  }, 1000);
}


//SAVE SCORES

submitButton.addEventListener("click", saveScore);

initialsForm.addEventListener("submit", saveScore);

function saveScore(event) {
  event.preventDefault();
  var initials = initialsInput.value.trim().toUpperCase();

  if (initials) {
    var scoreData = {
      initials: initials,
      score: score,
    };

    scoresArray.push(scoreData);
    scoresArray.sort((a, b) => b.score - a.score);
    localStorage.setItem("highScores", JSON.stringify(scoresArray));
    initialsForm.reset();
    initialsInput.value = "";
    displayScores();

    // THIS IS TO DISPLAY THE SCORE AND INITIAL
    var userScoreElement = document.getElementById("user-score");
    var userInitialsElement = document.getElementById("user-initials");
    userScoreElement.textContent = score;
    userInitialsElement.textContent = initials;
  }
}

// DISPLAY SCORE

function displayScores() {
  

  var scores = JSON.parse(localStorage.getItem("highScores")) || [];

  scoresList.innerHTML = "";

  for (var i = 0; i < scores.length; i++) {
    var scoreItem = document.createElement("li");
    scoreItem.textContent = scores[i].initials + " - " + scores[i].score;
    scoresList.appendChild(scoreItem);
  }
  mainSection.style.display = "none";
  initialsContainer.style.display = "none";
  scoresContainer.style.display = "block";
  document.getElementById("permanent-link").style.display = "block";
}


//THE PERMANENT LINK FOR THE VIEW SCORE FUNCTION


function showPermanentLink() {
  displayScores();

  // HIDING THE SECTIONS THAT ARE NOT NEEDED
  mainSection.style.display = "none";
  initialsContainer.style.display = "none";
  scoresContainer.style.display = "block";
  document.getElementById("permanent-link").style.display = "block";
  document.getElementById("tophead").style.display = "none";
  
  // THIS IS TO DISPLAY THE INITIALS AND SCORES WHEN THE LINK IS CLICKED
  var permanentLinkScoresList = document.getElementById("permanent-link-scores-list");
  permanentLinkScoresList.innerHTML = "";

  var scores = JSON.parse(localStorage.getItem("highScores")) || [];

  for (var i = 0; i < scores.length; i++) {
    var scoreItem = document.createElement("li");
    scoreItem.textContent = scores[i].initials + " - " + scores[i].score;
    permanentLinkScoresList.appendChild(scoreItem);
  }
}


//CLEAR SCORE BUTTON

clearScoresButton.addEventListener("click", clearScores);

function clearScores() {
  scoresArray = [];
  localStorage.removeItem("highScores");
  displayScores();
}


//GO BACK FUNCTIONS

goBackButton.addEventListener("click", goBack);

function goBack() {
  currentQuestionIndex = 0;
  score = 0;
  timeLeft = 60;
  quizOver = false;
  initialsContainer.style.display = "none";
  startButton.style.display = "block";
  scoreElement.textContent = "0";
  clearInterval(timerInterval);
  timerElement.textContent = timeLeft;

  scoresContainer.style.display = "none";
  mainSection.style.display = "block";
}