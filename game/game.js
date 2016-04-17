/// <reference path="../game/ref.js" />

/* GAME CONTROLLER */

/* GLOBAL VARS */
var canvas, engine, animRatio, music, trackID;
var howtoplayShown = false;

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
    }else{
        // WebGL is not supported
        $('body').html("<div id='webglNoSupport'>" +
            "WebGL is not supported on this browser<br/><span id='helper'>" +
            "Please use a browser that supports WebGL and also make sure you have your latest graphics card driver installed" +
            "<br/>For more info click <a href='http://webglreport.com/' target='_blank'>here</a></span></div>");
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

    // disable cursor
    $('html').css('cursor', 'none');

    // show how to play
    if(!howtoplayShown){
        howtoplayShown = true;
        $('#howtoplay').css('opacity', '1.0')
            .animate({
                'opacity': '0'
            }, 10000);
    }

    // choose music
    var musicIndex = $('#music').val();
    switch (musicIndex){
        case '1':
            trackID = 229895167;
            break;
        case '2':
            trackID = 243977945;
            break;
        case '3':
            trackID = 241622846;
            break;
        case '4':
            trackID = 231224149;
            break;
        case '5':
            trackID = 238538135;
            break;
        case '6':
            trackID = 166660553;
            break;
        case '7':
            trackID = 258471168;
            break;
        case '8':
            trackID = 243121546;
            break;
        case '9':
            trackID = 236984460;
            break;
        case '10':
            trackID = 223841097;
            break;
        case '11':
            trackID = 221321549;
            break;
        case '12':
            trackID = 215564724;
            break;
        case '13':
            trackID = 212505549;
            break;
        case '14':
            trackID = 206393242;
            break;
        case '15':
            trackID = 194863848;
            break;
        case '16':
            trackID = 192636167;
            break;
        case '17':
            trackID = 188143142;
            break;
        case '18':
            trackID = 183788956;
            break;
    }
    engine.displayLoadingUI();
    if(music !== undefined)
        music.dispose();
    music = new BABYLON.Sound("Music", "http://api.soundcloud.com/tracks/" + trackID + "/stream?client_id=a0bc8bd86e876335802cfbb2a7b35dd2", scene, function () { engine.hideLoadingUI(); }, { autoplay: true, loop: true, streaming: true });
    // choose difficulty
    var difficultyIndex = $("#difficulty").val();
    switch (difficultyIndex){
        case '1':
            maxNumOfHazards = 10;
            break;
        case '2':
            maxNumOfHazards = 15;
            break;
        case '3':
            maxNumOfHazards = 20;
    }

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

    $('#webglLogo').animate({
        opacity: 0
    }, 500, function(){
        $('#webglLogo').css('visibility', 'hidden');
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
        score = 10;
        cam.speed = 0.1;
        clearAllInScene();
        initHazardPozs();

        player.X = 1;
        player.Z = 1;
    });
}

function clearAllInScene(){
    for(var i = 0; i < colliders.length; i++){
        scene.removeMesh(colliders[i]);
    }

    colliders = [];
    numOfHazards = 0;
}

function Retry() {

    // disable cursor
    $('html').css('cursor', 'none');

    music = new BABYLON.Sound("Music", "http://api.soundcloud.com/tracks/" + trackID + "/stream?client_id=a0bc8bd86e876335802cfbb2a7b35dd2", scene, function () { engine.hideLoadingUI(); }, { autoplay: true, loop: false, streaming: true });
    $('#leaderboardMenu').animate({
        opacity: 0
    }, 500, function(){
        $('#score').css({
            'opacity': '0.7',
            'visibility': 'visible'
        });
        $('#leaderboardMenu').css('visibility', 'hidden');

        clearAllInScene();
        initHazardPozs();

        score = 10;
        cam.speed = 0.1;
        player.isDead = false;
        player.isVisible = true;
        player.X = 1;
        player.Z = 1;
        music.stop();
        music.play();
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
                'opacity': '1'
            }, 500);
        cam.speed = 0.1;
    });

    $('#title').animate({
        opacity: 1
    }, 500, function(){
        $('#title').css('visibility', 'visible');
    });

    $('#credit').animate({
        opacity: 1
    }, 500, function(){
        $('#credit').css('visibility', 'visible');
    });

    $('#webglLogo').animate({
        opacity: 1
    }, 500, function(){
        $('#webglLogo').css('visibility', 'visible');
    });
}

function enablePlay(){
    if($('#riskButton').hasClass('disabled')) $('#riskButton').removeClass('disabled');
    else $('#riskButton').addClass('disabled');
}

function continueToGame(){
    if($('#riskButton').hasClass('disabled')) return;
    $('.UI').animate({
       opacity: 1
    }, 1000, function(){
        $('.UI').css('pointer-events', 'auto');
    });
    $('#splashScreen').animate({
        opacity: 0
    }, 1000, function(){
        $('#splashScreen').css({
            'pointer-events': 'none',
            'visibility': 'hidden'
        });
        $('#leaderboardMenu').css('pointer-events', 'auto');
    });
}

function LeaderBoards(){

}