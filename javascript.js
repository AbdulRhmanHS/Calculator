const expression = document.querySelector('.expression');
const result = document.querySelector('.result');
const buttons = document.querySelector('.buttons');

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
            expression.textContent += event.target.textContent;
        }
    }
    else if (event.target.textContent === '=') {
        // Code to make the calculator work.
    }
});
