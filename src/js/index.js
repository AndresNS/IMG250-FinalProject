/*global Phaser, BootScene, WorldScene, DialogBoxScene, TransitionScene, MatchScene, UIScene*/
/*eslint no-undef: "error"*/

let config = {
	type: Phaser.AUTO,
	parent: "game-container",
	width: 800,
	height: 600,
	pixelArt: true,
	physics: {
		default: "arcade",
		arcade: {
			gravity: {
				y: 0
			},
			debug: false // set to true to view zones
		}
	},
	scene: [
		BootScene,
		WorldScene,
		DialogBoxScene,
		// TransitionScene,
		MatchScene,
		UIScene
	]
};

let game = new Phaser.Game(config);