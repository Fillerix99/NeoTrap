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