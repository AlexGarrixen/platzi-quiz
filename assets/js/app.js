const CoursesQuestion = [
  {
    id: 1,
    name: 'React js',
    questions: questionsReactJs,
    responses: responsesReactJs,
  }
]

let responses = [];
let courseExamID = null;
let responseUser = null;

let course = null;
let questions;
let totalQuestions = 0;
const quiz = document.getElementById('quiz')
const viewInitial = document.getElementById('quiz-view-initial')
const buttonStart = document.getElementById('buttonStart')
const buttonNext = document.getElementById('buttonNext')
const buttonSkip = document.getElementById('buttonSkip')
const points = document.getElementById('dialog-results__points')
const numQuestions = document.getElementById('quiz__questions_num')
const dialogResults = document.getElementById('dialog-results')
const dialogResultsMessage = document.getElementById('dialog-results__message')
const buttonRestart = document.getElementById('btn-restart')
const titleQuestion = document.getElementById('titleQuestion');
const quizCountdown = document.getElementById('quiz-countdown');
const buttonsOptions = document.getElementsByClassName('buttonOption');
const countdown = new Countdown();


buttonStart.onclick = function() {
  viewInitial.style.display = 'none';
  quiz.style.display = 'block';
  courseExamID = 1;
  course = CoursesQuestion.find((course) => course.id === courseExamID);
  totalQuestions = course.questions.length;
  questions = course.questions;
  buttonStart.style.display = 'none';
  showQuestion(questions);
  setNumQuestions()
  countdown.startCountdown(5);
}

buttonSkip.onclick = function() {
  clearClassButtons()
  questions.push(questions[0]);
  questions.shift();
  if (responseUser) responseUser = null;
  showQuestion(questions);
}

buttonNext.onclick = function() {
  if (responseUser) {
    clearClassButtons();
    responses.push(responseUser);
    setNumQuestions();
    responseUser = null;
    questions.shift();

    if (questions.length === 1) buttonSkip.style.display = 'none';

    if (questions.length > 0) {
      showQuestion(questions);
    } else {
      if (dialogResults.style.display === 'none') dialogResults.style.display = 'flex';
      setPoints();
      countdown.cancelCountdown();
    }
  } else {
    alert('Es necesario que selecciones una opcion u omitas')
  }
}

buttonRestart.onclick = function () {
  window.location.href = "index.html"
}

countdown.suscribeOnTime((time) => quizCountdown.textContent = time);

countdown.suscribeOnFinish(() => {
  if (dialogResults.style.display === 'none') dialogResults.style.display = 'flex';
  setPoints();
})

function setPoints() {
 let responsesSuccess = 0; 
 let pointsObtained = 0;
 let pointsInPercentage = 0;

 responses.forEach((resUser) => {
   const isValid = course.responses.find((res) => {
     if (res.idQuestion === resUser.idQuestion) return Boolean(res.response === resUser.response);
   });
   if (isValid) responsesSuccess += 1;
 })

 pointsInPercentage = (responsesSuccess / 5) * 100;
 pointsObtained = (responsesSuccess / 5) * 10;
 setProgressSvg(pointsInPercentage);
 points.textContent = pointsObtained;
 
 if (responsesSuccess === 5) dialogResultsMessage.textContent = '¡Wow, eres un ninja en react js!';
 else if (responsesSuccess === 4) dialogResultsMessage.textContent = '¡Genial, sigue asi!';
 else dialogResultsMessage.textContent = '¡No te rindas, sigue perstiendo!';
}


function showQuestion(questions_) {
  const options = questions_[0].options;
  titleQuestion.textContent = questions_[0].title;

  Array.prototype.forEach.call(buttonsOptions, (option, idx) => {
    option.children[1].textContent = `${options[idx].response}`; 
    option.dataset.option = options[idx].option;
    option.onclick = (e) => {
      clearClassButtons();
      e.target.classList.add('buttonOption--select');
      responseUser =  { idQuestion: questions_[0].id, response: e.target.dataset.option } 
    }
  })
}

function clearClassButtons() {
  Array.prototype.forEach.call(buttonsOptions, (button) => {
    if (button.classList.contains('buttonOption--select')) button.classList.remove('buttonOption--select')
  })
}

function setNumQuestions() {
  numQuestions.textContent = `${responses.length} | ${totalQuestions}`
}

// svg circumference = radius * 2 * PI
const circle = document.querySelector('.progress-svg__circle');
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

function setProgressSvg(percent) {
  const offset = circumference - percent / 100 * circumference;
  circle.style.strokeDashoffset = offset;
}

