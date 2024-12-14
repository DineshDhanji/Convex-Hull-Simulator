let bruteForceInProgress = false;
// Function to input points
function InputPoints() {

    const coordinates = JSON.parse(localStorage.getItem("coordinates")) || [];

    for (let i = 0; i < coordinates.length; i++) {
        if (!(!isNaN(coordinates[i].x) && !isNaN(coordinates[i].y))) {
            alert("Invalid data found");
            coordinates = [];
        }
    }

    return coordinates;
}

// draws the graph that includes points that are not necessarily the part of the hull
async function drawcheckingGraph(selectedVerticeX, selectedVerticeY, unSelectedVerticeX, unSelectedVerticeY) {
    GRAPH = document.getElementById('graphs-div');
    var trace1 = {
        x: unSelectedVerticeX,
        y: unSelectedVerticeY,
        mode: 'markers',
        type: 'scatter',
        name: "Unselected Vertices",
        marker: { size: 12 }
    }
    var trace2 = {
        x: selectedVerticeX,
        y: selectedVerticeY,
        mode: 'lines+markers',
        type: 'scatter',
        name: "Selected Vertices",
        marker: { size: 18, color: 'green' }
    }
    data = [trace1, trace2, { title: 'Brute Force' }];
    Plotly.newPlot('graphs-div', data);
}

// draws the graph that has only those points that are part of the hull
async function drawGraph(selectedVerticeX, selectedVerticeY, unSelectedVerticeX, unSelectedVerticeY) {
    GRAPH = document.getElementById('graphs-div');
    var trace1 = {
        x: unSelectedVerticeX,
        y: unSelectedVerticeY,
        mode: 'markers',
        type: 'scatter',
        name: "Unselected Vertices",
        marker: { size: 12 }
    }
    var trace2 = {
        x: selectedVerticeX,
        y: selectedVerticeY,
        mode: 'lines+markers',
        type: 'scatter',
        name: "Selected Vertices",
        marker: { size: 12 }
    }
    data = [trace1, trace2, { title: 'Brute Force' }];
    Plotly.newPlot('graphs-div', data);
}

// finds index
function find(px, py, x, y) {
    for (let i = 0; i < x.length; i++) {
        if (x[i] === px) {
            if (y[i] === py) {
                return i;
            }
        }
    }
    return -1;
}

async function brute_force() {
    // Check if the function is already in progress
    if (bruteForceInProgress) {
        alert('Brute Force is already in progress. Ignoring the new invocation.');
        return;
    }
    // Set the flag to indicate that the function is in progress
    bruteForceInProgress = true;
    const points = InputPoints();
    const n = points.length;

    if (n === 0) {
        alert("No points")
        return;
    }
    if (n < 3) {
        alert("Enter at least three points.");
        return;
    };
    let x = [];
    let y = [];
    let selectedx = [];
    let selectedy = [];
    let unselectedx = [];
    let unselectedy = [];
    let total = 0, val;

    for (let i = 0; i < n; i++) {
        // x = x + points[i].x;
        // y = y + points[i].y;
        x.push(points[i].x);
        y.push(points[i].y);
    }
    let hull = new Array(n).fill(-1);

    for (let i = 0; i < n; i++) {

        for (let j = 0; j < n; j++) {
            if (i !== j) {
                let flag2 = true;

                for (let k = 0; k < n; k++) {
                    if (i !== k && j !== k) {
                        const val = (x[j] - x[i]) * (y[k] - y[i]) - (y[j] - y[i]) * (x[k] - x[i]);
                        if (val <= 0) {
                            flag2 = false;
                            break;
                        }
                    }
                }

                if (flag2) {
                    hull[i] = j;
                    total++;
                }
            }
        }
    }

    for (let i = 0; i < n; i++) {
        unselectedx.push(x[i]);
        unselectedy.push(y[i]);
    }

    let count = 0, j, savedx, savedy, i = 0;
    let done = false;
    while (true) {
        if (count == total) {
            break;
        }

        if (hull[i] != -1) {

            if (done === false) {
                selectedx.push(x[i]);
                selectedy.push(y[i]);
                count++;
                done = true;
            }

            for (j = 0; j <= hull[i]; j++) {
                if (find(x[j], y[j], selectedx, selectedy) > -1) {
                    continue;
                }
                selectedx.push(x[j]);
                selectedy.push(y[j]);

                if (j === hull[i]) {
                    console.log("Draw Graph");
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    await drawGraph(selectedx, selectedy, unselectedx, unselectedy);
                }
                else {
                    console.log("Draw checking Graph");
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    await drawcheckingGraph(selectedx, selectedy, unselectedx, unselectedy);
                }

                console.log(selectedx);
                console.log(selectedy);
                console.log(unselectedx);
                console.log(unselectedy);

                savedx = selectedx.pop();
                savedy = selectedy.pop();
            }

            selectedx.push(savedx);
            selectedy.push(savedy);

            i = hull[i];
            count++;
            continue;
        }

        i++;
    }

    selectedx.push(selectedx[0]);
    selectedy.push(selectedy[0]);

    console.log("Draw Graph");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await drawGraph(selectedx, selectedy, unselectedx, unselectedy);
    bruteForceInProgress = false;
    print_convex_hull(selectedx, selectedy);
}
function print_convex_hull(selectedx, selectedy) {
    let convex_hull_div = document.querySelector("#convex-hull-div");
    convex_hull_div.innerHTML = `
    <div class="display-6 mt-1 mb-3">Convex Hull Points</div>
    <ul class="list-group list-group-flush fs-5">
    <li class="list-group-item fw-semibold">Total Length: ${selectedx.length - 1}</li>
    <li class="list-group-item fw-semibold"># (X, Y)</li>
    </ul>`;

    let n = selectedx.length;
    for (let i = 0; i < n - 1; i++) {
        let li = document.createElement('li');
        li.innerHTML = `(${selectedx[i]}, ${selectedy[i]})`;
        li.classList.add("list-group-item");
        convex_hull_div.querySelector("ul").appendChild(li);
    }
    // Scroll to the convex hull div
    convex_hull_div.scrollIntoView({ behavior: 'smooth' });
}
  