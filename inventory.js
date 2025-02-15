// Function to save inventory data
function saveInventory(data) {
    localStorage.setItem('inventory', JSON.stringify(data));
}

// Function to load inventory data
function loadInventory() {
    return JSON.parse(localStorage.getItem('inventory')) || [];
}

// Function to add or update product in inventory
function addToInventory(product) {
    let inventory = loadInventory();
    let existingProduct = inventory.find(p => p.barcode === product.barcode);
    if (existingProduct) {
        existingProduct.quantity += product.quantity;
    } else {
        inventory.push(product);
    }
    saveInventory(inventory);
    displayInventory();
}

// Function to update inventory when a sale happens
function updateInventoryOnSale(barcode, quantitySold) {
    let inventory = loadInventory();
    let product = inventory.find(p => p.barcode === barcode);
    if (product) {
        product.quantity -= quantitySold;
        if (product.quantity <= 0) {
            inventory = inventory.filter(p => p.barcode !== barcode);
        }
        saveInventory(inventory);
    }
    displayInventory();
    updateDashboard();
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
            <td><button onclick="editProduct('${product.barcode}')">Edit</button></td>
        `;
        inventoryContainer.appendChild(productRow);
    });
}

// Function to edit product in inventory
function editProduct(barcode) {
    let inventory = loadInventory();
    let product = inventory.find(p => p.barcode === barcode);
    if (product) {
        let newQuantity = prompt("Enter new quantity:", product.quantity);
        let newPrice = prompt("Enter new price:", product.price);
        if (newQuantity !== null) product.quantity = parseInt(newQuantity);
        if (newPrice !== null) product.price = parseFloat(newPrice);
        saveInventory(inventory);
        displayInventory();
    }
}

// Dashboard function to show sales summary
function updateDashboard() {
    let inventory = loadInventory();
    let lowStockProducts = inventory.filter(p => p.quantity <= 5);
    let totalSales = inventory.reduce((acc, p) => acc + (p.sold || 0), 0);
    document.getElementById('total-sales').innerText = totalSales;
    document.getElementById('low-stock').innerText = lowStockProducts.length;
}

// Function to integrate with barcode scanning
function onBarcodeScanned(barcode, name, price) {
    addToInventory({ barcode, name, quantity: 1, price });
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
                    <th>Action</th>
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
