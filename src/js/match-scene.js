let MatchScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function WorldScene() {
		Phaser.Scene.call(this, { key: "MatchScene" });
	},

	create: function(){
		this.cameras.main.setBackgroundColor("rgba(0, 200, 0, 0.5)");
	},

	update: function(){

	}

});
