class MemoryGame {
    constructor() {
        this.gameBoard = document.getElementById('gameBoard');
        this.timerElement = document.getElementById('timer');
        this.movesElement = document.getElementById('moves');
        this.matchesElement = document.getElementById('matches');
        this.gameOverElement = document.getElementById('gameOver');
        this.difficultySelector = document.getElementById('difficulty');
        
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.timer = 0;
        this.timerInterval = null;
        this.gameStarted = false;
        this.totalPairs = 8;
        
        // Símbolos para las cartas
        this.symbols = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎺', '🎹', '🎤', '🎧', '🎬', '📱', '💎', '🌟', '⚡', '🔥', '💝', '🍕', '🍔', '🍰', '🍎', '🍊', '🍇'];
        
        this.initializeGame();
        this.bindEvents();
    }
    
    bindEvents() {
        document.getElementById('newGame').addEventListener('click', () => this.startNewGame());
        document.getElementById('resetGame').addEventListener('click', () => this.resetGame());
        this.difficultySelector.addEventListener('change', () => this.changeDifficulty());
    }
    
    changeDifficulty() {
        const difficulty = this.difficultySelector.value;
        switch(difficulty) {
            case 'easy':
                this.totalPairs = 8;
                break;
            case 'medium':
                this.totalPairs = 12;
                break;
            case 'hard':
                this.totalPairs = 18;
                break;
        }
        this.startNewGame();
    }
    
    initializeGame() {
        this.createCards();
        this.renderCards();
        this.updateStats();
    }
    
    createCards() {
        this.cards = [];
        const selectedSymbols = this.symbols.slice(0, this.totalPairs);
        const cardSymbols = [...selectedSymbols, ...selectedSymbols];
        
        // Mezclar las cartas
        for (let i = cardSymbols.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cardSymbols[i], cardSymbols[j]] = [cardSymbols[j], cardSymbols[i]];
        }
        
        cardSymbols.forEach((symbol, index) => {
            this.cards.push({
                id: index,
                symbol: symbol,
                isFlipped: false,
                isMatched: false
            });
        });
    }
    
    renderCards() {
        this.gameBoard.innerHTML = '';
        
        // Configurar el grid según la dificultad
        const difficulty = this.difficultySelector.value;
        this.gameBoard.className = `game-board ${difficulty}`;
        
        this.cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.dataset.cardId = card.id;
            
            cardElement.innerHTML = `
                <div class="card-front">?</div>
                <div class="card-back">${card.symbol}</div>
            `;
            
            cardElement.addEventListener('click', () => this.flipCard(card.id));
            this.gameBoard.appendChild(cardElement);
        });
    }
    
    flipCard(cardId) {
        const card = this.cards[cardId];
        const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
        
        // No permitir voltear si ya está volteada, emparejada, o si ya hay 2 cartas volteadas
        if (card.isFlipped || card.isMatched || this.flippedCards.length === 2) {
            return;
        }
        
        // Iniciar el timer en el primer movimiento
        if (!this.gameStarted) {
            this.startTimer();
            this.gameStarted = true;
        }
        
        card.isFlipped = true;
        cardElement.classList.add('flipped');
        this.flippedCards.push(card);
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateStats();
            setTimeout(() => this.checkMatch(), 1000);
        }
    }
    
    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const card1Element = document.querySelector(`[data-card-id="${card1.id}"]`);
        const card2Element = document.querySelector(`[data-card-id="${card2.id}"]`);
        
        if (card1.symbol === card2.symbol) {
            // Es una pareja
            card1.isMatched = true;
            card2.isMatched = true;
            card1Element.classList.add('matched');
            card2Element.classList.add('matched');
            this.matchedPairs++;
            
            if (this.matchedPairs === this.totalPairs) {
                setTimeout(() => this.gameWon(), 500);
            }
        } else {
            // No es pareja, voltear de nuevo
            card1.isFlipped = false;
            card2.isFlipped = false;
            card1Element.classList.remove('flipped');
            card2Element.classList.remove('flipped');
        }
        
        this.flippedCards = [];
        this.updateStats();
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateTimer();
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    updateTimer() {
        const minutes = Math.floor(this.timer / 60);
        const seconds = this.timer % 60;
        this.timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateStats() {
        this.movesElement.textContent = this.moves;
        this.matchesElement.textContent = `${this.matchedPairs}/${this.totalPairs}`;
    }
    
    gameWon() {
        this.stopTimer();
        document.getElementById('finalTime').textContent = this.timerElement.textContent;
        document.getElementById('finalMoves').textContent = this.moves;
        this.gameOverElement.classList.add('show');
    }
    
    startNewGame() {
        this.stopTimer();
        this.timer = 0;
        this.moves = 0;
        this.matchedPairs = 0;
        this.flippedCards = [];
        this.gameStarted = false;
        this.gameOverElement.classList.remove('show');
        
        this.createCards();
        this.renderCards();
        this.updateStats();
        this.updateTimer();
    }
    
    resetGame() {
        this.startNewGame();
    }
}

// Función global para reiniciar desde el modal
function startNewGame() {
    game.startNewGame();
}

// Inicializar el juego cuando se carga la página
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new MemoryGame();
});

// Efectos adicionales
document.addEventListener('DOMContentLoaded', () => {
    // Animación de entrada para las cartas
    setTimeout(() => {
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'fadeIn 0.5s ease-in-out';
            }, index * 50);
        });
    }, 100);
});