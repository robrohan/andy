const Andy = require('./andy.ts');

const system = new Andy.SoundSystem();

const s1 = Andy.loadSound("./pickup.m4a", system);
const s2 = Andy.loadSound("./mesh.mp3", system);

Promise.all([s1,s2]).then(s => {
    document.querySelector('#s1').addEventListener("click", () => {
	system.play(s[0]);
    });

    document.querySelector('#s2').addEventListener("click", () => {
	system.play(s[1]);
    });
});
