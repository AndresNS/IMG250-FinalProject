# IMG250 - End of Semester Project

*Student Name: Andrés Navarro Silva*

This repository contains my project for the course *IMG-250, Applied JavaScript*, an RPG/Card Game developed in JavaScript using the [Phaser 3](https://phaser.io/) library and the [Scryfall API](https://scryfall.com/docs/api).

## Description

This project is an RPG game based in the Magic: The Gathering trading card game. As a player, you will start in an island where there are 5 NPC's, each one representing one of the 5 colors of Magic (White, Blue, Black, Red and Green). Whenever you encounter an NPC, a match will starts in which both of you have to battle against each other in a turn based card game. When the match begins, each player starts with a total of 20 lives, and whoever manage to get the opponent life to 0 wins the match. During each turn you get mana to cast different creatures that will fight for you and can attack at your opponent or at his/her creatures.

The game is built around 2 main scenes: the *World Scene*, in which the NPC's are loaded and the character can walk through to encounter them, and the *Match Scene*, where the card game happens. In the last one, when the match starts, the game will fetch the necesary cards from the Scryfall API depending on the NPC encountered. Then, each player will draw a hand of 3 random cards and each turn the active player will draw an additional card. During the player turn, he/she will be able to cast creatures based on the current mana and attack with them at an enemy creature or directly at the opponent's life if he/she doesn't have any creatures.

Next, there are some issues that can affect the game experience in the current state of the game:
- When the player encounter an NPC, there is a black screen that was added to give some time to the game to fetch the cards needed for the match. In some cases, that time is not enough to get the cards needed (depending on the internet speed), meaning the match will start, but it won't load any cards and the cards in the deck will be "undefined". This issue can be solved by turning that black screen into a transition scene with a "loading" message and change to th match scene when all the cards are fetched. A second option could be to have a loading screen at the start of the game where all the cards available in the game are fetched, instead of having it at the start of each match, that way the card will be in memory before the match start.
- During the match, I use some "setTimeOut" functions to show messages and to control the AI turn. Those delays ocassionaly cause the game to "bug" the selectors used to choose which card to play or declare as attacker.
- I created a file called *"data.js"* used to store the game settings and easily modify them if necessary. However, the controls settings only works with some of the keys listed [here](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/keyboardevents/#key-map), for some reason I was not able to assing some of the letters.
- If the same *"data.js"* file, if the *WALK_SPEED* value is set too high, the character will ignore any collision, allowing you to walk in the water.

At the time of this submission, the game is not optimal in terms of code design, efficiency, resources optimization, etc, but I think, it has a decent playability. If I had to make some changes to develop a more stable demo, I would change the way how I'm currently fetching the cards and probably create a loading screen at the beginning of the game instead at the beginning of each match.


## Chosen Library: Phaser 3

In web development, probably the main tool for manipulating graphics is the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API), and if you want to develop a game it would be necessary to manually code everything, from the physics to all kind of graphic resources and interactiones between them, which can take a long time. Fortunately, there are some libraries and frameworks that can do all the hard work for us, like Phaser.

Phaser 3 is a Javascript library/framework that uses canvas and WebGL as renderer. It is most used for developing platform games, but because it has tools to manipulate the camera and physics it makes possible to build other types of games like RPG's. In addition, Phaser 3 has a lot of features that can be used to control game objects, scenes, events and other generic tools that make data manipulation easier. In syntesis, it is library that has everything you need to build a vast variety of games.

Phaser let us define an Object with the configuration data for the game and then create a Game instance passing the configuration object.

```
let config = {
	type: Phaser.AUTO,
	parent: "game-container",
	width: 800,
	height: 600,
	pixelArt: true,
	physics: {
		default: "arcade",
		arcade: {
			gravity: {
				y: 0
			},
			debug: false
		}
	},
	scene: [
		BootScene,
		WorldScene,
		DialogBoxScene,
		MatchScene,
		UIScene
	]
};

let game = new Phaser.Game(config);
```

Once we have our configuration file and the Game instance created we can create scenes to manage the different screens or stages of the game.

```
let MyScene = new Phaser.Class({

	Extends: Phaser.Scene,

	initialize: function MyScene() {
		Phaser.Scene.call(this, { key: "MyScene" });
	}, 

	preload: function () {

	}, 

	create: function () {
	
	},
  
  update: function () {
	
	}
});
```

Scenes have methods to control the different stages of each scene, the most commons are preload, create and update. In the preload function are loaded all the assets needed, then the create function is where all the initial Game Objects are created in, and the update function is constantly being called during to make updates in the current scene.


We can also create custom game objects and containers by using Phaser Classes:

```
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
		...
	}, 

	deselect: function () {
	  ...
	} 
}); 

let Menu = new Phaser.Class({
	Extends: Phaser.GameObjects.Container,

	initialize: function Menu(x, y, scene) {
		Phaser.GameObjects.Container.call(this, scene, x, y);

		this.menuItems = [];
		this.menuItemIndex = 0;
		this.x = x;
		this.y = y;
	},

	addMenuItem: function (text) {
		...
	},

	moveSelectionUp: function () {
		...
	}, 
	moveSelectionDown: function () {
		...
	}, 
	moveSelectionLeft: function () {
		...
	},
	moveSelectionRight: function () {
		...
	}, 
	selectOption: function (option, menu) {
		...
	}
}); 

let OptionsMenu = new Phaser.Class({
	Extends: Menu,

	initialize: function (x, y, scene, type, options) {
		Menu.call(this, x, y, scene);
		this.type = type;
		this.options = options;
		this.addOptions(this.options, this);
	},

	addOptions: function (options, scene) {
		...
	} 
});
```

Then, we can create our custom object in the scene and store it in our container.
```
this.optionsMenuContainer = this.add.container();
let options = ["Cast", "Attack", "End Turn", "Concede"];
this.optionsMenu = new OptionsMenu(30, 450, this, "actions", options);
this.optionsMenuContainer.add(this.optionsMenu);
```


Another feature that I think is really helpful in Phaser, is to be able to use a JSON tilemaps:
```
this.load.image("tiles", "assets/map/rpg_tileset.png");
this.load.tilemapTiledJSON("map", "assets/map/map.json");

let map = this.make.tilemap({ key: 'map' });
let tiles = map.addTilesetImage('spritesheet', 'tiles');
```
By using a tilemaps we can have a tileset and phaser will build the map based on a JSON file that defines what tiles are used and where are they located.


In conclusion, I think Phaser is a very robust and powerful game engine that allow us to develop games in an easy way without necessarily having advanced knowledge in JavaScript. Sadly, the [documentation](https://photonstorm.github.io/phaser3-docs/index.html) is a kind of hard to read and it's not well organized. However, by using [these notes](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/index.html) and the [examples](http://labs.phaser.io/) provided by Phaser, is easy to learn how everything works. Of course, I used just a very small percentage of the library in this project, but even with that portion I was able to developed a potentially decent game in a short period of time, so I definitively would used it again if I had to make another web game.

In my opinion, one of the downsides of the library is not really in the library itself, but in the language in which is developed in, since JavaScript is known for beign a "weird" programming language (In fact, [Phaser 4](https://phaser.io/phaser3/devlog/148) will be rewritten in TypeScript), and I could experience that during this project since a have a background mainly focused in class based languages.




*(A 500 - 700 word report discussing your chosen API/library. Longer isn't necessarily better here, but some reports will require more information. I expect you to include an 'executive summary' that describes your API/library and convinces me why it might be useful; a deep exploration of the parts of the API/library that you have made use; sample code that shows how to use elements of the API/library (note that sample code does not count towards total word count); a conclusion describing how you potentially see using this API/library in the future, and what you have learned from this project. Note that any external sources used (including the API/library documentation site) must be properly referenced in your report.)*

## References

### Phaser Documentation
- https://photonstorm.github.io/phaser3-docs/index.html
- https://rexrainbow.github.io/phaser3-rex-notes/docs/site/index.html

### Scryfall API Documentation (Magic: The Gathering)
- https://scryfall.com/docs/api

### Phaser Examples
- http://labs.phaser.io/
- https://gamedevacademy.org/how-to-create-a-turn-based-rpg-game-in-phaser-3-part-1/
- http://phaser.io/tutorials/making-your-first-phaser-3-game/part1
- https://gamedevacademy.org/phaser-3-tutorial/
- https://phaser.io/tutorials/getting-started-phaser3/index

### Resources
- https://www.mapeditor.org/
- https://www.deviantart.com/mataraelfay/art/tileset-3-rpg-maker-xp-271510691
- https://www.deviantart.com/leon-murayami/art/RMVX-Final-Fantasy-Mystic-Quest-2-0-354877315
- https://freestocktextures.com/texture/old-paper-blank-page,1099.html
- https://wallpaperscraft.com/wallpaper/cliffs_destruction_city_landscape_waterfall_69033
