﻿/* NeoTrap Scene development */

/// <reference path="../engine/Babylon.js" />
/// <reference path="../game/game.js" />

function createScene() {

    scene = new BABYLON.Scene(engine);

    scene.fogEnabled = true;
    scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
    scene.fogColor = scene.clearColor;
    scene.fogEnd = 100;

    scene.ambientColor = scene.clearColor;

    createTunnel();

    createCamera();

    createPlayer();
}

function createCamera() {
    // main camera
    cam = new BABYLON.FreeCamera("Free Camera", new BABYLON.Vector3(0, 5, -75), scene);
}

function createTunnel() {
    // create a new node called "environment"
    var envNode = new BABYLON.Node("Environment", scene);

    // create tunnel meshes
    var floor1 = BABYLON.Mesh.CreateGround("Floor1", 15, 150, 5, scene);
    var floor2 = BABYLON.Mesh.CreateGround("Floor2", 15, 150, 5, scene);

    // set positions and rotations
    floor1.position = new BABYLON.Vector3.Zero();
    floor2.position = new BABYLON.Vector3(0, 0, 155);

    // create new emissive material
    var mat = new BABYLON.StandardMaterial("Main Emissive", scene);
    mat.emissiveColor = new BABYLON.Color3(255 / 255.0, 205 / 255.0, 210 / 255.0);

    // apply the material
    floor1.material = mat;
    floor2.material = mat;
}

function createPlayer() {
    // create cube
    var player = BABYLON.Mesh.CreateBox("Player", 4, scene, true);

    // attach cube to camera
    player.material = new BABYLON.StandardMaterial("Player Mat", scene);
    player.material.emissiveColor = new BABYLON.Color3(179 / 255.0, 229 / 255.0, 252 / 255.0);

    player.parent = cam;
    player.position.x = 0;
    player.position.z = 20;
    player.position.y = -4;

    player.scaling.x = 0.5;
    player.scaling.y = 0.5;
    player.scaling.z = 0.5;
}