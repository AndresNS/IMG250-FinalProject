let WorldScene = new Phaser.Class({

	Extends: Phaser.Scene,

	initialize: function WorldScene() {
		Phaser.Scene.call(this, { key: "WorldScene" });
	},

	preload: function () {

	},

	create: function () {
		//map
		let map = this.make.tilemap({ key: "map" });

		let tiles = map.addTilesetImage("rpg_tileset", "tiles");

		let water = map.createStaticLayer("water", tiles, 0, 0);
		let floor = map.createStaticLayer("floor", tiles, 0, 0);
		let bridges1 = map.createStaticLayer("bridges1", tiles, 0, 0);
		let bridges2 = map.createStaticLayer("bridges2", tiles, 0, 0);
		water.setCollisionByExclusion([-1]);

		//player
		this.player = this.physics.add.sprite(1050, 1080, "characters", 1);
		
		//npcs
		let npcs = this.physics.add.staticGroup();
		npcs.create(1072, 300, "characters", 10); //npc white
		npcs.create(1850, 800, "characters", 7); //npc blue
		npcs.create(1551, 1850, "characters", 52); //npc black
		npcs.create(700, 1780, "characters", 49); //npc red
		npcs.create(335, 800, "characters", 4); //npc green

		//collision
		this.physics.world.bounds.width = map.widthInPixels;
		this.physics.world.bounds.height = map.heightInPixels;
		this.player.setCollideWorldBounds(true);

		this.physics.add.collider(this.player, water);
		this.physics.add.collider(this.player, npcs);


		//user inputs
		this.cursors = this.input.keyboard.createCursorKeys();

		//camera
		this.cameras.main.setBounds(0, 0, 3200, 3200);
		this.cameras.main.startFollow(this.player);
		this.cameras.main.roundPixels = true;

		//character animations
		this.anims.create({
			key: "left",
			frames: this.anims.generateFrameNumbers("characters", { frames: [13, 12, 13, 14] }),
			frameRate: 10,
			repeat: -1
		});
		this.anims.create({
			key: "right",
			frames: this.anims.generateFrameNumbers("characters", { frames: [25, 24, 25, 26] }),
			frameRate: 10,
			repeat: -1
		});
		this.anims.create({
			key: "up",
			frames: this.anims.generateFrameNumbers("characters", { frames: [37, 36, 37, 38] }),
			frameRate: 10,
			repeat: -1
		});
		this.anims.create({
			key: "down",
			frames: this.anims.generateFrameNumbers("characters", { frames: [1, 0, 1, 2] }),
			frameRate: 10,
			repeat: -1
		});

	},

	update: function () {
		this.player.body.setVelocity(0);

		// Horizontal movement
		if (this.cursors.left.isDown) {
			this.player.body.setVelocityX(-400);
		}
		else if (this.cursors.right.isDown) {
			this.player.body.setVelocityX(400);
		}
		// Vertical movement
		if (this.cursors.up.isDown) {
			this.player.body.setVelocityY(-400);
		}
		else if (this.cursors.down.isDown) {
			this.player.body.setVelocityY(400);
		}

		//character animations
		if (this.cursors.left.isDown) {
			this.player.anims.play("left", true);
		}
		else if (this.cursors.right.isDown) {
			this.player.anims.play("right", true);
		}
		else if (this.cursors.up.isDown) {
			this.player.anims.play("up", true);
		}
		else if (this.cursors.down.isDown) {
			this.player.anims.play("down", true);
		}
		else {
			this.player.anims.stop();
		}
	}
});