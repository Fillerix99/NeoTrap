/// <reference path="../game/ref.js" />

/* GAME CONTROLLER */

/* GLOBAL VARS */
var canvas, engine, scene, cam, debugLayer, player;


/* MAIN GAME */
window.addEventListener("DOMContentLoaded", function () {

    canvas = document.getElementById("renderCanvas");
    engine = new BABYLON.Engine(canvas, true);
    engine.enableOfflineSupport = true;

    // First, create the scene
    createScene();

    // Player Controller
    controlPlayer();

    // GAME LOOP
    engine.runRenderLoop(function () {
        // Lerp with inputs
        player.position = BABYLON.Vector3.Lerp(player.position, player.movementMatrix[player.X][player.Z], scene.getRenderDuration() * 0.5);

        scene.render();
    });

    // the canvas/window resize event handler
    window.addEventListener('resize', function () {
        engine.resize();
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