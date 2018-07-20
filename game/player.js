﻿/// <reference path="../game/ref.js" />

/* PLAYER CONTROLLER */

var player;
var playerColors = [
    new BABYLON.Color3(1, 0.5, 0.5),
    new BABYLON.Color3(0.5, 1, 0.5),
    new BABYLON.Color3(0.5, 0.5, 1)
];
var playerColorIndex = 0;

function controlPlayer() {
    // matrix of gameplay move area
    player.movementMatrix = [[], []];

    var posX = -4, posZ;
    for (var i = 0; i < 3; i++) {
        posZ = 20;
        player.movementMatrix[i] = [null, null, null];
        for (var j = 0; j < 3; j++) {
            player.movementMatrix[i][j] = new BABYLON.Vector3(posX, -4, posZ);
            posZ -= 5;
        }
        posX += 4;
    }

    player.X = 1, player.Z = 1;
    player.position = player.movementMatrix[player.X][player.Z];

    // easing functions
    var easingFunction = new BABYLON.SineEase();
    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

    // jump animation for the player
    var jumpAnim = new BABYLON.Animation("Jump Animation", "position.y", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
    var jumpAnimKeys = [];

    jumpAnimKeys.push({
        frame: 0,
        value: player.position.y
    }, {
        frame: 15,
        value: player.position.y + 5
    }, {
        frame: 30,
        value: player.position.y
    });

    jumpAnim.setKeys(jumpAnimKeys);
    jumpAnim.setEasingFunction(easingFunction);
    player.animations.push(jumpAnim);

    // rotate animation
    var rotateAnim = new BABYLON.Animation("Rotate Animation", "rotation.x", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
    var rotateAnimKeys = [];

    rotateAnimKeys.push({
        frame: 0,
        value: player.rotation.x
    }, {
        frame: 30,
        value: player.position.x + Math.PI
    });

    rotateAnim.setKeys(rotateAnimKeys);
    player.animations.push(rotateAnim);

    var initialTime = Date.now();

    // keyboard input
    window.onkeydown = function (evt) {
        if ((evt.keyCode === 65 || evt.keyCode === 37) && player.X > 0) {
            // A
            player.X--;
        } else if ((evt.keyCode === 68 || evt.keyCode === 39) && player.X < 2) {
            // D
            player.X++;
        }

        if ((evt.keyCode === 87 || evt.keyCode === 38) && player.Z > 0) {
            // W
            player.Z--;
        } else if ((evt.keyCode === 83 || evt.keyCode === 40) && player.Z < 2) {
            // S
            player.Z++;
        }

        if (evt.keyCode === 32) {
            // spacebar
            var currentTime = Date.now();
            if(currentTime - initialTime > 500){
                playerColorIndex++;
                if(playerColorIndex > playerColors.length - 1)
                    playerColorIndex = 0;
                scene.beginAnimation(player, 0, 60, false);
                initialTime = Date.now();
            }
        }
    };
    // touch input
    var hammertime = new Hammer(document.getElementById('touchDiv'), {});
    hammertime.on('tap', function(tap) {
        if ((tap.center.x < (screen.width / 2 )) && player.X > 0) {
            // A
            player.X--;
        } else if ((tap.center.x > (screen.width / 2 )) && player.X < 2) {
            // D
            player.X++;
        }
    });

    // browser detection
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('safari') != -1) {
        if (ua.indexOf('chrome') > -1) {
            // gamepad input
            var gamepadConnected = function (gamepad) {
                gamepad.onbuttondown(function (buttonIndex) {
                    if (buttonIndex === 3 && player.X > 0) {
                        // left pressed 
                        player.X--;
                    } else if (buttonIndex === 1 && player.X < 2) {
                        // right pressed
                        player.X++;
                    }

                    if (buttonIndex === 5 && player.Z > 0) {
                        // up pressed
                        player.Z--;
                    } else if (buttonIndex === 2 && player.Z < 2) {
                        // down pressed
                        player.Z++;
                    }

                    // jump!
                    if (buttonIndex === 4) {
                        var currentTime = Date.now();
                        if (currentTime - initialTime > 500) {
                            playerColorIndex++;
                            if(playerColorIndex > playerColors.length - 1)
                                playerColorIndex = 0;
                            scene.beginAnimation(player, 0, 60, false);
                            initialTime = Date.now();
                        }
                    }
                    /*
                    if(player.isDead && buttonIndex === 9) Retry();
                    else if(player.isDead && buttonIndex === 8) Menu();
                    */
                });
            };

            var gamepads = new BABYLON.Gamepads(gamepadConnected);

            if (navigator.getGamepads()[0]) {
                gamepads._startMonitoringGamepads();
            }
        }
    }
    
    // movement
    scene.registerBeforeRender(function(){
        // Lerp with inputs
        player.position = BABYLON.Vector3.Lerp(player.position, player.movementMatrix[player.X][player.Z], animRatio / 5.0);
        player.material.emissiveColor = BABYLON.Color3.Lerp(player.material.emissiveColor, playerColors[playerColorIndex], animRatio / 25.0);
    });
}