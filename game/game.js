/* NeoTrap developed by Omar */

/// <reference path="../engine/Babylon.js" />
/// <reference path="../game/scene.js" />
/// <reference path="../sys/window.js" />
/// <reference path="../debug/_debugMain.js" />

/***********************************************/

/* GLOBAL VARS */
var canvas, engine, scene, cam, debugLayer, root;

/* MAIN GAME */
window.addEventListener("DOMContentLoaded", function () {

    canvas = document.getElementById("renderCanvas");
    engine = new BABYLON.Engine(canvas, true);

    createScene(canvas, engine);

    engine.enableOfflineSupport = true;

    debugLayer = new BABYLON.DebugLayer(scene);

    // GAME LOOP
    engine.runRenderLoop(function () {
        moveCamera(1);
        scene.render();
    });

    // Resize Window
    resizeWindow();
});

function moveCamera(speed) {
    cam.position.z += speed;
}