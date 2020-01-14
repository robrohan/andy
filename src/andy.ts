import { xhr } from './Xhr';

declare var window: any;

/////////////////////////////////////////////////

export class Sound {
  public buffer: AudioBuffer;

  public loop: boolean;
  public isInContext = false;
  public isPlaying = false;
  public isMusic = false;

  constructor(buffer: AudioBuffer) {
    this.buffer = buffer;
  }

  private source: AudioBufferSourceNode;
  private volume: GainNode;
  private panner: PannerNode;

  setContext(context: AudioContext) {
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
  }

  get node(): AudioNode {
    return (this.isMusic) ? this.volume : this.panner;
  }

  play(time: number = 0) {
    if (!this.isInContext) {
      Log.error('Sound not in context');
    }
    this.source.start(time);
  }

  stop() {
    this.source.stop();
  }
}

/////////////////////////////////////////////////

export class SoundSystemOptions {}

/////////////////////////////////////////////////
export class SoundSystem {
  static addSoundToContext(context: AudioContext, sound: Sound) {
    sound.setContext(context);
  }
  static soundContext: AudioContext;
  static masterGainNode: GainNode;

  constructor(settings: SoundSystemOptions) {
    this.reboot();
  }

  reboot() {
    try {
      const AudioContext = window.webkitAudioContext // Safari and old versions of Chrome
          || window.AudioContext                     // Default
          || false;

      if (AudioContext) {
        if (SoundSystem.soundContext) {
          SoundSystem.soundContext.suspend();
        }
        SoundSystem.soundContext = new AudioContext();
        SoundSystem.soundContext.onstatechange = this.handleStateChange;

        SoundSystem.masterGainNode = SoundSystem.soundContext.createGain();
        SoundSystem.masterGainNode.connect(SoundSystem.soundContext.destination);

        window.addEventListener('focus', (event: any) => {
          console.log('Resume Play');
          this.resumePlay();
        });
      } else {
        console.error('Web Audio API is not supported in this browser');
      }
    } catch (e) {
      console.error('Error creating Web Audio context', e);
    }
  }

  public adjustVolume(by: number) {
      SoundSystem.masterGainNode.gain.value = by;
  }

  public play(sound: Sound, loop: boolean = false, time: number = 0) {
      sound.loop = loop;
      this.playSound(sound, time);
  }

  public decodeSound(data: ArrayBuffer): Promise<AudioBuffer> {
    return new Promise<AudioBuffer>((res, rej) => {
      let buffer: AudioBuffer = undefined;
      if (SoundSystem.soundContext) {
        SoundSystem.soundContext.decodeAudioData(data, (ab: AudioBuffer) => {
            buffer = ab;
            res(buffer);
          },
          (error: any) => {
            console.error(error);
            rej(error);
          }
        );
      }
    });
  }

  public resumePlay(): Promise<void> {
    return SoundSystem.soundContext.resume();
  }

  private playSound(sound: Sound, time: number = 0) {
    sound.setContext(SoundSystem.soundContext);
    sound.node.connect(SoundSystem.masterGainNode);
    sound.play(time);
  }

  private handleStateChange(e: Event): any {
    if (SoundSystem.soundContext && SoundSystem.soundContext.state !== 'running') {
      this.resumePlay();
    }
    return undefined;
  }
}

//////////////////////////////////////////////////////////////////////////////

/**
 * Load a sound from the server and store it in the sound
 * registry
 * @param name
 */
export const loadSound = (url: string, soundSystem: SoundSystem): Promise<Sound> => {
  return new Promise((resolve, reject) => {
    xhr(url, 'GET')
      .then(response => response.arrayBuffer())
      .then(response => {
        soundSystem.decodeSound(<ArrayBuffer>response).then(
          (b: AudioBuffer) => {
            const sound = new Sound(b);
            sound.buffer = b;
            resolve(sound);
          },
          (err) => {
            reject(err);
          }).catch(e => console.error(e));
      }).catch(e => console.error(e));
  });
};
