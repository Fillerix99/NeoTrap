/// <reference path="../game/ref.js" />

var myAnalyser, fft;

function analyseMusic() {
    myAnalyser = new BABYLON.Analyser(scene);
    BABYLON.Engine.audioEngine.connectToAnalyser(myAnalyser);
    myAnalyser.FFT_SIZE = 128;
    myAnalyser.SMOOTHING = 0.9;

    fft = myAnalyser.getByteFrequencyData();
}