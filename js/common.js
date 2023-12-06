function formatCurrency(number) {
    return number.toLocaleString('en', { style: 'currency', currency: 'VND' });
}

function displayValidationError(elementId, message) {
    const element = document.getElementById(elementId);
    if (document.querySelector(`#${elementId} .text-success`) !== null)
        document.querySelector(`#${elementId} .text-success`).classList.remove('text-success');

    element.innerHTML = message;
    element.classList.add('text-danger');
}

function displayValidationSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    if (document.querySelector(`#${elementId} .text-danger`) !== null)
        document.querySelector(`#${elementId} .text-danger`).classList.remove('text-danger');

    element.innerHTML = message;
    element.classList.add('text-success');
}