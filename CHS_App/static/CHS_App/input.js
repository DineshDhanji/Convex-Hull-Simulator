document.addEventListener("DOMContentLoaded", () => {
    // Get references to the input fields and the button
    const xInput = document.getElementById("x-coordinate");
    const yInput = document.getElementById("y-coordinate");
    // Add event listeners for the Enter key press and button click
    xInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            addCoordinates();
        }
    });
    yInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            addCoordinates();
        }
    });
    const addPointBtn = document.querySelector("#addCoordiantes");
    addPointBtn.addEventListener("click", () => { addCoordinates() })
    loadCoordinates();
    const tbody = document.querySelector('#tbody');
    tbody.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove-btn")) {
            removeCoordinate(event.target);
        }
    });

    loadReadFromFileView();

    document.querySelector("#inputViewButton").addEventListener("click", () => {
        loadInputView();
    })
    document.querySelector("#readFromFileViewButton").addEventListener("click", () => {
        loadReadFromFileView();
    })
    document.querySelector("#randomViewButton").addEventListener("click", () => {
        loadRandomView();
    })
})

function addCoordinates() {
    const xInput = document.getElementById("x-coordinate");
    const yInput = document.getElementById("y-coordinate");
    const x = parseFloat(xInput.value);
    const y = parseFloat(yInput.value);
    // Check if the inputs are valid numbers
    if (!isNaN(x) && !isNaN(y)) {
        // You can use x and y here as needed
        const coordinates = JSON.parse(localStorage.getItem("coordinates")) || [];
        // Check if the coordinates already exist
        if (coordinates.some(coord => coord.x === x && coord.y === y)) {
            alert("Coordinates already exist! ...(*￣０￣)ノ");
            return;
        }
        coordinates.push({ x, y });
        localStorage.setItem("coordinates", JSON.stringify(coordinates));
        // You can use x and y here as needed
        console.log("X: " + x + ", Y: " + y);
        // Get the table body then make a new row with 
        // data. Finally add the new row to the table body.
        const tbody = document.querySelector('#tbody');
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
                            <th scope="row">${tbody.childElementCount + 1}</th>
                            <td >${x}</td>
                            <td>${y}</td>
                            <td><i class="bi bi-x-lg remove-btn"></i></td>
                        `;
        tbody.appendChild(newRow);
        // Clear the input fields
        xInput.value = "";
        yInput.value = "";
    } else {
        alert("Please enter valid coordinates (っ °Д °;)っ");
    }
}
function removeCoordinate(button) {
    const row = button.parentNode.parentNode;
    const tbody = document.querySelector('#tbody');
    const rowIndex = Array.from(tbody.children).indexOf(row);
    const coordinates = JSON.parse(localStorage.getItem("coordinates")) || [];
    if (rowIndex >= 0) {
        tbody.removeChild(row);
        coordinates.splice(rowIndex, 1);
        localStorage.setItem("coordinates", JSON.stringify(coordinates));
        // Update the row numbers after removal
        const rows = tbody.querySelectorAll('tr');
        rows.forEach((row, index) => {
            row.children[0].textContent = index + 1;
        });
    }
}
function loadCoordinates() {
    const tbody = document.querySelector('#tbody');
    tbody.innerHTML = '';
    const coordinates = JSON.parse(localStorage.getItem("coordinates")) || [];
    for (const coord of coordinates) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <th scope="row">${tbody.childElementCount + 1}</th>
            <td>${coord.x}</td>
            <td>${coord.y}</td>
            <td><i class="bi bi-x-lg remove-btn"></i></td>
        `;
        tbody.appendChild(newRow);
    }
}
function clearDataset() {
    const coordinates = JSON.parse(localStorage.getItem("coordinates")) || [];
    if (coordinates.length !== 0) {
        localStorage.removeItem("coordinates");
        // Reload the page to update the dataset
        location.reload();
    } else {
        alert("Can't you see there is no data here ( ￣へ￣) Baka ja neo");
    }
}

function loadInputView() {
    document.querySelector("#inputView").style.display = 'block';
    document.querySelector("#readFromFileView").style.display = 'none';
    document.querySelector("#randomView").style.display = 'none';
}
function loadReadFromFileView() {
    document.querySelector("#readFromFileView").style.display = 'block';
    document.querySelector("#inputView").style.display = 'none';
    document.querySelector("#randomView").style.display = 'none';
}
function loadRandomView() {
    document.querySelector("#readFromFileView").style.display = 'none';
    document.querySelector("#inputView").style.display = 'none';
    document.querySelector("#randomView").style.display = 'block';
}

function addRandomCoordiantes() {
    let numberOfRandomPoints = document.querySelector("#numberOfRandomPoints").value
    if (numberOfRandomPoints === '' || isNaN(numberOfRandomPoints)) {
        alert("No valid input for number of random coordinates  ￣へ￣");
        return;
    }
    else if (numberOfRandomPoints < 0) {
        alert("Not gonna use negative number （︶^︶）");
        return;
    }
    else if (numberOfRandomPoints < 3) {
        alert("Need at least 3 number of random coordinates (。_。)");
        return;
    }
    else if (numberOfRandomPoints > 1001) {
        alert("Maximum 50 number of random coordinates plz ( •̀ ω •́ )y");
        return;
    }

    let coordinates = JSON.parse(localStorage.getItem("coordinates")) || [];
    if (coordinates.length !== 0) {
        localStorage.removeItem("coordinates");
    }
    coordinates = [];
    loadCoordinates();

    for (let i = 0; i < numberOfRandomPoints; i++) {
        // Generate random x and y coordinates as integers (positive or negative)
        const randomX = Math.floor(Math.random() * 200) - 100; // Adjust the range as needed
        const randomY = Math.floor(Math.random() * 200) - 100; // Adjust the range as needed

        // Add the coordinates to the array
        coordinates.push({ x: randomX, y: randomY });
    }

    // Save the updated coordinates array to local storage
    localStorage.setItem("coordinates", JSON.stringify(coordinates));
    loadCoordinates();
}

function readCoordinatesFromFile() {
    const fileInput = document.getElementById('fileInput');

    if (!fileInput.files.length) {
        alert("Are you for real (ﾟДﾟ*)ﾉ");
        return;
    }

    const file = fileInput.files[0];

    // Check if the selected file has a .csv extension
    if (!file.name.toLowerCase().endsWith('.csv')) {
        alert("Please select a valid CSV file, you smart boi (╯▔皿▔)╯ ");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        const contents = e.target.result;
        processCSV(contents);
    };

    reader.readAsText(file);
}
function processCSV(contents) {
    const lines = contents.split('\n');
    const coordinates = new Set();

    for (const line of lines) {
        const [x, y] = line.split(',');

        if (x !== undefined && y !== undefined && !isNaN(x) && !isNaN(y)) {
            const point = { x: parseFloat(x), y: parseFloat(y) };

            // Check if the point is already in the set
            if (!coordinates.has(JSON.stringify(point))) {
                coordinates.add(JSON.stringify(point));
            }
        }
    }

    const uniqueCoordinates = Array.from(coordinates).map(JSON.parse);

    // Removing old points from local storage
    localStorage.removeItem("coordinates");
    // Save the updated coordinates array to local storage
    localStorage.setItem("coordinates", JSON.stringify(uniqueCoordinates));
    loadCoordinates();
}