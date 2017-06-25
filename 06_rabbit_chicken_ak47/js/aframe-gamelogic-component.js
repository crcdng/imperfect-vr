// this is the complete gamelogic in one component
// the elements in the scene use the event-set component to send messages to it
// and it handles the logic

// remark: this approach would not work well for more complex scenes
// (image hundreds of states)
// and there are better techniques to handle state logic
// also this component is specific to this scene and not reusable for others

// helper functions:
// construct a lerp-ed path with sinusodial movement on y.
// assume start.y === target.y
// returns an array of points [{x: x0, y: y0, z: z0}, ...]
function createJumpPath (startPos, endPos, points, maxHeight) {
  var path = [];
	var i, step, stepY, x, y, z;
  if (points == null) { points = 10; }
  if (maxHeight == null) { maxHeight = 20; }
  for (i = 0; i < points; i = i + 1) {
    step = i / points;
    stepY = (i / points) * Math.PI;
    x = startPos.x + step * (endPos.x - startPos.x);
    y = startPos.y + Math.sin(stepY) * maxHeight;
    z = startPos.z + step * (endPos.z - startPos.z);
    path.push({x: x, y: y, z: z});
  }
  return path;
}

function createPointStringFromJumpPath (arrayOfPoints) {
	var curvepoint, i, length = arrayOfPoints.length, point, pointString = "";

  for (i = 0; i < length; i = i + 1) {
		point = arrayOfPoints[i];
    curvePoint = AFRAME.utils.coordinates.stringify(point);
    pointString = pointString.concat(curvePoint, (i !== length - 1) ? "," : ""); // avoid a nullvector at the end
  }
  return pointString;
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
    var ak47 = this.ak47;
    var avatar = this.avatar;
    var followme = this.followme;
    var heart = this.heart;
    var killthebeast = this.killthebeast;
    var loveandpeace = this.loveandpeace;
    var player = this.player;
    var platform2 = this.platform2;
    var platform3 = this.platform3;
    var rabbit = this.rabbit;
    var raycaster = document.querySelector('[raycaster]').components.raycaster;
    var state = this.data.state;
    var states = this.states;
		var increaseCounter, jumpStart, jumpString, jumpTarget, playerPosition, score;

		console.log("state: " + state);
		avatar.setAttribute('sound', "src: #start; autoplay: true");

		// 1. we follow the rabbit
		if (state === states.follow) {
			player.setAttribute('sound', "src: #select; autoplay: true");
			followme.setAttribute('visible', false);
			player.setAttribute('follow', 'target', '#avatar');
			rabbit.setAttribute('animation__hop', 'property: position; to: 0 0.3 0; dur: 250; easing: easeInOutSine; loop: true');
			rabbit.removeAttribute('event-set__follow');
      avatar.setAttribute('move-along', 'dur: 3000; points: 0 72.5 6.15, 0 72.5 4.15, 0 72.5 0.15, 0 72.5 -4.15, 0 72.5 -12.15, 0 74 -18.15;');
      avatar.setAttribute('event-set__stopfollow', '_event: move-along-end; _target: #gamelogic; gamelogic.state: ' + states.stopfollow);

		// 2. the rabbit has reached its destination hovering in mid-air
		} else if (state === states.stopfollow) {
			player.setAttribute('sound', 'src: #fall; autoplay: true; volume: 0.8');
			player.removeAttribute('follow');
			avatar.removeAttribute('move-along');
			avatar.removeAttribute('event-set__stopfollow');
			rabbit.removeAttribute('animation__hop');
      avatar.setAttribute('move-along', 'delay: 2500; dur: 3000; points: 0 74 -18.15, 0 62 -18, 0 31 -18.15, 0 -20 -17;');
      avatar.setAttribute('event-set__rabbithasfallen', '_event: move-along-end; _target: #gamelogic; gamelogic.state: ' + states.rabbithasfallen);

		// 3. the rabbit has fallen :( the chicken rises
		} else if (state === states.rabbithasfallen) {
      player.setAttribute('sound', "src: #splash; autoplay: true");
      player.setAttribute('sound', "src: #rise; autoplay: true; on: sound-ended");
      avatar.parentNode.removeChild(avatar);
			chicken.setAttribute('animation__pos', 'property: position; dur: 14000; easing: easeInSine; to: 0 0 -550');
			chicken.setAttribute('animation__rot', 'property: rotation; dur: 14000; easing: easeInSine; to: 0 -17 0');
			chicken.setAttribute('event-set__chickenhasrisen', '_event: animation__rot-complete; _target: #gamelogic; gamelogic.state: ' + states.chickenhasrisen);

		// 4. how to deal with the threatening chicken - player has two choices
		} else if (state === states.chickenhasrisen) {
			chicken.removeAttribute('animation__pos');
			chicken.removeAttribute('animation__rot');
			chicken.removeAttribute('event-set__movingend');
			killthebeast.setAttribute('visible', true);
			loveandpeace.setAttribute('visible', true);
			ak47.setAttribute('class', 'interactive');
			ak47.addEventListener("click", (function() {
				this.el.setAttribute('gamelogic', 'state: ' + states.ak47selected);
			}).bind(this));
			heart.setAttribute('class', 'interactive');
			heart.addEventListener("click", (function() {
				this.el.setAttribute('gamelogic', 'state: ' + states.heartselected);
			}).bind(this));
			raycaster.refreshObjects();

		// 5. player has made a choice
		} else if (state === states.ak47selected || state === states.heartselected) {
			player.setAttribute('sound', "src: #select; autoplay: true");

			heart.parentNode.removeChild(heart);
			ak47.parentNode.removeChild(ak47);
			killthebeast.parentNode.removeChild(killthebeast);
			loveandpeace.parentNode.removeChild(loveandpeace);

			if (state === states.ak47selected) {
        jumpTarget = platform3.getAttribute('position');
        jumpTargetState = states.atak47;
			} else if (state === states.heartselected) {
        jumpTarget = platform2.getAttribute('position');
        jumpTargetState = states.atheart;
			}

      jumpStart = player.getAttribute('position');
      jumpTarget.y = jumpTarget.y + 33;
      player.removeAttribute('animation');
      player.removeAttribute('move-along');
      jumpString = createPointStringFromJumpPath(createJumpPath(jumpStart, jumpTarget));
      player.setAttribute('move-along', 'dur: 2000; points: '+jumpString+';')
      player.setAttribute('event-set__playeratak47', '_event: move-along-end; _target: #gamelogic; gamelogic.state: ' + states.atak47);

		// 6. player has arrived at final destination
		} else if (state === states.atak47 || state === states.atheart) {
			score = 0;
			chicken.setAttribute('class', 'interactive');
			increaseCounter = function (event) {
				score = score + 1; // TODO trigger
				console.log(score);
				if (score === 1) {
					this.el.setAttribute('gamelogic', 'state: ' + states.letitrain)
				}
			}.bind(this);
			this.scene.addEventListener('click', increaseCounter);
			if (state === states.atak47) {
				player.setAttribute('spawner', { 'mixin': 'bullet', 'on': 'click' });	// TODO change trigger
			} else if (state === states.atheart) {
				player.setAttribute('spawner', { 'mixin': 'heartbullet', 'on': 'click' });	// TODO change trigger
			}

		// 7. let it rain
		} else if (state === states.letitrain) {
			player.setAttribute('sound', "src: #ending; autoplay: true");
			playerPosition = player.getAttribute('position');
			this.scene.removeEventListener('click', increaseCounter);
			this.scene.setAttribute('rain-of-entities', { maxCount: 10, center: { x: playerPosition.x, y: (playerPosition.y + 30), z: playerPosition.z } });
		}
	} // end of update()
});
