let jarvisMarchInProgress = false;
// FUNCTION TO CHECK COUNTER CLOCKWISE BETWEEN POINTS
function checkCCW(p, q, r) {
    const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (val === 0) return 0; // Collinear
    return val > 0 ? 1 : 2; // If Clockwise return 1 or Counter-clockwise return 2
}

//FUNCTION TO DRAW GRAPH WHILE CHECKING
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
        marker: {
            size: 18,
            color: 'green'
        }
    }
    data = [trace1, trace2, { title: 'Jarvis March' }];
    Plotly.newPlot('graphs-div', data);
}

//FUNCTION TO DRAW GRAPH WHEN A POINT IS SELECTED
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
    data = [trace1, trace2, { title: 'Jarvis March' }];
    Plotly.newPlot('graphs-div', data);
}

// FUNCTION TO FIND CONVEX HULL USING JARVIS MARCH ALGO
async function jarvis_march() {
    // Check if the function is already in progress
    if (jarvisMarchInProgress) {
        alert('Jarvis March is already in progress. Ignoring the new invocation.');
        return;
    }
    // Set the flag to indicate that the function is in progress
    jarvisMarchInProgress = true;

    const points = InputPoints();
    const n = points.length;

    // No points available
    if (n === 0) {
        alert("No points")
        return;
    }

    if (n < 3) {
        alert("Enter at least three points.");
        return;
    } // Convex hull is not possible with less than 3 points

    //Lists to store selected and unselected vertices of convex hull
    let unSelectedVerticeX = [];
    let unSelectedVerticeY = [];
    let selectedVerticeX = [];
    let selectedVerticeY = [];

    // Loop to initialize all points as unselected in starting
    for (let i = 0; i < points.length; i++) {
        unSelectedVerticeX.push(points[i].x);
        unSelectedVerticeY.push(points[i].y);
    }

    // Initialize the convex hull as an empty array
    const hullIndices = new Array(n).fill(-1);

    // Find the point with the leftmost x-coordinate (the starting point)
    let leftmost = 0;
    for (let i = 1; i < n; i++) {
        if (points[i].x < points[leftmost].x) {
            leftmost = i;
        }
    }

    // Start from the leftmost point and move counterclockwise to build the hull
    let current = leftmost;
    selectedVerticeX.push(points[leftmost].x);
    selectedVerticeY.push(points[leftmost].y);
    unSelectedVerticeX.splice(leftmost, 1);
    unSelectedVerticeY.splice(leftmost, 1);
    let next; // Variable to store index of next variable
    let hullIndex = 0; //Variable used for indices of convex hull
    let k;
    do {
        hullIndices[hullIndex] = current;
        next = (current + 1) % n;
        // Loop to iterate through all points to check for counter clockwise points
        for (let i = 0; i < n; i++) {
            // Find the most counterclockwise point relative to the current point
            if (checkCCW(points[current], points[i], points[next]) === 2) {
                next = i;
                selectedVerticeX.push(points[next].x);
                selectedVerticeY.push(points[next].y);
                // Loop to select index of selected point in unselected vertices list
                for (let j = 0; j < n; j++) {
                    if (unSelectedVerticeX[j] == points[next].x && unSelectedVerticeY[j] == points[next].y) {
                        k = j;
                        break;
                    }
                }

                // If first point is not reached again 
                if (next != leftmost) {
                    unSelectedVerticeX.splice(k, 1);
                    unSelectedVerticeY.splice(k, 1);
                }
                // Below 2 lines are for the delay between points drawing on graph
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Change the delay time as needed
                await drawcheckingGraph(selectedVerticeX, selectedVerticeY, unSelectedVerticeX, unSelectedVerticeY);

                unSelectedVerticeX.splice(k, 0, points[next].x);
                unSelectedVerticeY.splice(k, 0, points[next].y);
                let lastElementIndex = -1;
                let positiveIndex = selectedVerticeX.length + lastElementIndex;
                selectedVerticeX.splice(positiveIndex, 1);
                selectedVerticeY.splice(positiveIndex, 1);
            }
        }
        current = next;
        k = 0;
        // If a point is selected for convex hull and it is other than starting point
        if (current != leftmost) {
            selectedVerticeX.push(points[current].x);
            selectedVerticeY.push(points[current].y);

            // Loop to select index of selected point in unselected vertices list
            for (let j = 0; j < unSelectedVerticeX.length; j++) {
                if (unSelectedVerticeX[j] == points[current].x && unSelectedVerticeY[j] == points[current].y) {
                    k = j;
                    break;
                }
            }
            unSelectedVerticeX.splice(k, 1);
            unSelectedVerticeY.splice(k, 1);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Change the delay time as needed
            await drawGraph(selectedVerticeX, selectedVerticeY, unSelectedVerticeX, unSelectedVerticeY);
            hullIndex++;
        }
    } while (current !== leftmost);

    // Again push the first selected point to make last edge between last and first selected point
    selectedVerticeX.push(points[leftmost].x);
    selectedVerticeY.push(points[leftmost].y);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await drawGraph(selectedVerticeX, selectedVerticeY, unSelectedVerticeX, unSelectedVerticeY);

    // Construct and return the convex hull as an array of points
    let convexHull = [];
    for (let i = 0; i < n; i++) {
        if (hullIndices[i] !== -1) {
            convexHull.push(points[hullIndices[i]]);
        }
    }
    console.log("Convex Hull: ", convexHull);
    jarvisMarchInProgress = false;
    print_convex_hull(convexHull);
}

// Function to take input points
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
function print_convex_hull(convexHull) {
    let convex_hull_div = document.querySelector("#convex-hull-div");
    convex_hull_div.innerHTML = `
    <div class="display-6 mt-1 mb-3">Convex Hull Points</div>
    <ul class="list-group list-group-flush fs-5">
    <li class="list-group-item fw-semibold">Total Length: ${convexHull.length}</li>
    <li class="list-group-item fw-semibold"># (X, Y)</li>
    </ul>`;

    for (const point of convexHull) {
        let li = document.createElement('li');
        li.innerHTML = `(${point.x}, ${point.y})`;
        li.classList.add("list-group-item");
        convex_hull_div.querySelector("ul").appendChild(li);
    }
    // Scroll to the convex hull div
    convex_hull_div.scrollIntoView({ behavior: 'smooth' });
}