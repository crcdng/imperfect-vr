AFRAME.registerComponent('navigate-to', {
  // Define component properties.
  schema: {
    on: { type: 'string' }, // alternative: { default: 'click' }
  	to: { type: 'string' }
  },
  init: function () {
	 this.el.addEventListener(this.data.on, function () {
	  var data = this.data;
	  var newUrl = data.to + "/";
    window.location.href = newUrl;
    }.bind(this));
  }
});
