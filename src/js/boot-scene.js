let BootScene = new Phaser.Class({

	Extends: Phaser.Scene,

	initialize: function BootScene() {
		Phaser.Scene.call(this, { key: "BootScene" });
	}, //End initialize

	preload: function () {
		//map
		this.load.image("tiles", "assets/map/rpg_tileset.png");
		this.load.tilemapTiledJSON("map", "assets/map/map.json");

		//characters
		this.load.spritesheet("characters", "assets/characters.png", { frameWidth: 32, frameHeight: 32 });

	}, //End preload

	create: function () {
		//Starts the World Scene
		this.scene.start("WorldScene");
	} //End create
});

