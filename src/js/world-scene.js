/*global Phaser, npcMessages, controls, gameSettings, whiteCards, blueCards, blackCards, redCards, greenCards, colors, radios*/
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

		this.npcTalkTriggers.children.entries[0].name = colors.WHITE;
		this.npcTalkTriggers.children.entries[1].name = colors.BLUE;
		this.npcTalkTriggers.children.entries[2].name = colors.BLACK;
		this.npcTalkTriggers.children.entries[3].name = colors.RED;
		this.npcTalkTriggers.children.entries[4].name = colors.GREEN;

		this.physics.add.overlap(
			this.player,
			this.npcTalkTriggers,
			this.onEnemyMeet,
			false,
			this
		);
		this.sys.events.on("wake", this.wake, this);
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

	wake: function (data) {
		this.cursors.left.reset();
		this.cursors.right.reset();
		this.cursors.up.reset();
		this.cursors.down.reset();

		if(!data.scene.isPostMatch) {
			//is end match
			this.scene.pause("WorldScene");
			let dialogData = [this.npcColor, data.scene.result, false];
	
			this.scene.launch("DialogBoxScene", dialogData);
		}else{
			//is post match
			this.scene.stop("DialogBoxScene");
			data.scene.isPostMatch = false;
		}
		
	},

	onEnemyMeet: function (player, zone) {
		if (zone.x > player.x) {
			player.body.x = player.body.x - 20;
		} else {
			player.body.x = player.body.x + 20;
		}

		if (zone.y > player.y) {
			player.body.y = player.body.y - 20;
		} else {
			player.body.y = player.body.y + 20;
		}
		let data = [zone.name, "startMatch"];
		this.scene.pause("WorldScene");
		this.scene.launch("DialogBoxScene", data);

	} //end onEnemyMeet
}); //end WorldScene

let DialogBoxScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function DialogBoxScene() {
		Phaser.Scene.call(this, {
			key: "DialogBoxScene"
		});
	}, //end initialize

	create: function (data) {
		//dialog box
		let dialogbox = this.add.sprite(0, 480, "dialogbox");
		dialogbox.setScale(2);
		dialogbox.setOrigin(0, 0);

		this.npc = data[0];

		if (data[1] !== "startMatch") {
			this.isEndMatch = true;
			if (data[1]) {
				/*eslint indent: ["error", "tab", { "SwitchCase": 1 }]*/
				switch (data[0]) {
					case colors.WHITE:
						this.addMessage(npcMessages.WHITE.VICTORY);
						break;
					case colors.BLUE:
						this.addMessage(npcMessages.BLUE.VICTORY);
						break;
					case colors.BLACK:
						this.addMessage(npcMessages.BLACK.VICTORY);
						break;
					case colors.RED:
						this.addMessage(npcMessages.RED.VICTORY);
						break;
					case colors.GREEN:
						this.addMessage(npcMessages.GREEN.VICTORY);
						break;
				}
			} else {
				switch (data[0]) {
					case colors.WHITE:
						this.addMessage(npcMessages.WHITE.DEFEAT);
						break;
					case colors.BLUE:
						this.addMessage(npcMessages.BLUE.DEFEAT);
						break;
					case colors.BLACK:
						this.addMessage(npcMessages.BLACK.DEFEAT);
						break;
					case colors.RED:
						this.addMessage(npcMessages.RED.DEFEAT);
						break;
					case colors.GREEN:
						this.addMessage(npcMessages.GREEN.DEFEAT);
						break;
				}
			}

		} else {
			this.isEndMatch = false;
			switch (data[0]) {
				case colors.WHITE:
					this.addMessage(npcMessages.WHITE.GREET);
					break;
				case colors.BLUE:
					this.addMessage(npcMessages.BLUE.GREET);
					break;
				case colors.BLACK:
					this.addMessage(npcMessages.BLACK.GREET);
					break;
				case colors.RED:
					this.addMessage(npcMessages.RED.GREET);
					break;
				case colors.GREEN:
					this.addMessage(npcMessages.GREEN.GREET);
					break;
			}
		}


		//user inputs
		this.keys = this.input.keyboard.addKey(controls.INTERACT);
	}, //end create

	update: function () {
		if (this.keys.isDown) {
			if(this.isEndMatch){
				this.scene.stop("DialogBoxScene");
				let world = this.scene.get("WorldScene");
				world.isPostMatch = true;
				this.scene.wake("WorldScene");
			}else{
				this.scene.stop("DialogBoxScene");
				this.scene.sleep("WorldScene");
				this.scene.launch("TransitionScene", this.npc);
			}
		}
	}, //end update

	addMessage: function (text) {
		this.message = this.add.text(20, 500, text, {
			color: "#ffffff",
			fontSize: 25,
			wordWrap: {
				width: 760,
				useAdvancedWrap: true
			}
		});
	} //end addMessage
}); //end DialogBoxScene

let TransitionScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function TransitionScene() {
		Phaser.Scene.call(this, {
			key: "TransitionScene"
		});
	}, //end initialize

	init: function (npc) {
		this.npc = npc;
	},

	preload: function () {
		this.load.image("loading-gideon", "assets/loading-gideon.jpg");
		this.load.image("loading-jace", "assets/loading-jace.jpg");
		this.load.image("loading-davriel", "assets/loading-davriel.jpg");
		this.load.image("loading-sarkhan", "assets/loading-sarkhan.jpg");
		this.load.image("loading-nissa", "assets/loading-nissa.jpg");
	}, //end preload

	create: function () {
		let matchBg;
		switch (this.npc) {
			case colors.WHITE:
				matchBg = this.add.sprite(0, 0, "loading-gideon");
				break;
			case colors.BLUE:
				matchBg = this.add.sprite(0, 0, "loading-jace");
				break;
			case colors.BLACK:
				matchBg = this.add.sprite(0, 0, "loading-davriel");
				break;
			case colors.RED:
				matchBg = this.add.sprite(0, 0, "loading-sarkhan");
				break;
			case colors.GREEN:
				matchBg = this.add.sprite(0, 0, "loading-nissa");
				break;
		}
		matchBg.setOrigin(0, 0);

		const startMatch = async () => {
			let results = await this.loadDecks()[0];
			let playerDeck = this.loadDecks()[1];
			let enemyDeck = this.loadDecks()[2];

			for (let i = 0; i < results.length; i++) {
				if (i < Object.keys(playerDeck.deckList).length) {
					for (let j = 0; j < playerDeck.deckList[results[i].id]; j++) {
						playerDeck.deckCards.push(results[i]);
					}
				} else {
					for (let j = 0; j < enemyDeck.deckList[results[i].id]; j++) {
						enemyDeck.deckCards.push(results[i]);
					}
				}
			}
			this.scene.stop("TransitionScene");
			this.scene.launch("MatchScene", [playerDeck, enemyDeck, this.npc]);
		};

		startMatch();

	}, //end create

	update: function () {

	}, //end update

	loadDecks: function () {
		let colorSelection;
		for (let i = 0, length = radios.length; i < length; i++) {
			if (radios[i].checked) {
				colorSelection = radios[i].value;
				break;
			}
		}

		let playerDeck = buildDeck(colorSelection);
		let enemyDeck = buildDeck(this.npc);
		let playerDeckListKeys = Object.keys(playerDeck.deckList);
		let enemyDeckListKeys = Object.keys(enemyDeck.deckList);
		let cardsPromises = [];

		let cardTotal = playerDeckListKeys.length + enemyDeckListKeys.length;

		for (let i = 0; i < cardTotal; i++) {
			let url;
			if (i < playerDeckListKeys.length) {
				url = `https://api.scryfall.com/cards/${playerDeckListKeys[i]}`;
			} else {
				url = `https://api.scryfall.com/cards/${enemyDeckListKeys[i - playerDeckListKeys.length]}`;
			}
			cardsPromises[i] = fetch(url).then(response => {
				return response.json();
			}).catch(e => {
				console.error(`There has been a problem while fetching resource "${url}": ${e.message}`);
			});
		}

		const getCards = async () => {
			let results = await Promise.all(cardsPromises);
			return results;
		};

		return [getCards(), playerDeck, enemyDeck];

	} //end loadDecks

}); //end TransitionScene

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

//Decklist for every color
function buildDeck(color) {
	let deck = new Deck(color);

	switch (color) {
		case colors.WHITE:
			//1 mana
			deck.addCard(whiteCards[1], 4);
			deck.addCard(whiteCards[3], 4);

			//2 mana
			deck.addCard(whiteCards[5], 4);
			deck.addCard(whiteCards[6], 4);
			deck.addCard(whiteCards[7], 2);
			deck.addCard(whiteCards[8], 4);

			//3 mana
			deck.addCard(whiteCards[9], 4);
			deck.addCard(whiteCards[10], 4);
			deck.addCard(whiteCards[13], 4);

			//4 mana
			deck.addCard(whiteCards[15], 2);
			deck.addCard(whiteCards[16], 2);
			deck.addCard(whiteCards[18], 2);
			break;
		case colors.BLUE:
			//1 mana
			deck.addCard(blueCards[1], 2);
			deck.addCard(blueCards[2], 2);
			deck.addCard(blueCards[3], 4);

			//2 mana
			deck.addCard(blueCards[5], 4);
			deck.addCard(blueCards[6], 4);
			deck.addCard(blueCards[7], 4);
			deck.addCard(blueCards[8], 4);

			//3 mana
			deck.addCard(blueCards[9], 2);
			deck.addCard(blueCards[10], 4);
			deck.addCard(blueCards[12], 4);

			//4 mana
			deck.addCard(blueCards[14], 2);
			deck.addCard(blueCards[15], 2);
			deck.addCard(blueCards[16], 2);
			break;
		case colors.BLACK:
			//1 mana
			deck.addCard(blackCards[0], 2);
			deck.addCard(blackCards[1], 2);
			deck.addCard(blackCards[2], 2);
			deck.addCard(blackCards[3], 2);

			//2 mana
			deck.addCard(blackCards[4], 2);
			deck.addCard(blackCards[5], 2);
			deck.addCard(blackCards[6], 4);
			deck.addCard(blackCards[7], 2);
			deck.addCard(blackCards[8], 4);

			//3 mana
			deck.addCard(blackCards[10], 4);
			deck.addCard(blackCards[12], 2);
			deck.addCard(blackCards[13], 2);
			deck.addCard(blackCards[14], 4);

			//4 mana
			deck.addCard(blackCards[15], 2);
			deck.addCard(blackCards[16], 2);
			deck.addCard(blackCards[18], 2);
			break;
		case colors.RED:
			//1 mana
			deck.addCard(redCards[0], 2);
			deck.addCard(redCards[1], 3);
			deck.addCard(redCards[2], 3);
			deck.addCard(redCards[3], 4);

			//2 mana
			deck.addCard(redCards[4], 4);
			deck.addCard(redCards[5], 2);
			deck.addCard(redCards[6], 4);

			//3 mana
			deck.addCard(redCards[8], 4);
			deck.addCard(redCards[9], 2);
			deck.addCard(redCards[10], 2);
			deck.addCard(redCards[11], 4);

			//4 mana
			deck.addCard(redCards[12], 2);
			deck.addCard(redCards[13], 2);
			deck.addCard(redCards[15], 2);
			break;
		case colors.GREEN:
			//1 mana
			deck.addCard(greenCards[0], 2);
			deck.addCard(greenCards[1], 2);
			deck.addCard(greenCards[2], 2);
			deck.addCard(greenCards[3], 4);

			//2 mana
			deck.addCard(greenCards[5], 4);
			deck.addCard(greenCards[6], 2);
			deck.addCard(greenCards[7], 4);
			deck.addCard(greenCards[8], 4);

			//3 mana
			deck.addCard(greenCards[9], 2);
			deck.addCard(greenCards[10], 2);
			deck.addCard(greenCards[11], 4);
			deck.addCard(greenCards[12], 2);

			//4 mana
			deck.addCard(greenCards[13], 2);
			deck.addCard(greenCards[15], 2);
			deck.addCard(greenCards[16], 2);
			break;
	}
	return deck;
}