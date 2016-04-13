/// <reference path="../game/ref.js" />

/* GAME CONTROLLER */

/* GLOBAL VARS */
var canvas, engine, animRatio;

var score = 10;

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
                cam.speed = Lerp(cam.speed, 1.5, animRatio / 2000.0);
                score += 10;
            }

            cam.position.z += cam.speed;

            // render the scene
            scene.render();

            fpsDiv.innerText = engine.getFps().toFixed(0);

            $('#score').html(score);
        });

        // the canvas/window resize event handler
        window.addEventListener('resize', function () {
            engine.resize();
        });

        // FOR DEVELOPMENT ONLY
        //debugLayer = new BABYLON.DebugLayer(scene);
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

    $('#title').animate({
        opacity: 0
    }, 500, function(){
        $('#title').css('visibility', 'hidden');
    });

    $('#credit').animate({
        opacity: 0
    }, 500, function(){
        $('#credit').css('visibility', 'hidden');
    });

    $('.menu').animate({
        opacity: 0
    }, 500, function(){
        $('#score').css({
            'opacity': '0.7',
            'visibility': 'visible'
        });
        $('.menu').css({
            'visibility' : 'hidden'
        });
        player.isDead = false;
        player.isVisible = true;
        music.play();
        score = 10;
        cam.speed = 0.1;
        clearAllInScene();
        initHazardPozs();
    });
}

function openGithub(){
    window.open("https://github.com/omarhuseynov011/NeoTrap", "_blank");
}

function clearAllInScene(){
    for(var i = 0; i < colliders.length; i++){
        scene.removeMesh(colliders[i]);
    }

    colliders = [];
}

function Retry() {
    clearAllInScene();
    initHazardPozs();

    score = 10;
    cam.speed = 0.1;
    player.isDead = false;
    player.isVisible = true;
    player.position = BABYLON.Vector3.Zero();
    music.stop();
    music.play();

    $('#leaderboardMenu').animate({
        opacity: 0
    }, 500, function(){
        $('#score').css({
            'opacity': '0.7',
            'visibility': 'visible'
        });
        $('#leaderboardMenu').css('visibility', 'hidden');
    });
}

function Menu(){
    $('#leaderboardMenu').animate({
        opacity: 0
    }, 500, function(){
        $('#score').css('visibility', 'hidden');
        $('#leaderboardMenu').css('visibility', 'hidden');
        $('#mainMenu').css('visibility', 'visible')
            .animate({
                'opacity': '0.7'
            }, 500);
        cam.speed = 0.1;
    });

    $('#title').animate({
        opacity: 0.7
    }, 500, function(){
        $('#title').css('visibility', 'visible');
    });

    $('#credit').animate({
        opacity: 0.7
    }, 500, function(){
        $('#credit').css('visibility', 'visible');
    });
}

function LeaderBoards(){

}

function connectSoundcloud(){

}

function connectGoogle(){

}