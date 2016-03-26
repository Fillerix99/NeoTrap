/// <reference path="../game/ref.js" />

/* Music Analyser */

var myAnalyser;

function analyseMusic() {
    var music = new BABYLON.Sound("Music", "../NeoTrap/music/Fire.mp3", scene, null, { autoplay: true, loop: true, streaming: true });

    myAnalyser = new BABYLON.Analyser(scene);
    BABYLON.Engine.audioEngine.connectToAnalyser(myAnalyser);
    myAnalyser.FFT_SIZE = 128;
    myAnalyser.SMOOTHING = 0.9;
}