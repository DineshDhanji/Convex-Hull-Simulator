let quickHullInProgress = false;
let selectedx = [];
let selectedy = [];
let unselectedx = [];
let unselectedy = [];

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
    data = [trace1, trace2, { title: 'Quick Hull' }];
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
    data = [trace1, trace2, { title: 'Quick Hull' }];
    Plotly.newPlot('graphs-div', data);
}

// finds the index of a point in the array
function find(p1x, p1y, x, y) {
    for (let i = 0; i < x.length; i++) {
        if (x[i] === p1x) {
            if (y[i] === p1y) {
                return i;
            }
        }
    }

    return -1;
}

// sorts points in ascending order
function sort(x, y, n) {

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (x[j] > x[j + 1]) {
                let temp1 = x[j];
                x[j] = x[j + 1];
                x[j + 1] = temp1;

                let temp2 = y[j];
                y[j] = y[j + 1];
                y[j + 1] = temp2;
            }
            else if (x[j] === x[j + 1]) {
                if (y[j] > y[j + 1]) {
                    let temp1 = x[j];
                    x[j] = x[j + 1];
                    x[j + 1] = temp1;

                    let temp2 = y[j];
                    y[j] = y[j + 1];
                    y[j + 1] = temp2;
                }
            }
        }
    }
}

// calculates slope between two points
function slope(p1x, p1y, p2x, p2y) {
    return (p2y - p1y) / (p2x - p1x);
}

// calculates the y intercept
function intercept(p1x, p1y, p2x, p2y, m) {
    return p1y - (m * p1x);
}

// finds the list of all points above the line
function calcabove(p1x, p1y, p2x, p2y, x, y) {

    let m = slope(p1x, p1y, p2x, p2y)
    let b = intercept(p1x, p1y, p2x, p2y, m);

    let pointsabove = [];

    for (let i = 0; i < x.length; i++) {
        let val = m * x[i] + b;
        // console.log(`Point (${x[i]}, ${y[i]}) is compared to Line Y = ${val} and y[i] = ${y[i]}`);
        if (y[i] > val) {
            pointsabove.push(i);
        }
    }

    return pointsabove;
}

// finds the list of all points below the line
function calcbelow(p1x, p1y, p2x, p2y, x, y) {

    let m = slope(p1x, p1y, p2x, p2y)
    let b = intercept(p1x, p1y, p2x, p2y, m);

    let pointsbelow = [];

    for (let i = 0; i < x.length; i++) {
        let val = m * x[i] + b;
        // console.log(`Point (${x[i]}, ${y[i]}) is compared to Line Y = ${val} and y[i] = ${y[i]}`);        
        if (y[i] < val) {
            pointsbelow.push(i);
        }
    }

    return pointsbelow;
}

// finds the point which is the farthest away from the line
function farthest_distance(p1x, p1y, p2x, p2y, xpoints, ypoints) {
    let far_distance = 0;
    let farthest_index = -1;
    let distance = 0;
    let A, B, C;

    // creating the equation
    A = -1 * slope(p1x, p1y, p2x, p2y);
    B = 1;
    C = -1 * intercept(p1x, p1y, p2x, p2y, -1 * A);

    for (let i = 0; i < xpoints.length; i++) {
        distance = Math.abs(A * xpoints[i] + B * ypoints[i] + C) / Math.sqrt(A ** 2 + B ** 2);

        if (distance > far_distance) {
            far_distance = distance;
            farthest_index = i;
        }
    }

    return farthest_index;
}

// the recursive function for quickhull
async function quickhull2(p1x, p1y, p2x, p2y, xpoints, ypoints, state) {

    if (xpoints.length === 0) {
        return;
    }

    if (state === "mid") {
        selectedx.push(p1x);
        selectedx.push(p2x);

        selectedy.push(p1y);
        selectedy.push(p2y);

        selectedx.push(p1x);
        selectedy.push(p1y);

        // call the displayer
        console.log(selectedx);
        console.log(selectedy);

        unselectedx.splice(0, 1);
        unselectedy.splice(0, 1);
        unselectedx.pop();
        unselectedy.pop();

        console.log("Draw Graph");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await drawGraph(selectedx, selectedy, unselectedx, unselectedy);
        // here the displayer call will end
    }

    if (state === "above" || state === "mid") {
        let aboveindex = calcabove(p1x, p1y, p2x, p2y, xpoints, ypoints);

        if (aboveindex.length !== 0) {
            let abovex = [];
            let abovey = [];

            for (let i = 0; i < aboveindex.length; i++) {
                abovex.push(xpoints[aboveindex[i]]);
                abovey.push(ypoints[aboveindex[i]]);
            }

            if (abovex.length === 0) {
                return;
            }

            let farthest_index = farthest_distance(p1x, p1y, p2x, p2y, abovex, abovey);
            let farthestx = abovex[farthest_index];
            let farthesty = abovey[farthest_index];

            let val = find(farthestx, farthesty, unselectedx, unselectedy);
            if (val === -1) {
                return;
            }
            unselectedx.splice(val, 1);
            unselectedy.splice(val, 1);

            val = find(p1x, p1y, selectedx, selectedy);
            selectedx.splice(val + 1, 0, farthestx);
            selectedy.splice(val + 1, 0, farthesty);

            // call the displayer
            console.log(selectedx);
            console.log(selectedy);

            console.log("Draw Graph");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await drawGraph(selectedx, selectedy, unselectedx, unselectedy);
            // here the displayer call will end

            await quickhull2(p1x, p1y, farthestx, farthesty, unselectedx, unselectedy, "above");
            await quickhull2(farthestx, farthesty, p2x, p2y, unselectedx, unselectedy, "above");
        }
    }

    if (state === "below" || state === "mid") {
        let belowindex = calcbelow(p1x, p1y, p2x, p2y, xpoints, ypoints);

        if (belowindex.length !== 0) {
            let belowx = [];
            let belowy = [];

            for (let i = 0; i < belowindex.length; i++) {
                belowx.push(xpoints[belowindex[i]]);
                belowy.push(ypoints[belowindex[i]]);
            }

            if (belowx.length === 0) {
                return;
            }

            let farthest_index = farthest_distance(p1x, p1y, p2x, p2y, belowx, belowy);
            let farthestx = belowx[farthest_index];
            let farthesty = belowy[farthest_index];

            let val = find(farthestx, farthesty, unselectedx, unselectedy);
            if (val === -1) {
                return;
            }
            unselectedx.splice(val, 1);
            unselectedy.splice(val, 1);

            val = find(p2x, p2y, selectedx, selectedy);
            selectedx.splice(val + 1, 0, farthestx);
            selectedy.splice(val + 1, 0, farthesty);

            // call the displayer
            console.log(selectedx);
            console.log(selectedy);

            console.log("Draw Graph");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await drawGraph(selectedx, selectedy, unselectedx, unselectedy);
            // here the displayer call will end

            await quickhull2(p1x, p1y, farthestx, farthesty, unselectedx, unselectedy, "below");
            await quickhull2(farthestx, farthesty, p2x, p2y, unselectedx, unselectedy, "below");
        }
    }

    return;
}

// the starting function for quickhull algorithm
async function quick_hull() {
    // Check if the function is already in progress
    if (quickHullInProgress) {
        alert('Quick Hull is already in progress. Ignoring the new invocation.');
        return;
    }
    // Set the flag to indicate that the function is in progress
    quickHullInProgress = true;

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

    // Cause of erroe
    selectedx = [];
    selectedy = [];
    unselectedx = [];
    unselectedy = [];

    let x = [];
    let y = [];

    for (let i = 0; i < n; i++) {
        x.push(points[i].x);
        y.push(points[i].y);
    }

    sort(x, y, n);

    for (let i = 0; i < n; i++) {
        unselectedx.push(x[i]);
        unselectedy.push(y[i]);
    }

    console.log("x and y Array:");
    console.log(x);
    console.log(y);

    let p1x = x[0];
    let p1y = y[0];
    let p2x = x[n - 1];
    let p2y = y[n - 1];

    await quickhull2(p1x, p1y, p2x, p2y, x, y, "mid");
    quickHullInProgress = false;
    print_convex_hull(selectedx, selectedy);
}
function print_convex_hull(selectedx, selectedy) {
    let convex_hull_div = document.querySelector("#convex-hull-div");
    convex_hull_div.innerHTML = `
    <div class="display-6 mt-1 mb-3">Convex Hull Points</div>
    <ul class="list-group list-group-flush fs-5">
    <li class="list-group-item fw-semibold">Total Length: ${selectedx.length-1}</li>
    <li class="list-group-item fw-semibold"># (X, Y)</li>
    </ul>`;

    let n = selectedx.length;
    for (let i = 0; i < n-1; i++) {
        let li = document.createElement('li');
        li.innerHTML = `(${selectedx[i]}, ${selectedy[i]})`;
        li.classList.add("list-group-item");
        convex_hull_div.querySelector("ul").appendChild(li);
    }
    // Scroll to the convex hull div
    convex_hull_div.scrollIntoView({ behavior: 'smooth' });
}
