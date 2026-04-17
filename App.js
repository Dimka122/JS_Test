const textInput = document.getElementById('textInput');
const applyBtn = document.getElementById('applyBtn');
const lettersContainer = document.getElementById('lettersContainer');
const selectionBox = document.getElementById('selectionBox');
const placeholder = document.getElementById('placeholder');

let letters = [];
let selectedLetters = new Set(); 
let isSelecting = false; 
let selectionStart = { x: 0, y: 0 };

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

    letters.forEach(l => l.remove());
    letters = [];

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === ' ') continue;

        const letter = document.createElement('div');
        letter.className = 'letter';
        letter.textContent = char;

        letter.addEventListener('mousedown', handleLetterMouseDown);
        letter.addEventListener('contextmenu', (e) => e.preventDefault());

        lettersContainer.appendChild(letter);
        letters.push(letter);
    }
    
    console.log('Создано букв:', letters.length);
}

function handleLetterMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();

    const letter = e.target;

    if (e.ctrlKey || e.metaKey) {
        if (selectedLetters.has(letter)) {
            selectedLetters.delete(letter);
            letter.classList.remove('selected');
        } else {
            selectedLetters.add(letter);
            letter.classList.add('selected');
        }
        return;
    }

    selectedLetters.clear();
    letters.forEach(l => l.classList.remove('selected'));
    selectedLetters.add(letter);
    letter.classList.add('selected');
}

lettersContainer.addEventListener('mousedown', handleContainerMouseDown);
document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('mouseup', handleMouseUp);

function handleContainerMouseDown(e) {
    if (e.target === lettersContainer || e.target === selectionBox) {
        e.preventDefault();
        isSelecting = true;
        selectionStart = { x: e.clientX, y: e.clientY };
        
        const containerRect = lettersContainer.getBoundingClientRect();
        selectionBox.style.left = (e.clientX - containerRect.left) + 'px';
        selectionBox.style.top = (e.clientY - containerRect.top) + 'px';
        selectionBox.style.width = '0';
        selectionBox.style.height = '0';
        selectionBox.style.display = 'block';
    }
}

function handleMouseMove(e) {
    if (isSelecting) {
        const containerRect = lettersContainer.getBoundingClientRect();
        
        const currentX = e.clientX - containerRect.left;
        const currentY = e.clientY - containerRect.top;
        
        const startX = selectionStart.x - containerRect.left;
        const startY = selectionStart.y - containerRect.top;

        const left = Math.min(startX, currentX);
        const top = Math.min(startY, currentY);
        const width = Math.abs(currentX - startX);
        const height = Math.abs(currentY - startY);

        selectionBox.style.left = left + 'px';
        selectionBox.style.top = top + 'px';
        selectionBox.style.width = width + 'px';
        selectionBox.style.height = height + 'px';

        letters.forEach(letter => {
            const letterRect = letter.getBoundingClientRect();
            const boxRect = selectionBox.getBoundingClientRect();

            if (isOverlapping(letterRect, boxRect)) {
                if (!selectedLetters.has(letter)) {
                    selectedLetters.add(letter);
                    letter.classList.add('selected');
                }
            }
        });
    }
}

function handleMouseUp(e) {
    if (isSelecting) {
        isSelecting = false;
        selectionBox.style.display = 'none';
    }
}

function isOverlapping(rect1, rect2) {
    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );
}