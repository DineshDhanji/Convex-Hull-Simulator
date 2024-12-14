let grahamScanInProgress = false;
let p0; //Global variable to store bottom_most point

//FUNCTION TO DRAW GRAPH WHILE CHECKING
async function drawCheckingGraph(selectedVerticeX, selectedVerticeY, unSelectedVerticeX, unSelectedVerticeY) {
    GRAPH = document.getElementById('graphs-div');
    var trace1 = {
        y: unSelectedVerticeY,
        x: unSelectedVerticeX,
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
        text: ['A-1', 'A-2', 'A-3', 'A-4', 'A-5'],
        textposition: 'top center',
        textfont: {
            family: 'Raleway, sans-serif'
        },
        marker: { size: 12 }
    }
    var trace2 = {
        x: selectedVerticeX,
        y: selectedVerticeY,
        mode: 'lines+markers',
        type: 'scatter',
        name: "Selected Vertices",
        text: ['B-1', 'B-2', 'B-3', 'B-4', 'B-5'],
        textposition: 'top center',
        textfont: {
            family: 'Raleway, sans-serif'
        },
        marker: { size: 12 }
    }
    data = [trace1, trace2, { title: 'Jarvis March' }];
    Plotly.newPlot('graphs-div', data);
}

// Function to check if three points are in a counterclockwise order
function checkCCW(p, q, r) {
    const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (val === 0) return 0; // Collinear
    return val > 0 ? 1 : 2; // Clockwise or Counterclockwise
}

// Function to compute the square of the distance between two points
function distSq(p, q) {
    return (p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y);
}

// Function to compare two points for sorting
function compare(vp1, vp2) {
    let p1 = vp1;
    let p2 = vp2;

    const o = checkCCW(p0, p1, p2);
    if (o === 0) {
        return distSq(p0, p2) >= distSq(p0, p1) ? -1 : 1;
    }
    return o === 2 ? -1 : 1;
}

// Function to find the convex hull using the Graham Scan algorithm
async function graham_scan() {
    // Check if the function is already in progress
    if (grahamScanInProgress) {
        alert('Graham Scan is already in progress. Ignoring the new invocation.');
        return;
    }
    // Set the flag to indicate that the function is in progress
    grahamScanInProgress = true;

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


    // Initialize the convex hull as an empty array
    const hullIndices = new Array(n).fill(-1);

    // Find the point with the lowest y-coordinate (and leftmost if tied)
    let bottom_most = 0;
    for (let i = 1; i < n; i++) {
        if (points[i].y < points[bottom_most].y || (points[i].y === points[bottom_most].y && points[i].x < points[bottom_most].x)) {
            bottom_most = i;
        }
    }

    // Place the point with the lowest y-coordinate at the beginning
    [points[0], points[bottom_most]] = [points[bottom_most], points[0]];
    p0 = points[0];

    // Sort the rest of the points based on polar angle with p0
    points.sort(compare);

    // Loop to initialize all points as unselected at starting of algorithm
    for (let i = 0; i < points.length; i++) {
        unSelectedVerticeX.push(points[i].x);
        unSelectedVerticeY.push(points[i].y);
    }

    //Push first point which is lowest as selected and remove from unselected
    let current = 0;
    selectedVerticeX.push(points[0].x);
    selectedVerticeY.push(points[0].y);
    unSelectedVerticeX.splice(0, 1);
    unSelectedVerticeY.splice(0, 1);

    let next; // Variable to store index of next variable
    let hullIndex = 0; //Variable used for indices of convex hull
    let k;

    // Initialize the convex hull stack and push first three points into stack
    let hull = [points[0], points[1], points[2]];
    let m = 3; // Denotes number of elements in the stack

    //All three points put into stack insert them into selected and remove from unselected
    selectedVerticeX.push(points[1].x);
    selectedVerticeY.push(points[1].y);
    unSelectedVerticeX.splice(0, 1);
    unSelectedVerticeY.splice(0, 1);
    //Draw checking graph which will draw points present in the stack
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Change the delay time as needed
    await drawCheckingGraph(selectedVerticeX, selectedVerticeY, unSelectedVerticeX, unSelectedVerticeY);
    selectedVerticeX.push(points[2].x);
    selectedVerticeY.push(points[2].y);
    unSelectedVerticeX.splice(0, 1);
    unSelectedVerticeY.splice(0, 1);
    //Draw checking graph which will draw points present in the stack
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Change the delay time as needed
    await drawCheckingGraph(selectedVerticeX, selectedVerticeY, unSelectedVerticeX, unSelectedVerticeY);

    // Process the rest of the points to construct the convex hull
    for (let i = 3; i < n; i++) {
        hullIndices[hullIndex] = current;
        next = (current + 1) % n;

        // Remove points that create a clockwise turn
        while (m > 1 && checkCCW(hull[m - 2], hull[m - 1], points[i]) !== 2) {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Change the delay time as needed
            await drawGraph(selectedVerticeX, selectedVerticeY, unSelectedVerticeX, unSelectedVerticeY);
            let lastelement = hull.pop(); //Pop last element from stack which is making clock wise turn
            m--; //Decrease count of elements in the stack

            // Remove this last point making (clock wise) from selcted and put back into unselected
            selectedVerticeX.splice(-1, 1);
            selectedVerticeY.splice(-1, 1);
            unSelectedVerticeX.splice(0, 0, lastelement.x);
            unSelectedVerticeY.splice(0, 0, lastelement.y);

            // Draw the graph which will show all the selected points by our algorithm
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Change the delay time as needed
            await drawGraph(selectedVerticeX, selectedVerticeY, unSelectedVerticeX, unSelectedVerticeY);
        }

        current = next; //Current element will become next 
        k = 0;
        // If a point is selected for convex hull and it is other than starting point
        if (current != 0) {
            hull[m++] = points[i]; //Insert next point into stack

            // Insert this selected element into selected and remove from unselected
            selectedVerticeX.push(points[i].x);
            selectedVerticeY.push(points[i].y);
            // Loop to select index of selected point in unselected vertices list
            for (let j = 0; j < unSelectedVerticeX.length; j++) {
                if (unSelectedVerticeX[j] == points[i].x && unSelectedVerticeY[j] == points[i].y) {
                    k = j;
                    break;
                }
            }
            unSelectedVerticeY.splice(k, 1);
            unSelectedVerticeX.splice(k, 1);

            //Draw checking graph which will draw points present in the stack
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Change the delay time as needed
            await drawCheckingGraph(selectedVerticeX, selectedVerticeY, unSelectedVerticeX, unSelectedVerticeY);
        }
    }

    // Again push the first selected point to make last edge between last and first selected point
    selectedVerticeX.push(points[0].x);
    selectedVerticeY.push(points[0].y);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await drawGraph(selectedVerticeX, selectedVerticeY, unSelectedVerticeX, unSelectedVerticeY);

    // Print the points on the convex hull
    console.log("\nConvex Hull Points:");
    for (let i = 0; i < hull.length; i++) {
        console.log(`(${hull[i].x}, ${hull[i].y})`);
    }
    grahamScanInProgress = false;
    print_convex_hull(hull);
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