const npcMessages = Object.freeze({
	WHITE: {
		GREET: "Hello, I'm Gideon Jura!",
		VICTORY: "You win!",
		DEFEAT: "You lose!"
	},
	BLUE: {
		GREET: "Hello, I'm Jace Beleren",
		VICTORY: "You win!",
		DEFEAT: "You lose!"
	},
	BLACK: {
		GREET: "Hello, I'm Davriel Cane!",
		VICTORY: "You win!",
		DEFEAT: "You lose!"
	},
	RED: {
		GREET: "Hello, I'm Sarkhan Vol!",
		VICTORY: "You win!",
		DEFEAT: "You lose!"
	},
	GREEN: {
		GREET: "Hello, I'm Nissa Revane!",
		VICTORY: "You win!",
		DEFEAT: "You lose!"
	}

});

const controls = Object.freeze({
	INTERACT: "A",
	CANCEL: "S",
	OPEN_MENU: "ENTER"
});

const gameSettings = Object.freeze({
	WALK_SPEED: 1800,
	STARTING_LIFE_TOTAL: 20
});

const playerDeck = [{
	name: "playerCard1",
	color: "w",
	cost: 3,
	power: 2,
	toughness: 4
},
{
	name: "playerCard2",
	color: "w",
	cost: 3,
	power: 2,
	toughness: 4
},
{
	name: "playerCard3",
	color: "w",
	cost: 3,
	power: 2,
	toughness: 4
},
{
	name: "playerCard4",
	color: "w",
	cost: 3,
	power: 2,
	toughness: 4
},
{
	name: "playerCard5",
	color: "w",
	cost: 3,
	power: 2,
	toughness: 4
},
{
	name: "playerCard6",
	color: "w",
	cost: 3,
	power: 2,
	toughness: 4
}
];

const enemyDeck = [{
	name: "enemyCard1",
	color: "w",
	cost: 3,
	power: 2,
	toughness: 4
},
{
	name: "enemyCard2",
	color: "w",
	cost: 3,
	power: 2,
	toughness: 4
},
{
	name: "enemyCard3",
	color: "w",
	cost: 3,
	power: 2,
	toughness: 4
},
{
	name: "enemyCard4",
	color: "w",
	cost: 3,
	power: 2,
	toughness: 4
},
{
	name: "enemyCard5",
	color: "w",
	cost: 3,
	power: 2,
	toughness: 4
},
{
	name: "enemyCard6",
	color: "w",
	cost: 3,
	power: 2,
	toughness: 4
}
];