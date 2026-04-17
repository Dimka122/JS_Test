const textInput = document.getElementById('textInput');
const applyBtn = document.getElementById('applyBtn');
const lettersContainer = document.getElementById('lettersContainer');
const selectionBox = document.getElementById('selectionBox');
const placeholder = document.getElementById('placeholder');

let letters = [];

applyBtn.addEventListener('click', () => {
    const text = textInput.value.trim();
    if (!text) {
        alert('Введите текст!');
        return;
    }
    createLetters(text);
});

textInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        applyBtn.click();
    }
});

function createLetters(text) {
    if (placeholder) placeholder.style.display = 'none';

    // Очистка старых букв
    letters.forEach(l => l.remove());
    letters = [];

    // Создаём буквы
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === ' ') continue;

        const letter = document.createElement('div');
        letter.className = 'letter';
        letter.textContent = char;

        lettersContainer.appendChild(letter);
        letters.push(letter);
    }
    
    console.log('Создано букв:', letters.length);
}