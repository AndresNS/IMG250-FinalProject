/*global Phaser, gameSettings, enemyDeck*/
/*eslint no-undef: "error"*/

let MatchScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function WorldScene() {
		Phaser.Scene.call(this, {
			key: "MatchScene"
		});
	}, //end initialize

	init: function (data) {
		this.cardsImages = {};

		for (let cardId in data[0].deckList) {
			for (let i = 0; i < data[0].deckCards.length; i++) {
				if (data[0].deckCards[i].id == cardId) {
					this.cardsImages[cardId] = data[0].deckCards[i].image_uris.small;
				}
			}
		}
	},

	preload: function () {
		this.load.image("matchBg", "assets/match-bg.png");
		this.load.image("white", "assets/whiteMana.png");
		this.load.image("blue", "assets/blueMana.png");
		this.load.image("black", "assets/blackMana.png");
		this.load.image("red", "assets/redMana.png");
		this.load.image("green", "assets/greenMana.png");
		let scene = this;
		for (let i = 0; i < Object.keys(this.cardsImages).length; i++) {
			scene.load.image(Object.keys(this.cardsImages)[i], scene.cardsImages[Object.keys(this.cardsImages)[i]]);
		}
	}, //end preload

	create: function (data) {
		let matchBg = this.add.sprite(0, 0, "matchBg");
		matchBg.setScale(2);
		matchBg.setOrigin(0, 0);

		this.scene.run("UIScene", data[2]);
		this.startMatch(data);
	}, //end create

	startMatch: function (decks) {
		//load decks
		let playerDeck = decks[0];
		let enemyDeck = decks[1];

		playerDeck.shuffleDeck();
		enemyDeck.shuffleDeck();

		let player = new Player("player", gameSettings.STARTING_LIFE_TOTAL, playerDeck);
		let enemy = new Player("enemy", gameSettings.STARTING_LIFE_TOTAL, enemyDeck);

		//draw hand
		for (let i = 0; i < 3; i++) {
			player.hand.push(player.deck.deckCards.shift());
			enemy.hand.push(enemy.deck.deckCards.shift());
		}

		this.loadHand(player.hand);

		this.nextTurn(player);

		// console.log(player);
		// if (this.chooseFirstPlayer()) {
		// 	//player starts
		// 	this.nextTurn(player);
		// } else {
		// 	//enemy starts
		// 	this.nextTurn(enemy);
		// }

	}, //end startMatch

	loadHand: function (cards) {
		let ui = this.scene.get("UIScene");
		this.cards = [];

		this.handContainer = this.add.container();
		this.hand = new HandUI(0, 0, ui, cards);

		this.handContainer.add(this.hand);
	},

	nextTurn: function (player) {
		//add mana
		player.mana++;

		//draw card
		player.drawCard();

		//next phase (main)
		//play cards

		//next phase (attack)

		//next phase (block)
		//checkEndMatch after damage is done

		//next phase (main2)
		//play cards

	}, //end nextTurn

	nextPhase: function (currentPhase) {


	}, //end nextTurn

	endMatch: function () {

	}, //end endMatch

	checkEndMatch: function (playerLife, enemyLife) {
		let victory = false;
		let defeat = false;

		if (playerLife <= 0) {
			defeat = true;
		}

		if (enemyLife <= 0) {
			victory = true;
		}

		return victory || defeat;
	}, //end endMatch

	loadEnemyDeck: function () {

	}, //end loadEnemyDeck

	loadPlayerDeck: function () {

	}, //end loadPlayerDeck

	chooseFirstPlayer: function () {
		if (Math.random() < 0.5) {
			return true;
		}
		return false;
	}

}); //end MatchScene

let MenuItem = new Phaser.Class({
	Extends: Phaser.GameObjects.Text,

	initialize: function MenuItem(x, y, text, scene) {
		Phaser.GameObjects.Text.call(this, scene, x, y, text, {
			color: "#eeeeee",
			align: "left",
			fontSize: 26
		});
	},

	select: function () {
		this.setStyle({
			color: "#ffffff",
			stroke: "#000000",
			strokeThickness: 5
		});
	}, //end select

	deselect: function () {
		this.setStyle({
			color: "#eeeeee",
			stroke: "#000000",
			strokeThickness: 0
		});
	} //end deselect
}); //end MenuItem

let Menu = new Phaser.Class({
	Extends: Phaser.GameObjects.Container,

	initialize: function Menu(x, y, scene) {
		Phaser.GameObjects.Container.call(this, scene, x, y);

		this.menuItems = [];
		this.menuItemIndex = 0;
		this.x = x;
		this.y = y;
	}, //end initialize

	addMenuItem: function (text) {
		let x = 0;
		let y = 0;

		/*eslint indent: ["error", "tab", { "SwitchCase": 1 }]*/
		switch (this.menuItems.length) {
			case 1:
				x = 150;
				break;
			case 2:
				y = 60;
				break;
			case 3:
				x = 150;
				y = 60;
				break;
		}

		let menuItem = new MenuItem(x, y, text, this.scene);

		this.menuItems.push(menuItem);
		this.add(menuItem);

		return menuItem;
	}, //end addMenuItem

	moveSelectionUp: function () {
		if (this.menuItemIndex > 1) {
			this.menuItems[this.menuItemIndex].deselect();
			if (this.menuItemIndex == 3) {
				this.menuItems[1].select();
				this.menuItemIndex = 1;
			} else {
				this.menuItems[0].select();
				this.menuItemIndex = 0;
			}
		}
	}, //end moveSelectionUp
	moveSelectionDown: function () {
		if (this.menuItemIndex < 2) {
			this.menuItems[this.menuItemIndex].deselect();
			if (this.menuItemIndex == 0) {
				this.menuItems[2].select();
				this.menuItemIndex = 2;
			} else {
				this.menuItems[3].select();
				this.menuItemIndex = 3;
			}
		}
	}, //end moveSelectionDown
	moveSelectionLeft: function () {
		if (this.menuItemIndex % 2 != 0) {
			this.menuItems[this.menuItemIndex].deselect();
			if (this.menuItemIndex == 1) {
				this.menuItems[0].select();
				this.menuItemIndex = 0;
			} else {
				this.menuItems[2].select();
				this.menuItemIndex = 2;
			}
		}
	}, //end moveSelectionLeft
	moveSelectionRight: function () {
		if (this.menuItemIndex % 2 == 0) {
			this.menuItems[this.menuItemIndex].deselect();
			if (this.menuItemIndex == 0) {
				this.menuItems[1].select();
				this.menuItemIndex = 1;
			} else {
				this.menuItems[3].select();
				this.menuItemIndex = 3;
			}
		}
	} //end moveSelectionRight
}); // end Menu

let OptionsMenu = new Phaser.Class({
	Extends: Menu,

	initialize: function (x, y, scene) {
		Menu.call(this, x, y, scene);
		this.addMenuItem("Cast");
		this.addMenuItem("Attack");
		this.addMenuItem("End Turn");
		this.addMenuItem("Concede");
	} //end initialize
}); //end OptionsMenu

let UIScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function UIScene() {
		Phaser.Scene.call(this, {
			key: "UIScene"
		});
	}, //end initialize

	create: function (npc) {

		//Menu containers
		this.optionsMenuContainer = this.add.container();
		this.phasesContainer = this.add.container();
		this.infoContainer = this.add.container();


		//Options Menu
		this.optionsMenu = new OptionsMenu(30, 450, this);
		this.optionsMenu.menuItems[0].select();
		this.optionsMenuContainer.add(this.optionsMenu);

		//Phases
		this.enemyPhases = new PhasesList(710, 36, this);
		this.phasesContainer.add(this.enemyPhases);

		this.playerPhases = new PhasesList(710, 236, this);
		this.playerPhases.phaseItems[0].setActive(); //set active according to starting player
		this.phasesContainer.add(this.playerPhases);

		//Life
		this.enemyLifeCounter = new LifeCounter(16, 136, this);
		this.infoContainer.add(this.enemyLifeCounter);

		this.playerLifeCounter = new LifeCounter(16, 208, this);
		this.infoContainer.add(this.playerLifeCounter);


		//Mana
		this.enemyManaCounter = new Mana(42, 40, this, npc);
		this.infoContainer.add(this.enemyManaCounter);

		this.playerManaCounter = new Mana(42, 306, this, "green");
		this.infoContainer.add(this.playerManaCounter);

		//Initial state
		this.currentMenu = this.optionsMenu;

		// listen for keyboard events
		this.input.keyboard.on("keydown", this.onKeyInput, this);




	}, //end create

	onKeyInput: function (event) {
		switch (event.code) {
			case "ArrowUp":
				this.currentMenu.moveSelectionUp();
				break;
			case "ArrowDown":
				this.currentMenu.moveSelectionDown();
				break;
			case "ArrowRight":
				this.currentMenu.moveSelectionRight();
				break;
			case "ArrowLeft":
				this.currentMenu.moveSelectionLeft();
				break;
		}
	} //end onKeyInput

}); //end UIScene

let PhaseItem = new Phaser.Class({
	Extends: Phaser.GameObjects.Text,

	initialize: function PhaseItem(x, y, text, scene) {
		Phaser.GameObjects.Text.call(this, scene, x, y, text, {
			color: "#ffffff",
			align: "left",
			fontSize: 22
		});
	}, //end initialize

	setActive: function () {
		this.setStyle({
			color: "#ffffff",
			stroke: "#000",
			strokeThickness: 4
		});
	}, //end setActive

	setInactive: function () {
		this.setStyle({
			color: "#ffffff",
			stroke: "#000",
			strokeThickness: 0
		});
	} //end setInactive
}); //end PhaseItem

let Phases = new Phaser.Class({
	Extends: Phaser.GameObjects.Container,

	initialize: function Phases(x, y, scene) {
		Phaser.GameObjects.Container.call(this, scene, x, y);

		this.phaseItems = [];
		this.phaseItemIndex = 0;
		this.x = x;
		this.y = y;
	}, //end initialize

	addPhaseItem: function (text) {
		var phaseItem = new PhaseItem(0, this.phaseItems.length * 36, text, this.scene);
		this.phaseItems.push(phaseItem);
		this.add(phaseItem);
		return phaseItem;
	}, //end addPhaseItem

	nextPhase: function () {

	}, //end nextPhase

}); //end Phases

let PhasesList = new Phaser.Class({
	Extends: Phases,

	initialize: function (x, y, scene) {
		Phases.call(this, x, y, scene);
		this.addPhaseItem("Main");
		this.addPhaseItem("Attack");
		this.addPhaseItem("Block");
		this.addPhaseItem("Main 2");
	} //end initialize
}); //end PhasesList

let LifeText = new Phaser.Class({
	Extends: Phaser.GameObjects.Text,

	initialize: function LifeText(x, y, text, scene) {
		Phaser.GameObjects.Text.call(this, scene, x, y, text, {
			color: "#eeeeee",
			align: "left",
			fontSize: 40,
			stroke: "#000000",
			strokeThickness: 5
		});
	} //end initialize
}); //end LifeText

let LifeCounter = new Phaser.Class({
	Extends: Phaser.GameObjects.Container,

	initialize: function LifeCounter(x, y, scene) {
		Phaser.GameObjects.Container.call(this, scene, x, y);

		this.lifeTotal = gameSettings.STARTING_LIFE_TOTAL;
		this.x = x;
		this.y = y;

		this.lifeText = new LifeText(0, 0, this.lifeTotal, this.scene);
		this.add(this.lifeText);
	}, //end initialize

	changeLife: function (amount) {

	}, //end moveSelectionUp

}); //end LifeCounter

let ManaText = new Phaser.Class({
	Extends: Phaser.GameObjects.Text,

	initialize: function ManaText(x, y, text, scene) {
		Phaser.GameObjects.Text.call(this, scene, x, y, text, {
			color: "#eeeeee",
			align: "left",
			fontSize: 30,
			stroke: "#000000",
			strokeThickness: 4
		});
	} //end initialize
}); //end ManaText

let Mana = new Phaser.Class({
	Extends: Phaser.GameObjects.Container,

	initialize: function Mana(x, y, scene, color) {
		Phaser.GameObjects.Container.call(this, scene, x, y);

		this.totalMana = 0;
		this.currentMana = 0;
		this.x = x;
		this.y = y;

		let manaColor = this.scene.add.sprite(x, y, color);
		// manaColor.setScale(0.8);

		this.manaText = new ManaText(-29, 30, `${this.currentMana}/${this.totalMana}`, this.scene);
		this.add(this.manaText);
	}, //end initialize

	addMana: function () {
		this.totalMana++;
	}, //end addMana

	spendMana: function (quantity) {
		this.currentMana = this.currentMana - quantity;
	}, //end spendMana

}); //end Mana

let CardUI = new Phaser.Class({
	Extends: Phaser.GameObjects.Sprite,

	initialize: function CardUI(scene, x, y, texture, frame, cost, power, toughness, color) {
		Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame);

		this.cost = cost;
		this.power = power;
		this.toughness = toughness;
		this.color = color;
		this.damage = 0;
	}, //end initialize

	attack: function () {

	}, //end attack

	block: function (target) {

	}, //end block

	takeDamage: function () {

	}, //end takeDamage

	resetDamage: function () {

	} //end resetDamage
}); //end CardUI

let HandUI = new Phaser.Class({
	Extends: Phaser.GameObjects.Container,

	initialize: function HandUI(x, y, scene, cards) {
		Phaser.GameObjects.Container.call(this, scene, x, y);
		this.cards = cards;
		this.x = x;
		this.y = y;
		this.card = [];

		for (let i = 0; i < this.cards.length; i++) {
			// let card = this.scene.add.sprite(i * 55 + 195, 250, this.cards[i].id);
			// card.setScale(0.36);
			let card = this.scene.add.sprite(i * 110 + 390, 500, this.cards[i].id);
			card.setScale(0.7);
		}
	},

	addCard: function () {

	},

	playCard: function (cardIndex) {

	},

	moveSelectionLeft: function () {

	},

	moveSelectionRight: function () {

	}
}); //end HandUI

function Player(type, life, deck) {
	this.type = type;
	this.life = life;
	this.deck = deck;
	this.hand = [];
	this.drawCard = function () {
		this.hand.push(this.deck.deckCards.shift());
	};
}