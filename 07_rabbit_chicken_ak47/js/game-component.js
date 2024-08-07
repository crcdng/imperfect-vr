/* global AFRAME */

// this is the complete game logic
// the elements in the scene use the event-set component to send messages to it and it handles the logic

// remark: this approach would not work well for more complex scenes
// (imagine hundreds of states)
// also this component is specific to this particular scene and not reusable for others

AFRAME.registerComponent('gamelogic', {
  schema: {
    state: { type: 'string', default: 'start' }
  },
  init: function () { // this function is called once at the beginning
    const ios = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
    this.ak47 = document.querySelector('#ak47');
    this.avatar = document.querySelector('#avatar');
    this.chicken = document.querySelector('#chicken');
    this.curtain = document.querySelector('#curtain');
    this.cursor = document.querySelector('#cursor');
    this.decision = null;
    this.followme = document.querySelector('#followme');
    this.gamelogic = document.querySelector('#gamelogic');
    this.heart = document.querySelector('#heart');
    this.logo = document.querySelector('#logo');
    this.killthebeast = document.querySelector('#killthebeast');
    this.loveandpeace = document.querySelector('#loveandpeace');
    this.platform1 = document.querySelector('#platform1'); // starting point
    this.platform2 = document.querySelector('#platform2'); // heart
    this.platform3 = document.querySelector('#platform3'); // ak47
    this.player = document.querySelector('#player');
    this.camera = document.querySelector('#camera');
    this.rabbit = document.querySelector('#rabbit');
    this.scene = this.el.sceneEl;
    this.states = {
      start: 'start',
      follow: 'follow',
      stopfollow: 'stopfollow',
      rabbithasfallen: 'rabbithasfallen',
      chickenhasrisen: 'chickenhasrisen',
      ak47selected: 'ak47selected',
      heartselected: 'heartselected',
      letitrain: 'letitrain'
    };
    this.state = null; // must be set
    this.startbutton = document.getElementById('startbutton');
    this.startmessage = document.querySelector('#startmessage');
    this.startscreen = document.querySelector('#startscreen');

    if (ios) {
      this.startmessage.innerText = 'Tipp: On an iPhone, tap the "Share" button. Select "Add to Home Screen". Then open the app from the home screen.';
    }

    this.startbutton.addEventListener('click', (e) => {
      this.state = this.states.start;
      this.gamelogic.setAttribute('sound', 'src: #music; autoplay: true; volume: 0.1');
      const startSoundComponent = this.gamelogic.components.sound;
      const mediaEl = document.querySelector(startSoundComponent.attrValue.src);
      if (mediaEl != null) {
        mediaEl.play.bind(mediaEl)(); // this must be bound to the media element
      }
      this.startscreen.classList.add('fadeout');
      this.curtain.classList.add('fadeout');
      setTimeout(() => {
        this.startscreen.style.display = 'none';
        this.curtain.style.display = 'none';
      }, 1990); // and remove the ui completely
    }, false);

    this.startbutton.disabled = true; // TODO
    this.startbutton.innerText = 'MAINTENANCE\nIN PROGRESS'; // TODO
  },
  update: function (oldData) { // this function is called each time when something is updated
    let increaseCounter, playerPosition, score;

    const ak47 = this.ak47;
    const avatar = this.avatar;
    const chicken = this.chicken;
    const cursor = this.cursor;
    const endmessage = {};
    const followme = this.followme;
    const gamelogic = this.gamelogic;
    const heart = this.heart;
    const killthebeast = this.killthebeast;
    const loveandpeace = this.loveandpeace;
    const player = this.player;
    const camera = this.camera;
    const platform2 = this.platform2;
    const platform3 = this.platform3;
    const rabbit = this.rabbit;
    const raycaster = document.querySelector('[raycaster]').components.raycaster;
    const scene = this.scene;
    const states = this.states;
    const state = this.data.state;
    // 1. we follow the rabbit
    if (state === states.follow) {
      player.setAttribute('sound', 'src: #select; autoplay: true');
      rabbit.classList.remove('interactive');
      followme.parentNode.removeChild(followme);
      player.setAttribute('follow', 'target', '#avatar');
      rabbit.setAttribute('animation__hop', 'property: position; to: 0 0.3 0; dur: 250; easing: easeInOutSine; loop: true');
      avatar.setAttribute('move-along', 'dur: 3000; points: 0 72.5 6.15, 0 72.5 4.15, 0 72.5 0.15, 0 72.5 -4.15, 0 72.5 -12.15, 0 74 -18.15;');
      avatar.setAttribute('event-set__stopfollow', '_event: move-along-end; _target: #gamelogic; gamelogic.state: ' + states.stopfollow);

      // 2. the rabbit has reached its destination hovering in mid-air
    } else if (state === states.stopfollow) {
      rabbit.setAttribute('sound', 'src: #fall; autoplay: true; volume: 0.8');
      player.removeAttribute('follow');
      avatar.removeAttribute('move-along');
      avatar.removeAttribute('event-set__stopfollow');
      rabbit.removeAttribute('animation__hop');
      avatar.setAttribute('move-along', 'delay: 2500; dur: 3000; points: 0 74 -18.15, 0 62 -18, 0 31 -18.15, 0 -20 -17;');
      avatar.setAttribute('event-set__rabbithasfallen', '_event: move-along-end; _target: #gamelogic; gamelogic.state: ' + states.rabbithasfallen);

      // 3. the rabbit has fallen :( the chicken rises
    } else if (state === states.rabbithasfallen) {
      // console.log('rise chicken');
      player.setAttribute('sound', 'src: #splash; autoplay: true');
      chicken.setAttribute('animation__pos', 'property: position; dur: 14000; easing: easeInSine; to: 0 100 -100');
      chicken.setAttribute('animation__rot', 'property: rotation; dur: 14000; easing: easeInSine; to: 0 -17 0');
      chicken.setAttribute('event-set__chickenhasrisen', '_event: animationcomplete__rot; _target: #gamelogic; gamelogic.state: ' + states.chickenhasrisen);
      avatar.parentNode.removeChild(avatar);

      // 4. how to deal with the threatening chicken - player has two choices
    } else if (state === states.chickenhasrisen) {
      chicken.removeAttribute('animation__pos');
      chicken.removeAttribute('animation__rot');
      chicken.removeAttribute('event-set__movingend');
      chicken.setAttribute('hit-handler');
      killthebeast.setAttribute('visible', true);
      loveandpeace.setAttribute('visible', true);
      ak47.setAttribute('class', 'interactive');
      ak47.addEventListener('click', function () {
        this.el.setAttribute('gamelogic', 'state: ' + states.ak47selected);
        this.decision = states.ak47selected;
        player.setAttribute('sound', 'src: #select; autoplay: true;');
      }.bind(this));
      heart.setAttribute('class', 'interactive');
      heart.addEventListener('click', function () {
        this.el.setAttribute('gamelogic', 'state: ' + states.heartselected);
        this.decision = states.heartselected;
        player.setAttribute('sound', 'src: #select; autoplay: true;');
      }.bind(this));
      raycaster.refreshObjects();

      // 5. player has made a choice
    } else if (state === states.ak47selected || state === states.heartselected) {
      if (state === states.ak47selected) {
        player.setAttribute('sound', 'src: #shootbullet; on: shoot;');
      } else if (state === states.heartselected) {
        player.setAttribute('sound', 'src: #shootheart; on: shoot;');
      }

      heart.parentNode.removeChild(heart);
      ak47.parentNode.removeChild(ak47);
      killthebeast.parentNode.removeChild(killthebeast);
      loveandpeace.parentNode.removeChild(loveandpeace);
      platform3.parentNode.removeChild(platform3);
      platform2.parentNode.removeChild(platform2);
      camera.setAttribute('shooter', '');
      camera.setAttribute('click-to-shoot', '');
      player.removeAttribute('animation');
      player.removeAttribute('move-along');

      score = 0;
      chicken.setAttribute('class', 'interactive');

      increaseCounter = (event) => {
        score = score + 1;
        if (score === 5) {
          this.el.setAttribute('gamelogic', 'state: ' + states.letitrain);
        }
      };
      scene.addEventListener('click', increaseCounter);

      // 7. let it rain
    } else if (state === states.letitrain) {
      camera.removeAttribute('shooter');
      scene.removeEventListener('click', increaseCounter);
      cursor.parentNode.removeChild(cursor);
      playerPosition = player.getAttribute('position');
      // TODO next iteration - recode rain of chickens
      // scene.setAttribute('rain-of-entities', { maxCount: 20, components: ['dynamic-body', 'src|#tex_chicken'], center: { x: playerPosition.x, y: (playerPosition.y + 30), z: playerPosition.z } });
      endmessage.pos = { x: playerPosition.x, y: playerPosition.y + 0.5, z: playerPosition.z - 12 };

      if (this.decision === states.ak47selected) {
        endmessage.text = 'You opted for violence and killed the chicken. Therefore you will be haunted by little chickens forever...';
        endmessage.color = '#0000ff';
      } else if (this.decision === states.heartselected) {
        endmessage.text = 'You decided to shower the chicken with love. Therefore lots of little chickens will shower you with their love...';
        endmessage.color = '#ff11b4';
      } else {
        endmessage.text = 'Love and Peace.';
      }
      endmessage.text += '\n\nThank you for playing the teaser of Rabbit Chicken AK47.';
      endmessage.text += '\n\nMade with aframe.io by @crcdng.';

      setTimeout(function () { // show the endmessage
        const endmessageEl = document.createElement('a-text');

        endmessageEl.setAttribute('position', endmessage.pos);
        endmessageEl.setAttribute('value', endmessage.text);
        endmessageEl.setAttribute('color', endmessage.color);
        endmessageEl.setAttribute('anchor', 'center');
        endmessageEl.setAttribute('align', 'center');
        endmessageEl.setAttribute('width', '15');
        endmessageEl.setAttribute('wrapCount', '20');
        endmessageEl.setAttribute('font', 'assets/fonts/Monoid.fnt');
        scene.appendChild(endmessageEl);
      }, 5000);
    }
  } // end of update()
});
