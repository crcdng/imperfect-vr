AFRAME.registerComponent('follow', {

	schema: {
		strength: { default: 0.03 },
		target: { type: 'selector' }
	},
	init: function () {
		this.myVec = new THREE.Vector3();
		this.targetVec = new THREE.Vector3();
	},
	update: function () {
		console.log('follow set');
	},
	tick: function () {
		const strength = this.data.strength;
		const target = this.data.target;
		const myPosition = this.myVec;
		this.el.object3D.getWorldPosition(myPosition);
		const targetPosition = this.targetVec;
		target.object3D.getWorldPosition(targetPosition);
		targetPosition.sub(myPosition).multiplyScalar(strength).add(this.el.object3D.position);
		this.el.setAttribute('position', targetPosition);
		}
});
