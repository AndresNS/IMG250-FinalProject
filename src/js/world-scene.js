var WorldScene = new Phaser.Class({

	Extends: Phaser.Scene,

	initialize: function WorldScene() {
		Phaser.Scene.call(this, { key: "WorldScene" });
	},

	preload: function () {

	},

	create: function () {
		//map
		this.add.sprite(500, 400, "background");

		// this.physics.world.bounds.width = map.widthInPixels;
		// this.physics.world.bounds.height = map.heightInPixels;
		// this.player.setCollideWorldBounds(true);

		//player
		this.player = this.physics.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "player", 6);
		this.player.setScale(2);

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