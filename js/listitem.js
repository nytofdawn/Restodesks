document.addEventListener('DOMContentLoaded', () => {
    fetchItems();
});


function fetchItems() {
    const url = 'http://localhost:3000/api/list-items'; 

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(items => {
            const tableBody = document.getElementById('item-table-body');
            tableBody.innerHTML = '';
            items.forEach(item => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td><img src="uploads/${item.image}" alt="Item Image" style="width: 50px; height: 50px;"></td>
                    <td>${item.name}</td>
                    <td>${item.table_number}</td>
                    <td>${item.category}</td>
                    <td>₱${item.price.toFixed(2)}</td>
                    <td><button class="remove-btn" onclick="removeItem(${item.id})">Remove</button></td>
                    <td><button class="edit-btn" onclick="editItem(${item.id})">Edit</button></td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function removeItem(itemId) {
    if (confirm('Are you sure you want to remove this item?')) {
        const url = `http://localhost:3000/api/item/${itemId}`;

        fetch(url, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete item');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message); 
            fetchItems(); 
        })
        .catch(error => {
            console.error('There was a problem with the delete operation:', error);
        });
    }
}


function editItem(itemId) {
   
    fetch(`http://localhost:3000/api/item/${itemId}`)
        .then(response => response.json())
        .then(item => {
            
            const itemName = prompt("Edit item name:", item.name);
            const itemCategory = prompt("Edit category:", item.category);
            const itemPrice = prompt("Edit price:", item.price);

            if (itemName && itemCategory && itemPrice) {
                
                const updatedItem = {
                    name: itemName,
                    category: itemCategory,
                    price: parseFloat(itemPrice)
                };

                fetch(`http://localhost:3000/api/item/${itemId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedItem)
                })
                .then(response => response.json())
                .then(data => {
                    alert('Item updated successfully!');
                    fetchItems(); 
                })
                .catch(error => console.error('Error updating item:', error));
            }
        })
        .catch(error => console.error('Error fetching item details:', error));
}
