// index.js (Login logic)

const { ipcRenderer } = require('electron');

// Handle form submission
document.getElementById('login-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Send data to the main process
    ipcRenderer.send('login-user', { email, password });

    // Listen for the response from the main process
    ipcRenderer.once('login-response', (event, response) => {
        const modal = document.getElementById('modal');
        const modalMessage = document.getElementById('modal-message');
        const successModal = document.getElementById('success-modal');

        // Clear previous messages
        modalMessage.innerText = '';

        if (response.success) {
            // Show success message in the success modal
            successModal.style.display = 'flex';  // Use flex to center the modal
            modal.style.display = 'none';  // Hide the error modal

            // Add event listener for the success OK button
            document.getElementById('success-ok-button').onclick = () => {
                window.location.href = 'dashboard.html'; // Redirect to dashboard
            };
        } else {
            // Show error message in the error modal
            modalMessage.innerText = response.message;
            modal.style.display = 'flex';  // Show the error modal
        }
    });
});

// Close the error modal and clear message
document.getElementById('ok-button').addEventListener('click', () => {
    const modal = document.getElementById('modal');
    modal.style.display = 'none'; // Hide the modal
});
