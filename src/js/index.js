let config = {
	type: Phaser.AUTO,
	parent: "game-container",
	width: 400,
	height: 300,
	zoom: 2,
	pixelArt: true,
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 0 },
			debug: false // set to true to view zones
		}
	},
	scene: [
		BootScene,
		WorldScene
	]
};

let game = new Phaser.Game(config);