// Very rough usage of Andy to load an play sounds.
// You'll want implement this into something more robust
// like an react context or something along those lines
const Andy = require('./andy.ts');

const system = new Andy.SoundSystem();
const sounds = {
    s0: Andy.loadSound("./coin4.wav", system),
    s1: Andy.loadSound("./humm.wav", system),
    s2: Andy.loadSound("./whatisthis.wav", system),
    s3: Andy.loadSound("./icon.wav", system),
    s4: Andy.loadSound("./doortrek2.wav", system)
}

Promise.all([sounds.s0,sounds.s1,sounds.s2,sounds.s3, sounds.s4]).then(s => {
    sounds.s0 = s[0];
    sounds.s1 = s[1];
    sounds.s2 = s[2];
    sounds.s3 = s[3];
    sounds.s4 = s[4];

    window.sound = system;
    window.sounds = sounds;
});
