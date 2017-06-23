// this is the complete gamelogic in one component
// the elements in the scene use the event-set component to send messages to it
// and it handles the logic

// this approach would not work well for more complex scenes
// (image hundreds of states)
// there are better techniques to handle state logic
// also this component is specific to this scene and not reusable for others

// two helper functions

// construct a lerp-ed path with sinusodial movement on y.
// assume start.y === target.y
// returns an array of points [{x: x0, y: y0, z: z0}, ...]
function createJumpPath (startPos, endPos, points = 10, maxHeight = 11.5) {
  var path = [];
	var i, step, stepY, x, y, z;
	if (points == null) { point}
  for (i = 0; i <= points; i = i + 1) {
    step = i / points;
    stepY = (i / points) * Math.PI;
    x = startPos.x + step * (endPos.x - startPos.x);
    y = startPos.y + Math.sin(stepY) * maxHeight;
    z = startPos.z + step * (endPos.z - startPos.z);
    path.push({x: x, y: y, z: z});
  }
  return path;
}

function createCurveEntityFromJumpPath (id, arrayOfPoints) {
  var curveEntity = document.createElement('a-curve');
	var curvepoint, i, point;

	curveEntity.setAttribute('id', id);
  for (i = 0; i < arrayOfPoints.length; i = i + 1) {
		point = arrayOfPoints[i];
    curvePoint = document.createElement('a-curve-point');
    curvePoint.setAttribute('position', `${point.x} ${point.y} ${point.z}`);
    curveEntity.appendChild(curvePoint);
  }
  return curveEntity;
}


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
		this.states = { start: "start", follow: "follow", stopfollow: "stopfollow", rabbithasfallen: "rabbithasfallen",
			chickenhasrisen: "chickenhasrisen", ak47selected: "ak47selected", heartselected: "heartselected",
			atak47: "atak47", atheart: "atheart", letitrain: "letitrain" };
		this.state = this.data.state || this.states.start;
		this.previousState = null;
	},
	update: function (oldData) { // this function is called each time when something is updated
		var raycaster = document.querySelector('[raycaster]').components.raycaster;
		var increaseCounter;
		var playerPosition; // position at rain
		var score;
		var parameter, target;

		this.state = this.data.state;
		console.log("state: " + this.state);
		this.avatar.setAttribute('sound', "src: #start; autoplay: true");

		// 1. we follow the rabbit
		if (this.state === this.states.follow) {
			this.player.setAttribute('sound', "src: #select; autoplay: true");
			this.followme.setAttribute('visible', false);
			this.player.setAttribute('follow', 'target', '#avatar');
			this.rabbit.setAttribute('animation__hop', 'property: position; to: 0 0.3 0; dur: 250; easing: easeInOutSine; loop: true');
			this.rabbit.removeAttribute('event-set__follow');
      this.avatar.setAttribute('move-along', 'dur: 3000; points: 0 72.5 6.15, 0 72.5 4.15, 0 72.5 0.15, 0 72.5 -4.15, 0 72.5 -12.15, 0 74 -18.15;');
      this.avatar.setAttribute('event-set__stopfollow', '_event: move-along-end; _target: #gamelogic; gamelogic.state: ' + this.states.stopfollow);

		// 2. the rabbit has reached its destination hovering in mid-air
		} else if (this.state === this.states.stopfollow) {
			this.player.setAttribute('sound', 'src: #fall; autoplay: true');
			this.player.removeAttribute('follow');
			this.avatar.removeAttribute('move-along');
			this.avatar.removeAttribute('event-set__stopfollow');
			this.rabbit.removeAttribute('animation__hop');
      this.avatar.setAttribute('move-along', 'delay: 2500; dur: 3000; points: 0 74 -18.15, 0 62 -18, 0 31 -18.15, 0 -20 -17;');
      this.avatar.setAttribute('event-set__rabbithasfallen', '_event: move-along-end; _target: #gamelogic; gamelogic.state: ' + this.states.rabbithasfallen);

		// 3. the rabbit has fallen :( the chicken rises
		} else if (this.state === this.states.rabbithasfallen) {
			this.avatar.components.sound.stopSound();
			this.avatar.removeAttribute('sound');
			this.player.setAttribute('sound', "src: #rise; autoplay: true");
			this.avatar.removeAttribute('alongpath');
			this.avatar.removeAttribute('event-set__rabbithasfallen');
			this.rabbit.setAttribute('visible', false);
			this.chicken.setAttribute('animation__pos', 'property: position; dur: 14000; easing: easeInSine; to: 0 0 -550');
			this.chicken.setAttribute('animation__rot', 'property: rotation; dur: 14000; easing: easeInSine; to: 0 -17 0');
			this.chicken.setAttribute('event-set__chickenhasrisen', '_event: animation__rot-complete; _target: #gamelogic; gamelogic.state: ' + this.states.chickenhasrisen);

		// 4. how to deal with the threatening chicken - player has two choices
		} else if (this.state === this.states.chickenhasrisen) {
			this.chicken.removeAttribute('animation__pos');
			this.chicken.removeAttribute('animation__rot');
			this.chicken.removeAttribute('event-set__movingend');
			this.killthebeast.setAttribute('visible', true);
			this.loveandpeace.setAttribute('visible', true);
			this.ak47.setAttribute('class', 'interactive');
			this.ak47.addEventListener("click", (function() {
				this.el.setAttribute('gamelogic', 'state: ' + this.states.ak47selected);
			}).bind(this));
			this.heart.setAttribute('class', 'interactive');
			this.heart.addEventListener("click", (function() {
				this.el.setAttribute('gamelogic', 'state: ' + this.states.heartselected);
			}).bind(this));
			raycaster.refreshObjects();

		// 5. player has made a choice
		} else if (this.state === this.states.ak47selected || this.state === this.states.heartselected) {
			this.player.setAttribute('sound', "src: #select; autoplay: true");

			if (this.state === this.states.ak47selected) {
				target = this.platform3.getAttribute('position');
				parameters = 'property: position; dur: 2000; easing: easeInOutQuad; to: ' + target.x + ' ' + (target.y + 33) + ' ' + target.z;
				this.player.removeAttribute('animation');
				this.player.setAttribute('animation__toak47', parameters);
				this.player.setAttribute('event-set__playeratak47', '_event: animation__toak47-complete; _target: #gamelogic; gamelogic.state: ' + this.states.atak47);

			} else if (this.state === this.states.heartselected) {
				target = this.platform2.getAttribute('position');
				parameters = 'property: position; dur: 2000; easing: easeInOutQuad; to: '+target.x+' '+(target.y + 36)+' '+target.z;
				this.player.removeAttribute('animation');
				this.player.setAttribute('animation__toheart', parameters);
				this.player.setAttribute('event-set__playeratheart', '_event: animation__toheart-complete; _target: #gamelogic; gamelogic.state: ' + this.states.atheart);
			}

			// remove all choice elements
			this.heart.parentNode.removeChild(this.heart);
			this.ak47.parentNode.removeChild(this.ak47);
			this.killthebeast.parentNode.removeChild(this.killthebeast);
			this.loveandpeace.parentNode.removeChild(this.loveandpeace);

		// 6. player has arrived at final destination
		} else if (this.state === this.states.atak47 || this.state === this.states.atheart) {
			score = 0;
			this.chicken.setAttribute('class', 'interactive');
			increaseCounter = function (event) {
				score = score + 1; // TODO trigger
				console.log(score);
				if (score === 1) {
					this.el.setAttribute('gamelogic', 'state: ' + this.states.letitrain)
				}
			}.bind(this);
			this.scene.addEventListener('click', increaseCounter);
			if (this.state === this.states.atak47) {
				this.player.setAttribute('spawner', { 'mixin': 'bullet', 'on': 'click' });	// TODO change trigger
			} else if (this.state === this.states.atheart) {
				this.player.setAttribute('spawner', { 'mixin': 'heartbullet', 'on': 'click' });	// TODO change trigger
			}

		// 7. let it rain
		} else if (this.state === this.states.letitrain) {
			this.player.components.sound.stopSound();
			this.player.removeAttribute('sound');
			this.player.setAttribute('sound', "src: #ending; autoplay: true");
			playerPosition = this.player.getAttribute('position');
			this.scene.removeEventListener('click', increaseCounter);
			this.scene.setAttribute('rain-of-chickens', { tagName: 'a-sphere', center: {x: playerPosition.x, y: (playerPosition.y + 30), z: playerPosition.z} });
		}
	} // end of update()
});
