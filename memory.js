// Konfiguracja gry
const board = document.querySelector('.board');
const scoreElement = document.querySelector('.score');
let turnCounter = 0;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;

const cardsData = generateRandomSVGs(6).flatMap(item => [item, { ...item }]); // 6 par

// Tasowanie kart
shuffleArray(cardsData);

// Generowanie kart
cardsData.forEach((data, index) => {
    const card = document.createElement('div');
    card.classList.add('card', 'hidden');
    card.dataset.id = index;
    card.dataset.shape = data.shape;
    card.dataset.color = data.color;
    card.addEventListener('click', handleCardClick);
    board.appendChild(card);
});

// Obsługa kliknięcia karty
function handleCardClick(e) {
    const card = e.currentTarget;
    if (lockBoard || card === firstCard || !card.classList.contains('hidden')) return;

    // Odkrywanie karty
    showCard(card);

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    checkForMatch();
}

// Wyświetlanie karty (generowanie SVG)
function showCard(card) {
    const shape = card.dataset.shape;
    const color = card.dataset.color;
    
    card.innerHTML = generateSVG(shape, color);
    card.classList.remove('hidden');
}

// Sprawdzanie dopasowania kart
function checkForMatch() {
    lockBoard = true;
    turnCounter++;
    scoreElement.textContent = `Turn counter: ${turnCounter}`;

    if (firstCard.dataset.shape === secondCard.dataset.shape && firstCard.dataset.color === secondCard.dataset.color) {
        matchedPairs++;
        resetCards();
        if (matchedPairs === 6) {
            setTimeout(() => alert('Wygrałeś!'), 500);
        }
    } else {
        setTimeout(() => {
            hideCard(firstCard);
            hideCard(secondCard);
            resetCards();
        }, 1000);
    }
}

// Ukrywanie karty
function hideCard(card) {
    card.innerHTML = '';
    card.classList.add('hidden');
}

// Resetowanie kart
function resetCards() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

// Funkcja do generowania losowych grafik SVG
function generateSVG(shape, color) {
    if (shape === 'circle') {
        return `<svg width="100" height="100"><circle cx="50" cy="50" r="40" fill="${color}" /></svg>`;
    } else if (shape === 'rect') {
        return `<svg width="100" height="100"><rect width="80" height="80" x="10" y="10" fill="${color}" /></svg>`;
    }
}

// Funkcja generująca dane SVG dla kart (kształt i kolor)
function generateRandomSVGs(pairs) {
    const shapes = ['circle', 'rect'];
    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
    let data = [];

    for (let i = 0; i < pairs; i++) {
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        data.push({ shape, color });
    }
    return data;
}

// Tasowanie tablicy (algorytm Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}