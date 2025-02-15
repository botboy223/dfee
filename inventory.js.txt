// Function to save inventory data
function saveInventory(data) {
    localStorage.setItem('inventory', JSON.stringify(data));
}

// Function to load inventory data
function loadInventory() {
    return JSON.parse(localStorage.getItem('inventory')) || [];
}

// Function to add a product to inventory
function addToInventory(product) {
    let inventory = loadInventory();
    let existingProduct = inventory.find(p => p.name === product.name);
    if (existingProduct) {
        existingProduct.quantity += product.quantity;
    } else {
        inventory.push(product);
    }
    saveInventory(inventory);
}

// Function to update inventory on sale
function updateInventoryOnSale(productName, quantitySold) {
    let inventory = loadInventory();
    let product = inventory.find(p => p.name === productName);
    if (product) {
        product.quantity -= quantitySold;
        if (product.quantity <= 0) {
            inventory = inventory.filter(p => p.name !== productName);
        }
        saveInventory(inventory);
    }
}

// Function to display inventory in the UI
function displayInventory() {
    let inventory = loadInventory();
    let inventoryContainer = document.getElementById('inventory-list');
    inventoryContainer.innerHTML = '';
    inventory.forEach(product => {
        let productRow = document.createElement('tr');
        productRow.innerHTML = `
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>${product.price}</td>
        `;
        inventoryContainer.appendChild(productRow);
    });
}

// Dashboard function to show sales summary
function updateDashboard() {
    let inventory = loadInventory();
    let lowStockProducts = inventory.filter(p => p.quantity <= 5);
    let totalSales = inventory.reduce((acc, p) => acc + (p.sold || 0), 0);
    document.getElementById('total-sales').innerText = totalSales;
    document.getElementById('low-stock').innerText = lowStockProducts.length;
}

// Function to add Inventory section in HTML dynamically
document.addEventListener("DOMContentLoaded", function() {
    let inventorySection = document.createElement("div");
    inventorySection.innerHTML = `
        <h2>Inventory</h2>
        <table border="1">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody id="inventory-list"></tbody>
        </table>
        <h2>Dashboard</h2>
        <p>Total Sales: <span id="total-sales">0</span></p>
        <p>Low Stock Products: <span id="low-stock">0</span></p>
    `;
    document.body.appendChild(inventorySection);

    displayInventory();
    updateDashboard();
});
