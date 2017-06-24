// adapted from A-Frame physics system, Don McCurdy

AFRAME.registerComponent('rain-of-chickens', {
  schema: {
    tagName: { default: 'a-box' },
    components: { default: ['dynamic-body|shape: box', 'collada-model|#mod_chick'] },
    center: {type: 'vec3'},
    maxCount: { default: 10, min: 0 },
    interval: { default: 1000, min: 0 },
    lifetime: { default: 10000, min: 0 }
  },

  init: function () {
    this.entities = [];
    this.timeout = setInterval(this.spawn.bind(this), this.data.interval);
  },

  spawn: function () {
    var data, ent, parts;

    if (this.entities.length >= this.data.maxCount) {
      clearTimeout(this.timeout);
      return;
    }

    data = this.data;
    ent = document.createElement('a-entity');

    this.entities.push(ent);

    ent.setAttribute('position', this.randomPosition());
    data.components.forEach(function (c) {
      parts = c.split('|');
      ent.setAttribute(parts[0], parts[1] || '');
    });

    this.el.appendChild(ent);

    // Recycling is important, kids.
    setInterval(function () {
      if (ent.body.position.y > 0) return;
      ent.body.position.copy(this.randomPosition());
      ent.body.velocity.set(0, 0, 0);
    }.bind(this), this.data.lifetime);
  },

  randomPosition: function () {
    return { x: this.data.center.x + (Math.random() * 10 - 5), y: this.data.center.y, z: this.data.center.z + (Math.random() * 10 - 5) };
  }
});
