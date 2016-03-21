/* NeoTrap developed by Omar */

/// <reference path="../engine/Babylon.js" />
/// <reference path="../game/scene.js" />
/// <reference path="../sys/window.js" />

/***********************************************/

/* GLOBAL VARS */
var canvas, engine, scene, cam, debugLayer;


/* MAIN GAME */
window.addEventListener("DOMContentLoaded", function () {

    canvas = document.getElementById("renderCanvas");
    engine = new BABYLON.Engine(canvas, true);
    engine.enableOfflineSupport = true;

    // Init
    createScene();

    // GAME LOOP
    engine.runRenderLoop(function () {

        scene.render();
    });

    // Resize Window
    resizeWindow();

    // Debug Layer
    debugLayer = new BABYLON.DebugLayer(scene);
});