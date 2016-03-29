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

    // jump animation for the player
    var jumpAnim = new BABYLON.Animation("Jump Animation", "position", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
    jumpAnim.enableBlending = true;
    jumpAnim.blendingSpeed = 0.01;
    var jumpAnimKeys = [];

    jumpAnimKeys.push({
        frame: 0,
        value: player.position
    });

    jumpAnimKeys.push({
        frame: 15,
        value: player.position.add(new BABYLON.Vector3(0, 4, 0))
    });

    jumpAnimKeys.push({
        frame: 30,
        value: player.position
    });

    var easingFunction = new BABYLON.SineEase();
    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    jumpAnim.setEasingFunction(easingFunction);

    jumpAnim.setKeys(jumpAnimKeys);
    player.animations.push(jumpAnim);

    // rotate animation for the player
    var rotateAnim = new BABYLON.Animation("Rotate Animation", "rotation", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
    var rotateKeys = [];

    rotateKeys.push({
        frame: 0,
        value: player.rotation
    });

    rotateKeys.push({
        frame: 15,
        value: player.rotation.add(new BABYLON.Vector3(Math.PI / 2.0, 0, 0))
    });

    rotateAnim.setKeys(rotateKeys);
    rotateAnim.enableBlending = true;
    rotateAnim.blendingSpeed = 0.01;
    player.animations.push(rotateAnim);

    var spacePressed = 0;

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
            spacePressed++;
            jumpAnim.reset();
            rotateAnim.reset();
            jumpAnim.setKeys(jumpAnimKeys);
            rotateAnim.setKeys(rotateKeys);
            scene.beginAnimation(player, 0, 30, false);
        }
    }

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
        });
    };

    var gamepads = new BABYLON.Gamepads(gamepadConnected);

    if (navigator.getGamepads()[0]) {
        gamepads._startMonitoringGamepads();
    }
}