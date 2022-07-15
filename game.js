const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];
let hasChooseAnswer = false;
let chooseAnswer = [];
let questions = [];

fetch(
  "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple"
)
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestions) => {
    questions = loadedQuestions.results.map((loadedQuestion) => {
      const formattedQuestion = {
        question: loadedQuestion.question,
      };

      const answerChoices = [...loadedQuestion.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestion.correct_answer
      );

      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      });

      return formattedQuestion;
    });

    startGame();
  })
  .catch((err) => {
    console.error(err);
  });

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuesions = [...questions];
  getNewQuestion();
  game.classList.remove("hidden");
  loader.classList.add("hidden");
};

getNewQuestion = () => {
  if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    //go to the end page
    return window.location.assign("/end.html");
  }
  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  //Update the progress bar
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuesions.length);
  currentQuestion = availableQuesions[questionIndex];
  question.innerHTML = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerHTML = currentQuestion["choice" + number];
  });

  availableQuesions.splice(questionIndex, 1);
  acceptingAnswers = true;
  hasChooseAnswer = false;
};

// choices.forEach((choice) => {
//   choice.addEventListener("click", (e) => {
//     if (!acceptingAnswers) return;

//     acceptingAnswers = false;
//     const selectedChoice = e.target;
//     const selectedAnswer = selectedChoice.dataset["number"];
//     chooseAnswer.push(selectedAnswer);
//     const classToApply =
//       selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

//     if (classToApply === "correct") {
//       incrementScore(CORRECT_BONUS);
//     }

//     selectedChoice.parentElement.classList.add(classToApply);
//     hasChooseAnswer = true;
//   });
// });

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];
    if (chooseAnswer.includes(selectedAnswer)) {
      chooseAnswer = chooseAnswer.filter(
        (answer) => answer != selectedAnswer.toString()
      );
      selectedChoice.parentElement.classList.remove("choosing");
    } else {
      chooseAnswer.push(selectedAnswer);
      selectedChoice.parentElement.classList.add("choosing");
    }
    // hasChooseAnswer = true;
  });
});

nextQuestion = () => {
  if (chooseAnswer.length > 0) {
    choices.forEach(
      (choice) => (choice.parentElement.className = "choice-container")
    );
    //   selectedChoice.parentElement.classList.remove(classToApply);
    getNewQuestion();
  }
};

checkAnswer = () => {
    choices.forEach((choice) => {
         if (choice )
    })
}

incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};
