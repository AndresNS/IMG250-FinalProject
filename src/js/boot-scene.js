var BootScene = new Phaser.Class({

	Extends: Phaser.Scene,

	initialize: function BootScene() {
		Phaser.Scene.call(this, { key: "BootScene" });
	}, //End initialize

	preload: function () {
		//map
		this.load.image("background", "assets/map/rpg-map.png");

		//character
		this.load.spritesheet("player", "assets/RPG_assets.png", { frameWidth: 16, frameHeight: 16 });


	}, //End preload

	create: function () {
		//Starts the World Scene
		this.scene.start("WorldScene");
	} //End create
});

