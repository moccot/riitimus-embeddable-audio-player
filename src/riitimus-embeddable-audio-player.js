/**
 * @copyright 2023 Tarcísio J. S. Rodrigues <justother94@gmail.com>
 * @license GNU-GPL-3.0
 */

/**
 * RiitimusEmbeddableAudioPlayer class.
 */
class RiitimusEmbeddableAudioPlayer {
    /**
     * Creates a new RiitimusEmbeddableAudioPlayer instance.
     * 
     * @param { { audio: string, coverImage: string }[] | string } srcs
     * A list containing all sources to audios and cover images.
     * Optionally you can provide a string with the source to
     * the audio only, as its the cover image source is not mandatory.
     */
    constructor(srcs) {
        /**
         * The current audio that is being played.
         * @type { HTMLAudioElement | null }
         * @default
         */
        this._currentAudio = null;

        /**
         * The current audio's cover image.
         * @type { HTMLImageElement | null }
         * @default
         */
        this._currentAudioCoverImage = null;

        /**
         * The current audio's title
         * @type { string | null }
         * @default
         */
        this._currentAudioTitle = null;

        this._srcs = srcs;
    }

    /**
     * Sets the current audio by index.
     * @param { number } index - The index of the audio in the srcs list.
     */
    setCurrentAudio(index) {
        let audioSrcFromSrcs = this._srcs[index];
        let audioSrc = null;

        if (typeof audioSrcFromSrcs === 'string') audioSrc = audioSrcFromSrcs;
        else audioSrc = audioSrcFromSrcs.audio;

        this._currentAudio = new Audio(audioSrc);
        this._currentAudio.addEventListener('canplay', () => {
            this._playAudio();
        });
    }

    /**
     * Starts the current audio's playback.
     */
    _playAudio() {
        this._currentAudio.play();
    }

    /**
     * Pauses the current audio's playback.
     */
    _pauseAudio() {
        this._currentAudio.pause();
    }

    /**
     * Plays or pauses the audio, depending on its paused property.
     */
    _toggleAudioPlayback() {
        let currentAudioIsPaused = this._currentAudio.paused

        if (currentAudioIsPaused) this._playAudio();
        else this._pauseAudio();
    }
}
