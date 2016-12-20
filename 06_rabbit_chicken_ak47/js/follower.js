const vec1 = new THREE.Vector3();
const vec2 = new THREE.Vector3();

AFRAME.registerComponent('follow', {

	schema: {
		strength: { default: 0.03 },
		target: { type: 'selector' }
	},

	tick: function () {
		let myPosition = vec1;
		this.el.object3D.getWorldPosition(myPosition);
		let targetPosition = vec2;
		this.data.target.object3D.getWorldPosition(targetPosition);
		targetPosition.sub(myPosition).multiplyScalar(this.data.strength).add(this.el.object3D.position);
		this.el.setAttribute('position', targetPosition);
		}
});
