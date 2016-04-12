/// <reference path="../game/ref.js" />

/* GAME CONTROLLER */

/* GLOBAL VARS */
var canvas, engine, debugLayer, animRatio;

/* MAIN GAME */
window.addEventListener("DOMContentLoaded", function () {

    if (BABYLON.Engine.isSupported()) {
        var fpsDiv = document.getElementById("fps");

        canvas = document.getElementById("renderCanvas");
        engine = new BABYLON.Engine(canvas, true);
        engine.enableOfflineSupport = true;

        // First, create the scene
        createScene();

        // create the music analyser
        analyseMusic();

        // Player Controller
        controlPlayer();

        // GAME LOOP
        engine.runRenderLoop(function () {
            // animation ratio
            animRatio = scene.getAnimationRatio();

            // move the camera forward
            if(!player.isDead){
                cam.speed = Lerp(cam.speed, 1, animRatio / 1000.0);
            }

            cam.position.z += cam.speed;

            // render the scene
            scene.render();

            fpsDiv.innerText = engine.getFps().toFixed(0);
        });

        // the canvas/window resize event handler
        window.addEventListener('resize', function () {
            engine.resize();
        });

        // FOR DEVELOPMENT ONLY
        debugLayer = new BABYLON.DebugLayer(scene);
        //debugLayer.show();
    }
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

function Lerp(start, end, amount) {
    return (start + (end - start) * amount);
}

function startPlaying(){
    $('#title').css('visibility', 'hidden');
    $('.menu').css('visibility', 'hidden');
    $('#credit').css('visibility', 'hidden');

    player.isDead = false;
    player.isVisible = true;
    music.play();
}

function openGithub(){
    window.open("https://github.com/omarhuseynov011/NeoTrap", "_blank");
}