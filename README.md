# Andy

![andy](static/andy.jpg)

Andy is a simple library to play sounds on web pages. [Here is a very basic example.](http://envelope.robrohan.com/andy)

Andy is the audio system from within my [online game engine](https://meshengine.xyz). It is the main part of the system, but the 3d audio, and some other small bits have been stripped out.

## Adding to Your Project

You can include Andy by doing the following in your _package.json_ file

	...
	"dependencies": {
		...
		"andy": "git+https://github.com/robrohan/andy.git"
		...
	},
	...

## Usage

Andy is a "low level" library in that it just provides an easier way to load and play audio files. You'll have to write your own manager / context / come up with your own way of managing the files. Here is a typescript example of Andy's basic usage:

	import { SoundSystem, Sound, loadSound } from 'andy';

    // This really isn't the best way to do this, but for example...
	const system = new SoundSystem();
	const sounds = {
		s0: loadSound("http://envelope.robrohan.com/andy/coin4.wav", system),
		s1: loadSound("http://envelope.robrohan.com/andy/coin3.m4a", system),
	}

	Promise.all([sounds.s0, sounds.s1]).then(s => {
		sounds.s0 = s[0];
		sounds.s1 = s[1];

		window.sound = system;
		window.sounds = sounds;
	});

Then later you could play the sound (say from the HTML page itself):

	function uiSound() {
		window.sound.play(window.sounds.s0);
	}

Of course, it's far better to use Andy within your chosen framework. For example in a React Context, or what have you.
