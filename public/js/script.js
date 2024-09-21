const errorMessage = document.querySelector('.error-message');
const inputs = document.querySelectorAll('input');

inputs.forEach(input => {
    input.addEventListener('input', () => {
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
    });
});
