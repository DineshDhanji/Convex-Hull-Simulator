// structures for the program
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Line {
    constructor(point1, point2) {
        this.point1 = point1;
        this.point2 = point2;
    }
}

// getting and generating input co-ordinates functions
function check_input_coordinates() {
    let l1p1x = document.querySelector("#l1p1x").value;
    let l1p1y = document.querySelector("#l1p1y").value;
    let l1p2x = document.querySelector("#l1p2x").value;
    let l1p2y = document.querySelector("#l1p2y").value;
    let l2p1x = document.querySelector("#l2p1x").value;
    let l2p1y = document.querySelector("#l2p1y").value;
    let l2p2x = 0;
    let l2p2y = 0;
    if (document.querySelector("#l2p2x") != undefined) {
        document.querySelector("#l2p2x").value = parseInt(l2p2x);
        document.querySelector("#l2p2y").value = parseInt(l2p2y);
    }

    // Check for missing values or non-numeric input
    if (l1p1x === '' || l1p1y === '' || l1p2x === '' || l1p2y === '' ||
        l2p1x === '' || l2p1y === '' || l2p2x === '' || l2p2y === '') {
        return true;
    }
    if (isNaN(l1p1x) || isNaN(l1p1y) || isNaN(l1p2x) || isNaN(l1p2y) ||
        isNaN(l2p1x) || isNaN(l2p1y) || isNaN(l2p2x) || isNaN(l2p2y)) {
        return true;
    }
    return false;
}

function get_input_coordinates() {
    let l1p1 = new Point(parseFloat(document.querySelector("#l1p1x").value), parseFloat(document.querySelector("#l1p1y").value));
    let l1p2 = new Point(parseFloat(document.querySelector("#l1p2x").value), parseFloat(document.querySelector("#l1p2y").value));
    let l2p1 = new Point(parseFloat(document.querySelector("#l2p1x").value), parseFloat(document.querySelector("#l2p1y").value));
    let l2p2 = new Point(parseFloat(document.querySelector("#l2p2x") == undefined ? 0 : document.querySelector("#l2p2x").value), parseFloat(document.querySelector("#l2p2y") == undefined ? 0 : document.querySelector("#l2p2y").value));

    return [new Line(l1p1, l1p2), new Line(l2p1, l2p2)];
}

function getRandomCoordinate() {
    return Math.random() * 100; // Adjust the range as needed
}

function random_lines() {
    // Generate random coordinates for Line 1
    let l1p1x = getRandomCoordinate();
    let l1p1y = getRandomCoordinate();
    let l1p2x = getRandomCoordinate();
    let l1p2y = getRandomCoordinate();

    // Generate random coordinates for Line 2
    let l2p1x = getRandomCoordinate();
    let l2p1y = getRandomCoordinate();
    let l2p2x = getRandomCoordinate();
    let l2p2y = getRandomCoordinate();

    // Put these points in their places
    document.querySelector("#l1p1x").value = parseInt(l1p1x);
    document.querySelector("#l1p1y").value = parseInt(l1p1y);
    document.querySelector("#l1p2x").value = parseInt(l1p2x);
    document.querySelector("#l1p2y").value = parseInt(l1p2y);
    document.querySelector("#l2p1x").value = parseInt(l2p1x);
    document.querySelector("#l2p1y").value = parseInt(l2p1y);
    if (document.querySelector("#l2p2x") != undefined) {
        document.querySelector("#l2p2x").value = parseInt(l2p2x);
        document.querySelector("#l2p2y").value = parseInt(l2p2y);
    }

}

// first line intersection algo's helper and main functions
function findIntersection(line1, line2) {
    // Extract coordinates
    let x1 = line1.point1.x, y1 = line1.point1.y;
    let x2 = line1.point2.x, y2 = line1.point2.y;
    let x3 = line2.point1.x, y3 = line2.point1.y;
    let x4 = line2.point2.x, y4 = line2.point2.y;

    // Calculate the intersection point
    let x =
        ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
        ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));

    let y =
        ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
        ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));

    return new Point(x, y);
}

function checkCCW(a, b, c) {
    const val = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
    if (val < 0) return -1;
    else if (val > 0) return 1;
    else return 0;
}

function ccw() {
    if (check_input_coordinates()) {
        alert("Please enter valid numeric values for all points.");
        return;
    }
    let [line1, line2] = get_input_coordinates();

    let test1 = checkCCW(line1.point1, line1.point2, line2.point1) *
        checkCCW(line1.point1, line1.point2, line2.point2);
    let test2 = checkCCW(line2.point1, line2.point2, line1.point1) *
        checkCCW(line2.point1, line2.point2, line1.point2);
    let intersect = test1 <= 0 && test2 <= 0;
    console.log(`test1:${test1}  test2:${test2}`);
    // Add a special case for collinear lines
    if (test1 === 0 && test2 === 0) {
        alert("Collinear lines - Special case, handle as needed.");
        drawCollinear();
    } else {
        let intersect = test1 <= 0 && test2 <= 0;
        if (intersect) {
            console.log("True");
        } else {
            console.log("False");
        }
        drawGraph(line1, line2, intersect, intersect ? findIntersection(line1, line2) : null, "CCW - ");
    }
}

// second line intersection algo's helper and main functions
function slope_line_method() {
    if (check_input_coordinates()) {
        alert("Please enter valid numeric values for all points.");
        return;
    }

    let [coord_line1, coord_line2] = get_input_coordinates();

    let x = [coord_line1.point1.x, coord_line1.point2.x];
    let y = [coord_line1.point1.y, coord_line1.point2.y];

    let xo = coord_line2.point1.x;
    let yo = coord_line2.point1.y;

    let crossings = 0;

    let m = slope(x[0], y[0], x[1], y[1]);

    let cond1 = (x[0] <= xo) && (xo < x[1]);
    let cond2 = (x[1] <= xo) && (xo < x[0]);
    let expectedy = (m * (xo - x[0]) + y[0]);
    let above = (yo < expectedy);
    let output = "";
    if ((cond1 || cond2) && above) {
        alert("The point is inside the line.");
        output = "The point is inside the line."
    }
    else if (Math.abs(expectedy - yo) < 1e-6) {
        alert("The point lies on the line.");
        output = "The point lies on the line."
    }
    else if ((cond1 || cond2) && !above) {
        alert("The point is outside the line.");
        output = "The point is outside the line."
    }
    else {
        alert("The point is around the line.");
        output = "The point is around the line."
    }
    drawGraphForSlope(coord_line1, coord_line2, "Slope Line Method", output);
}


// third line intersection algo's helper and main functions
function calcDet(a, b, c, d) {
    return ((a * d) - (b * c));
}


function cramers_rule() {
    // getting the line inputs
    if (check_input_coordinates()) {
        alert("Please enter valid numeric values for all points.");
        return;
    }
    let [coord_line1, coord_line2] = get_input_coordinates();

    // Coefficients of Line 01.
    let [l1a, l1b, l1c] = get_line_equation_coefficients(
        coord_line1.point1.x,
        coord_line1.point1.y,
        coord_line1.point2.x,
        coord_line1.point2.y);

    // Coefficients of Line 02.
    let [l2a, l2b, l2c] = get_line_equation_coefficients(
        coord_line2.point1.x,
        coord_line2.point1.y,
        coord_line2.point2.x,
        coord_line2.point2.y);

    // Printing both lines to verify equations. 
    console.log(`Eq of Line 01: ${l1a}x` + (l1b === 0 ? "" : ` + ${l1b}y`) + ` = ${l1c}`)
    console.log(`Eq of Line 02: ${l2a}x` + (l2b === 0 ? "" : ` + ${l2b}y`) + ` = ${l2c}`)


    /*
        Crammer's Method Summary:-
        determinant != 0 -> Unqiue solution
        determinant = 0 -> Skew, parallel or coincident. In simple words, either there is no solution or there are infinite solutions.
        != slope -> skew
        = slope and != intercept -> parallel
        = slope and = intercept -> coincident
    */

    // Calculating the determinant
    let det;
    det = calcDet(l1a, l1b, l2a, l2b);
    console.log("The determinant is: ", `${det}`);

    // Deciding the relationship between the lines
    if (det === 0) {
        alert("Cramer's Rule is not applicable on the given line equations. As the determinant (D) is 0, the system has either no solution or infinite solutions.");
        drwaNotApplicable();
        return;
    }
    else if (det !== 0) {
        let Dx, Dy;

        Dx = calcDet(l1c, l1b, l2c, l2b);
        Dy = calcDet(l1a, l1c, l2a, l2c);

        let xval, yval;

        xval = Dx / det;
        yval = Dy / det;

        console.log("Lines intersect at:\n", `${xval} , ${yval}`);

        let result = new Point(xval, yval);

        drawInfiniteLineGraph(coord_line1, coord_line2, true, result, "Cramer's Rule - ");
    }
}

/* 
    This is a simple function that will return the coefficients of 
    the line
*/
function get_line_equation_coefficients(p1x, p1y, p2x, p2y) {
    let a, b, c, m = 0;
    m = slope(p1x, p1y, p2x, p2y);
    if (m === Infinity) {
        // This is the case of a vertical line.
        a = 1;
        b = 0;
    }
    else {
        a = (-1 * m);
        b = 1;
    }

    // Now finding the intercept (c) of the line.
    c = intercept(p1x, p1y, m);

    return [a, b, c];
}

/* 
    This function returns the slope of the line.
    In case of a verticeal line, it will return INFINITY
*/
function slope(p1x, p1y, p2x, p2y) {
    return (p2y - p1y) / (p2x - p1x);
}

/* 
    This function returns the intercept of the line equation.
    In case of a vertical line, the slope will be Infinity, and
    the function will return x. Because the equation of a vertical
    line is x = c as y = 0. 
*/
function intercept(x, y, m) {
    if (m !== Infinity)
        return y - (m * x);
    else
        return x
}


/*
    Graph drawing functions
*/

// drawing functions for GUI
function drawGraph(line1, line2, intersect, intersection_point, method_name) {
    let output_color = intersect ? 'green' : "blue";
    let output_name = method_name + (intersect ? 'Intersecting' : "Not Intersecting");
    var trace3 = {};
    GRAPH = document.getElementById('graphs-div');
    var trace1 = {
        x: [line1.point1.x, line1.point2.x],
        y: [line1.point1.y, line1.point2.y],
        mode: 'lines+markers',
        type: 'lines',
        name: "Line 01",
        marker: { size: 12, color: output_color }
    }
    var trace2 = {
        x: [line2.point1.x, line2.point2.x],
        y: [line2.point1.y, line2.point2.y],
        mode: 'lines+markers',
        type: 'lines',
        name: "Lines 02",
        marker: { size: 12, color: output_color }
    }
    if (intersection_point !== null) {
        trace3 = {
            x: [intersection_point.x],
            y: [intersection_point.y],
            mode: 'lines+markers',
            type: 'lines',
            name: "Intersection",
            marker: { size: 13, color: "orange" }
        }
    }
    var layout = {
        title: {
            text: output_name,
        }
    }
    data = [trace1, trace2, trace3, { title: 'Line Intersection' }];
    Plotly.newPlot('graphs-div', data, layout);
}

// Print Collinear as graph
function drawCollinear() {
    let output_color = "orange";
    GRAPH = document.getElementById('graphs-div');
    var c = {
        x: [-8, -10, -12, -12, -10, -8],
        y: [6, 6, 5, 2, 1, 1],
        mode: 'lines+markers',
        type: 'lines',
        name: "C",
        marker: { size: 10, color: output_color }
    }
    var o = {
        x: [-4, 0, 1, 1, 0, -4, -5, -5, -4],
        y: [6, 6, 5, 2, 1, 1, 2, 5, 6],
        mode: 'lines+markers',
        type: 'lines',
        name: "O",
        marker: { size: 12, color: output_color }
    }
    var l1 = {
        x: [7, 4, 4],
        y: [1, 1, 10],
        mode: 'lines+markers',
        type: 'lines',
        name: "L",
        marker: { size: 12, color: output_color }
    }
    var l2 = {
        x: [13, 10, 10],
        y: [1, 1, 10],
        mode: 'lines+markers',
        type: 'lines',
        name: "L",
        marker: { size: 12, color: output_color }
    }
    var i = {
        x: [15, 15],
        y: [1, 6],
        mode: 'lines+markers',
        type: 'lines',
        name: "I",
        marker: { size: 12, color: output_color }
    }
    var i_dot = {
        x: [15],
        y: [8],
        mode: 'lines+markers',
        type: 'lines',
        name: "I dot",
        marker: { size: 20, color: output_color }
    }
    var n = {
        x: [18, 18, 17, 18, 19, 23, 24, 24],
        y: [1, 5, 6, 5, 6, 6, 5, 1],
        mode: 'lines+markers',
        type: 'lines',
        name: "N",
        marker: { size: 12, color: output_color }
    }
    var e = {
        x: [32, 28, 27, 28, 32, 33, 27],
        y: [1, 1, 3, 6, 6, 3, 3],
        mode: 'lines+markers',
        type: 'lines',
        name: "E",
        marker: { size: 12, color: output_color }
    }
    var a = {
        x: [37, 40, 41, 41, 37, 36, 36, 41],
        y: [6, 6, 5, 1, 1, 2, 4, 4],
        mode: 'lines+markers',
        type: 'lines',
        name: "A",
        marker: { size: 12, color: output_color }
    }
    var r = {
        x: [44, 44, 44, 45, 46],
        y: [1, 6, 5, 6, 6],
        mode: 'lines+markers',
        type: 'lines',
        name: "R",
        marker: { size: 12, color: output_color }
    }
    data = [c, o, l1, l2, i, i_dot, n, e, a, r, { title: 'Line Intersection' }];
    Plotly.newPlot('graphs-div', data);
}

function drawInfiniteLineGraph(line1, line2, intersect, intersection_point, method_name) {
    let output_color = intersect ? 'green' : 'blue';
    let output_name = method_name + (intersect ? ' Intersecting' : ' Not Intersecting');

    // Define extension factor
    const extensionFactor = 1000; // Adjust this factor as needed

    // Calculate extended points for Line 1
    const extendedLine1 = calculateExtendedPoints(line1, extensionFactor);

    // Calculate extended points for Line 2
    const extendedLine2 = calculateExtendedPoints(line2, extensionFactor);

    // Trace for Line 1
    var trace1 = createLineTrace(extendedLine1, 'Line 01', output_color);

    // Trace for Line 2
    var trace2 = createLineTrace(extendedLine2, 'Line 02', output_color);

    // Trace for Intersection Point
    var trace3 = createIntersectionPointTrace(intersection_point);

    var layout = {
        title: {
            text: output_name,
        },
    };

    var data = [trace1, trace2, trace3, { title: 'Line Intersection' }];
    Plotly.newPlot('graphs-div', data, layout);
}


function calculateExtendedPoints(line, extensionFactor) {
    // Check if the line is vertical
    if (line.point1.x === line.point2.x) {
        const extensionY = extensionFactor * (line.point2.y > line.point1.y ? 1 : -1);
        return {
            point1: { x: line.point1.x, y: line.point1.y - extensionY },
            point2: { x: line.point2.x, y: line.point2.y + extensionY },
        };
    }

    // Calculate extended points for non-vertical lines
    const deltaX = line.point2.x - line.point1.x;
    const deltaY = line.point2.y - line.point1.y;
    const extensionX1 = line.point1.x - extensionFactor;
    const extensionY1 = line.point1.y - (extensionFactor * deltaY) / deltaX;
    const extensionX2 = line.point2.x + extensionFactor;
    const extensionY2 = line.point2.y + (extensionFactor * deltaY) / deltaX;

    return {
        point1: { x: extensionX1, y: extensionY1 },
        point2: { x: extensionX2, y: extensionY2 },
    };
}

function createLineTrace(extendedLine, name, color) {
    return {
        x: [extendedLine.point1.x, extendedLine.point2.x],
        y: [extendedLine.point1.y, extendedLine.point2.y],
        mode: 'lines',
        type: 'lines',
        name: name,
        marker: { size: 12, color: color },
    };
}

function createIntersectionPointTrace(intersection_point) {
    if (intersection_point !== null) {
        return {
            x: [intersection_point.x],
            y: [intersection_point.y],
            mode: 'markers',
            type: 'scatter',
            name: 'Intersection',
            marker: { size: 13, color: 'orange' },
        };
    } else {
        return {};
    }
}

// Print No Solution or Infinite Solution as graph.
function drwaNotApplicable() {
    let output_color = "orange";
    GRAPH = document.getElementById('graphs-div');

    var n = {
        x: [10, 10, 15, 15],
        y: [10, 15, 10, 15],
        mode: 'lines+markers',
        type: 'lines',
        name: "N",
        marker: { size: 12, color: output_color }
    }
    var o = {
        x: [18, 17, 17, 18, 21, 22, 22, 21, 18],
        y: [15, 14, 11, 10, 10, 11, 14, 15, 15],
        mode: 'lines+markers',
        type: 'lines',
        name: "O",
        marker: { size: 12, color: output_color }
    }
    var t = {
        x: [24, 28, 26, 26],
        y: [15, 15, 15, 10],
        mode: 'lines+markers',
        type: 'lines',
        name: "T",
        marker: { size: 12, color: output_color }
    }

    var a1 = {
        x: [10, 11.125, 13.75, 12.5, 13.75, 15],
        y: [0, 2.5, 2.5, 5, 2.5, 0],
        mode: 'lines+markers',
        type: 'lines',
        name: "A",
        marker: { size: 12, color: output_color }
    }
    var p1 = {
        x: [17, 17, 20, 21, 21, 20, 17],
        y: [0, 5, 5, 4, 3, 2, 2],
        mode: 'lines+markers',
        type: 'lines',
        name: "P",
        marker: { size: 12, color: output_color }
    }
    var p2 = {
        x: [23, 23, 26, 27, 27, 26, 23],
        y: [0, 5, 5, 4, 3, 2, 2],
        mode: 'lines+markers',
        type: 'lines',
        name: "P",
        marker: { size: 12, color: output_color }
    }
    var l1 = {
        x: [29, 29, 33],
        y: [5, 0, 0],
        mode: 'lines+markers',
        type: 'lines',
        name: "L",
        marker: { size: 12, color: output_color }
    }
    var i = {
        x: [35, 35],
        y: [0, 5],
        mode: 'lines+markers',
        type: 'lines',
        name: "I",
        marker: { size: 12, color: output_color }
    }
    var c = {
        x: [41, 38, 37, 37, 38, 41],
        y: [5, 5, 4, 1, 0, 0],
        mode: 'lines+markers',
        type: 'lines',
        name: "C",
        marker: { size: 12, color: output_color }
    }
    var a2 = {
        x: [44, 45.125, 47.75, 46.5, 47.75, 49],
        y: [0, 2.5, 2.5, 5, 2.5, 0],
        mode: 'lines+markers',
        type: 'lines',
        name: "A",
        marker: { size: 12, color: output_color }
    }
    var b = {
        x: [51, 51, 54, 55, 55, 54, 51, 54, 55, 55, 54, 51],
        y: [0, 5, 5, 4.5, 3, 2.5, 2.5, 2.5, 2, 0.5, 0, 0],
        mode: 'lines+markers',
        type: 'lines',
        name: "B",
        marker: { size: 12, color: output_color }
    }
    var l2 = {
        x: [58, 58, 61],
        y: [5, 0, 0],
        mode: 'lines+markers',
        type: 'lines',
        name: "L",
        marker: { size: 12, color: output_color }
    }

    var e = {
        x: [67, 64, 64, 67, 64, 64, 67],
        y: [0, 0, 2.5, 2.5, 2.5, 5, 5],
        mode: 'lines+markers',
        type: 'lines',
        name: "E",
        marker: { size: 12, color: output_color }
    }

    data = [n, o, t, a1, p1, p2, l1, i, c, a2, b, l2, e, { title: 'Not Applicable' }];
    Plotly.newPlot('graphs-div', data);
}
function drawGraphForSlope(line1, line2, method_name, output) {
    GRAPH = document.getElementById('graphs-div');
    var trace1 = {
        x: [line1.point1.x, line1.point2.x],
        y: [line1.point1.y, line1.point2.y],
        mode: 'lines+markers',
        type: 'lines',
        name: "Line 01",
        marker: { size: 12 }
    }
    var trace2 = {
        x: [line2.point1.x],
        y: [line2.point1.y],
        mode: 'lines+markers',
        type: 'lines',
        name: "Point",
        marker: { size: 12 }
    }

    var layout = {
        title: {
            text: method_name + " - " + output,
        }
    }
    data = [trace1, trace2, { title: 'Line Intersection' }];
    Plotly.newPlot('graphs-div', data, layout);
}