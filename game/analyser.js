/// <reference path="../game/ref.js" />

// http://api.soundcloud.com/tracks/162671452/stream?client_id=a0bc8bd86e876335802cfbb2a7b35dd2

/* Music Analyser */
// zephyr: 229895167
// falling: 243977945
// enigma: 241622846

var myAnalyser, fft;

function analyseMusic() {

    engine.displayLoadingUI();
    var music = new BABYLON.Sound("Music", "http://api.soundcloud.com/tracks/243977945/stream?client_id=a0bc8bd86e876335802cfbb2a7b35dd2", scene, function () { engine.hideLoadingUI(); }, { autoplay: true, loop: false, streaming: true });
    //var music = new BABYLON.Sound("Music", "../NeoTrap/music/california.mp3", scene, function () { engine.hideLoadingUI(); }, { autoplay: true, loop: false, streaming: true });

    myAnalyser = new BABYLON.Analyser(scene);
    BABYLON.Engine.audioEngine.connectToAnalyser(myAnalyser);
    myAnalyser.FFT_SIZE = 128;
    myAnalyser.SMOOTHING = 0.9;

    fft = myAnalyser.getByteFrequencyData();
}