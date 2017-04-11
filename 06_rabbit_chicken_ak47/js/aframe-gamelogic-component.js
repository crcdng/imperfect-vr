// this is the complete gamelogic in one component
// we use event-set to send messages to this component and it handles the logic
// it is ok for our purpose here
// it is specific to this scene and not reusable for others
// in practice we would separate it out into several smaller components that can be reused

AFRAME.registerComponent('gamelogic', {
	schema: {
		state: {type: 'string'}
	},
	init: function () {
		this.player = document.querySelector('#player');
		this.followme = document.querySelector('#followme');
		this.avatar = document.querySelector('#avatar');
		this.rabbit = document.querySelector('#rabbit');
		this.track = '#track1';
	},
	update: function (oldData) {
		var state = this.data.state;
		var previousState = oldData.state;
		if (oldData === {}) { return; }
		console.log("state: " + state);
		console.log("previous state: " + previousState);

		// # 1. scene follow the rabbit

		// when we "click" on the rabbit by looking at it:
		// we attach the follow component
		// the "follow me" text gets invisible
		// the rabbit starts hopping
		// the rabbit starts moving along its path (alongpath/curve component)
		if (state === 'follow' && previousState !== 'movingended') {
			this.followme.setAttribute('visible', false);
			this.player.setAttribute('follow', 'target', '#avatar');
			this.rabbit.setAttribute('animation__hop', 'property: position; to: 0 0.3 0; dur: 250; easing: easeInOutSine; loop: true');
			this.avatar.setAttribute('alongpath', 'curve: '+this.track+'; dur: 3000');
		}
		// when the rabbit is done:
		// we stop following it
		// the rabbit stops hopping
		// the rabbit hovers in mid air before falling down
		// at the end it gets invisible
		if (state === 'movingended') {
			if (this.track === '#track1') {
				this.player.removeAttribute('follow');
				this.avatar.removeAttribute('alongpath');
				this.rabbit.removeAttribute('animation__hop');
				this.track = '#track2';
				this.avatar.setAttribute('alongpath', 'curve: '+this.track+'; delay: 4000; dur: 3000');
			} else if (this.track === '#track2') {
				this.rabbit.setAttribute('visible', false);
			}
		}
	}
});
