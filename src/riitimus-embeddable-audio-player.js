/**
 * @copyright 2023 Tarcísio J. S. Rodrigues <justother94@gmail.com>
 * @license GNU-GPL-3.0
 */

/**
 * @typedef RiitimusEmbeddableAudioPlayerSrcStructure
 * @property { string } audio - The source to the audio.
 * @property { string } coverImage - The source to the audio's cover image.
 */

/**
 * RiitimusEmbeddableAudioPlayerElement class.
 */
class RiitimusEmbeddableAudioPlayerElement {
    /**
     * Creates a new RiitimusEmbeddableAudioPlayerElement instance.
     * @param { string } htmlTag - The tag of the element to be created.
     * @param { Object } attributes - The attributes to be set to the element.
     */
    constructor(htmlTag, attributes) {
        /**
         * The created html element.
         * @type { HTMLElement }
         */
        this.htmlElement = document.createElement(htmlTag);

        /**
         * The child elements of the created element.
         * @type { Object }
         */
        this.children = {};

        /**
         * A list containing all the event listeners set to the created element.
         * @type { { event: string, callback: Function }[] }
         */
        this._eventListeners = [];

        for (let attribute in attributes) {
            this.htmlElement.setAttribute(attribute, attributes[attribute]);
        }
    }

    /**
     * Removes all added event listeners from the created element.
     */
    removeEventListeners() {
        for (let eventListenerData of this._eventListeners) {
            this.htmlElement.removeEventListener(eventListenerData.event, eventListenerData.callback);
        }
    }

    /**
     * Sets the created element's innerText property.
     * @param { string } text - The new value for the created element's innerText property.
     * @returns this, for chainability.
     */
    setText(text) {
        this.htmlElement.innerText = text;

        return this;
    }

    /**
     * Adds a child element to the created element.
     * @param { string } name - The name of the child element for indexing it in the children list.
     * @param { RiitimusEmbeddableAudioPlayerElement } child - The child element to be added.
     * @returns this, for chainability.
     */
    addChild(name, child) {
        this.children[name] = child;
        this.htmlElement.appendChild(child.htmlElement);

        return this;
    }

    /**
     * Adds an event listener to the created element.
     * @param { string } event - The name of the event to be added.
     * @param { Function } callback - The event's callback.
     * @returns this, for chainability.
     */
    on(event, callback) {
        this._eventListeners.push({ event, callback });

        this.htmlElement.addEventListener(event, callback);

        return this;
    }
}

/**
 * RiitimusEmbeddableAudioPlayer class.
 */
class RiitimusEmbeddableAudioPlayer {
    /**
     * Creates a new RiitimusEmbeddableAudioPlayer instance.
     * 
     * @param { RiitimusEmbeddableAudioPlayerSrcStructure[] | string } srcs
     * A list containing all the sources to audios and cover images.
     * Optionally you can provide a string with the source to
     * the audio only, as its the cover image source is not mandatory.
     */
    constructor(srcs) {
        /**
         * The current audio that is being played.
         * @type { HTMLAudioElement }
         * @default
         */
        this._currentAudio = this._createElement({ tag: 'audio' });

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

        /**
         * A list containg all the sources to audios and cover images.
         * @type { RiitimusEmbeddableAudioPlayerSrcStructure[] }
         */
        this._srcs = srcs;

        this._elements = {};

        this._mount();
    }

    /**
     * Creates a new RiitimusEmbeddableAudioPlayerElement instance.
     * @param { { tag: string, attributes: Object, children: { name: string, tag: string, attributes: Object }[] } } options 
     * @returns { RiitimusEmbeddableAudioPlayerElement }
     */
    _createElement(options) {
        let element = new RiitimusEmbeddableAudioPlayerElement(options.tag, options.attributes);

        if (options.children && options.children.length > 0) for (let childElementOption of options.children) {
            let childElement = this._createElement(childElementOption);

            element.addChild(childElementOption.name, childElement);
        }

        return element;
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

    /**
     * Mounts the player in the page
     */
    _mount() {
        /**
         * Creates a new RiitimusEmbeddableAudioPlayerElement instance representing an icon.
         * @param { string } iconName - The name of the icon in Google Fonts Icons.
         * @returns { RiitimusEmbeddableAudioPlayerElement }
         */
        const createIcon = iconName => {
            return this._createElement({ tag: 'span', attributes: { class: 'material-symbols-rounded' } }).setText(iconName);
        }

        let container = document.getElementById('riitimus-embeddable-audio-player-container');

        this._elements.audioCoverImageContainer = this._createElement({
            tag: 'div',

            attributes: {
                class: 'audio-cover-image-container',
            },

            children: [
                {
                    name: 'audioCoverImage',
                    tag: 'img',
                    attributes: {
                        class: 'audio-cover-image'
                    }
                }
            ]
        });

        this._elements.audioTitle = this._createElement({
            tag: 'span',
            attributes: {
                class: 'audio-title'
            }
        });

        this._elements.audioVolumeControls = this._createElement({
            tag: 'div',
            attributes: {
                class: 'audio-volume-controls'
            },
            children: [
                {
                    name: 'audioVolumeBar',
                    tag: 'input',
                    attributes: {
                        class: 'audio-volume-bar',
                        type: 'range'
                    }
                },
                {
                    name: 'audioVolumeMuteControl',
                    tag: 'button',
                    attributes: {
                        class: 'audio-volume-mute-control'
                    }
                }
            ]
        });

        this._elements.audioControls = this._createElement({
            tag: 'div',
            attributes: {
                class: 'audio-controls'
            },
            children: [
                {
                    name: 'audioPlaybackProgressControl',
                    tag: 'input',
                    attributes: {
                        class: 'audio-playback-progress-control',
                        type: 'range'
                    }
                },
                {
                    name: 'audioSkipPreviousControl',
                    tag: 'button',
                    attributes: {
                        class: 'audio-skip-previous-control'
                    }
                },
                {
                    name: 'audioTogglePlaybackControl',
                    tag: 'button',
                    attributes: {
                        class: 'audio-toggle-playback-control'
                    }
                },
                {
                    name: 'audioSkipNextControl',
                    tag: 'button',
                    attributes: {
                        class: 'audio-skip-next-control'
                    }
                }
            ]
        });

        for (let index in this._elements) {
            let element = this._elements[index];

            if (index === 'audioVolumeControls') element.children.audioVolumeMuteControl.addChild('icon', createIcon('volume_up'));

            else if (index === 'audioControls') {
                element.children.audioSkipPreviousControl.addChild('icon', createIcon('skip_previous'));
                
                element.children.audioTogglePlaybackControl.addChild('playIcon', createIcon('play_arrow'))
                element.children.audioTogglePlaybackControl.addChild('pauseIcon', createIcon('pause'));

                element.children.audioSkipNextControl.addChild('icon', createIcon('skip_next'));
            }

            container.appendChild(element.htmlElement);
        }
    }
}
