// Assuming you have a div with id 'table-container' where you want to render the table
const tableContainer = document.getElementById('table-container');

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

// Fetch data from backend and append it to the table
fetch('/runsmallstored_withQuery')
    .then(response => response.json())
    .then(data => {
        renderTable(data); // Call the function to render the table
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
