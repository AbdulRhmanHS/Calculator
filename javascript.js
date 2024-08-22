const expression = document.querySelector('.expression');
const result = document.querySelector('.result');
const buttons = document.querySelector('.buttons');

function multiply(arr, pos) {
    arr.splice(pos - 1, 3, parseFloat(arr[pos - 1]) * parseFloat(arr[pos + 1]));
}

function divide(arr, pos) {
    arr.splice(pos - 1, 3, parseFloat(arr[pos - 1]) / parseFloat(arr[pos + 1]));
}

function add(arr, pos) {
    arr.splice(pos - 1, 3, parseFloat(arr[pos - 1]) + parseFloat(arr[pos + 1]));
}

function subtract(arr, pos) {
    arr.splice(pos - 1, 3, parseFloat(arr[pos - 1]) - parseFloat(arr[pos + 1]));
}

function power(arr, pos) {
    arr.splice(pos - 1, 3, parseFloat(arr[pos - 1]) ** parseFloat(arr[pos + 1]));
}

function squareRoot(arr, pos) {
    arr.splice(pos, 2, Math.sqrt(parseFloat(arr[pos + 1])));
}

function modulo(arr, pos) {
    arr.splice(pos - 1, 3, parseFloat(arr[pos - 1]) % parseFloat(arr[pos + 1]));
}

function splitExpression(str) {
    str += '$'; // To mark the ending of the string.
    let arr = [];
    let lastIndex = 0;
    let paraIndex = 0;

    for (let i = 0; i < str.length; i++) {
        if (str[i] === '(') {
            paraIndex += 1;
        }
        else if (str[i] === ')') {
            paraIndex -= 1;
        }
        else if (str[i] === ')' && paraIndex === 0) {
            arr.push(str.slice(lastIndex, i + 1));
            lastIndex = i + 1;
        }
        else if ((str[i] === '+' || str[i] === '‐' || str[i] === '×' || str[i] === '÷' || str[i] === '^' || str[i] === '%') && paraIndex === 0) {
            arr.push(str.slice(lastIndex, i));
            arr.push(str[i]);
            lastIndex = i + 1;
        }
        else if (str[i] === '√' && paraIndex === 0) {
            arr.push(str[i]);
            lastIndex = i + 1;
        }
        else if (str[i] === '$') {
            arr.push(str.slice(lastIndex, i));
        }
    }

    return paraIndex === 0 ? arr : "Syntax Error";
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

    return arr !== "Syntax Error" ? parseFloat(Number(arr[0]).toFixed(9)) : arr;
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
            else if (event.target.id === "power") {
                expression.textContent += "^(";
            }
            else if (event.target.id === "modulo") {
                expression.textContent += '%';
            }
            else {
                expression.textContent += event.target.textContent;
            }
        }
    }
    else if (event.target.textContent === '=') {
        result.textContent = '= ' + evaluate(expression.textContent);
    }
});