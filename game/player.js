/// <reference path="../game/ref.js" />

/* PLAYER CONTROLLER */

function controlPlayer() {
    var movementMatrix = [[null, null, null], []];

    var posX = -4, posZ;
    for (var i = 0; i < 3; i++) {
        posZ = 20;
        movementMatrix[i] = [null, null, null];
        for (var j = 0; j < 3; j++) {
            movementMatrix[i][j] = new BABYLON.Vector3(posX, -4, posZ);
            posZ -= 5;
        }
        posX += 4;
    }

    var player = scene.getMeshByName("Player");

    var x = 1, z = 1;
    player.position = movementMatrix[x][z];

    window.onkeydown = function (evt) {
        if ((evt.keyCode === 65 || evt.keyCode === 37) && x > 0) {
            // A
            player.position = BABYLON.Vector3.Lerp(player.position, movementMatrix[x - 1][z], 1);
            x--;
        } else if ((evt.keyCode === 68 || evt.keyCode === 39) && x < 2) {
            // D
            player.position = BABYLON.Vector3.Lerp(player.position, movementMatrix[x + 1][z], 1);
            x++;
        }

        if ((evt.keyCode === 87 || evt.keyCode === 38) && z > 0) {
            // W
            player.position = BABYLON.Vector3.Lerp(player.position, movementMatrix[x][z - 1], 1);
            z--;
        } else if ((evt.keyCode === 83 || evt.keyCode === 40) && z < 2) {
            // S
            player.position = BABYLON.Vector3.Lerp(player.position, movementMatrix[x][z + 1], 1);
            z++;
        }
    }
}