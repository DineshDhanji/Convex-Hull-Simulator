# Convex Hull Simulator
## Overview
<img align="right" width="200" height="auto" style="margin:10px" src="./CHS_App/static/CHS_App/CHS%20Logo_white_bg.png" alt="Convex hull simulator logo">

The Convex Hull Simulator is a visualization tool that demonstrates the construction of a convex hull using computational geometry algorithms. The convex hull of a set of points is the smallest convex polygon that can enclose all the points, analogous to wrapping a rubber band around them.

This project is designed for students and enthusiasts in computer science or computational geometry to understand the algorithm's inner workings through interactive visualizations.

## Features
- Interactive Visualization: Allows users to place points and dynamically observe the convex hull's construction.
- Algorithm Demonstration: Implements algorithms like the Jarvis-March (Gift Wrapping) method to explain each step.
- Real-Time Updates: Responds to user input and updates the convex hull in real-time.
- Educational Insights: Suitable for teaching computational geometry concepts.
  
## Technologies Used
- Frontend: HTML, CSS, and JavaScript.
- Visualization: Leveraged libraries like plot.js for rendering and animations.
- Algorithm Implementation: Core logic built in JavaScript to demonstrate step-by-step construction.

## How It Works
- Point Placement: Users can add points on a canvas through clicks.
- Algorithm Execution: The simulator calculates the convex hull using the Jarvis-March algorithm:
  - Starts from the leftmost point.
  - Iteratively selects the next point with the smallest polar angle relative to the previous segment.
  - Ends when the initial point is reached.
- Dynamic Updates: Visualizes each step, providing insights into the algorithm's mechanics.

## Getting Started
### Prerequisites
Ensure you have a modern web browser that supports JavaScript and plot.js.

### Installation
Clone the repository:
```
git clone https://github.com/DineshDhanji/Convex-Hull-Simulator.git
```

Navigate to the project directory:
```
cd Convex-Hull-Simulator
```

Create a virtual environment and activate it
```
Windows
py -m venv .venv
.\.venv\Script\activate    

Linux
python -m venv .venv
source .\.venv\bin\activate
```

Install the requirements
```
pip install -r requirements.txt
```

Run the server 
```
python manage.py runserver
```

Go to your localhost
```
http://127.0.0.1:8000/
```

## Usage
- Open the simulator in your browser.
- Click on the canvas to add points.
- Watch the convex hull dynamically construct around the points.
- Use the clear/reset option to restart.

## Applications
- Educational Tool: For teaching algorithms and computational geometry.
- Research and Development: To prototype and test convex hull algorithms.
- Interactive Learning: Enables users to grasp geometric concepts through hands-on experience.

## Contributing
Contributions are welcome! Feel free to submit issues, feature requests, or pull requests to enhance the simulator.

