fetch("https://api.scryfall.com/cards/937dbc51-b589-4237-9fce-ea5c757f7c48")
	.then(function (response) {
		return response.json();
	})
	.then(function (content) {
		const container = document.getElementById("root");
		const header = document.createElement("div");
		header.textContent = content[0];
		container.appendChild(header);
	});