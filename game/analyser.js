/// <reference path="../game/ref.js" />

/* Music Analyser */

// zephyr: 229895167
// falling: 243977945

var myAnalyser, fft;

function analyseMusic() {

    engine.displayLoadingUI();
    var music = new BABYLON.Sound("Music", "../NeoTrap/music/beg.mp3", scene, function () { engine.hideLoadingUI(); }, { autoplay: true, loop: false, streaming: true });

    myAnalyser = new BABYLON.Analyser(scene);
    BABYLON.Engine.audioEngine.connectToAnalyser(myAnalyser);
    myAnalyser.FFT_SIZE = 128;
    myAnalyser.SMOOTHING = 0.9;

    fft = myAnalyser.getByteFrequencyData();
}