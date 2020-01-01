AFRAME.registerComponent('click-to-shoot', {
  init: function () {
    document.body.addEventListener('mousedown', () => { this.el.emit('shoot'); });
  }
});

AFRAME.registerComponent('hit-handler', {

  init: function () {
    var el = this.el;

    el.addEventListener('hit', () => {
      console.log('hit');
    });

    el.addEventListener('die', () => {
      console.log('dead');
    });
  }
});