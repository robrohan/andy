export declare class Sound {
    buffer: AudioBuffer;
    loop: boolean;
    isInContext: boolean;
    isPlaying: boolean;
    isMusic: boolean;
    constructor(buffer: AudioBuffer);
    private source;
    private volume;
    private panner;
    setContext(context: AudioContext): void;
    get node(): AudioNode | undefined;
    play(time?: number): void;
    stop(): void;
}
export declare class SoundSystemOptions {
}
export declare class SoundSystem {
    static addSoundToContext(context: AudioContext, sound: Sound): void;
    static soundContext: AudioContext;
    static masterGainNode: GainNode;
    constructor(settings: SoundSystemOptions);
    reboot(): void;
    adjustVolume(by: number): void;
    play(sound: Sound, loop?: boolean, time?: number): void;
    decodeSound(data: ArrayBuffer): Promise<AudioBuffer>;
    resumePlay(): Promise<void>;
    private playSound;
    private handleStateChange;
}
export declare const loadSound: (url: string, soundSystem: SoundSystem) => Promise<Sound>;
