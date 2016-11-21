AFRAME.registerComponent('click-listener', {
  init: function () {
    window.addEventListener('click', () => {
      this.el.emit('click', null, false);
    });
  }
});
