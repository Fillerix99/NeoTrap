/* NeoTrap developed by Omar */
/// <reference path="../game/ref.js" />
/***********************************************/

/* GLOBAL VARS */
var canvas, engine, scene, cam, debugLayer;


/* MAIN GAME */
window.addEventListener("DOMContentLoaded", function () {

    canvas = document.getElementById("renderCanvas");
    engine = new BABYLON.Engine(canvas, true);
    engine.enableOfflineSupport = true;

    // First, create the scene
    createScene();

    // Second, assign input to player
    controlPlayer();

    // GAME LOOP
    engine.runRenderLoop(function () {
        scene.render();
    });
});

/* SYSTEM FUNCTIONS */

function toggleFullScreen() {
    if (!document.fullscreenElement &&    // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {  // current working methods
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    }
}

// the canvas/window resize event handler
window.addEventListener('resize', function () {
    engine.resize();
});