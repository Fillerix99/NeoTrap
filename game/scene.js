/// <reference path="../game/ref.js" />

/* SCENE CONTROLLER */

var scene, cam, collisionWall1, collisionWall2, particles;
var floor1, floor2;
var numOfHazards = 0, maxNumOfHazards = 15, cone;
var colliders = []; // our colliders for the scene

var newColorForSpectrum = null;
var allColorsForSpectrum =
    [
        new BABYLON.Color3(229 / 255.0, 115 / 255.0, 115 / 255.0), // red
        new BABYLON.Color3(240 / 255.0, 98 / 255.0, 146 / 255.0), // pink
        new BABYLON.Color3(186 / 255.0, 104 / 255.0, 200 / 255.0), // purple
        new BABYLON.Color3(149 / 255.0, 117 / 255.0, 205 / 255.0), // deep purple
        new BABYLON.Color3(121 / 255.0, 134 / 255.0, 203 / 255.0), // indigo
        new BABYLON.Color3(100 / 255.0, 181 / 255.0, 246 / 255.0), // blue
        new BABYLON.Color3(79 / 255.0, 195 / 255.0, 247 / 255.0), // light blue
        new BABYLON.Color3(77 / 255.0, 208 / 255.0, 225 / 255.0), // cyan
        new BABYLON.Color3(77 / 255.0, 182 / 255.0, 172 / 255.0), // teal
        new BABYLON.Color3(129 / 255.0, 199 / 255.0, 132 / 255.0), // green
        new BABYLON.Color3(174 / 255.0, 213 / 255.0, 129 / 255.0), // light green
        new BABYLON.Color3(220 / 255.0, 231 / 255.0, 117 / 255.0), // lime
        new BABYLON.Color3(255 / 255.0, 241 / 255.0, 118 / 255.0), // yellow
        new BABYLON.Color3(255 / 255.0, 213 / 255.0, 79 / 255.0), // amber
        new BABYLON.Color3(255 / 255.0, 183 / 255.0, 77 / 255.0), // orange
        new BABYLON.Color3(255 / 255.0, 138 / 255.0, 101 / 255.0) // deep orange
    ];

var counter = 0;

function createScene() {

    scene = new BABYLON.Scene(engine);

    scene.fogEnabled = true;
    scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
    scene.fogColor = scene.clearColor;
    scene.fogEnd = 100;

    scene.ambientColor = scene.clearColor;

    // enable collisions
    scene.collisionsEnabled = true;
    createCamera(); // creates camera

    createLevel(); // creates our pre-designed level

    createPlayer(); // creates player

    createSpectrum(); // creates our equalizing spectrum

    initParticles(); // initialized and starts the particle system

    createHazard(); // creates a hazard object and initializes it

    checkForCollisions(player); // checks collisions for the player
}

function createCamera(){
    cam = new BABYLON.FreeCamera("Free Camera", new BABYLON.Vector3(0, 5, -75), scene);
    cam.speed = 0.1;
}

function createLevel() {
    // create tunnel meshes
    floor1 = BABYLON.Mesh.CreateGround("Floor1", 15, 152, 1, scene);
    floor2 = floor1.createInstance("Floor2");

    // set positions and rotations
    floor1.position = new BABYLON.Vector3.Zero();
    floor2.position = new BABYLON.Vector3(0, 0, 152);

    // create new emissive material
    var mat = new BABYLON.StandardMaterial("Main Emissive", scene);
    mat.emissiveColor = new BABYLON.Color3(255 / 255.0, 205 / 255.0, 210 / 255.0);
    mat.alpha = 0.5;

    // apply the material
    floor1.material = mat;
    floor2.material = mat;

    // create collision walls
    collisionWall1 = new BABYLON.Mesh.CreatePlane("Wall1", 1, scene);
    collisionWall2 = collisionWall1.createInstance("Wall2");

    collisionWall1.isVisible = false;
    collisionWall2.isVisible = false;

    // scale the collison walls
    collisionWall1.scaling = new BABYLON.Vector3(15, 15, 0.1);
    collisionWall2.scaling = new BABYLON.Vector3(15, 15, 0.1);

    // assign the parents
    collisionWall1.parent = floor1;
    collisionWall2.parent = floor2;

    // assign the positions
    collisionWall1.position.z += 100;
    collisionWall2.position.z += 100;

    // did they collide?
    collisionWall1.collided = false;
    collisionWall2.collided = false;

    // detect the collisions
    scene.registerAfterRender(function () {
        if (collisionWall1.collided === false && player.intersectsMesh(collisionWall1, false)) {
            collisionWall1.collided = true;
            collisionWall2.collided = false;
            collisionWall1.parent.position.z += 304;

            spawnHazards(floor1);
        } else if (collisionWall2.collided === false && player.intersectsMesh(collisionWall2, false)) {
            collisionWall1.collided = false;
            collisionWall2.collided = true;
            collisionWall2.parent.position.z += 304;

            if (counter >= allColorsForSpectrum.length - 1) counter = 0;
            counter++;

            particles.color1 = allColorsForSpectrum[counter];
            particles.color2 = allColorsForSpectrum[counter];

            spawnHazards(floor2);
        }
    });
}

function createPlayer() {
    // create cube
    player = BABYLON.Mesh.CreateBox("Player", 4, scene, true);

    // attach cube to camera
    player.material = new BABYLON.StandardMaterial("Player Mat", scene);
    player.material.emissiveColor = playerColors[playerColorIndex];
    player.material.alpha = 0.75;

    // position and scaling
    player.parent = cam;
    player.position = new BABYLON.Vector3(0, -4, 20);
    player.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);

    // death control
    player.isDead = true;
    player.isVisible = false;
}

function createSpectrum() {

    var floor1 = scene.getMeshByName("Floor1");
    var floor2 = scene.getMeshByName("Floor2");

    var leftSpectrum1 = [], rightSpectrum1 = [], leftSpectrum2 = [], rightSpectrum2 = [];

    var posZ1 = -74, posZ2 = -74;

    var specMesh1 = BABYLON.Mesh.CreateGround("SpecMesh", 4, 4, 1, scene);
    specMesh1.isVisible = false;

    var specMat1 = new BABYLON.StandardMaterial("SpecMat1", scene);
    specMat1.emissiveColor = allColorsForSpectrum[0];
    specMat1.alpha = 0.5;

    specMesh1.material = specMat1;

    for (var i = 0; i < 32; i++) {
        
        // 1st spectrum left
        leftSpectrum1[i] = specMesh1.createInstance("SpecMesh1_" + i);
        leftSpectrum1[i].parent = floor1;

        leftSpectrum1[i].position = new BABYLON.Vector3(-7.5, 0, posZ1);
        leftSpectrum1[i].rotation = new BABYLON.Vector3(0, 0, -Math.PI / 2);
        leftSpectrum1[i].material = specMat1;

        // 1st spectrum right
        rightSpectrum1[i] = specMesh1.createInstance("SpecMesh2_" + i);
        rightSpectrum1[i].parent = floor1;

        rightSpectrum1[i].position = new BABYLON.Vector3(7.5, 0, posZ1);
        rightSpectrum1[i].rotation = new BABYLON.Vector3(0, 0, Math.PI / 2);
        rightSpectrum1[i].material = specMat1;

        // 2nd spectrum left
        leftSpectrum2[i] = specMesh1.createInstance("SpecMesh3_" + i);
        leftSpectrum2[i].parent = floor2;

        leftSpectrum2[i].position = new BABYLON.Vector3(-7.5, 0, posZ2);
        leftSpectrum2[i].rotation = new BABYLON.Vector3(0, 0, -Math.PI / 2);
        leftSpectrum2[i].material = specMat1;

        // 2nd spectrum right
        rightSpectrum2[i] = specMesh1.createInstance("SpecMesh4_" + i);
        rightSpectrum2[i].parent = floor2;

        rightSpectrum2[i].position = new BABYLON.Vector3(7.5, 0, posZ2);
        rightSpectrum2[i].rotation = new BABYLON.Vector3(0, 0, Math.PI / 2);
        rightSpectrum2[i].material = specMat1;

        posZ1 += 4.75;
        posZ2 += 4.75;
    }

    scene.registerBeforeRender(function () {
        fft = myAnalyser.getByteFrequencyData();
        
        for (var i = 0; i < leftSpectrum1.length; i++) {
            leftSpectrum1[i].scaling.x = Lerp(leftSpectrum1[i].scaling.x, fft[i + 24] / 50.0 + 0.5, animRatio / 2.0);
            rightSpectrum1[i].scaling.x = leftSpectrum1[i].scaling.x;

            leftSpectrum2[leftSpectrum2.length - i - 1].scaling.x = leftSpectrum1[i].scaling.x;
            rightSpectrum2[rightSpectrum2.length - i - 1].scaling.x = leftSpectrum1[i].scaling.x;
        } 

        cam.fov = Lerp(cam.fov, Math.abs(fft[0] / 100 - 0.8), animRatio / 3.0);

        if (collisionWall1.collided) {
            newColorForSpectrum = allColorsForSpectrum[counter];
            specMat1.emissiveColor = BABYLON.Color3.Lerp(specMat1.emissiveColor, newColorForSpectrum, animRatio / 50.0);
            cone.material.emissiveColor = BABYLON.Color3.Lerp(cone.material.emissiveColor, newColorForSpectrum, animRatio / 50.0);
        }
    });
}

function initParticles() {
    var emitter = scene.getMeshByName("Wall1");
    var emitterPlane = emitter.createInstance("Emitter Plane");
    emitterPlane.isVisible = false;

    // create the particle system named "Dust System"
    particles = new BABYLON.ParticleSystem("Dust System", 1000, scene);
    
    emitterPlane.parent = cam;
    emitterPlane.position = new BABYLON.Vector3(0, 0, 100); // 100 is default
    emitterPlane.scaling = new BABYLON.Vector3(15, 15, 1);
    emitterPlane.rotation = new BABYLON.Vector3(0, 0, Math.PI / 2);

    // set the texture
    particles.particleTexture = new BABYLON.Texture("../NeoTrap/textures/dust.png", scene);
    particles.particleTexture.hasAlpha = true;

    // source of emission
    particles.emitter = emitterPlane;

    // starting
    particles.minEmitBox = new BABYLON.Vector3(1, 1, 1);

    // ending
    particles.maxEmitBox = new BABYLON.Vector3(-1, -1, -1);

    // colors of the particles
    particles.color1 = allColorsForSpectrum[counter];
    particles.color2 = allColorsForSpectrum[counter];
    particles.colorDead = allColorsForSpectrum[counter];

    // size of particles
    particles.minSize = 0.2;
    particles.maxSize = 0.3;

    // lifetime of particles
    particles.minLifeTime = 1;
    particles.maxLifeTime = 1.5;

    // emission rate
    particles.emitRate = 250;

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

function initHazardPozs(){
    floor1.hazardPozs = [];
    floor2.hazardPozs = [];
    floor1.spawnedHazards = [];
    floor2.spawnedHazards = [];

    // initialize the positions array
    var xPos = -4, zPos = -75;
    for (var i = 0; i < 15; i++) {
        floor1.hazardPozs[i] = new BABYLON.Vector3(xPos, 1.5, zPos);
        floor2.hazardPozs[i] = new BABYLON.Vector3(xPos, 1.5, zPos);
        xPos += 4;
        zPos += 10;
        if (xPos > 4) {
            xPos = -4;
        }
    }
}

function createHazard() {
    cone = BABYLON.MeshBuilder.CreateCylinder("cone", { diameterTop: 0, tessellation: 4, diameterBottom: 1.5, height: 3 }, scene);

    var coneMat = new BABYLON.StandardMaterial("Cone Material", scene);
    coneMat.emissiveColor = allColorsForSpectrum[counter];
    cone.material = coneMat;
    cone.isVisible = false;

    initHazardPozs();
}

function spawnHazards(parent) {
    var randomIndex, randomPoz;
    shuffle(parent.hazardPozs);

    if (numOfHazards >= maxNumOfHazards) {
        for(var i = 0; i < parent.spawnedHazards.length; i++){
            var mesh = scene.getMeshByName(parent.name.charAt(5) + "NewCone" + i);
            if(mesh !== null){
                var newPoz = parent.hazardPozs[i];
                mesh.position = newPoz;
                colliders[i].position = newPoz;
            }
        }

        return;
    }

    randomIndex = Math.floor((Math.random() * parent.hazardPozs.length));
    randomPoz = parent.hazardPozs[randomIndex];

    if (randomIndex > -1) {
        var newCone;
        parent.hazardPozs.splice(randomIndex, 1);

        if(parent.name === "Floor1")
            newCone = cone.createInstance("1NewCone" + numOfHazards);
        else
            newCone = cone.createInstance("2NewCone" + numOfHazards);
        numOfHazards++;
        newCone.parent = parent;
        newCone.position = randomPoz;
        newCone.tagName = "hazard";

        parent.spawnedHazards.push(newCone);
        colliders.push(newCone);
    }
}

function checkForCollisions(player){
    scene.registerBeforeRender(function(){
        for(var i = 0; i < colliders.length; i++){
            if(player.intersectsMesh(colliders[i], true) && !player.isDead){
                // intersection with hazardous cones
                if(colliders[i].tagName === "hazard"){
                    player.isDead = true;
                    player.isVisible = false;
                    if(music !== undefined)
                        music.dispose();
                    $('#score').css({
                        'opacity': '0',
                        'visibility': 'hidden'
                    });
                    setTimeout(function(){
                        $('#leaderboardMenu').css('visibility', 'visible')
                            .animate({
                                opacity: 0.7,
                                width: '200px',
                                height: '400px'
                            }, 500);
                        $('#totalScore').html('Score: ' + score);
                    }, 500);
                }
            }
        }
    });
}

/**
 * Shuffles array in place.
 * @param {Array} array items The array containing the items.
 */
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}