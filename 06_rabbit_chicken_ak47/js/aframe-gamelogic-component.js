AFRAME.registerComponent('gamelogic', {
	stuff: {},
	schema: {
		state: {type: 'string'}
	},
	init: function () {
		this.stuff.player = document.querySelector('#player');
		this.stuff.followme = document.querySelector('#followme');
		// this.stuff.avatar = document.querySelector('#avatar');
	},
	update: function (oldData) {
		var state = this.data.state;
		// if (oldData === {}) { return; }

		if (state === 'follow') {
			console.log(this.data.state);
			this.stuff.followme.setAttribute('visible', false);
			this.stuff.player.setAttribute('follow', 'target', '#avatar');
		}
		if (state === 'unfollow') {
			console.log(this.data.state);
			this.stuff.followme.setAttribute('visible', true);
			this.stuff.player.removeAttribute('follow');
		}
	}
});
