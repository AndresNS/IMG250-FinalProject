/*global Phaser, npcMessages, controls, gameSettings, whiteCards, colors*/
/*eslint no-undef: "error"*/

let WorldScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function WorldScene() {
		Phaser.Scene.call(this, {
			key: "WorldScene"
		});
	}, //end initialize

	preload: function () {}, //end preload

	create: function () {
		//map
		let map = this.make.tilemap({
			key: "map"
		});

		let tiles = map.addTilesetImage("rpg_tileset", "tiles");

		this.water = map.createStaticLayer("water", tiles, 0, 0);
		this.floor = map.createStaticLayer("floor", tiles, 0, 0);
		this.bridges1 = map.createStaticLayer("bridges1", tiles, 0, 0);
		this.bridges2 = map.createStaticLayer("bridges2", tiles, 0, 0);
		this.water.setCollisionByExclusion([-1]);

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

		this.physics.add.collider(this.player, this.water);
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
			frames: this.anims.generateFrameNumbers("characters", {
				frames: [13, 12, 13, 14]
			}),
			frameRate: 10,
			repeat: -1
		});
		this.anims.create({
			key: "right",
			frames: this.anims.generateFrameNumbers("characters", {
				frames: [25, 24, 25, 26]
			}),
			frameRate: 10,
			repeat: -1
		});
		this.anims.create({
			key: "up",
			frames: this.anims.generateFrameNumbers("characters", {
				frames: [37, 36, 37, 38]
			}),
			frameRate: 10,
			repeat: -1
		});
		this.anims.create({
			key: "down",
			frames: this.anims.generateFrameNumbers("characters", {
				frames: [1, 0, 1, 2]
			}),
			frameRate: 10,
			repeat: -1
		});

		//npc talk triggers
		this.npcTalkTriggers = this.physics.add.group({
			classType: Phaser.GameObjects.Zone
		});

		this.npcTalkTriggers.create(1072, 332, 50, 100); //npc white
		this.npcTalkTriggers.create(1850, 832, 50, 100); //npc blue
		this.npcTalkTriggers.create(1551, 1850, 100, 100); //npc black
		this.npcTalkTriggers.create(700, 1780, 100, 100); //npc red
		this.npcTalkTriggers.create(335, 832, 50, 100); //npc green

		this.npcTalkTriggers.children.entries[0].name = "white";
		this.npcTalkTriggers.children.entries[1].name = "blue";
		this.npcTalkTriggers.children.entries[2].name = "black";
		this.npcTalkTriggers.children.entries[3].name = "red";
		this.npcTalkTriggers.children.entries[4].name = "green";

		this.physics.add.overlap(
			this.player,
			this.npcTalkTriggers,
			this.onEnemyMeet,
			false,
			this
		);
	}, //end create

	update: function () {
		this.player.body.setVelocity(0);

		// Horizontal movement
		if (this.cursors.left.isDown) {
			this.player.body.setVelocityX(-gameSettings.WALK_SPEED);
		} else if (this.cursors.right.isDown) {
			this.player.body.setVelocityX(gameSettings.WALK_SPEED);
		}
		// Vertical movement
		if (this.cursors.up.isDown) {
			this.player.body.setVelocityY(-gameSettings.WALK_SPEED);
		} else if (this.cursors.down.isDown) {
			this.player.body.setVelocityY(gameSettings.WALK_SPEED);
		}

		//character animations
		if (this.cursors.left.isDown) {
			this.player.anims.play("left", true);
		} else if (this.cursors.right.isDown) {
			this.player.anims.play("right", true);
		} else if (this.cursors.up.isDown) {
			this.player.anims.play("up", true);
		} else if (this.cursors.down.isDown) {
			this.player.anims.play("down", true);
		} else {
			this.player.anims.stop();
		}
	}, //end update

	onEnemyMeet: function (player, zone) {
		this.scene.pause("WorldScene");
		this.scene.launch("DialogBoxScene", zone.name);
	} //end onEnemyMeet
}); //end WorldScene

let DialogBoxScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function DialogBoxScene() {
		Phaser.Scene.call(this, {
			key: "DialogBoxScene"
		});
	}, //end initialize

	create: function (npc) {
		//dialog box
		let dialogbox = this.add.sprite(0, 240, "dialogbox");
		dialogbox.setOrigin(0, 0);

		/*eslint indent: ["error", "tab", { "SwitchCase": 1 }]*/
		switch (npc) {
			case "white":
				this.addMessage(npcMessages.WHITE.GREET);
				break;
			case "blue":
				this.addMessage(npcMessages.BLUE.GREET);
				break;
			case "black":
				this.addMessage(npcMessages.BLACK.GREET);
				break;
			case "red":
				this.addMessage(npcMessages.RED.GREET);
				break;
			case "green":
				this.addMessage(npcMessages.GREEN.GREET);
				break;
		}

		//user inputs
		this.keys = this.input.keyboard.addKey(controls.INTERACT);
	}, //end create

	update: function () {
		if (this.keys.isDown) {
			this.scene.stop("DialogBoxScene");
			this.scene.sleep("WorldScene");
			this.scene.launch("MatchScene", this.loadPlayerDeck());
		}
	}, //end update

	addMessage: function (text) {
		this.message = this.add.text(15, 250, text, {
			color: "#ffffff",
			fontSize: 13,
			wordWrap: {
				width: 370,
				useAdvancedWrap: true
			}
		});
	}, //end addMessage

	loadPlayerDeck: function () {
		let playerDeck = new Deck(colors.WHITE);

		//1 mana
		playerDeck.addCard(whiteCards[1], 4);
		playerDeck.addCard(whiteCards[3], 4);

		//2 mana
		playerDeck.addCard(whiteCards[5], 4);
		playerDeck.addCard(whiteCards[6], 4);
		playerDeck.addCard(whiteCards[7], 2);
		playerDeck.addCard(whiteCards[8], 4);

		//3 mana
		playerDeck.addCard(whiteCards[9], 4);
		playerDeck.addCard(whiteCards[10], 4);
		playerDeck.addCard(whiteCards[13], 4);

		//4 mana
		playerDeck.addCard(whiteCards[15], 2);
		playerDeck.addCard(whiteCards[16], 2);
		playerDeck.addCard(whiteCards[18], 2);

		//Get cards from scryfall api
		let cardsPromises = [];

		for (let i = 0; i < Object.keys(playerDeck.deckList).length; i++) {
			let url = `https://api.scryfall.com/cards/${Object.keys(playerDeck.deckList)[i]}`;
			cardsPromises[i] = fetch(url).then(response => {
				return response.json();
			}).catch(e => {
				console.error(`There has been a problem while fetching resource "${url}": ${e.message}`);
			});
		}

		Promise.all(cardsPromises).then(cards => {
			for (let i = 0; i < cards.length; i++) {
				for (let j = 0; j < playerDeck.deckList[cards[i].id]; j++) {
					playerDeck.deckCards.push(cards[i]);
				}
			}
		});

		return playerDeck;
	} //end loadPlayerDeck
}); //end DialogBoxScene

function Deck(color) {
	this.color = color;
	this.deckList = {};
	this.deckCards = [];
	this.addCard = function (card, qty) {
		this.deckList[card] = qty;
	};
	this.drawCard = function () {
		let card = this.deckCards[0];
		this.deckCards.splice(0, 1);
		return card;
	};
	this.shuffleDeck = function () {
		this.deckCards = Phaser.Utils.Array.Shuffle(this.deckCards);
	};
}