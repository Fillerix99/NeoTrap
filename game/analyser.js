/// <reference path="../game/ref.js" />

/* Music Analyser */

var myAnalyser, fft;

function analyseMusic() {
    engine.displayLoadingUI();
    var music = new BABYLON.Sound("Music", "../NeoTrap/music/Team.mp3", scene, function () { engine.hideLoadingUI(); }, { autoplay: true, loop: false, streaming: true });

    myAnalyser = new BABYLON.Analyser(scene);
    BABYLON.Engine.audioEngine.connectToAnalyser(myAnalyser);
    myAnalyser.FFT_SIZE = 128;
    myAnalyser.SMOOTHING = 0.9;
}