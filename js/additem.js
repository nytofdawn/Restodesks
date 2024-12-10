
form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(form);

    try {
        const response = await fetch('http://localhost:3000/api/add-item', {
            method: 'POST',
            body: formData
        });

        // Check if the response is successful
        if (!response.ok) {
            const result = await response.json();
            showModal(result.message || 'Error adding item');
            return; // Exit the function early on error
        }

        const result = await response.json();

        // Show success message and add the item to the table
        showModal('Success! Item has been added successfully.'); // Display modal with success message
        addToTable(result); // Add new item to the table
        form.reset(); // Reset the form after successful submission

    } catch (error) {
        console.error('Error:', error);
        showModal('An error occurred. Please try again.');
    }
});

// Function to display modal messages
function showModal(message) {
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    
    modalMessage.innerText = message;
    modal.style.display = 'flex'; // Display the modal
}

// Function to add the new item to the table
function addToTable(item) {
    const tableBody = document.querySelector('#itemTable tbody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${item.itemId}</td>
        <td>${item.name}</td>
        <td><img src="uploads/${item.image}" alt="${item.name}" width="50"></td>
        <td>${item.category}</td>
        <td>${parseFloat(item.price).toFixed(2)}</td>
        <td>${item.description}</td>
        <td>${item.table_number}</td> <!-- Ensure this matches your data structure -->
    `;

    tableBody.appendChild(newRow); // Append the new row to the table body
}

// Close modal on OK button click
document.getElementById('ok-button').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
});
