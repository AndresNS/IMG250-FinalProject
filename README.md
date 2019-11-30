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

pahser is for platform games... but using cams and gravity rpg are possible

phaser vs unity
javascript is weird (class)

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
- https://www.deviantart.com/mataraelfay/art/tileset-3-rpg-maker-xp-271510691
- https://www.deviantart.com/leon-murayami/art/RMVX-Final-Fantasy-Mystic-Quest-2-0-354877315
- https://www.mapeditor.org/
- https://freestocktextures.com/texture/old-paper-blank-page,1099.html
