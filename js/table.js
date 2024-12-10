function showModal(message, type) {
    const modal = document.getElementById("modal");
    const modalMessage = document.getElementById("modal-message");

    // Set the message
    modalMessage.innerText = message;

    // Add success or error class based on the type
    if (type === 'success') {
        modal.classList.add('modal-success');
        modal.classList.remove('modal-error');
    } else if (type === 'error') {
        modal.classList.add('modal-error');
        modal.classList.remove('modal-success');
    }

    // Show the modal
    modal.style.display = "block";

    // Automatically hide the modal after 3 seconds
    setTimeout(() => {
        modal.style.display = "none";
    }, 3000);  // Hide after 3 seconds
}

function addTable() {
    const tableName = document.getElementById("table-name").value;
    const capacity = document.getElementById("table-description").value;

    // Validate inputs
    if (!tableName || !capacity) {
        showModal('Please enter both table number and capacity.', 'error');
        return;
    }

    // Create data object
    const data = {
        table_number: tableName,
        capacity: capacity
    };

    // Log the data being sent to the server
    console.log('Data being sent:', data);

    // Send a POST request to the backend
    fetch('http://localhost:3000/api/add-table', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Table added successfully") {
            showModal('Table added successfully!', 'success');
        } else {
            showModal(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showModal('Error adding table.', 'error');
    });
}
