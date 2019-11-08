var WorldScene = new Phaser.Class({

	Extends: Phaser.Scene,

	initialize: function WorldScene() {
		Phaser.Scene.call(this, { key: "WorldScene" });
	},

	preload: function () {

	},

	create: function () {
		//map
		var map = this.make.tilemap({ key: "map" });

		var tiles = map.addTilesetImage("rpg_tileset", "tiles");

		var water = map.createStaticLayer("water", tiles, 0, 0);
		var floor = map.createStaticLayer("floor", tiles, 0, 0);
		var bridges1 = map.createStaticLayer("bridges1", tiles, 0, 0);
		var bridges2 = map.createStaticLayer("bridges2", tiles, 0, 0);
		water.setCollisionByExclusion([-1]);

		//player
		this.player = this.physics.add.sprite(1050, 1080, "player", 6);
		this.player.setScale(2);

		//collision
		this.physics.world.bounds.width = map.widthInPixels;
		this.physics.world.bounds.height = map.heightInPixels;
		this.player.setCollideWorldBounds(true);

		this.physics.add.collider(this.player, water);

		//user inputs
		this.cursors = this.input.keyboard.createCursorKeys();

		//camera
		this.cameras.main.setBounds(0, 0, 3200, 3200);
		this.cameras.main.startFollow(this.player);
		this.cameras.main.roundPixels = true;

	},

	update: function () {
		this.player.body.setVelocity(0);

		// Horizontal movement
		if (this.cursors.left.isDown) {
			this.player.body.setVelocityX(-160);
		}
		else if (this.cursors.right.isDown) {
			this.player.body.setVelocityX(160);
		}
		// Vertical movement
		if (this.cursors.up.isDown) {
			this.player.body.setVelocityY(-160);
		}
		else if (this.cursors.down.isDown) {
			this.player.body.setVelocityY(160);
		}
	}
});