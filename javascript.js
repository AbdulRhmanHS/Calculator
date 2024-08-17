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

function evaluate(str) {
    let arr = str.split(/([+\‐×÷])/g)
    
    for (let i = 0; i < arr.length + 1; i++) {
        if (arr[i] === '×') {
            multiply(arr, i);
            i--;
        }
        else if (arr[i] === '÷') {
            divide(arr, i);
            i--;
        }
    }

    for (let i = 0; i < arr.length + 1; i++) {
        if (arr[i] === '+') {
            add(arr, i);
            i--;
        }
        else if (arr[i] === '‐') {
            subtract(arr, i);
            i--;
        }
    }

    return arr[0];
}

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
            else {
                expression.textContent += event.target.textContent;
            }
        }
    }
    else if (event.target.textContent === '=') {
        result.textContent = '= ' + evaluate(expression.textContent);
    }
});