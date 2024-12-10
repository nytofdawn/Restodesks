// Function to add a new item to the database
function addItem() {
    const itemName = document.getElementById('item-name').value;
    const itemDescription = document.getElementById('item-description').value;
    const itemCategory = document.getElementById('item-category').value;
    const itemImage = document.getElementById('item-image').files[0];

    if (itemName && itemDescription && itemCategory && itemImage) {
        let formData = new FormData();
        formData.append('item-name', itemName);
        formData.append('item-description', itemDescription);
        formData.append('item-category', itemCategory);
        formData.append('item-image', itemImage);

        fetch('add_item.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(result => {
            alert(result);  // Show success message
            if (result.includes('successfully')) {
                fetchItems();  // Refresh the list of items
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        alert('Please fill out all fields.');
    }
}

function fetchItems() {
    fetch('/api/items')
        .then(response => response.json())
        .then(items => {
            const tableBody = document.getElementById('items-table').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = '';  // Clear current table data

            items.forEach(item => {
                const row = tableBody.insertRow();
                row.dataset.id = item.id;  // Store item ID in a data attribute

                row.insertCell(0).textContent = item.name;
                row.insertCell(1).textContent = item.description;
                row.insertCell(2).textContent = item.category;

                const imageCell = row.insertCell(3);
                const imgElement = document.createElement('img');
                imgElement.src = '/uploads/' + item.image_path;
                imgElement.style.width = '60px';
                imgElement.style.height = '60px';
                imgElement.style.objectFit = 'cover';
                imgElement.title = item.name;
                imageCell.appendChild(imgElement);

                const actionsCell = row.insertCell(4);
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.classList.add('edit-btn');
                editButton.onclick = function() { editItem(row); };

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('delete-btn');
                deleteButton.onclick = function() { deleteItem(row); };

                actionsCell.appendChild(editButton);
                actionsCell.appendChild(deleteButton);
            });
        })
        .catch(error => console.error('Error fetching items:', error));
}


// Function to edit an item (filling the form)
function editItem(row) {
    const itemName = row.cells[0].textContent;
    const itemDescription = row.cells[1].textContent;
    const itemCategory = row.cells[2].textContent;

    document.getElementById('item-name').value = itemName;
    document.getElementById('item-description').value = itemDescription;
    document.getElementById('item-category').value = itemCategory;

    const addButton = document.querySelector('.form-container button');
    addButton.textContent = 'Update Item';
    addButton.setAttribute('onclick', 'updateItem(this, row)');
}

// Function to update an item
function updateItem(button, row) {
    const itemName = document.getElementById('item-name').value;
    const itemDescription = document.getElementById('item-description').value;
    const itemCategory = document.getElementById('item-category').value;
    const itemId = row.dataset.id;

    if (itemName && itemDescription && itemCategory) {
        let formData = new FormData();
        formData.append('item-id', itemId);
        formData.append('item-name', itemName);
        formData.append('item-description', itemDescription);
        formData.append('item-category', itemCategory);

        // Check if an image is uploaded
        const itemImage = document.getElementById('item-image').files[0];
        if (itemImage) {
            formData.append('item-image', itemImage);
        } else {
            formData.append('current-image', row.cells[3].children[0].src);
        }

        fetch('update_item.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(result => {
            alert(result);
            if (result.includes('successfully')) {
                fetchItems();  // Refresh item list
            }
        })
        .catch(error => {
            console.error('Error updating item:', error);
        });
    } else {
        alert('Please fill out all fields.');
    }
}

// Function to delete an item
function deleteItem(row) {
    const itemId = row.dataset.id;

    let formData = new FormData();
    formData.append('item-id', itemId);

    fetch('delete_item.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(result => {
        alert(result);
        if (result.includes('successfully')) {
            fetchItems();  // Refresh item list
        }
    })
    .catch(error => {
        console.error('Error deleting item:', error);
    });
}

// Load items on page load
window.onload = fetchItems;
