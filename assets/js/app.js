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
const nodeOptions = document.getElementById('quiz__options');
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
  nodeOptions.innerHTML = '';
  clearClassButtons()
  questions.push(questions[0]);
  questions.shift();
  if (responseUser) responseUser = null;
  showQuestion(questions);
}

buttonNext.onclick = function() {
  if (responseUser) {
    nodeOptions.innerHTML = '';
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
      quiz.style.display = 'none';
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
  quiz.style.display = 'none';
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
 
 if (responsesSuccess === 5) dialogResultsMessage.textContent = '¡Wow, eres un ninja en javascript!';
 else if (responsesSuccess === 4) dialogResultsMessage.textContent = '¡Genial, sigue asi!';
 else dialogResultsMessage.textContent = '¡No te rindas, sigue perstiendo!';
}


function showQuestion(questions_) {
  const options = questions_[0].options;
 
  titleQuestion.textContent = questions_[0].title;
  options.forEach((opt) => {
    let btn = document.createElement('button');
    let p = document.createElement('p');

    btn.dataset.option = opt.option;
    btn.className = 'button-option';
    btn.onclick = handleClickButtonOptions;
    p.className = 'button-option__name-response'
    p.textContent = opt.response

    btn.appendChild(p)
    nodeOptions.appendChild(btn)
  })
}

function handleClickButtonOptions(e) {
  clearClassButtons();
  e.target.classList.add('button-option--select');
  responseUser =  { idQuestion: questions[0].id, response: e.target.dataset.option } 
}

function clearClassButtons() {
  const buttonsOptions = document.getElementsByClassName('button-option');
  Array.prototype.forEach.call(buttonsOptions, (button) => {
    if (button.classList.contains('button-option--select')) button.classList.remove('button-option--select')
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

