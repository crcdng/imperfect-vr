/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	if (typeof AFRAME === 'undefined') {
	    throw new Error('Component attempted to register before AFRAME was available.');
	}

	/**
	 * Alongpath component for A-Frame.
	 * Move Entities along a predefined path
	 */
	AFRAME.registerComponent('alongpath', {
	    schema: {
	        path: {default: ''},
	        closed: {default: false},
	        dur: {default: 1000},
	        delay: {default: 2000},
	        loop: {default: false},
	        inspect: {default: false}
	    },

	    init: function () {
	        this.initialPosition = this.el.getAttribute("position");
	    },

	    update: function (oldData) {

	        // Only restart following the path when
	        // Path-Data has been changed.
	        if (!oldData.path || oldData.path != this.data.path) {
	            // Create Curve from Path
	            this.createCurve();
	        }

	        // Create/Update Debug-Visuals when needed or
	        // remove Debug-Visuals when disabled
	        if (this.data.inspect) {

	            if (!oldData.inspect || oldData.inspect === false) {
	                this.inspectorElementChanged = this.inspectorElementChanged.bind(this);

	                // Add Elements to visualize the Path
	                // and allow for path editing in the
	                // A-Frame Inspector
	                this.createInspectorElements();
	            }

	            this.drawCurveLine();

	        } else if (oldData.inspect === true) {
	            this.removeInspectorElements();
	        }

	    },

	    createCurve: function () {
	        this.pathpoints = this.data.path.split(' ').map(function (p) {
	            p = p.split(',');
	            return new THREE.Vector3(
	                parseFloat(p[0]),
	                parseFloat(p[1]),
	                parseFloat(p[2])
	            );
	        });

	        var curve = new THREE.CatmullRomCurve3(this.pathpoints);
	        curve.closed = this.data.closed;

	        this.curve = curve;

	        // Reset to initial state
	        this.interval = 0;
	        this.el.removeState("endofpath");
	    },

	    tick: function (time, timeDelta) {

	        // Only update position if we didn't reach
	        // the end of the path
	        if (!this.el.is("endofpath")) {
	            this.interval = this.interval + timeDelta;

	            var i = 0;

	            if (this.interval - this.data.delay >= this.data.dur) {
	                // Time is up, we should be at the end of the path
	                i = 1;
	            } else if ((this.interval - this.data.delay < 0)) {
	                // We are still waiting for the delay-time to finish
	                // so keep entity at the beginning of the path
	                i = 0;
	            } else {
	                // Update path position based on timing
	                i = (this.interval - this.data.delay) / this.data.dur;
	            }

	            try {
	                if ((this.data.loop === false) && i >= 1) {
	                    // We have reached the end of the path and are not going
	                    // to loop back to the beginning therefore set final state
	                    this.el.removeState("moveonpath");
	                    this.el.addState("endofpath");

	                    // Set the end-position
	                    if (this.data.closed) {
	                        this.el.setAttribute('position', this.curve.points[0]);
	                    } else {
	                        this.el.setAttribute('position', this.curve.points[this.curve.points.length - 1]);
	                    }
	                } else if ((this.data.loop === true) && i >= 1) {
	                    // We have reached the end of the path
	                    // but we are looping through the curve,
	                    // so restart here.
	                    this.interval = this.data.delay;
	                } else {
	                    // We are somewhere in the middle of the path
	                    // updating position
	                    var p = this.curve.getPoint(i);
	                    this.el.setAttribute('position', p);
	                    if (!this.el.is("moveonpath")) {
	                        this.el.addState("moveonpath");
	                    }
	                }
	            } catch (ex) {
	            }
	        }
	    },

	    remove: function () {
	        this.el.setAttribute("position", this.initialPosition);

	        this.removeInspectorElements();
	    },

	    createInspectorElements: function() {
	        this.removeInspectorElements();

	        var debugRootElement = document.querySelector(".alongpath-debug-root");

	        if (!debugRootElement) {
	            var debugRoot = document.createElement("a-entity");
	            debugRootElement = this.el.sceneEl.appendChild(debugRoot);
	            debugRootElement.setAttribute("class", "alongpath-debug-root");
	        }

	        this.inspectorRootElement = debugRootElement;

	        this.inspectorElements = new Array();

	        for (var i = 0; i < this.pathpoints.length; i++) {
	            var pathPoint = document.createElement("a-box");
	            var pathPointEl = this.inspectorRootElement.appendChild(pathPoint);

	            AFRAME.utils.entity.setComponentProperty(pathPointEl, "position", AFRAME.utils.coordinates.stringify(this.pathpoints[i]));
	            AFRAME.utils.entity.setComponentProperty(pathPointEl, "width", 0.1);
	            AFRAME.utils.entity.setComponentProperty(pathPointEl, "height", 0.1);
	            AFRAME.utils.entity.setComponentProperty(pathPointEl, "depth", 0.1);
	            AFRAME.utils.entity.setComponentProperty(pathPointEl, "color", "red");
	            pathPointEl.setAttribute("class", "alongpath-debug");
	            pathPointEl.setAttribute("visible", true);

	            pathPointEl.addEventListener("componentchanged", this.inspectorElementChanged);

	            this.inspectorElements.push(pathPointEl);
	        }

	        // First add a line
	        this.drawCurveLine();
	    },

	    drawCurveLine: function() {
	        if (this.inspectorCurve) {
	            this.inspectorCurve.parentNode.removeChild(this.inspectorCurve);
	        }

	        var lineEntity = document.createElement("a-entity");
	        var lineEntityEl = this.inspectorRootElement.appendChild(lineEntity);

	        var lineMaterial = new THREE.LineBasicMaterial({
	            color: "red"
	        });

	        var lineGeometry = new THREE.Geometry();
	        lineGeometry.vertices = this.curve.getPoints(this.pathpoints.length * 10);

	        lineEntityEl.setObject3D('mesh', new THREE.Line(lineGeometry, lineMaterial));

	        lineEntityEl.setAttribute("className", "alongpath-debug");
	        lineEntityEl.setAttribute("visible", true);

	        this.inspectorCurve = lineEntityEl;
	    },

	    removeInspectorElements: function() {
	        // Remove the Inspector-Boxes
	        if(this.inspectorElements) {
	            for (var i = 0; i < this.inspectorElements.length; i++) {
	                this.inspectorElements[i].parentNode.removeChild(this.inspectorElements[i]);
	            }
	        }

	        // Remove the curve
	        if(this.inspectorCurve) {
	            this.inspectorCurve.parentNode.removeChild(this.inspectorCurve);
	        }

	        // Remove also the Root Element if it has
	        // no more children
	        if (this.inspectorRootElement) {
	            if(!this.inspectorRootElement.childNodes || this.inspectorRootElement.childNodes.length == 0) {
	                if (this.inspectorRootElement.parentNode) {
	                    this.inspectorRootElement.parentNode.removeChild(this.inspectorRootElement);
	                }
	                this.inspectorRootElement = null;
	            }
	        }

	        this.inspectorElements = null;
	        this.inspectorCurve = null;
	    },

	    inspectorElementChanged: function(e) {
	        var newPathPoints = new Array();

	        for (var i = 0; i < this.inspectorElements.length; i++) {
	            if (this.inspectorElements[i].components.position.attrValue) {
	                newPathPoints.push(this.inspectorElements[i].components.position.attrValue.x
	                    + "," + this.inspectorElements[i].components.position.attrValue.y
	                    + "," + this.inspectorElements[i].components.position.attrValue.z
	                );
	            }
	        }

	        var newPath = newPathPoints.join(" ");

	        if (newPath != "" && newPath != this.data.path) {
	            AFRAME.utils.entity.setComponentProperty(this.el, "alongpath.path", newPath);
	        }
	    }
	});

/***/ }
/******/ ]);