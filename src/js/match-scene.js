/*global Phaser, gameSettings, controls*/
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

		this.player = new Player("player", gameSettings.STARTING_LIFE_TOTAL, playerDeck);
		this.enemy = new Player("enemy", gameSettings.STARTING_LIFE_TOTAL, enemyDeck);

		//draw hand
		for (let i = 0; i < 3; i++) {
			this.player.hand.push(this.player.deck.deckCards.shift());
			this.enemy.hand.push(this.enemy.deck.deckCards.shift());
		}

		this.nextTurn(this.player);


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
		if (typeof ui.handContainer !== "undefined") {
			for (let i = 0; i < ui.hand.card.length; i++) {
				ui.hand.card[i].destroy();
			}
		}
		ui.cards = [];

		ui.handContainer = ui.add.container();
		ui.hand = new HandUI(0, 0, ui, cards);
		ui.handContainer.add(ui.hand);
	},

	nextTurn: function (player) {
		//add mana
		player.mana++;

		//draw card
		player.drawCard();
		this.loadHand(player.hand);

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
	}, //end moveSelectionRight
	selectOption: function (option, menu) {
		switch (option) {
			case 0:
				if (menu.type == "actions") {
					//cast
					let uiScene = menu.scene;

					uiScene.hand.createSelector(uiScene, 0, 0);

					uiScene.currentMenu = uiScene.hand;
				}
				break;
			case 1:
				if (menu.type == "actions") {
					//attack
					console.log("attack");
				}
				break;
			case 2:
				if (menu.type == "actions") {
					//end turn
					console.log("end turn");
				}
				break;
			case 3:
				if (menu.type == "actions") {
					//concede
					console.log("concede");
				}
				break;
		}
	}
}); // end Menu

let OptionsMenu = new Phaser.Class({
	Extends: Menu,

	initialize: function (x, y, scene, type, options) {
		Menu.call(this, x, y, scene);
		this.type = type;
		this.options = options;
		this.addOptions(this.options, this);
	}, //end initialize

	addOptions: function (options, scene) {
		for (let i = 0; i < options.length; i++) {
			scene.addMenuItem(options[i]);
		}
	} //end addOptions
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
		this.playerBattlefieldContainer = this.add.container();
		this.enemyBattlefieldContainer = this.add.container();

		//Battlefields
		// this.enemyBattlefield = new Battlefield(110, 110, this);
		// this.enemyBattlefieldContainer.add(this.playerBattlefield);
		this.playerBattlefield = new Battlefield(150, 300, this);
		this.playerBattlefieldContainer.add(this.playerBattlefield);


		//Options Menu
		let options = ["Cast", "Attack", "End Turn", "Concede"];
		this.optionsMenu = new OptionsMenu(30, 450, this, "actions", options);
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
		if (this.currentMenu.type == "actions") {
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
				case controls.INTERACT:
					this.currentMenu.menuItems[this.currentMenu.menuItemIndex].deselect();
					this.currentMenu.selectOption(this.currentMenu.menuItemIndex, this.currentMenu);
					break;
			}
		} else {
			switch (event.code) {
				case "ArrowRight":

					this.currentMenu.moveSelectionRight(this.currentMenu);
					break;
				case "ArrowLeft":
					this.currentMenu.moveSelectionLeft(this.currentMenu);
					break;
				case controls.INTERACT:
					this.currentMenu.playCard(this.currentMenu.selectorPosition, this);
					break;
			}
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
	Extends: Phaser.GameObjects.Image,

	initialize: function CardUI(scene, x, y, texture, frame, cost, power, toughness, color) {
		Phaser.GameObjects.Image.call(this, scene, x, y, texture, frame);
		this.x = x;
		this.y = y;
		this.cost = cost;
		this.power = power;
		this.toughness = toughness;
		this.color = color;
		this.damage = 0;

		this.setScale(0.7);
		scene.add.existing(this);
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

let Battlefield = new Phaser.Class({
	Extends: Phaser.GameObjects.Container,

	initialize: function Battlefield(x, y, scene) {
		Phaser.GameObjects.Container.call(this, scene, x, y);
		this.x = x;
		this.y = y;
		this.cards = [];
	},

	addCard: function (cardObject, cardIndex, player) {
		player.playCard(cardIndex);
		
		let card = new CardUI(this.scene, this.x * (this.cards.length + 1), this.y, cardObject.id, null, 1, 1, 1, "W");
		this.cards.push(cardObject);
	}
});


let HandUI = new Phaser.Class({
	Extends: Phaser.GameObjects.Container,

	initialize: function HandUI(x, y, scene, cards) {
		Phaser.GameObjects.Container.call(this, scene, x, y);
		this.cards = cards;
		this.x = x;
		this.y = y;
		this.card = [];
		this.selectorPosition = 0;
		this.selector;

		for (let i = 0; i < this.cards.length; i++) {
			this.card[i] = new CardUI(scene, (i + 1) * 115 + 275, 500, this.cards[i].id, null, 1, 1, 1, "W");
		}
	},

	addCard: function (card, hand) {
		hand.push(card);
	}, //end addCard

	playCard: function (card, scene) {
		let matchScene = scene.scene.get("MatchScene");
		
		scene.playerBattlefield.addCard(scene.hand.cards[card], card, matchScene.player);
		matchScene.loadHand(matchScene.player.hand);
		scene.currentMenu.selector.destroy();
		scene.currentMenu = scene.optionsMenu;
		scene.currentMenu.menuItems[scene.currentMenu.menuItemIndex].select();
	}, //end playCard

	moveSelectionLeft: function (menu) {
		if (this.selectorPosition > 0) {
			this.selectorPosition--;
			this.selector.destroy();
			this.createSelector(menu.scene, 115 * (this.selectorPosition), 0);
		}
	}, //end moveSelectionLeft

	moveSelectionRight: function (menu) {
		if (this.selectorPosition < this.cards.length - 1) {
			this.selectorPosition++;
			this.selector.destroy();
			this.createSelector(menu.scene, 115 * (this.selectorPosition), 0);
		}
	}, //end moveSelectionRight

	createSelector: function (scene, x, y) {

		this.selector = new CardSelector(scene, 390 + x, 500 + y, [
			0, 0,
			0, 187,
			114, 187,
			114, 0
		]);
	} //end createSelector
}); //end HandUI

let CardSelector = new Phaser.Class({
	Extends: Phaser.GameObjects.Polygon,

	initialize: function CardSelector(scene, x, y, points) {
		Phaser.GameObjects.Polygon.call(this, scene, x, y, points);

		this.setStrokeStyle(5, 0xffffff, 1);
		this.setFillStyle(0xffffff, 0);

		scene.add.existing(this);
	} //end initialize
}); //end CardSelector

function Player(type, life, deck) {
	this.type = type;
	this.life = life;
	this.deck = deck;
	this.battlefield = [];
	this.hand = [];
	this.playCard = function (cardIndex) {
		this.battlefield.push(this.hand[cardIndex]);
		this.hand.splice(cardIndex, 1);
	};
	this.drawCard = function () {
		this.hand.push(this.deck.deckCards.shift());
	};
}