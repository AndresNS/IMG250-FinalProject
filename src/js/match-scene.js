/*global Phaser*/
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
			color: "#ffffff",
			align: "left",
			fontSize: 13
		});
	},

	select: function () {
		this.setColor("#f8ff38");
	}, //end select

	deselect: function () {
		this.setColor("#ffffff");
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
			if(this.menuItemIndex==3){
				this.menuItems[1].select();
				this.menuItemIndex = 1;
			}else{
				this.menuItems[0].select();
				this.menuItemIndex = 0;
			}
		}
	}, //end moveSelectionUp
	moveSelectionDown: function () {
		if (this.menuItemIndex < 2) {
			this.menuItems[this.menuItemIndex].deselect();
			if(this.menuItemIndex==0){
				this.menuItems[2].select();
				this.menuItemIndex = 2;
			}else{
				this.menuItems[3].select();
				this.menuItemIndex = 3;
			}
		}
	}, //end moveSelectionDown
	moveSelectionLeft: function () {
		if (this.menuItemIndex%2!=0) {
			this.menuItems[this.menuItemIndex].deselect();
			if(this.menuItemIndex==1){
				this.menuItems[0].select();
				this.menuItemIndex = 0;
			}else{
				this.menuItems[2].select();
				this.menuItemIndex = 2;
			}
		}
	}, //end moveSelectionLeft
	moveSelectionRight: function () {
		if (this.menuItemIndex%2==0) {
			this.menuItems[this.menuItemIndex].deselect();
			if(this.menuItemIndex==0){
				this.menuItems[1].select();
				this.menuItemIndex = 1;
			}else{
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
		this.optionsMenuContainer = this.add.container();
		this.phasesContainer = this.add.container();
		this.infoContainer = this.add.container();

		this.optionsMenu = new OptionsMenu(15, 225, this);
		this.optionsMenu.menuItems[0].select();

		this.currentMenu = this.optionsMenu;

		//add menu to the container
		this.optionsMenuContainer.add(this.optionsMenu);

		this.matchScene = this.scene.get("MatchScene");

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