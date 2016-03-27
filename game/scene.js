/// <reference path="../game/ref.js" />

/* SCENE CONTROLLER */

var scene, cam;

function createScene() {

    scene = new BABYLON.Scene(engine);

    scene.fogEnabled = true;
    scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
    scene.fogColor = scene.clearColor;
    scene.fogEnd = 100;

    scene.ambientColor = scene.clearColor;

    // create the camera
    cam = new BABYLON.FreeCamera("Free Camera", new BABYLON.Vector3(0, 5, -75), scene);
    cam.speed = 0.1;
    //cam.attachControl(canvas, false);

    createLevel();

    createPlayer();

    createSpectrum();

    initParticles();
}

function createLevel() {
    // create a new node called "environment"
    var envNode = new BABYLON.Node("Environment", scene);

    // create tunnel meshes
    var floor1 = BABYLON.Mesh.CreateGround("Floor1", 15, 152, 1, scene);
    var floor2 = BABYLON.Mesh.CreateGround("Floor2", 15, 152, 1, scene);

    // set positions and rotations
    floor1.position = new BABYLON.Vector3.Zero();
    floor2.position = new BABYLON.Vector3(0, 0, 152);

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
            collisionWall1.parent.position.z += 304;
        } else if (collisionWall2.collided === false && player.intersectsMesh(collisionWall2, false)) {
            collisionWall1.collided = false;
            collisionWall2.collided = true;
            collisionWall2.parent.position.z += 304;
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

function createSpectrum() {
    
    var floor1 = scene.getMeshByName("Floor1");
    var floor2 = scene.getMeshByName("Floor2");

    var leftSpectrum1 = [], rightSpectrum1 = [], leftSpectrum2 = [], rightSpectrum2 = [];

    var posZ1 = -74, posZ2 = -74;

    for (var i = 0; i < 38; i++) {
        var specMesh1 = BABYLON.Mesh.CreateGround("SpecMesh1_" + i, 4, 4, 1, scene);
        var specMat1 = new BABYLON.StandardMaterial("SpecMat1_" + i, scene);

        var specMesh2 = BABYLON.Mesh.CreateGround("SpecMesh2_" + i, 4, 4, 1, scene);
        var specMat2 = new BABYLON.StandardMaterial("SpecMat2_" + i, scene);

        var specMesh3 = BABYLON.Mesh.CreateGround("SpecMesh3_" + i, 4, 4, 1, scene);
        var specMat3 = new BABYLON.StandardMaterial("SpecMat3_" + i, scene);

        var specMesh4 = BABYLON.Mesh.CreateGround("SpecMesh4_" + i, 4, 4, 1, scene);
        var specMat4 = new BABYLON.StandardMaterial("SpecMat4_" + i, scene);

        specMat1.emissiveColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
        specMat2.emissiveColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
        specMat3.emissiveColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
        specMat4.emissiveColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());

        // 1st spectrum left
        leftSpectrum1[i] = specMesh1;
        leftSpectrum1[i].parent = floor1;

        leftSpectrum1[i].position = new BABYLON.Vector3(-7, 1, posZ1);
        leftSpectrum1[i].rotation = new BABYLON.Vector3(0, 0, -Math.PI / 2);
        leftSpectrum1[i].material = specMat1;

        // 1st spectrum right
        rightSpectrum1[i] = specMesh2;
        rightSpectrum1[i].parent = floor1;

        rightSpectrum1[i].position = new BABYLON.Vector3(7, 1, posZ1);
        rightSpectrum1[i].rotation = new BABYLON.Vector3(0, 0, Math.PI / 2);
        rightSpectrum1[i].material = specMat2;

        // 2nd spectrum left
        leftSpectrum2[i] = specMesh3;
        leftSpectrum2[i].parent = floor2;

        leftSpectrum2[i].position = new BABYLON.Vector3(-7, 1, posZ2);
        leftSpectrum2[i].rotation = new BABYLON.Vector3(0, 0, -Math.PI / 2);
        leftSpectrum2[i].material = specMat3;

        // 2nd spectrum right
        rightSpectrum2[i] = specMesh4;
        rightSpectrum2[i].parent = floor2;

        rightSpectrum2[i].position = new BABYLON.Vector3(7, 1, posZ2);
        rightSpectrum2[i].rotation = new BABYLON.Vector3(0, 0, Math.PI / 2);
        rightSpectrum2[i].material = specMat4;

        posZ1 += 4;
        posZ2 += 4;
    }


    scene.registerBeforeRender(function () {

        fft = myAnalyser.getByteFrequencyData();

        for (var i = 0; i < leftSpectrum1.length; i++) {
            leftSpectrum1[i].scaling.x = Lerp(leftSpectrum1[i].scaling.x, fft[i] / 30.0 + 0.5, animRatio / 2.0);
            rightSpectrum1[i].scaling.x = leftSpectrum1[i].scaling.x;
            
            leftSpectrum2[leftSpectrum2.length - 1 - i].scaling.x = leftSpectrum1[i].scaling.x;
            rightSpectrum2[rightSpectrum2.length - 1 - i].scaling.x = leftSpectrum1[i].scaling.x;
        }
        
        cam.fov = Lerp(cam.fov, fft[0] / 250.0, animRatio / 2.0);
    });
}

function initParticles() {
    // create the particle system named "Dust System"
    var particles = new BABYLON.ParticleSystem("Dust System", 2000, scene);

    // create the emitter and its material
    var emitterPlane = BABYLON.Mesh.CreatePlane("Particle Emitter", 1, scene);
    var emitterPlaneMat = new BABYLON.StandardMaterial("Emitter Material", scene);
    emitterPlaneMat.emissiveColor = new BABYLON.Color3(1, 1, 1);
    emitterPlaneMat.alpha = 0;
    emitterPlane.material = emitterPlaneMat;
    
    emitterPlane.parent = cam;
    emitterPlane.position = new BABYLON.Vector3(0, 0, 100);
    emitterPlane.scaling = new BABYLON.Vector3(15, 15, 1);
    emitterPlane.rotation = new BABYLON.Vector3(0, 0, Math.PI / 2);

    // set the texture
    particles.particleTexture = new BABYLON.Texture("../NeoTrap/textures/dust.png", scene);

    // source of emission
    particles.emitter = emitterPlane;

    // starting
    particles.minEmitBox = new BABYLON.Vector3(1, 1, 1);

    // ending
    particles.maxEmitBox = new BABYLON.Vector3(-1, -1, -1);

    // colors of the particles
    particles.color1 = new BABYLON.Color4(255 / 255.0, 248 / 255.0, 225 / 255.0, 1.0);
    particles.color2 = new BABYLON.Color4(255 / 255.0, 236 / 255.0, 179 / 255.0, 1.0);
    particles.colorDead = new BABYLON.Color4(255 / 255.0, 224 / 255.0, 130 / 255.0, 0.0);

    // size of particles
    particles.minSize = 0.1;
    particles.maxSize = 0.2;

    // lifetime of particles
    particles.minLifeTime = 2;
    particles.maxLifeTime = 4;

    // emission rate
    particles.emitRate = 500;

    // blend mode
    particles.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    // gravity for particles
    particles.gravity = new BABYLON.Vector3(0, 0, -10);

    // direction of the particles
    particles.direction1 = new BABYLON.Vector3(0, 0, 1);
    particles.direction2 = new BABYLON.Vector3(0, 0, 2);

    // angular speed in radians
    particles.minAngularSpeed = 0;
    particles.maxAngularSpeed = Math.PI;

    // speed
    particles.minEmitPower = 1;
    particles.maxEmitPower = 3;
    particles.updateSpeed = 0.005;

    // start the particle system
    particles.start();
}