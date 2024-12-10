// signup.js

const { ipcRenderer } = require('electron');

// Handle registration form submission
document.getElementById('register-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;

    // Check if passwords match
    if (password !== confirmPassword) {
        displayMessage('Passwords do not match!', 'error');
        return;
    }

    // Send data to the main process for registration
    ipcRenderer.send('register-user', { name, email, password });

    // Listen for the response from the main process
    ipcRenderer.once('registration-response', (event, response) => {
        if (response.success) {
            // Registration success
            displayMessage('Registration successful! You can now log in.', 'success');
            document.getElementById('register-form').reset();
        } else {
            // Registration failure (e.g., email already exists)
            displayMessage(response.message, 'error');
        }
    });
});

// Function to display success or error message
function displayMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerText = message;
    
    // Style based on message type
    if (type === 'success') {
        messageDiv.style.color = 'green';
    } else {
        messageDiv.style.color = 'red';
    }
}
