document.addEventListener("DOMContentLoaded", function () {
    fetchOrders();

    function fetchOrders() {
        fetch('http://localhost:3000/api/orders')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const tbody = document.querySelector('tbody');
                tbody.innerHTML = '';

                data.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${item.id}</td>
                        <td>${item.name}</td>
                        <td>${item.table_number}</td>
                        <td>$${item.price.toFixed(2)}</td>
                        <td>${item.payment_status || 'Unpaid'}</td>
                        <td>
                            <select class="action-select" onchange="handleActionChange(this, '${item.id}')">
                                <option value="pending" ${item.status === 'pending' ? 'selected' : ''}>Pending</option>
                                <option value="receive" ${item.status === 'receive' ? 'selected' : ''}>Receive</option>
                                <option value="approve" ${item.status === 'approve' ? 'selected' : ''}>Approve</option>
                                <option value="cancel" ${item.status === 'cancel' ? 'selected' : ''}>Cancel</option>
                            </select>
                        </td>
                        <td><button class="remove-btn" onclick="removeOrder('${item.id}')">Remove</button></td>
                    `;
                    tbody.appendChild(row);
                });
            })
            .catch(error => console.error('Error fetching orders:', error));
    }

    window.handleActionChange = function (selectElement, itemId) {
        const selectedAction = selectElement.value;

        fetch(`http://localhost:3000/api/orders/${itemId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: selectedAction }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => console.log('Action updated:', data))
        .catch(error => console.error('Error updating action:', error));
    }

    window.removeOrder = function (itemId) {
        fetch(`http://localhost:3000/api/orders/${itemId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to remove order');
            }
            const row = document.querySelector(`button[onclick="removeOrder('${itemId}')"]`).closest('tr');
            row.remove();
        })
        .catch(error => console.error('Error removing order:', error));
    }
});
