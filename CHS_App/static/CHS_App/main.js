document.addEventListener('DOMContentLoaded', () => {
    document.querySelector("#convexHullContainer").style.display = 'none';
    document.querySelector("#lineIntersectionContainer").style.display = 'none';
    

})

function showConvexHullContainer() {
    document.querySelector("#convexHullContainer").style.display = 'flex';
    document.querySelector("#lineIntersectionContainer").style.display = 'none';
    // refreshVanta();
}

function showLineIntersectionContainer() {
    document.querySelector("#lineIntersectionContainer").style.display = 'flex';
    document.querySelector("#convexHullContainer").style.display = 'none';
    // refreshVanta();
}