// this is the complete gamelogic in one component
// we use event-set to send messages to this component and it handles the logic
// it is ok for our purpose here
// it is specific to this scene and not reusable for others
// in practice we would separate it out into several smaller components that can be reused

AFRAME.registerComponent('gamelogic', {
	schema: { // this tells us what goes into the component
		state: {type: 'string'}
	},
	init: function () { // this function is called once
		this.ak47 = document.querySelector('#ak47');
		this.avatar = document.querySelector('#avatar');
		this.chicken = document.querySelector('#chicken');
		this.followme = document.querySelector('#followme');
		this.heart = document.querySelector('#heart');
		this.killthebeast = document.querySelector('#killthebeast');
		this.loveandpeace = document.querySelector('#loveandpeace');
		this.player = document.querySelector('#player');
		this.rabbit = document.querySelector('#rabbit');
		this.track = '#track1';
	},
	update: function (oldData) { // this function is called when something is updated
		var raycaster = document.querySelector('[raycaster]').components.raycaster;
		var state = this.data.state;
		var previousState = oldData.state;
		if (oldData === {}) { return; }
		console.log("state: " + state);
		console.log("previous state: " + previousState);

		if (state === 'follow' && previousState !== 'movingended') {
			this.followme.setAttribute('visible', false);
			this.player.setAttribute('follow', 'target', '#avatar');
			this.rabbit.setAttribute('animation__hop', 'property: position; to: 0 0.3 0; dur: 250; easing: easeInOutSine; loop: true');
			this.rabbit.removeAttribute('event-set__follow');
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
			this.chicken.setAttribute('event-set__movingend', '_event: animation__rot-complete; _target: #gamelogic; gamelogic.state: chickenmovingend');
		} else if (state === 'chickenmovingend') {
			console.log("chicken end");
			this.killthebeast.setAttribute('visible', true);
			this.loveandpeace.setAttribute('visible', true);
			this.ak47.setAttribute('class', 'interactive');
			this.heart.setAttribute('class', 'interactive');
			raycaster.refreshObjects();
		}
	}
});
