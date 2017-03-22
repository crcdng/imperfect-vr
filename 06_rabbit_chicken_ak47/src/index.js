var scene = document.querySelector('a-scene');

if (scene.hasLoaded) {
  run();
} else {
  scene.addEventListener('loaded', run);
}

function run() {
  var rabbit = document.querySelector('#rabbit');
  var following = false;

  function followTheRabbit() {
    console.log("following the rabbit");
  }
  function unFollowTheRabbit() {
    console.log("unfollowing the rabbit");
  }
  rabbit.addEventListener("click", function() {
    followTheRabbit();
  });
  rabbit.addEventListener("mouseleave", function() {
    unFollowTheRabbit();
  });
}
