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

const colors = Object.freeze({
	WHITE: "W",
	BLUE: "U",
	BLACK: "B",
	RED: "R",
	GREEN: "G",
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

const whiteCards = [
	//1 mana
	"0732d372-1000-435e-905b-4a6c852ba427",
	"28a5c350-2ed1-4a25-9626-0f8da5d1aef7",
	"41193ef1-1619-4448-9905-26b05079c79a",
	"96865440-01ad-40f2-90d7-9ecd0b4efecc",
	"a9757246-e782-4d7a-8273-d9efe284edaf",

	//2 mana
	"52daf505-d436-4ea6-a157-4268af2ff7a8",
	"373d6799-e031-4043-8437-ed4880be0de9",
	"15d6476c-1944-48e8-9af6-6db78edd58e5",
	"ca42da05-330d-4050-a580-dc00f6faff24",

	//3 mana
	"a3bc4e43-1935-402b-a309-c575c83e849f",
	"35bb9e4e-3cfb-4794-bd03-04840b5fe1dc",
	"7cbf17a0-2dbc-4e79-9cfa-ea49b1605105",
	"43cc74c6-f0e5-443d-a2b3-4dcbf5858034",
	"36fcc018-76c2-4246-8eca-b78115d568be",
	
	//4 mana
	"144e9391-f417-464b-8c04-c952193997c7",
	"1585bb24-41de-48a7-820e-d99ee76aec01",
	"d1a9594e-edc9-42b2-ba8a-8298da9441fb",
	"1af50bf1-c51e-4592-86bf-4197ec85a45d",
	"ba8741f5-f512-4c31-b4ba-3f2ef00b0102"
];