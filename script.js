const wordList = [
    'algorithm', 'binary', 'cache', 'database', 'encryption',
    'firewall', 'gateway', 'hardware', 'interface', 'javascript',
    'keyboard', 'library', 'memory', 'network', 'operating',
    'protocol', 'query', 'router', 'software', 'terminal',
    'upload', 'variable', 'website', 'browser', 'coding',
    'abstract', 'boolean', 'compiler', 'debug', 'execute',
    'function', 'graphics', 'hosting', 'integer', 'java',
    'kernel', 'latency', 'module', 'notification', 'output',
    'parameter', 'quantum', 'recursion', 'syntax', 'thread',
    'unicode', 'virtual', 'wireless', 'pixel', 'element',
    'responsive', 'array', 'object', 'string', 'loop',
    'class', 'method', 'server', 'client', 'framework','yappnika'
];

let score = 0;
let timer = 60;
let wordsTyped = 0;
let activeWords = [];
let gameInterval;
let spawnInterval;
let timerInterval;
let gameRunning = false;
let startTime;

const gameArea = document.getElementById('gameArea');
const wordInput = document.getElementById('wordInput');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const wordCountDisplay = document.getElementById('wordCount');
const startMenu = document.getElementById('startMenu');
const gameOverMenu = document.getElementById('gameOverMenu');

wordInput.addEventListener('input', checkWord);
wordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        wordInput.value = '';
    }
});

function startGame() {
    startMenu.classList.add('hidden');
    wordInput.disabled = false;
    wordInput.focus();
    gameRunning = true;
    startTime = Date.now();
    
    score = 0;
    timer = 60;
    wordsTyped = 0;
    activeWords = [];
    gameArea.innerHTML = '';
    
    updateDisplay();
    
    spawnInterval = setInterval(spawnWord, 1500);
    timerInterval = setInterval(updateTimer, 1000);
    
    spawnWord();
}

function spawnWord() {
    if (!gameRunning) return;
    
    const word = wordList[Math.floor(Math.random() * wordList.length)];
    const wordEl = document.createElement('div');
    wordEl.className = 'word';
    wordEl.textContent = word;
    
    const wordWidth = 150;
    const wordHeight = 50;
    
    const maxX = window.innerWidth - wordWidth;
    const maxY = window.innerHeight - 300;
    const minY = 150;
    
    let x = Math.random() * maxX;
    let y = minY + Math.random() * (maxY - minY);
    
    let overlapping = true;
    let attempts = 0;
    
    while (overlapping && attempts < 20) {
        overlapping = false;
        
        for (let existingWord of activeWords) {
            const existingLeft = parseFloat(existingWord.element.style.left);
            const existingTop = parseFloat(existingWord.element.style.top);
            const existingRect = {
                left: existingLeft,
                top: existingTop,
                right: existingLeft + wordWidth,
                bottom: existingTop + wordHeight
            };
            
            const newRect = {
                left: x,
                top: y,
                right: x + wordWidth,
                bottom: y + wordHeight
            };
            
            const padding = 30;
            
            if (!(newRect.right + padding < existingRect.left || 
                  newRect.left - padding > existingRect.right || 
                  newRect.bottom + padding < existingRect.top || 
                  newRect.top - padding > existingRect.bottom)) {
                overlapping = true;
                x = Math.random() * maxX;
                y = minY + Math.random() * (maxY - minY);
                break;
            }
        }
        attempts++;
    }
    
    wordEl.style.left = x + 'px';
    wordEl.style.top = y + 'px';
    
    gameArea.appendChild(wordEl);
    activeWords.push({
        element: wordEl,
        text: word
    });

    if (activeWords.length > 10) {
        endGame(false);
    }
    
    updateDisplay();
}

function checkWord() {
    const input = wordInput.value.toLowerCase().trim();
    
    if (input === '') {
        
        activeWords.forEach(word => {
            word.element.classList.remove('matched');
        });
        return;
    }
    
    let foundMatch = false;
    
    for (let i = 0; i < activeWords.length; i++) {
        const word = activeWords[i];
        
        if (word.text.toLowerCase().startsWith(input)) {
            word.element.classList.add('matched');
            foundMatch = true;
            
           
            if (word.text.toLowerCase() === input) {
                
                const points = word.text.length * 10;
                score += points;
                wordsTyped++;
                
                
                word.element.classList.add('removing');
                setTimeout(() => {
                    word.element.remove();
                }, 300);
                
                activeWords.splice(i, 1);
                wordInput.value = '';
                updateDisplay();
                
                
                if (score >= 2500) {
                    endGame(true);
                }
                break;
            }
        } else {
            word.element.classList.remove('matched');
        }
    }
}


function updateTimer() {
    if (!gameRunning) return;
    
    timer--;
    timerDisplay.textContent = timer;
    
    if (timer <= 0) {
        endGame(false);
    }
}


function updateDisplay() {
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timer;
    wordCountDisplay.textContent = activeWords.length;
}

function endGame(won) {
    gameRunning = false;
    
    clearInterval(spawnInterval);
    clearInterval(timerInterval);
    
    wordInput.disabled = true;
    
    const elapsed = (Date.now() - startTime) / 1000;
    const avgRateSecond = (wordsTyped / elapsed).toFixed(2);
    const avgRateMinute = (wordsTyped / elapsed * 60).toFixed(2);
    
    
    document.getElementById('resultTitle').textContent = 
        won ? 'CONGRATULATIONS!' : 'GAME OVER';
    document.getElementById('resultMessage').textContent = 
        won ? "You ARE my type. 💜" : "Sorry, you're not my type.";
    document.getElementById('finalWords').textContent = wordsTyped;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('avgRateSecond').textContent = avgRateSecond;
    document.getElementById('avgRateMinute').textContent = avgRateMinute;
    
    gameOverMenu.classList.remove('hidden');
}

function restartGame() {
    gameOverMenu.classList.add('hidden');
    
    activeWords.forEach(word => word.element.remove());
    activeWords = [];
    
    startGame();
}