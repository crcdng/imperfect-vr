// this is the complete gamelogic in one component
// we use event-set to send messages to this component and it handles the logic
// this approach is ok for our purpose here, but note that there are better ones:
// - the component is specific to this scene and not reusable for others
// - in practice we would separate it out into several smaller components
//   that can be reused
// - there are more advanced JavaScript techniques to handle complex scene
//   I'd like to cover those in the future.

AFRAME.registerComponent('gamelogic', {
	schema: { // this tells us what goes into the component
		state: {type: 'string'}
	},
	init: function () { // this function is called once at the beginning
		this.ak47 = document.querySelector('#ak47');
		this.avatar = document.querySelector('#avatar');
		this.chicken = document.querySelector('#chicken');
		this.followme = document.querySelector('#followme');
		this.heart = document.querySelector('#heart');
		this.killthebeast = document.querySelector('#killthebeast');
		this.loveandpeace = document.querySelector('#loveandpeace');
		this.player = document.querySelector('#player');
		this.platform2 = document.querySelector('#platform2'); // heart
		this.platform3 = document.querySelector('#platform3'); // ak47
		this.rabbit = document.querySelector('#rabbit');
		this.track = '#track1';
	},
	update: function (oldData) { // this function is called each time when something is updated
		var raycaster = document.querySelector('[raycaster]').components.raycaster;
		var state = this.data.state;
		var parameter;
		if (oldData === {}) { return; }
		var previousState = oldData.state;
		var target;
		console.log("state: " + state + ", previous state: " + previousState);

		// 1. start of the scene, we follow the rabbit
		if (state === 'follow' && previousState !== 'movingended') {
			this.followme.setAttribute('visible', false);
			this.player.setAttribute('follow', 'target', '#avatar');
			this.rabbit.setAttribute('animation__hop', 'property: position; to: 0 0.3 0; dur: 250; easing: easeInOutSine; loop: true');
			this.rabbit.removeAttribute('event-set__follow');
			this.avatar.setAttribute('alongpath', 'curve: '+this.track+'; dur: 3000');
			this.avatar.setAttribute('event-set__stopfollow', '_event: movingended; _target: #gamelogic; gamelogic.state: stopfollow');
		// 2. the rabbit has reached its destination hovering in mid-air
		} else if (state === 'stopfollow') {
			this.player.removeAttribute('follow');
			this.avatar.removeAttribute('alongpath');
			this.avatar.removeAttribute('event-set__stopfollow');
			this.rabbit.removeAttribute('animation__hop');
			this.track = '#track2';
			this.avatar.setAttribute('alongpath', 'curve: '+this.track+'; delay: 4000; dur: 3000');
			this.avatar.setAttribute('event-set__rabbithasfallen', '_event: movingended; _target: #gamelogic; gamelogic.state: rabbithasfallen');
			// 3. the rabbit has fallen :( the chicken rises
		} else if (state === 'rabbithasfallen') {
			this.avatar.removeAttribute('alongpath');
			this.avatar.removeAttribute('event-set__rabbithasfallen');
			this.rabbit.setAttribute('visible', false);
			this.chicken.setAttribute('animation__pos', 'property: position; dur: 14000; easing: easeInSine; to: 0 0 -550');
			this.chicken.setAttribute('animation__rot', 'property: rotation; dur: 14000; easing: easeInSine; to: 0 -17 0');
			this.chicken.setAttribute('event-set__chickenhasrisen', '_event: animation__rot-complete; _target: #gamelogic; gamelogic.state: chickenhasrisen');
			// 4. how to deal with the threatening chicken - we have two choices
		} else if (state === 'chickenhasrisen') {
			this.chicken.removeAttribute('animation__pos');
			this.chicken.removeAttribute('animation__rot');
			this.chicken.removeAttribute('event-set__movingend');
			this.killthebeast.setAttribute('visible', true);
			this.loveandpeace.setAttribute('visible', true);
			this.ak47.setAttribute('class', 'interactive');
			this.ak47.addEventListener("click", (function() {
				console.log('click on ak47');
				this.el.setAttribute('gamelogic', 'state: ak47');
			}).bind(this));
			this.heart.setAttribute('class', 'interactive');
			this.heart.addEventListener("click", (function() {
				console.log('click on heart');
				this.el.setAttribute('gamelogic', 'state: heart');
			}).bind(this));
			raycaster.refreshObjects();
		} else if (state === 'ak47' || state === 'heart') {
			if (state === 'ak47') {
				target = this.platform3.getAttribute('position');
				parameters = 'property: position; dur: 2000; easing: easeInOutQuad; to: '+target.x+' '+(target.y + 33)+' '+target.z;
			} else if (state === 'heart') {
				target = this.platform2.getAttribute('position');
				parameters = 'property: position; dur: 2000; easing: easeInOutQuad; to: '+target.x+' '+(target.y + 36)+' '+target.z;
			}
			console.log(target);
			// stop the animation
			this.player.removeAttribute('animation');
			this.player.setAttribute('animation', parameters);
			// remove all choice elements
			this.heart.parentNode.removeChild(this.heart);
			this.ak47.parentNode.removeChild(this.ak47);
			this.killthebeast.parentNode.removeChild(this.killthebeast);
			this.loveandpeace.parentNode.removeChild(this.loveandpeace);
		}
	} // end of update()
});
