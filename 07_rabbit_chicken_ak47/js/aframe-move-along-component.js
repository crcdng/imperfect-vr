/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Minimal Move-along Component for A-Frame.
 */
AFRAME.registerComponent('move-along', {
  schema: {
    delay: { default: 0 },
    dur: { default: 1000 },
    loop: { default: false },
    on: { default: '' },
    points: {
      default: [],
      parse: function (value) {
        if (value == null) { throw Error('move-along: path is null'); }
        var arr = value.trim().split(',');
        var result = [];
        var i;

        for (i = 0; i < arr.length; i = i + 1) {
          result.push(AFRAME.utils.coordinates.parse(arr[i]));
        }
        return result;
      }
    }
  },

  init: function () {
    this.startMoveAlong = (function () {
      var points = this.data.points;
      var threePoints = [];
      var i;
      this.elapsed = 0;
      for (i = 0; i < points.length; i = i + 1) {
        threePoints.push(new THREE.Vector3(points[i].x, points[i].y, points[i].z));
      }
      this.threeConstructor = THREE['CatmullRomCurve3'];
      this.curve = new this.threeConstructor(threePoints);
      this.animate = true; // curve is initialized
    }).bind(this);
  },

  update: function (oldData) {
    var data = this.data;
    var el = this.el;

    // if the event handler has been changed set the new one
    if (oldData.on != null && data.on !== oldData.on) {
      el.removeEventListener(oldData.on, this.startMoveAlong);
    }
    if (data.on != null && data.on !== '') {
      el.addEventListener(data.on, this.startMoveAlong);
    } else { // directly start to move
      this.startMoveAlong();
    }
  },

  tick: function (time, delta) {
    var el = this.el;
    var curve = this.curve;
    var delay = this.data.delay;
    var duration = this.data.dur;
    var loop = this.data.loop;
    var point, ratio;

    if (this.animate == null || this.animate === false) { return; }
    this.elapsed = this.elapsed + delta;
    if (this.elapsed < delay) { return; }
    if (this.elapsed > delay + duration) {
      el.setAttribute('position', curve.points[curve.points.length - 1]);
      el.emit('move-along-end');
      if (loop === false) {
        this.animate = false;
      } else {
        this.elapsed = 0;
      }
      return;
    }
    ratio = (this.elapsed - delay) / duration;
    point = curve.getPointAt(ratio);
    el.setAttribute('position', point);
  },

  pause: function () {
  },

  play: function () {
  },

  remove: function () {
    var data = this.data;
    var el = this.el;
    this.animate = false;

    if (data.on != null) {
      el.removeEventListener(data.on, this.eventHandlerFn);
    }
  }

});
