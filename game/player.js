/// <reference path="../game/ref.js" />

/* PLAYER CONTROLLER */

var player;

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
        value: player.position.y + 4
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
                scene.beginAnimation(player, 0, 60, false);
                initialTime = Date.now();
            }
        }
    };

    // gamepad input
    var gamepadConnected = function (gamepad) {
        gamepad.onbuttondown(function (buttonIndex) {
            console.log(buttonIndex);
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
                    scene.beginAnimation(player, 0, 60, false);
                    initialTime = Date.now();
                }
            }
        });
    };

    var gamepads = new BABYLON.Gamepads(gamepadConnected);

    if (navigator.getGamepads()[0]) {
        gamepads._startMonitoringGamepads();
    }

    // player collisions with hazardous cones
    scene.registerBeforeRender(function () {

        

    });
}