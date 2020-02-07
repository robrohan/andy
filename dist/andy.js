"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Xhr_1 = require("./Xhr");
var Sound = (function () {
    function Sound(buffer) {
        this.isInContext = false;
        this.isPlaying = false;
        this.isMusic = false;
        this.buffer = buffer;
        this.loop = false;
    }
    Sound.prototype.setContext = function (context) {
        this.volume = context.createGain();
        this.panner = context.createPanner();
        this.source = context.createBufferSource();
        this.source.connect(this.volume);
        this.volume.connect(this.panner);
        this.source.buffer = this.buffer;
        this.source.loop = this.loop;
        this.isInContext = true;
        this.panner.panningModel = 'HRTF';
        this.panner.distanceModel = 'inverse';
        this.panner.refDistance = 1;
        this.panner.maxDistance = 1000;
        this.panner.rolloffFactor = 1;
        this.panner.coneInnerAngle = 360;
        this.panner.coneOuterAngle = 0;
        this.panner.coneOuterGain = 0;
    };
    Object.defineProperty(Sound.prototype, "node", {
        get: function () {
            return (this.isMusic) ? this.volume : this.panner;
        },
        enumerable: true,
        configurable: true
    });
    Sound.prototype.play = function (time) {
        if (time === void 0) { time = 0; }
        if (!this.isInContext) {
            throw new Error('Sound not in context');
        }
        if (this.source)
            this.source.start(time);
    };
    Sound.prototype.stop = function () {
        if (this.source)
            this.source.stop();
    };
    return Sound;
}());
exports.Sound = Sound;
var SoundSystemOptions = (function () {
    function SoundSystemOptions() {
    }
    return SoundSystemOptions;
}());
exports.SoundSystemOptions = SoundSystemOptions;
var SoundSystem = (function () {
    function SoundSystem(settings) {
        this.reboot();
    }
    SoundSystem.addSoundToContext = function (context, sound) {
        sound.setContext(context);
    };
    SoundSystem.prototype.reboot = function () {
        var _this = this;
        try {
            var AudioContext_1 = window.webkitAudioContext
                || window.AudioContext
                || false;
            if (AudioContext_1) {
                if (SoundSystem.soundContext) {
                    SoundSystem.soundContext.suspend();
                }
                SoundSystem.soundContext = new AudioContext_1();
                SoundSystem.soundContext.onstatechange = this.handleStateChange;
                SoundSystem.masterGainNode = SoundSystem.soundContext.createGain();
                SoundSystem.masterGainNode.connect(SoundSystem.soundContext.destination);
                window.addEventListener('focus', function (event) {
                    console.log('Resume Play');
                    _this.resumePlay();
                });
            }
            else {
                console.error('Web Audio API is not supported in this browser');
            }
        }
        catch (e) {
            console.error('Error creating Web Audio context', e);
        }
    };
    SoundSystem.prototype.adjustVolume = function (by) {
        SoundSystem.masterGainNode.gain.value = by;
    };
    SoundSystem.prototype.play = function (sound, loop, time) {
        if (loop === void 0) { loop = false; }
        if (time === void 0) { time = 0; }
        sound.loop = loop;
        this.playSound(sound, time);
    };
    SoundSystem.prototype.decodeSound = function (data) {
        return new Promise(function (res, rej) {
            var buffer;
            if (SoundSystem.soundContext) {
                SoundSystem.soundContext.decodeAudioData(data, function (ab) {
                    buffer = ab;
                    res(buffer);
                }, function (error) {
                    console.error(error);
                    rej(error);
                });
            }
        });
    };
    SoundSystem.prototype.resumePlay = function () {
        return SoundSystem.soundContext.resume();
    };
    SoundSystem.prototype.playSound = function (sound, time) {
        if (time === void 0) { time = 0; }
        sound.setContext(SoundSystem.soundContext);
        if (sound.node)
            sound.node.connect(SoundSystem.masterGainNode);
        sound.play(time);
    };
    SoundSystem.prototype.handleStateChange = function (e) {
        if (SoundSystem.soundContext && SoundSystem.soundContext.state !== 'running') {
            this.resumePlay();
        }
        return undefined;
    };
    return SoundSystem;
}());
exports.SoundSystem = SoundSystem;
exports.loadSound = function (url, soundSystem) {
    return new Promise(function (resolve, reject) {
        Xhr_1.xhr(url, 'GET')
            .then(function (response) { return response.arrayBuffer(); })
            .then(function (response) {
            soundSystem.decodeSound(response).then(function (b) {
                var sound = new Sound(b);
                sound.buffer = b;
                resolve(sound);
            }, function (err) {
                reject(err);
            }).catch(function (e) { return console.error(e); });
        }).catch(function (e) { return console.error(e); });
    });
};
//# sourceMappingURL=andy.js.map