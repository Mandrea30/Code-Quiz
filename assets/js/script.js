var startBtn = document.querySelector("#start");
var timerEl = document.querySelector("#time");
var questionsEl = document.querySelector("#questions");
var choicesEl = document.querySelector("#choices");
var submitBtn = document.querySelector("#submit");
var initialsEl = document.querySelector("#initials");
var feedbackEl = document.querySelector("#feedback");

var currentQuestionIndex = 0;
var time = questions.length * 10;
var timerId;

function startQuiz() {
  var startScreenEl = document.getElementById("start-page");
  startScreenEl.setAttribute("class", "hide");

  questionsEl.removeAttribute("class");

  // Timer start
  timerId = setInterval(clockTick, 1000);

  timerEl.textContent = time;

  getQuestion();
}

function getQuestion() {

  var currentQuestion = questions[currentQuestionIndex];

  // questions
  var titleEl = document.getElementById("question-title");
  titleEl.textContent = currentQuestion.title;

  choicesEl.innerHTML = "";

  // Choices
  currentQuestion.choices.forEach(function(choice, i) {
    //button for new questions
    var choiceNode = document.createElement("button");
    choiceNode.setAttribute("class", "choice");
    choiceNode.setAttribute("value", choice);

    choiceNode.textContent = i + 1 + ". " + choice;

    // click event question click
    choiceNode.onclick = questionClick;

    choicesEl.appendChild(choiceNode);
  });
}
//wrong answer will substract time
function questionClick() {
  if (this.value !== questions[currentQuestionIndex].answer) {
    time -= 10;
    if (time < 0) {
      time = 0;
    }
    // New time
    timerEl.textContent = time;
    feedbackEl.textContent = "Wrong!";
    feedbackEl.style.fontSize = "200%";
  } else {
    feedbackEl.textContent = "Correct!";
    feedbackEl.style.fontSize = "400%";
  }

  feedbackEl.setAttribute("class", "feedback");
  setTimeout(function() {
    feedbackEl.setAttribute("class", "feedback hide");
  }, 1000);

  // on to next question
  currentQuestionIndex++;

  // current timer
  if (currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}
//timer stop
function quizEnd() {
  clearInterval(timerId);

  // results page
  var endScreenEl = document.getElementById("end-page");
  endScreenEl.removeAttribute("class");

  // show final score page
  var finalScoreEl = document.getElementById("final-score");
  finalScoreEl.textContent = time;

  questionsEl.setAttribute("class", "hide");
}
//updated time
function clockTick() {
  
  time--;
  timerEl.textContent = time;

  // out of time
  if (time <= 0) {
    quizEnd();
  }
}

function saveHighscore() {
  var initials = initialsEl.value.trim();

  if (initials !== "") {
    //high score variable
    var highscores =
      JSON.parse(window.localStorage.getItem("highscores")) || [];
    //new score variable
    var newScore = {
      score: time,
      initials: initials
    };

    //save high scores to local storage
    highscores.push(newScore);
    window.localStorage.setItem("highscores", JSON.stringify(highscores));

    // display results page 
    window.location.href = "results.html";
  }
}
function checkForEnter(event) {
  if (event.key === "Enter") {
    saveHighscore();
  }
}
// input player initials
submitBtn.onclick = saveHighscore;

// start quiz
startBtn.onclick = startQuiz;
initialsEl.onkeyup = checkForEnter;