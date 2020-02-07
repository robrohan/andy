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

Andy is a "low level" library in that it just provides an easier way to load and play audio files. You'll have to write your own manager / context / come up with your own way of managing the files (see example below). Here is a "raw" Typescript example of Andy's basic usage:

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

Of course, it's better to use Andy within your chosen framework. For example in a React Context, or what have you.

## React Context

Here is a simple example of using andy within a React context (in Typescript).

Create a file called _SoundContext.tsx_ with the following content:

    import React from 'react';
    import { Sound, SoundSystem, loadSound, SoundSystemOptions } from 'andy';

    export interface ISounds {
      load: Function;
      play: Function;
    }

    export interface SoundRepository {
      [key: string]: Sound;
    }

    const sounds = {} as SoundRepository;
    const system = new SoundSystem(new SoundSystemOptions());

    const createKey = (url:string): string => {
      const parts = url.split('/');
      return parts[parts.length - 1];
    }

    export const SoundContext = React.createContext<ISounds>({
      load: async (soundUrl: string, key?: string) => { 
        const sound = await loadSound(soundUrl, system);
        sounds[key || createKey(soundUrl)] = sound;
      },
      play: (name: string, loop: boolean = false) => {
        system.play(sounds[name], loop);
      }
    });

You can then use this context within your app. Here is an example usage with the create react app:

    ...
    import { SoundContext } from './SoundContext';
    ...

    const App = () => {
      const ctx = useContext(SoundContext);
      ctx.load("http://localhost:3000/coin4.wav");

      return (
        <div className="App">
            <div
              className="App-link"
              onClick={() => ctx.play("coin4.wav")}
            >Learn React</div>
        </div>
      );
    }
