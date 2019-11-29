const npcMessages = Object.freeze({
	WHITE: {
		GREET: "Hello, I'm Gideon Jura!",
		VICTORY: "You win!",
		DEFEAT: "You lose!"
	},
	BLUE: {
		GREET: "Greetings! I'm Jace Beleren, ",
		VICTORY: "I had hoped for more from you, Jace. But I expected as much. - Nicol Bolas",
		DEFEAT: "It's good to learn from your failures, but I prefer to learn from the failures of others."
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
	INTERACT: "Space",
	CANCEL: "s",
	OPEN_MENU: "Enter"
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


// let mazoenemigo = [{
// 		name: "enemyCard1",
// 		color: "w",
// 		cost: 3,
// 		power: 2,
// 		toughness: 4
// 	},
// 	{
// 		name: "enemyCard2",
// 		color: "w",
// 		cost: 3,
// 		power: 2,
// 		toughness: 4
// 	},
// 	{
// 		name: "enemyCard3",
// 		color: "w",
// 		cost: 3,
// 		power: 2,
// 		toughness: 4
// 	},
// 	{
// 		name: "enemyCard4",
// 		color: "w",
// 		cost: 3,
// 		power: 2,
// 		toughness: 4
// 	},
// 	{
// 		name: "enemyCard5",
// 		color: "w",
// 		cost: 3,
// 		power: 2,
// 		toughness: 4
// 	},
// 	{
// 		name: "enemyCard6",
// 		color: "w",
// 		cost: 3,
// 		power: 2,
// 		toughness: 4
// 	}
// ];

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

const blueCards = [
	//1 mana
	"d0d899e1-bded-4e16-8ecc-cc07784af4bb",
	"40ead30e-9f96-4fca-b619-fdc8d1b5e2e0",
	"520ad9d0-5f41-4183-a04e-58a61ad7202b",
	"cc1f65c8-4941-41ac-9340-f741725ec71c",

	//2 mana
	"00223901-d462-41b0-9749-b093058f682f",
	"97a74ccf-8165-4db1-a87c-52c2d8ea0058",
	"0a03ba5a-ac27-4fce-9eaf-b029ab26f9e1",
	"1008ff1b-7fb0-4570-b23e-9fda14b97640",
	"e83a74c4-026e-4419-9dde-3b044ef507a0",

	//3 mana
	"2eda67da-02b5-4ecb-9038-10e026d454ec",
	"0f244233-f2e8-48f8-9106-e7cd186efd51",
	"f8f2b7c1-9f2a-481d-94ee-04728828f7df",
	"7c2ca68b-15fb-4691-b549-268df92ca413",

	//4 mana
	"2af2c338-f5e9-4596-9435-c6aa965ae541",
	"324681da-a28e-47ec-9810-5678de53e494",
	"beaefa77-6e4a-4724-a443-fa6b45803db5",
	"6653bce7-b0fc-49e3-8f45-f0bfcade8870"

];

const blackCards = [
	//1 mana
	"cf2018ec-94e4-4e29-8b4b-ce30fb0d4a99",
	"28129aaf-aaff-47f4-8dd2-8c576c55052c",
	"b3c185b9-5d97-4a5a-af0b-8b9c44dcd235",
	"2a4b6ced-e8d3-47e9-bd27-3e0cb644afe4",

	//2 mana
	"6ed84268-92f7-4790-99b2-f2982b6e0893",
	"f44e94f0-5f64-4991-aa45-c2b05879be40",
	"42bd4896-4191-4479-be57-070753f8725c",
	"ce2ca2e6-f920-4529-88d2-d984bdb7490a",
	"923cb904-c725-4d57-bc17-7aa87a7cd8e0",
	"1f994e2b-1784-4bb7-9784-ac2de600cf5f",

	//3 mana
	"94785274-fa79-47cc-9896-0f5f695abb21",
	"b0130d04-05f2-44f5-bd6c-8b11f798b69e",
	"5e5ae910-ee1d-4958-92d9-0b06872913c6",
	"e2a0410f-95c5-49bf-856d-dea796c96e3b",
	"daad7489-c8cd-4eb6-bef1-8b82f2099579",

	//4 mana
	"c21cbb10-9157-4887-a752-29b9e94fc77a",
	"9f2b9f27-459c-4585-9051-b83ffe053a74",
	"c46da57d-bcb9-4303-aa1c-72d08bb2b5a8",
	"c217b672-c724-4fc2-936c-b3f0feaf6ea0"
];

const redCards = [
	//1 mana
	"067ff95e-c4dc-41bb-9677-67f51a09b05a",
	"3ee34158-867f-4685-8f2b-af9469b628c3",
	"47754124-37e2-4878-a711-a3e00ae0bc70",
	"58b7a22b-f354-4f42-9354-d149bb9b3645",

	//2 mana
	"91df110f-85d2-41cb-96b6-6c79cebfada7",
	"ff7a4769-7a64-4016-8db0-b56c6b98aff3",
	"6f22a45e-7352-4f5b-b298-eca4375ea28c",
	"8cfefb65-b6e4-44a1-baa9-d3c00ee8ba96",

	//3 mana
	"eb72cfc8-6235-4951-b1ba-6d9531f5eabf",
	"9097ec4a-6c0e-4c27-8910-29ac47612031",
	"8ee340f5-f719-42f9-9836-53305e5b0c3b",
	"caba00ff-df58-456e-8aeb-fc8b632018a6",

	//4 mana
	"ffa87a70-c9fb-4ab3-ac16-367888aa775b",
	"5ad3381e-ae2f-40cf-8a7b-62375e9f453e",
	"f9fa8351-567e-4ef4-8346-c58e50c778a6",
	"32f49716-1522-4f36-92c9-63ef2059c4ef"
];

const greenCards = [
	//1 mana
	"bb95a9a7-b0a3-4199-8c05-2519ccda738b",
	"34e501e6-38da-44ad-abe2-53ea7f0eb4ae",
	"c063a072-0cd4-45fb-ac68-96e359bf3ef5",
	"4ebf3a7c-e065-468b-a73c-6f986cde3a3d",
	"c4a5f86f-44a8-4735-909a-770586d33a15",

	//2 mana
	"135946fc-fe67-401f-821d-d7145c63f030",
	"409f9b88-f03e-40b6-9883-68c14c37c0de",
	"c3d0485a-209d-4040-94ab-856bdee83b81",
	"b3afaab6-4768-4852-a0b6-4e6a0295bde7",

	//3 mana
	"5eac1616-d764-4e62-9fc6-939c28b75f52",
	"b55e0487-3abb-4f2b-b34c-d6ad49164e73",
	"7bc33252-145f-45c0-bb70-23183c698f66",
	"d6997a75-42c9-4706-ac34-69fa34011eca",

	//4 mana
	"4c5b05fe-9d46-4d64-a4d9-9eb22a2a9f4c",
	"7a6d1184-15e0-4b41-ba2d-4f68e91c61d4",
	"75935f0e-9086-485b-b3e6-1a958fd0f2af",
	"25eff287-6b53-4e6d-9da2-d80d05bb8c51"

];

