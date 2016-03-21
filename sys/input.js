/* FUNCTIONS HANDLING INPUT */

window.onkeydown = function (evt) {
    // system events
    if (evt.ctrlKey) {
        if (evt.keyCode === 70) {
            evt.preventDefault();
            toggleFullScreen();
        }
        else if (evt.keyCode === 68) {
            evt.preventDefault();
            startDebugging();
        }
    }
}

function startDebugging() {
    if (!scene.debugLayer.isVisible()) {
        scene.debugLayer.show();
    } else {
        scene.debugLayer.hide();
    }
}