/* global AFRAME, THREE */

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
        if (typeof value !== "string") { return []; }
        if (value.length === 0) { return []; }
        
        console.log("value: ");
        console.log(`${value}`);
        
        console.log(`typeof value`);
        console.log(typeof value);

        const arr = value.trim().split(',');
        console.log("arr: ");
        console.log(arr);

        const result = [];
        for (let i = 0; i < arr.length; i = i + 1) {
          console.log("adding to result");
          result.push(AFRAME.utils.coordinates.parse(arr[i]));
        }
        console.log(`result:`);
        console.log(result);
        return result;
      }
    }
  },

  init: function () {
    this.startMoveAlong = () => {
      const data = this.data;
      console.log(data);
      const points = this.data.points;
      console.log(`${points}`);
      const threePoints = [];
      this.elapsed = 0;
      for (const p of points) {
        console.log(`p ${p}`);
        threePoints.push(new THREE.Vector3(p.x, p.y, p.z));
      }
      console.log(`before bug`);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
      const curveObject = new THREE.Line(geometry, material);
      this.threeConstructor = THREE['CatmullRomCurve3'];
      this.curve = new this.threeConstructor(threePoints);
      this.animate = true; // curve is initialized
    };
  },

  update: function (oldData) {
    const data = this.data;
    console.log(data);
    const el = this.el;

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
                          console.log(ratio);

    point = curve.getPointAt(ratio);

    el.setAttribute('position', point);
  },

  pause: function () {
  },

  play: function () {
  },

  remove: function () {
    const data = this.data;
    const el = this.el;
    this.animate = false;

    if (data.on != null) {
      el.removeEventListener(data.on, this.eventHandlerFn);
    }
  }

});
