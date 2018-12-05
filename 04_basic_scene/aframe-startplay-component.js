/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Start Play component for A-Frame.
 */
AFRAME.registerComponent('startplay', {
  schema: {
    autohide: { type: 'boolean', default: true },
    autoplay: { type: 'boolean', default: true },
    color: { type: 'string', default: 'black' },
    font: { type: 'asset', default: 'default' },
    media: { type: 'selector' },
    position: { type: 'vec3', default: { x: 0, y: 0, z: 0 } },
    rotation: { type: 'vec3', default: { x: 0, y: 0, z: 0 } },
    size: { type: 'vec2', default: { x: 3, y: 1.5 } },
    text: { type: 'string', default: 'START' },
    textColor: { type: 'string', default: 'white' }
  },

  /**
   * Set if component needs multiple instancing.
   */
  multiple: false,

  createButton (playFunction) {
    const button = document.createElement('a-entity');
    const text = document.createElement('a-text');

    const clickHandler = (event) => {
      playFunction();
      if (this.data.autohide) {
        button.removeEventListener('click', clickHandler);
        button.parentNode.removeChild(button);
      }
    };

    button.setAttribute('geometry', { primitive: 'plane', height: this.data.size.y, width: this.data.size.x });
    button.setAttribute('position', this.data.position);
    button.setAttribute('rotation', this.data.rotation);
    button.setAttribute('material', { color: this.data.color });

    button.setAttribute('text', { value: this.data.text, align: 'center', width: (this.data.size.x * 2 + 2) });
    button.addEventListener('click', clickHandler);
    button.appendChild(text);
    this.sceneEl.appendChild(button);
  },

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function () {
    console.log('startplay: init');

    const el = this.el;
    this.sceneEl = document.querySelector('a-scene');

    const srcEl = document.querySelector(el.getAttribute('src'));
    const soundComponent = el.components.sound;
    let playFunction;

    // determine the video / audio element to play
    // The first option is a user-provided target
    // TODO currently undocumented
    if (this.data.media != null) {
      // 'this' must be bound to an HTMLMediaElement
      playFunction = this.data.media.play.bind(this.data.media);
    } else if (srcEl != null) {
      playFunction = srcEl.play.bind(srcEl);
    } else if (soundComponent != null) {
      playFunction = soundComponent.playSound;
    } else {
      new Error('A-Frame startplay component: cannot identify the medium to play');
    }

    // TODO temporarily log
    if (this.data.autoplay) {
      const autoplay = playFunction();
      if (autoplay != undefined) {
        autoplay.then(_ => {
          // TODO temporarily log
          console.log('startplay component: autoplay works');
        }).catch(error => {
          // TODO temporarily log
          console.log('startplay component: autoplay blocked');
          this.createButton(playFunction);
        });
      }
    } else {
      this.createButton(playFunction);
    }
  },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function (oldData) { },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () { },

  /**
   * Called on each scene tick.
   */
  // tick: function (t) { },

  /**
   * Called when entity pauses.
   * Use to stop or remove any dynamic or background behavior such as events.
   */
  pause: function () { },

  /**
   * Called when entity resumes.
   * Use to continue or add any dynamic or background behavior such as events.
   */
  play: function () { }
});


/***/ })
/******/ ]);