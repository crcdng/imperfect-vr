// from A-Frame physics system, by Don McCurdy

AFRAME.registerComponent('rain-of-entities', {
  schema: {
    tagName:    { default: 'a-box' },
    center: { type: 'vec3' },
    components: { default: ['dynamic-body', 'force-pushable', 'color|#39BB82'] },
    maxCount:   { default: 10, min: 0 },
    interval:   { default: 1000, min: 0 },
    lifetime:   { default: 10000, min: 0 }
  },
  init: function () {
    this.boxes = [];
    this.timeout = setInterval(this.spawn.bind(this), this.data.interval);
  },
  spawn: function () {
    if (this.boxes.length >= this.data.maxCount) {
      clearTimeout(this.timeout);
      return;
    }

    var data = this.data,
        box = document.createElement(data.tagName);

    this.boxes.push(box);
    this.el.appendChild(box);

    box.setAttribute('position', this.randomPosition());
    data.components.forEach(function (s) {
      var parts = s.split('|');
      box.setAttribute(parts[0], parts[1] || '');
    });

    // Recycling is important, kids.
    setInterval(function () {
      if (box.body.position.y > 0) return;
      box.body.position.copy(this.randomPosition());
      box.body.velocity.set(0,0,0);
    }.bind(this), this.data.lifetime);
  },
  randomPosition: function () {
    return { x: this.data.center.x + (Math.random() * 10 - 5), y: this.data.center.y, z: this.data.center.z + (Math.random() * 10 - 5) };
  }
});
