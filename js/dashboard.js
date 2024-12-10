// Fetch items from the API when the page loads
document.addEventListener('DOMContentLoaded', fetchItems);

function fetchItems() {
    fetch('http://localhost:3000/api/items') // Ensure this is pointing to the correct URL
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(items => {
            displayItems(items);
        })
        .catch(error => {
            console.error('Error fetching items:', error);
            // Optionally display an error message or handle it
        });
}

function addToTable(item) {
    const tableBody = document.querySelector('#itemTable tbody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${item.itemId}</td>

        <td><img src="uploads/${item.image}" width="50"></td>
        <td>${item.category}</td>
        <td>${parseFloat(item.price).toFixed(2)}</td>
        <td>${item.description}</td>
    `;

    tableBody.appendChild(newRow); // Append new row to the table
}
