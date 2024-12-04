const dialog = document.getElementById('myDialog');
const closeDialogBtn = document.getElementById('close');
const dontShowAgainBtn = document.getElementById('dontShowAgain');
let timeElapsed = 0;
let bestTime = localStorage.getItem('bestTime') ? parseInt(localStorage.getItem('bestTime')) : Infinity; 
let timerInterval;
let cartetrouve = 0;

if (localStorage.getItem('dialogRemoved') !== 'true') {
    dialog.showModal();
    console.log('Le dialogue a été affiché');
}

closeDialogBtn.onclick = function () {
  dialog.remove(); 
};

dontShowAgainBtn.onclick = function () {
  dialog.remove(); 
  localStorage.setItem('dialogRemoved', 'true'); 
  console.log('Le dialogue ne sera plus affiché.');
};

function startTimer() {
  if (timeElapsed === 0 && !timerInterval) {
    timerInterval = setInterval(() => {
      timeElapsed++;
      timerDisplay.textContent = `Temps : ${timeElapsed}`;
    }, 1000); 
  }
}

// Logique du jeu de mémoire
const cards = document.querySelectorAll('.memory-card'); 
const timerDisplay = document.getElementById('timer');
const bestTimeDisplay = document.getElementById('best-time'); 
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard() {
  startTimer();
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    // first click
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  // second click
  secondCard = this;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();
  checkWin();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }, 800);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}


(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();

cards.forEach(card => card.addEventListener('click', flipCard));

function checkWin() {
  cartetrouve++;
  if (cartetrouve == 6) {
    clearInterval(timerInterval); 
    if (timeElapsed < bestTime) {
      bestTime = timeElapsed; 
      localStorage.setItem('bestTime', bestTime); 
      console.log('Nouveau meilleur temps: ', bestTime);
    }
  }
}

// Afficher le meilleur temps au début
bestTimeDisplay.textContent = `Meilleur Temps: ${bestTime === Infinity ? 'Aucun' : bestTime} secondes`;
