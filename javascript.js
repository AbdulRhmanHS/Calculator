const expression = document.querySelector('.expression');
const result = document.querySelector('.result');
const buttons = document.querySelector('.buttons');


function isNumber(str) {
    return !isNaN(parseFloat(str)) && !isNaN(Number(str));
}

// Operators with no math errors.
function multiply(arr, pos) {
    if (isNumber(arr[pos - 1]) && isNumber(arr[pos + 1])) {
        arr.splice(pos - 1, 3, Number(arr[pos - 1]) * Number(arr[pos + 1]));
    }
    else {
        arr.splice(0, arr.length, "Syntax Error");
    }
}
function add(arr, pos) {
    if (isNumber(arr[pos - 1]) && isNumber(arr[pos + 1])) {
        arr.splice(pos - 1, 3, Number(arr[pos - 1]) + Number(arr[pos + 1]));
    }
    else {
        arr.splice(0, arr.length, "Syntax Error");
    }
}
function subtract(arr, pos) {
    if (isNumber(arr[pos - 1]) && isNumber(arr[pos + 1])) {
        arr.splice(pos - 1, 3, Number(arr[pos - 1]) - Number(arr[pos + 1]));
    }
    else {
        arr.splice(0, arr.length, "Syntax Error");
    }
}
function power(arr, pos) {
    if (isNumber(arr[pos - 1]) && isNumber(arr[pos + 1])) {
        arr.splice(pos - 1, 3, Number(arr[pos - 1]) ** Number(arr[pos + 1]));
    }
    else {
        arr.splice(0, arr.length, "Syntax Error");
    }
}

// Operators with math errors.
function divide(arr, pos) {
    if (isNumber(arr[pos - 1]) && isNumber(arr[pos + 1])) {
        if (Number(arr[pos + 1]) !== 0) {
            arr.splice(pos - 1, 3, parseFloat(Number(arr[pos - 1])) / parseFloat(Number(arr[pos + 1])));
        }
        else {
            arr.splice(0, arr.length, "Math Error");
        }
    }
    else {
        arr.splice(0, arr.length, "Syntax Error");
    }
}
function modulo(arr, pos) {
    if (isNumber(arr[pos - 1]) && isNumber(arr[pos + 1])) {
        if (Number(arr[pos + 1]) !== 0) {
            arr.splice(pos - 1, 3, parseFloat(Number(arr[pos - 1])) % parseFloat(Number(arr[pos + 1])));
        }
        else {
            arr.splice(0, arr.length, "Math Error");
        }
    }
    else {
        arr.splice(0, arr.length, "Syntax Error");
    }
}
function squareRoot(arr, pos) {
    if (isNumber(arr[pos + 1])) {
        if (Number(arr[pos + 1]) >= 0) {
            arr.splice(pos, 2, Math.sqrt(Number(arr[pos + 1])));
        }
        else {
            arr.splice(0, arr.length, "Math Error");
        }
    }
    else {
        arr.splice(0, arr.length, "Syntax Error");
    }
}

function splitExpression(str) {
    str += '$'; // To mark the ending of the string.
    let arr = [];
    let lastIndex = 0;
    let paraIndex = 0; // Zero means no parentheses or all of them are closed.

    for (let i = 0; i < str.length; i++) {
        if (str[i] === '(') {
            // Splitting the numbers before parentheses and multiply them.
            if (lastIndex !== i && paraIndex === 0) {
                arr.push(str.slice(lastIndex, i));
                arr.push('×');
                lastIndex = i;
            }
            paraIndex += 1;
        }
        else if (str[i] === ')' && paraIndex === 1) {
            arr.push(str.slice(lastIndex, i + 1));
            lastIndex = i + 1;
            if (isNumber(str[i + 1]) || str[i + 1] === '(') arr.push('×'); // Multiplying numbers after parentheses or other parentheses.
            paraIndex -= 1;
        }
        else if (str[i] === ')') {
            paraIndex -= 1;
        }
        else if ((str[i] === '+' || str[i] === '‐' || str[i] === '×' || str[i] === '÷' || str[i] === '^' || str[i] === '%' || str[i] === '√') && paraIndex === 0) {
            if (lastIndex !== i) arr.push(str.slice(lastIndex, i));
            if (lastIndex !== i && str[i] === '√') arr.push('×'); // Multiplying numbers before a square root.
            arr.push(str[i]);
            lastIndex = i + 1; 
        }
        else if (str[i] === '$' && lastIndex !== i) {
            arr.push(str.slice(lastIndex, i));
        }
    }

    return paraIndex === 0 ? arr : ["Syntax Error"];
}


function evaluate(str) {
    let arr = splitExpression(str);

    // First the precedence of the parentheses.
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][0] === '(' && arr[i][arr[i].length -1] === ')') {
            arr[i] = arr[i].slice(1, -1);
            arr[i] = evaluate(arr[i]);
        }
    }

    // Second the precedence of the power and square root.
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === '^') {
            power(arr, i);
            i--;
        }
        else if (arr[i] === '√') {
            squareRoot(arr, i);
            i--;
        }
    }
    
    // Third the precedence of multiplication, division and modulo.
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === '×') {
            multiply(arr, i);
            i--;
        }
        else if (arr[i] === '÷') {
            divide(arr, i);
            i--;
        }
        else if (arr[i] === '%') {
            modulo(arr, i);
            i--;
        }
    }

    // Finally the precedence of addition and subtraction.
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === '+') {
            add(arr, i);
            i--;
        }
        else if (arr[i] === '‐') {
            subtract(arr, i);
            i--;
        }
    }

    if (!isNumber(arr[0]) && arr[0] !== "Math Error" && arr.length !== 0) arr.splice(0, arr.length, "Syntax Error"); // Syntax error last check.
    else arr.push("Enter an expression");

    // Reducing the number of digits after the decimal point.
    return arr[0] !== "Syntax Error" && arr[0] !== "Math Error" && arr[0] !== "Enter an expression" ? parseFloat(Number(arr[0]).toFixed(9)) : arr[0];
}

// Function to insert a character at the current caret position
function insertAtCaret(char) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    // Create a text node with the character
    const textNode = document.createTextNode(char);
    range.deleteContents(); // Remove any selected text
    range.insertNode(textNode);

    // Move the cursor after the inserted character
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
}

// Buttons and equal sign function.
buttons.addEventListener('click', event => {
    if (event.target.tagName === 'BUTTON' && event.target.textContent !== '=') {
        if (event.target.textContent === "AC") {
            expression.textContent = '';
            result.textContent = '';
        }
        else if (event.target.textContent === "DEL") {
            expression.textContent = expression.textContent.slice(0, -1);
        }
        else {
            if (event.target.id === "negative") {
                expression.textContent += '-';
            }
            else if (event.target.id === "squareRoot") {
                expression.textContent += "√(";
            }
            else if (event.target.id === "modulo") {
                expression.textContent += '%';
            }
            else {
                expression.textContent += event.target.textContent;
            }
        }
        expression.scrollLeft = expression.scrollWidth; // Scrolls to the end after each update.
    }
    else if (event.target.textContent === '=') {
        result.textContent = '= ' + evaluate(expression.textContent);
    }
});

// Prevent pasting or inserting invalid characters directly into the expression.
expression.addEventListener('keydown', (event) => {
    // Allow navigation keys, etc.
    const allowedKeys = [
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End',
    ];

    // Allow numbers, parentheses, and operators
    const validInput = /^[0-9+\-*/().^%√]*$/;

    if (!allowedKeys.includes(event.key) && !validInput.test(event.key)) {
        event.preventDefault();
    }

    if (event.key === '-') {
        event.preventDefault();
        insertAtCaret('‐');
    }
    if (event.key === '*') {
        event.preventDefault();
        insertAtCaret('×');
    }
    if (event.key === '/') {
        event.preventDefault();
        insertAtCaret('÷');
    }
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default behavior of adding a new line
        result.textContent = '= ' + evaluate(expression.textContent);
    }
});