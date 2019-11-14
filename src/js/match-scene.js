/*global Phaser, gameSettings*/
/*eslint no-undef: "error"*/

let MatchScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function WorldScene() {
		Phaser.Scene.call(this, {
			key: "MatchScene"
		});
	}, //end initialize

	preload: function () {
		this.load.image("matchBg", "assets/match-bg.png");
		this.load.image("white", "assets/whiteMana.png");
		this.load.image("blue", "assets/blueMana.png");
		this.load.image("black", "assets/blackMana.png");
		this.load.image("red", "assets/redMana.png");
		this.load.image("green", "assets/greenMana.png");
	}, //end preload

	create: function () {
		let matchBg = this.add.sprite(0, 0, "matchBg");
		matchBg.setOrigin(0, 0);

		this.scene.run("UIScene");
	}, //end create

	update: function () {

	} //end update

}); //end MatchScene

let MenuItem = new Phaser.Class({
	Extends: Phaser.GameObjects.Text,

	initialize: function MenuItem(x, y, text, scene) {
		Phaser.GameObjects.Text.call(this, scene, x, y, text, {
			color: "#dddddd",
			align: "left",
			fontSize: 13
		});
	},

	select: function () {
		this.setStyle({
			color: "#ffffff",
			stroke: "#000000",
			strokeThickness: 3
		});
	}, //end select

	deselect: function () {
		this.setStyle({
			color: "#dddddd",
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
				x = 75;
				break;
			case 2:
				y = 30;
				break;
			case 3:
				x = 75;
				y = 30;
				break;
		}

		let menuItem = new MenuItem(x, y, text, this.scene);

		this.menuItems.push(menuItem);
		this.add(menuItem);
		// this.menuItemIndex++;

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

	create: function () {

		//Menu containers
		this.optionsMenuContainer = this.add.container();
		this.phasesContainer = this.add.container();
		this.infoContainer = this.add.container();

		//Options Menu
		this.optionsMenu = new OptionsMenu(15, 225, this);
		this.optionsMenu.menuItems[0].select();
		this.optionsMenuContainer.add(this.optionsMenu);

		//Phases
		this.enemyPhases = new PhasesList(355, 18, this);
		this.phasesContainer.add(this.enemyPhases);

		this.playerPhases = new PhasesList(355, 118, this);
		this.playerPhases.phaseItems[0].setActive(); //set active according to starting player
		this.phasesContainer.add(this.playerPhases);

		//Life
		this.enemyLifeCounter = new LifeCounter(7, 67, this);
		this.infoContainer.add(this.enemyLifeCounter);

		this.playerLifeCounter = new LifeCounter(7, 103, this);
		this.infoContainer.add(this.playerLifeCounter);


		//Mana
		this.enemyManaCounter = new Mana(21, 20, this, "red");
		this.infoContainer.add(this.enemyManaCounter);

		this.playerManaCounter = new Mana(21, 153, this, "green");
		this.infoContainer.add(this.playerManaCounter);


		//Initial state
		this.currentMenu = this.optionsMenu;

		// listen for keyboard events
		this.input.keyboard.on("keydown", this.onKeyInput, this);


		// this.matchScene = this.scene.get("MatchScene");

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
			color: "#eeeeee",
			align: "left",
			fontSize: 11
		});
	}, //end initialize

	setActive: function () {
		this.setStyle({
			color: "#ffffff",
			stroke: "#000",
			strokeThickness: 3
		});
	}, //end setActive

	setInactive: function () {
		this.setStyle({
			color: "#eeeeee",
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
		var phaseItem = new PhaseItem(0, this.phaseItems.length * 18, text, this.scene);
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
			fontSize: 20,
			stroke: "#000000",
			strokeThickness: 3
		});
	}//end initialize
});//end LifeText

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
			fontSize: 15,
			stroke: "#000000",
			strokeThickness: 3
		});
	}//end initialize
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
		manaColor.setScale(0.4);

		this.manaText = new ManaText(-16, 15, `${this.currentMana}/${this.totalMana}`  , this.scene);
		this.add(this.manaText);
	}, //end initialize

	addMana: function () {
		this.totalMana++;
	}, //end addMana

	spendMana: function (quantity) {
		this.currentMana = this.currentMana - quantity;
	}, //end spendMana

}); //end Mana