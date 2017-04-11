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
		this.chicken = document.querySelector('#chicken');
		this.track = '#track1';
	},
	update: function (oldData) {
		var state = this.data.state;
		var previousState = oldData.state;
		if (oldData === {}) { return; }
		console.log("state: " + state);
		console.log("previous state: " + previousState);

		// # 1. scene follow the rabbit

		if (state === 'follow' && previousState !== 'movingended') {
			this.followme.setAttribute('visible', false);
			this.player.setAttribute('follow', 'target', '#avatar');
			this.rabbit.setAttribute('animation__hop', 'property: position; to: 0 0.3 0; dur: 250; easing: easeInOutSine; loop: true');
			this.avatar.setAttribute('alongpath', 'curve: '+this.track+'; dur: 3000');
			this.avatar.setAttribute('event-set__hoppingend', '_event: movingended; _target: #gamelogic; gamelogic.state: hoppingend');
		} else if (state === 'hoppingend') {
			console.log("hopping end");
			this.player.removeAttribute('follow');
			this.avatar.removeAttribute('alongpath');
			this.avatar.removeAttribute('event-set__hoppingend');
			this.rabbit.removeAttribute('animation__hop');
			this.track = '#track2';
			this.avatar.setAttribute('alongpath', 'curve: '+this.track+'; delay: 4000; dur: 3000');
			this.avatar.setAttribute('event-set__fallingend', '_event: movingended; _target: #gamelogic; gamelogic.state: fallingend');
		} else if (state === 'fallingend') {
			console.log("falling end");
			this.avatar.removeAttribute('event-set__fallingend');
			this.rabbit.setAttribute('visible', false);
			this.chicken.setAttribute('animation__pos', 'property: position; dur: 14000; easing: easeInSine; to: 0 0 -550');
			this.chicken.setAttribute('animation__rot', 'property: rotation; dur: 14000; easing: easeInSine; to: 0 -17 0');
		}
	}
});
