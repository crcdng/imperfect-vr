AFRAME.registerComponent('spawner', {
  schema: {
    on: { default: 'click' },
    mixin: { default: '' }
  },
  init: function (oldData) {
    this.el.addEventListener(this.data.on, this.spawn.bind(this));
  },
  spawn: function () {
    let entity = document.createElement('a-entity');
    let cursor = document.querySelector('#cursor');
    let matrixWorld = cursor.object3D.matrixWorld;
    let position = new THREE.Vector3();
    let rotation = this.el.getAttribute('rotation');
    let entityRotation;
    // Have the spawned entity face the same direction as the entity.
    // Allow the entity to further modify the inherited rotation.
    position.setFromMatrixPosition(matrixWorld);
    entity.setAttribute('position', position);
    entity.setAttribute('mixin', this.data.mixin);
    entity.addEventListener('loaded', () => {
      entityRotation = entity.getComputedAttribute('rotation');
      if(rotation) {
	  	entity.setAttribute('rotation', {
        	x: entityRotation.x + rotation.x,
        	y: entityRotation.y + rotation.y,
        	z: entityRotation.z + rotation.z
      	});
  		}
    });
    this.el.sceneEl.appendChild(entity);
  }
});
