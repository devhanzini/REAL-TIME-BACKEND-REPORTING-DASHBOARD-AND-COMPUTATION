// Assuming you have a div with id 'table-container' where you want to render the table
const tableContainer = document.getElementById('allTaxes');

// Function to render the data into an HTML table
function renderTable(data) {
    // Create a table element
    const table = document.createElement('table');
    table.classList.add('my-table-class'); // You can add your own class for styling

    // Create table header row
    const headerRow = table.insertRow();
    for (const key in data[0]) {
        if (data[0].hasOwnProperty(key)) {
            const headerCell = document.createElement('th');
            headerCell.textContent = key;
            headerRow.appendChild(headerCell);
        }
    }

    // Create table rows and cells
    data.forEach(item => {
        const row = table.insertRow();
        for (const key in item) {
            if (item.hasOwnProperty(key)) {
                const cell = row.insertCell();
                cell.textContent = item[key];
            }
        }
    });

    // Append the table to the container
    tableContainer.appendChild(table);
}

// Assuming you receive data from res.json(result[0]) and it's an array of objects
const responseData = [
    { "Product ID": 1, "Currency": "USD", "Customer": "John Doe", /* and so on */ },
    { "Product ID": 2, "Currency": "EUR", "Customer": "Jane Doe", /* and so on */ },
    // Add more objects as per your data structure
];

// Call the function to render the table
renderTable(responseData);
