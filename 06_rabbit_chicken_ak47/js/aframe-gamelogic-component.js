// this is the complete gamelogic in one component
// using event-set to send messages to this component and it handles the logic
// this approach not good for more complex scenes:
// - the component is specific to this scene and not reusable for others
// - there are better techniques to handle state logic.
// I'd like to cover those in the future.

AFRAME.registerComponent('gamelogic', {
	schema: { // what goes into the component
		state: {type: 'string'}
	},
	init: function () { // this function is called once at the beginning
		this.scene = this.el.sceneEl;
		this.ak47 = document.querySelector('#ak47');
		this.avatar = document.querySelector('#avatar');
		this.chicken = document.querySelector('#chicken');
		this.chickenhitplane = document.querySelector('#chickenhitplane');
		this.followme = document.querySelector('#followme');
		this.heart = document.querySelector('#heart');
		this.killthebeast = document.querySelector('#killthebeast');
		this.loveandpeace = document.querySelector('#loveandpeace');
		this.player = document.querySelector('#player');
		this.platform1 = document.querySelector('#platform1'); // starting point
		this.platform2 = document.querySelector('#platform2'); // heart
		this.platform3 = document.querySelector('#platform3'); // ak47
		this.rabbit = document.querySelector('#rabbit');
		this.track = '#track1';
	},
	update: function (oldData) { // this function is called each time when something is updated
		var raycaster = document.querySelector('[raycaster]').components.raycaster;
		var increaseCounter;
		var playerPosition; // position at rain
		var score;
		var state = this.data.state;
		var parameter, previousState, target;
		if (oldData === {}) { return; }
		previousState = oldData.state;
		console.log("state: " + state + ", previous state: " + previousState);
		this.avatar.setAttribute('sound', "src: #start; autoplay: true");
		// 1. start of the scene, we follow the rabbit
		if (state === 'follow' && previousState !== 'movingended') {
			this.player.setAttribute('sound', "src: #select; autoplay: true");
			this.followme.setAttribute('visible', false);
			this.player.setAttribute('follow', 'target', '#avatar');
			this.rabbit.setAttribute('animation__hop', 'property: position; to: 0 0.3 0; dur: 250; easing: easeInOutSine; loop: true');
			this.rabbit.removeAttribute('event-set__follow');
			this.avatar.setAttribute('alongpath', 'curve: '+this.track+'; dur: 3000');
			this.avatar.setAttribute('event-set__stopfollow', '_event: movingended; _target: #gamelogic; gamelogic.state: stopfollow');
		// 2. the rabbit has reached its destination hovering in mid-air
		} else if (state === 'stopfollow') {
			this.player.setAttribute('sound', 'src: #fall; autoplay: true');
			this.player.removeAttribute('follow');
			this.avatar.removeAttribute('alongpath');
			this.avatar.removeAttribute('event-set__stopfollow');
			this.rabbit.removeAttribute('animation__hop');
			this.track = '#track2';
			this.avatar.setAttribute('alongpath', 'curve: '+this.track+'; delay: 2500; dur: 3000');
			this.avatar.setAttribute('event-set__rabbithasfallen', '_event: movingended; _target: #gamelogic; gamelogic.state: rabbithasfallen');
			// 3. the rabbit has fallen :( the chicken rises
		} else if (state === 'rabbithasfallen') {
			this.avatar.components.sound.stopSound();
			this.avatar.removeAttribute('sound');
			this.player.setAttribute('sound', "src: #rise; autoplay: true");
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
				this.el.setAttribute('gamelogic', 'state: ak47');
			}).bind(this));
			this.heart.setAttribute('class', 'interactive');
			this.heart.addEventListener("click", (function() {
				this.el.setAttribute('gamelogic', 'state: heart');
			}).bind(this));
			raycaster.refreshObjects();
		} else if (state === 'ak47' || state === 'heart') {
			this.player.setAttribute('sound', "src: #select; autoplay: true");
			if (state === 'ak47') {
				// violence begins
				target = this.platform3.getAttribute('position');
				parameters = 'property: position; dur: 2000; easing: easeInOutQuad; to: ' + target.x + ' ' + (target.y + 33) + ' ' + target.z;
				this.player.removeAttribute('animation');
				this.player.setAttribute('animation__toak47', parameters);
				this.player.setAttribute('event-set__playeratak47', '_event: animation__toak47-complete; _target: #gamelogic; gamelogic.state: playeratak47');
			} else if (state === 'heart') {
				target = this.platform2.getAttribute('position');
				parameters = 'property: position; dur: 2000; easing: easeInOutQuad; to: '+target.x+' '+(target.y + 36)+' '+target.z;
				this.player.removeAttribute('animation');
				this.player.setAttribute('animation__toheart', parameters);
				this.player.setAttribute('event-set__playeratheart', '_event: animation__toheart-complete; _target: #gamelogic; gamelogic.state: playeratheart');
			}
			console.log(target);
			// remove all choice elements
			this.heart.parentNode.removeChild(this.heart);
			this.ak47.parentNode.removeChild(this.ak47);
			this.killthebeast.parentNode.removeChild(this.killthebeast);
			this.loveandpeace.parentNode.removeChild(this.loveandpeace);
		} else if (state === 'playeratak47' || state === 'playeratheart') {
			score = 0;
			this.chicken.setAttribute('class', 'interactive');
			increaseCounter = function (event) {
				score = score + 1; // TODO trigger
				console.log(score);
				if (score === 1) {
					this.el.setAttribute('gamelogic', 'state: letitrain')
				}
			}.bind(this);
			this.scene.addEventListener('click', increaseCounter);
			if (state === 'playeratak47') {
				this.player.setAttribute('spawner', { 'mixin': 'bullet', 'on': 'click' });	// TODO change trigger
			} else if (state === 'playeratheart') {
				this.player.setAttribute('spawner', { 'mixin': 'heartbullet', 'on': 'click' });	// TODO change trigger
			}
		} else if (state === 'letitrain') {
			this.player.components.sound.stopSound();
			this.player.removeAttribute('sound');
			this.player.setAttribute('sound', "src: #ending; autoplay: true");
			playerPosition = this.player.getAttribute('position');
			console.log('letitrain');
			console.log(playerPosition.x + ', ' + playerPosition.y + ', ' + playerPosition.z);
			this.scene.removeEventListener('click', increaseCounter);
			this.scene.setAttribute('rain-of-chickens', { tagName: 'a-sphere', center: {x: playerPosition.x, y: (playerPosition.y + 30), z: playerPosition.z} });
		}
	} // end of update()
});
