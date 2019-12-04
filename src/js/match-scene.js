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
		this.playerCardsImages = {};
		this.enemyCardsImages = {};

		for (let cardId in data[0].deckList) {
			for (let i = 0; i < data[0].deckCards.length; i++) {
				if (data[0].deckCards[i].id == cardId) {
					this.playerCardsImages[cardId] = data[0].deckCards[i].image_uris.small;
				}
			}
		}

		for (let cardId in data[1].deckList) {
			for (let i = 0; i < data[1].deckCards.length; i++) {
				if (data[1].deckCards[i].id == cardId) {
					this.enemyCardsImages[cardId] = data[1].deckCards[i].image_uris.small;
				}
			}
		}
	},

	preload: function () {
		this.load.image("matchBg", "assets/match-bg.png");
		this.load.image("W", "assets/whiteMana.png");
		this.load.image("U", "assets/blueMana.png");
		this.load.image("B", "assets/blackMana.png");
		this.load.image("R", "assets/redMana.png");
		this.load.image("G", "assets/greenMana.png");
		let scene = this;
		for (let i = 0; i < Object.keys(this.playerCardsImages).length; i++) {
			scene.load.image(Object.keys(this.playerCardsImages)[i], scene.playerCardsImages[Object.keys(this.playerCardsImages)[i]]);
		}
		for (let i = 0; i < Object.keys(this.enemyCardsImages).length; i++) {
			scene.load.image(Object.keys(this.enemyCardsImages)[i], scene.enemyCardsImages[Object.keys(this.enemyCardsImages)[i]]);
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
		let ui = this.scene.get("UIScene");
		ui.updateMana(this.player);
		ui.updateMana(this.enemy);

		// if (this.chooseFirstPlayer()) {
		// 	//player starts
		// 	this.nextTurn(player);
		// } else {
		// 	//enemy starts
		// 	this.nextTurn(enemy);
		// }


		// this.nextTurn(this.player);

		this.player.totalMana++;
		this.player.currentMana = this.player.totalMana;
		ui.updateMana(this.player);

		//draw card
		this.player.drawCard();
		this.loadHand(this.player.hand);


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
		let ui = this.scene.get("UIScene");
		let matchScene = this;

		ui.playerBattlefield.selectorPosition = 0;
		ui.enemyBattlefield.selectorPosition = 0;

		//add mana
		if (player.totalMana < 8) {
			player.totalMana++;
			player.currentMana = player.totalMana;
			ui.updateMana(player);
		}

		//Reset player attackers and damage
		if (player.battlefield.length > 0) {
			for (let i = 0; i < player.battlefield.length; i++) {
				player.battlefield[i].declaredAttacker = false;
				player.battlefield[i].damage = 0;
			}
		}
		if (ui.playerBattlefield.cards.length > 0) {
			for (let i = 0; i < ui.playerBattlefield.cards.length; i++) {
				ui.playerBattlefield.cards[i].declaredAttacker = false;
				ui.playerBattlefield.cards[i].damage = 0;
			}
		}
		if (ui.enemyBattlefield.cards.length > 0) {
			for (let i = 0; i < ui.enemyBattlefield.cards.length; i++) {
				ui.enemyBattlefield.cards[i].declaredAttacker = false;
				ui.enemyBattlefield.cards[i].damage = 0;
			}
		}

		if (player.type == "enemy") {
			let message = ui.add.text(322, 180, "Enemy Turn", {
				color: "#eeeeee",
				align: "left",
				fontSize: 23,
				stroke: "#000000",
				strokeThickness: 5
			});

			player.drawCard();

			setTimeout(function () {
				message.destroy();

				//play cards
				for (let i = 0; i < player.hand.length; i++) {
					if (player.hand[i].cmc <= player.currentMana && player.battlefield.length < 4) {
						let cmc = player.hand[i].cmc;
						ui.enemyBattlefield.addCard(player.hand[i], i, player);
						player.currentMana = player.currentMana - cmc;
						ui.updateMana(player);
					}
				}


				//attack
				setTimeout(function () {
					if (matchScene.player.battlefield.length == 0) {
						//no blockers
						for (let i = 0; i < player.battlefield.length; i++) {
							if (!player.battlefield[i].declaredAttacker) {
								setTimeout(function () {
									matchScene.player.life = matchScene.player.life - player.battlefield[i].power;
									if (matchScene.player.life <= 0) {
										matchScene.scene.stop("MatchScene");
										matchScene.scene.stop("UIScene");
										matchScene.scene.wake("WorldScene");
										let id = window.setTimeout(function () {}, 0);

										while (id--) {
											window.clearTimeout(id);
										}
										return;
									}
									player.battlefield[i].declaredAttacker = true;
									ui.playerLifeCounter.destroy();
									ui.playerLifeCounter = new LifeCounter(16, 208, ui, matchScene.player.life);
									ui.infoContainer.add(ui.playerLifeCounter);
									matchScene.cameras.main.shake(100, 0.01);
									console.log(player.battlefield[i].name + " is attacking you for " + player.battlefield[i].power);

								}, 1000);
							}
						}

					} else {
						//attack player's creatures
						for (let i = 0; i < ui.enemyBattlefield.cards.length; i++) {
							if (!ui.enemyBattlefield.cards[i].declaredAttacker && matchScene.player.battlefield.length > 0) {
								//get enemy creature with the lowest toughness
								let weakerCreatureIndex = 0;
								for (let i = 0; i < matchScene.player.battlefield.length; i++) {
									if (matchScene.player.battlefield[i].toughness < matchScene.player.battlefield[weakerCreatureIndex].toughness) {
										weakerCreatureIndex = i;
									}
								}

								if (ui.enemyBattlefield.cards[i].toughness > matchScene.player.battlefield[weakerCreatureIndex].power) {
									//deal damage
									ui.enemyBattlefield.cards[i].damage = ui.enemyBattlefield.cards[i].damage + parseInt(ui.playerBattlefield.cards[weakerCreatureIndex].power);
									ui.playerBattlefield.cards[weakerCreatureIndex].damage = ui.playerBattlefield.cards[weakerCreatureIndex].damage + parseInt(ui.enemyBattlefield.cards[i].power);

									console.log(`Attacking Creature: ${ui.enemyBattlefield.cards[i].power} / ${ui.enemyBattlefield.cards[i].toughness}, Damage: ${ui.enemyBattlefield.cards[i].damage}`);
									console.log(`Defending Creature: ${ui.playerBattlefield.cards[weakerCreatureIndex].power} / ${ui.playerBattlefield.cards[weakerCreatureIndex].toughness}, Damage: ${ui.playerBattlefield.cards[weakerCreatureIndex].damage}`);

									ui.enemyBattlefield.cards[i].declaredAttacker = true;

									if (ui.enemyBattlefield.cards[i].damage >= ui.enemyBattlefield.cards[i].toughness) {
										console.log("attackingCreature dead");
										ui.enemyBattlefield.cards[i].destroy();
										ui.enemyBattlefield.removeCard(ui.enemyBattlefield.selectorPosition, matchScene.enemy);

										ui.enemyBattlefield.reloadBattlefield(ui);
									}


									if (ui.playerBattlefield.cards[weakerCreatureIndex].damage >= ui.playerBattlefield.cards[weakerCreatureIndex].toughness) {
										console.log("target creature dead");
										ui.playerBattlefield.cards[weakerCreatureIndex].destroy();

										ui.playerBattlefield.removeCard(ui.playerBattlefield.selectorPosition, matchScene.player);

										ui.playerBattlefield.reloadBattlefield(ui);
									}
								}
							}
						}
					}
				}, 1000);

			}, 1000);

			setTimeout(function () {
				console.log("enemy turn ends");
				matchScene.nextTurn(matchScene.player);
			}, 4000);

		} else {

			let message = ui.add.text(322, 180, "Your Turn", {
				color: "#eeeeee",
				align: "left",
				fontSize: 23,
				stroke: "#000000",
				strokeThickness: 5
			});

			setTimeout(function () {
				message.destroy();
			}, 1000);

			ui.currentMenu = ui.optionsMenu;
			ui.currentMenu.menuItemIndex = 0;
			ui.currentMenu.menuItems[ui.currentMenu.menuItemIndex].select();
			console.log("player turn starts");

			player.drawCard();
			matchScene.loadHand(player.hand);
		}

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
		let uiScene = menu.scene;
		let matchScene = uiScene.scene.get("MatchScene");
		switch (option) {
			case 0:
				//cast
				uiScene.hand.createSelector(uiScene, 0, 0);
				uiScene.currentMenu = uiScene.hand;
				break;
			case 1:
				//attack
				uiScene.playerBattlefield.createSelector(uiScene, 0, 0);
				uiScene.currentMenu = uiScene.playerBattlefield;
				break;
			case 2:
				//end turn
				matchScene.nextTurn(matchScene.enemy);
				uiScene.currentMenu = null;


				break;
			case 3:
				//concede
				console.log("concede");

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

	create: function () {

		//Menu containers
		this.optionsMenuContainer = this.add.container();
		this.phasesContainer = this.add.container();
		this.infoContainer = this.add.container();
		this.playerBattlefieldContainer = this.add.container();
		this.enemyBattlefieldContainer = this.add.container();

		//Battlefields
		this.enemyBattlefield = new Battlefield(150, 90, this);
		this.enemyBattlefield.name = "enemyBattlefield";
		this.enemyBattlefieldContainer.add(this.enemyBattlefield);
		this.playerBattlefield = new Battlefield(150, 300, this);
		this.playerBattlefield.name = "playerBattlefield";
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
		this.enemyLifeCounter = new LifeCounter(16, 136, this, gameSettings.STARTING_LIFE_TOTAL);
		this.infoContainer.add(this.enemyLifeCounter);

		this.playerLifeCounter = new LifeCounter(16, 208, this, gameSettings.STARTING_LIFE_TOTAL);
		this.infoContainer.add(this.playerLifeCounter);

		//Initial state
		this.currentMenu = this.optionsMenu;

		// listen for keyboard events
		this.input.keyboard.on("keydown", this.onKeyInput, this);

	}, //end create

	updateMana: function (player) {
		this.infoContainer = this.add.container();
		if (player.type == "player") {
			if (typeof this.playerManaCounter != "undefined") {
				this.playerManaCounter.destroy();
			}
			this.playerManaCounter = new Mana(42, 306, this, player.deck.color, player.totalMana, player.currentMana);
			this.infoContainer.add(this.playerManaCounter);
		} else {
			if (typeof this.enemyManaCounter != "undefined") {
				this.enemyManaCounter.destroy();
			}
			this.enemyManaCounter = new Mana(42, 40, this, player.deck.color, player.totalMana, player.currentMana);
			this.infoContainer.add(this.enemyManaCounter);
		}
	},

	onKeyInput: function (event) {
		if (this.currentMenu != null) {
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
						if (this.playerBattlefield.cards.length == 0 && this.currentMenu.menuItemIndex == 1) {
							console.log("no creatures in battlefield.");
						} else {
							this.currentMenu.menuItems[this.currentMenu.menuItemIndex].deselect();
							this.currentMenu.selectOption(this.currentMenu.menuItemIndex, this.currentMenu);
						}
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
						if (this.currentMenu.name == "playerBattlefield") {
							let attackerCreature = this.playerBattlefield.cards[this.currentMenu.selectorPosition];
							if (!attackerCreature.declaredAttacker) {
								this.currentMenu.declareAttacker(this.playerBattlefield.cards[this.currentMenu.selectorPosition], this);
							} else {

								let message = this.add.text(110, 180, "This creature already attacked this turn.", {
									color: "#eeeeee",
									align: "left",
									fontSize: 23,
									stroke: "#000000",
									strokeThickness: 5
								});
								this.scene.pause();

								let uiScene = this;

								setTimeout(function () {
									uiScene.scene.resume();
									message.destroy();
									uiScene.currentMenu.selector.destroy();
									uiScene.currentMenu = uiScene.optionsMenu;
									uiScene.currentMenu.menuItems[uiScene.currentMenu.menuItemIndex].select();
								}, 1000);

								this.playerBattlefield.selectorPosition = 0;
								this.enemyBattlefield.selectorPosition = 0;
							}

						} else if (this.currentMenu.name == "enemyBattlefield") {
							this.currentMenu.dealDamage(this.playerBattlefield.cards[this.playerBattlefield.selectorPosition], this.enemyBattlefield.cards[this.enemyBattlefield.selectorPosition], this);


							this.playerBattlefield.selector.destroy();
							this.currentMenu.selector.destroy();
							this.currentMenu = this.optionsMenu;
							this.currentMenu.menuItems[this.currentMenu.menuItemIndex].select();

							this.playerBattlefield.selectorPosition = 0;
							this.enemyBattlefield.selectorPosition = 0;
						} else {
							this.currentMenu.playCard(this.currentMenu.selectorPosition, this);
						}
						break;
					case controls.CANCEL:
						if (this.currentMenu.name == "enemyBattlefield") {
							this.playerBattlefield.cards[this.currentMenu.selectorPosition].declaredAttacker = false;
							this.playerBattlefield.selector.destroy();
						}
						this.currentMenu.selector.destroy();
						this.currentMenu = this.optionsMenu;
						this.currentMenu.menuItems[this.currentMenu.menuItemIndex].select();

						this.playerBattlefield.selectorPosition = 0;
						this.enemyBattlefield.selectorPosition = 0;
						break;
				}
			}
		} else {
			console.log("Oponent's turn");
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

	initialize: function LifeCounter(x, y, scene, life) {
		Phaser.GameObjects.Container.call(this, scene, x, y);

		this.lifeTotal = life;
		this.x = x;
		this.y = y;

		this.lifeText = new LifeText(0, 0, this.lifeTotal, this.scene);
		this.add(this.lifeText);
	} //end initialize

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

	initialize: function Mana(x, y, scene, color, totalMana, currentMana) {
		Phaser.GameObjects.Container.call(this, scene, x, y);

		this.totalMana = totalMana;
		this.currentMana = currentMana;
		this.x = x;
		this.y = y;

		let manaColor = this.scene.add.sprite(x, y, color);
		// manaColor.setScale(0.8);

		this.manaText = new ManaText(-29, 30, `${this.currentMana}/${this.totalMana}`, this.scene);
		this.add(this.manaText);
	}, //end initialize

	addMana: function () {
		this.totalMana++;
		this.manaText.destroy();
		this.manaText = new ManaText(-29, 30, `${this.currentMana}/${this.totalMana}`, this.scene);
		this.add(this.manaText);
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
		this.declaredAttacker = false;
		this.alive = true;

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
		this.selectorPosition = 0;
	},

	addCard: function (cardObject, cardIndex, player) {
		player.playCard(cardIndex);

		let card = new CardUI(this.scene, this.x * (this.cards.length + 1), this.y, cardObject.id, null, cardObject.cmc, cardObject.power, cardObject.toughness, cardObject.colors[0]);
		this.cards.push(card);
	}, //end addCard

	removeCard: function (cardIndex, player) {
		player.destroyCard(cardIndex);
		this.cards.splice(cardIndex, 1);
	}, //end removeCard

	dealDamage: function (attackingCreature, defendingCreature, scene) {
		let matchScene = scene.scene.get("MatchScene");
		//deal damage
		attackingCreature.damage = attackingCreature.damage + parseInt(defendingCreature.power);
		defendingCreature.damage = defendingCreature.damage + parseInt(attackingCreature.power);

		console.log(`Attacking Creature: ${attackingCreature.power} / ${attackingCreature.toughness}, Damage: ${attackingCreature.damage}`);
		console.log(`Defending Creature: ${defendingCreature.power} / ${defendingCreature.toughness}, Damage: ${defendingCreature.damage}`);

		if (attackingCreature.damage >= attackingCreature.toughness) {
			console.log("attackingCreature dead");
			attackingCreature.destroy();
			scene.playerBattlefield.removeCard(scene.playerBattlefield.selectorPosition, matchScene.player);

			scene.playerBattlefield.reloadBattlefield(scene);
		}

		if (defendingCreature.damage >= defendingCreature.toughness) {
			console.log("target creature dead");
			defendingCreature.destroy();
			scene.enemyBattlefield.removeCard(scene.enemyBattlefield.selectorPosition, matchScene.enemy);

			scene.enemyBattlefield.reloadBattlefield(scene);
		}

		matchScene.cameras.main.shake(100, 0.01);
	}, //end dealDamage

	declareAttacker: function (attackingCard, scene) {
		let matchScene = scene.scene.get("MatchScene");
		let enemy = matchScene.enemy;
		if (matchScene.enemy.battlefield.length > 0) {
			//select enemy creature
			scene.enemyBattlefield.createSelector(scene, 0, -200);
			scene.currentMenu = scene.enemyBattlefield;
		} else {
			//no blockers
			enemy.life = enemy.life - attackingCard.power;
			scene.enemyLifeCounter.destroy();
			scene.enemyLifeCounter = new LifeCounter(16, 136, scene, enemy.life);
			scene.infoContainer.add(scene.enemyLifeCounter);
			matchScene.cameras.main.shake(100, 0.01);

			scene.currentMenu.selector.destroy();
			scene.currentMenu = scene.optionsMenu;
			scene.currentMenu.menuItems[scene.currentMenu.menuItemIndex].select();

			if (enemy.life <= 0) {
				matchScene.scene.stop("MatchScene");
				matchScene.scene.stop("UIScene");
				matchScene.scene.wake("WorldScene");
				let id = window.setTimeout(function () {}, 0);

				while (id--) {
					window.clearTimeout(id);
				}
				return;
			}
		}
		attackingCard.declaredAttacker = true;

	}, //end declareAttacker

	reloadBattlefield: function (scene) {
		let matchScene = scene.scene.get("MatchScene");
		let tempCards = [];

		for (let i = 0; i < this.cards.length; i++) {
			tempCards.push(this.cards[i]);
		}
		for (let i = 0; i < this.cards.length; i++) {
			this.cards[i].destroy();
		}

		for (let i = 0; i < this.cards.length; i++) {
			let cardObject;
			if (this.name == "playerBattlefield") {
				cardObject = matchScene.player.battlefield[i];
			} else {
				cardObject = matchScene.enemy.battlefield[i];
			}
			let card = new CardUI(this.scene, this.x * (i + 1), this.y, cardObject.id, null, cardObject.cmc, cardObject.power, cardObject.toughness, cardObject.colors[0]);
			card.declaredAttacker = tempCards[i].declaredAttacker;
			this.cards[i] = card;
		}

	},

	moveSelectionLeft: function (menu) {
		if (this.selectorPosition > 0) {
			this.selectorPosition--;
			this.selector.destroy();
			this.createSelector(menu.scene, 150 * (this.selectorPosition), this.selector.y - 299);
		}
	}, //end moveSelectionLeft

	moveSelectionRight: function (menu) {
		if (this.selectorPosition < this.cards.length - 1) {
			this.selectorPosition++;
			this.selector.destroy();
			this.createSelector(menu.scene, 150 * (this.selectorPosition), this.selector.y - 299);
		}
	}, //end moveSelectionRight

	createSelector: function (scene, x, y) {

		this.selector = new CardSelector(scene, 150 + x, 299 + y, [
			0, 0,
			0, 187,
			114, 187,
			114, 0
		]);
	} //end createSelector
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
			this.card[i] = new CardUI(scene, (i + 1) * 115 + 275, 500, this.cards[i].id, null, this.cards[i].cmc, this.cards[i].power, this.cards[i].toughness, this.cards[i].colors[0]);
		}
	},

	addCard: function (card, hand) {
		hand.push(card);
	}, //end addCard

	playCard: function (cardIndex, scene) {
		let matchScene = scene.scene.get("MatchScene");
		let currentMana = matchScene.player.currentMana;
		let cmc = scene.hand.cards[cardIndex].cmc;
		if (currentMana < cmc) {
			let message = scene.add.text(210, 180, "You don't have enough mana.", {
				color: "#eeeeee",
				align: "left",
				fontSize: 23,
				stroke: "#000000",
				strokeThickness: 5
			});
			// scene.scene.pause();

			setTimeout(function () {
				// scene.scene.resume();
				message.destroy();
			}, 1000);
		} else {
			scene.playerBattlefield.addCard(scene.hand.cards[cardIndex], cardIndex, matchScene.player);
			matchScene.loadHand(matchScene.player.hand);
			scene.currentMenu.selector.destroy();
			scene.currentMenu = scene.optionsMenu;
			scene.currentMenu.menuItems[scene.currentMenu.menuItemIndex].select();
			currentMana = currentMana - cmc;
			matchScene.player.currentMana = currentMana;
			this.scene.updateMana(matchScene.player);
		}


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
	this.currentMana = 0;
	this.totalMana = 0;
	this.playCard = function (cardIndex) {
		this.battlefield.push(this.hand[cardIndex]);
		this.hand.splice(cardIndex, 1);
	};
	this.destroyCard = function (cardIndex) {
		this.battlefield.splice(cardIndex, 1);
	};
	this.drawCard = function () {
		if (this.hand.length < 4) {
			this.hand.push(this.deck.deckCards.shift());
		}
	};
}