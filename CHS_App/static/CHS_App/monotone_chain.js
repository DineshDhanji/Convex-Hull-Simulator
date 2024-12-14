let monotoneChainInProgress = false;


let x = [];
let y = [];
let reversex = [];
let reversey = [];

let lowerx = [];
let lowery = [];
let upperx = [];
let uppery = [];

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

async function drawdoublecheckingGraph(lowerhullx, lowerhully, selectedVerticeX, selectedVerticeY, unSelectedVerticeX, unSelectedVerticeY) {
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
        name: "Upper hull",
        marker: { size: 18, color: "green" }
    }
    var trace3 = {
        x: lowerhullx,
        y: lowerhully,
        mode: 'lines+markers',
        type: 'scatter',
        name: "Lower hull",
        marker: { size: 18, color: "yellow" }
    }
    data = [trace1, trace2, trace3, { title: 'Monotone Chain' }];
    Plotly.newPlot('graphs-div', data);
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
        name: "Lower hull",
        marker: { size: 18, color: "yellow" }
    }
    data = [trace1, trace2, { title: 'Monotone Chain' }];
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

// sorts points in ascending order
function sort(points, n) {

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (points[j].x > points[j + 1].x) {
                let temp1 = points[j].x;
                points[j].x = points[j + 1].x;
                points[j + 1].x = temp1;

                let temp2 = points[j].y;
                points[j].y = points[j + 1].y;
                points[j + 1].y = temp2;
            }
            else if (points[j].x === points[j + 1].x) {
                if (points[j].y > points[j + 1].y) {
                    let temp1 = points[j].x;
                    points[j].x = points[j + 1].x;
                    points[j + 1].x = temp1;

                    let temp2 = points[j].y;
                    points[j].y = points[j + 1].y;
                    points[j + 1].y = temp2;
                }
            }
        }
    }
}

function CCW(x1, y1, x2, y2, x3, y3) {
    return (((x2 - x1) * (y3 - y1)) - ((y2 - y1) * (x3 - x1)));
}

async function build_hull(xpoints, ypoints, state) {
    let selectedx = [];
    let selectedy = [];
    let val;

    for (let i = 0; i < xpoints.length; i++) {
        while (selectedx.length >= 2) {
            val = CCW(selectedx[selectedx.length - 2], selectedy[selectedy.length - 2], selectedx[selectedx.length - 1], selectedy[selectedx.length - 1], xpoints[i], ypoints[i]);
            if (val > 0) {
                break;
            }
            selectedx.pop();
            selectedy.pop();
        }

        selectedx.push(xpoints[i]);
        selectedy.push(ypoints[i]);

        console.log(selectedx);
        console.log(selectedy);

        console.log("Draw Checking Graph");
        if (state === "upper") {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await drawdoublecheckingGraph(lowerx, lowery, selectedx, selectedy, x, y);
        }
        else if (state === "lower") {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await drawcheckingGraph(selectedx, selectedy, x, y);
        }
    }

    return [selectedx, selectedy];
}

async function monotone_chain() {
    // Check if the function is already in progress
    if (monotoneChainInProgress) {
        alert('Monotone Chain is already in progress. Ignoring the new invocation.');
        return;
    }
    // Set the flag to indicate that the function is in progress
    monotoneChainInProgress = true;
    let points = InputPoints();
    const n = points.length;

    if (n === 0) {
        alert("No points")
        return;
    }
    if (n < 3) {
        alert("Enter at least three points.");
        return;
    };

    sort(points, n);

    console.log("sorted points array");
    console.log(points);

    for (let i = 0; i < n; i++) {
        x.push(points[i].x);
        y.push(points[i].y);

        reversex.push(points[n - 1 - i].x);
        reversey.push(points[n - 1 - i].y);
    }

    console.log("lower hull");
    [lowerx, lowery] = await build_hull(x, y, "lower");

    console.log("upper hull");
    [upperx, uppery] = await build_hull(reversex, reversey, "upper");

    console.log("final lower hull");
    console.log(lowerx);
    console.log(lowery);
    console.log("final upper hull");
    console.log(upperx);
    console.log(uppery);

    // combine the hulls and display one last time
    let convexhullx = lowerx.concat(upperx.slice(1, n - 1));
    let convexhully = lowery.concat(uppery.slice(1, n - 1));
    console.log("complete hull");
    console.log(convexhullx);
    console.log(convexhully);

    // call the displayer
    console.log("Draw Graph");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await drawGraph(convexhullx, convexhully, x, y);

    x = [];
    y = [];
    reversex = [];
    reversey = [];

    lowerx = [];
    lowery = [];
    upperx = [];
    uppery = [];
    monotoneChainInProgress = false;
    print_convex_hull(convexhullx, convexhully);
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