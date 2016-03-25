/// <reference path="../game/ref.js" />

/* SCENE CONTROLLER */

function createScene() {

    scene = new BABYLON.Scene(engine);

    scene.fogEnabled = true;
    scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
    scene.fogColor = scene.clearColor;
    scene.fogEnd = 100;

    scene.ambientColor = scene.clearColor;

    // create the camera
    cam = new BABYLON.FreeCamera("Free Camera", new BABYLON.Vector3(0, 5, -75), scene);

    createLevel();

    createPlayer();
}

function createLevel() {
    // create a new node called "environment"
    var envNode = new BABYLON.Node("Environment", scene);

    // create tunnel meshes
    var floor1 = BABYLON.Mesh.CreateGround("Floor1", 15, 150, 5, scene);
    var floor2 = BABYLON.Mesh.CreateGround("Floor2", 15, 150, 5, scene);

    // set positions and rotations
    floor1.position = new BABYLON.Vector3.Zero();
    floor2.position = new BABYLON.Vector3(0, 0, 150);

    // create new emissive material
    var mat = new BABYLON.StandardMaterial("Main Emissive", scene);
    mat.emissiveColor = new BABYLON.Color3(255 / 255.0, 205 / 255.0, 210 / 255.0);

    // apply the material
    floor1.material = mat;
    floor2.material = mat;

    // create collision walls
    var collisionWall1 = new BABYLON.Mesh.CreatePlane("Wall1", 1, scene);
    var collisionWall2 = new BABYLON.Mesh.CreatePlane("Wall2", 1, scene);

    // scale the collison walls
    collisionWall1.scaling = new BABYLON.Vector3(15, 10, 0.1);
    collisionWall2.scaling = new BABYLON.Vector3(15, 10, 0.1);

    // assign the parents
    collisionWall1.parent = floor1;
    collisionWall2.parent = floor2;

    // assign the positions
    collisionWall1.position.z += 100;
    collisionWall2.position.z += 100;

    // did they collide?
    collisionWall1.collided = false;
    collisionWall2.collided = false;

    // create special material for collision walls and apply it
    var collisionMat = new BABYLON.StandardMaterial("Collision Material", scene);
    collisionMat.alpha = 0;
    collisionWall1.material = collisionMat;
    collisionWall2.material = collisionMat;

    // detect the collisions
    scene.registerAfterRender(function () {
        if (collisionWall1.collided === false && player.intersectsMesh(collisionWall1, false)) {
            collisionWall1.collided = true;
            collisionWall2.collided = false;
            collisionWall1.parent.position.z += 300;
        } else if (collisionWall2.collided === false && player.intersectsMesh(collisionWall2, false)) {
            collisionWall1.collided = false;
            collisionWall2.collided = true;
            collisionWall2.parent.position.z += 300;
        }
    });
}

function createPlayer() {
    // create cube
    player = BABYLON.Mesh.CreateBox("Player", 4, scene, true);

    // attach cube to camera
    player.material = new BABYLON.StandardMaterial("Player Mat", scene);
    player.material.emissiveColor = new BABYLON.Color3(179 / 255.0, 229 / 255.0, 252 / 255.0);

    // position and scaling
    player.parent = cam;
    player.position = new BABYLON.Vector3(0, -4, 20);
    player.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
}