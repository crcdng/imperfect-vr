// https://aframe.io/docs/0.5.0/guides/writing-a-component.html
AFRAME.registerComponent('gamelogic', {
	schema: {
		state: {type: 'string'}
	},
	init: function () {
	},
	update: function (x) {
		console.log('gamelogic property set: ');
		console.log(this.data.state);
	}
});
