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

// fetch(
//   "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple"
// )

const loadQuestion = async () => {
  const questionData = await fetch("./data.json").then((res) => res.json());

  console.log(questionData);
  questions = questionData.map((loadedQuestion) => {
    const formattedQuestion = {
      question: loadedQuestion.question,
    };

    // const answerChoices = [...loadedQuestion.incorrect_answers];
    formattedQuestion.answer = loadedQuestion.answer;
    // answerChoices.splice(
    //   formattedQuestion.answer - 1,
    //   0,
    //   loadedQuestion.correct_answer
    // );

    formattedQuestion.choices = loadedQuestion.choices;

    // answerChoices.forEach((choice, index) => {
    //   formattedQuestion["choice" + (index + 1)] = choice;
    // });
    return formattedQuestion;
  });

  console.log(questions);
  startGame();
};

loadQuestion();

//CONSTANTS
const CORRECT_BONUS = 10;
let MAX_QUESTIONS = 0;
startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuesions = [...questions];
  MAX_QUESTIONS = availableQuesions.length;
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

  choices.forEach((choice, index) => {
    choice.innerHTML = currentQuestion.choices[index];
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
    getNewQuestion();
  }

  chooseAnswer = [];
};

checkAnswer = () => {
  if (chooseAnswer.length > 0) {
    choices.forEach((choice) => {
      const choiceAnswer = choice.dataset["number"];

      const classToApply = currentQuestion.answer.includes(choiceAnswer)
        ? "correct"
        : "incorrect";
      choice.parentElement.classList.add(classToApply);
    });
  }
};

incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};
