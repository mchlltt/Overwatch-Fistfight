$(document).ready(function() {
	// Game object
	game = {
		// Variables
		heroes: [
			{
				name: '',
				bio: '',
				attackPower: 14,
				counterAttackPower: 10,
				healthPoints: 100
			},
			{
				id: 2,
				name: '',
				bio: '',
				attackPower: 8,
				counterAttackPower: 12,
				healthPoints: 120
			},
			{
				id: 3,
				name: '',
				bio: '',
				attackPower: 6,
				counterAttackPower: 8,
				healthPoints: 150
			},
			{
				id: 4,
				name: '',
				bio: '',
				attackPower: 4,
				counterAttackPower: 12,
				healthPoints: 180
			}
		],
		hero: {},
		currentOpponent: {},
		heroHealthLost: 0,
		attackMultiplier: 1,
		opponentHealthLost: 0,
		defeatedOpponents: [],

		// Methods
		setHero: function(x) {
			game.hero = game.heroes[x];
			// push content to do with the hero to the hero div.
			$('.stage-1').hide();
			$('.stage-2').show();
		},

		displayOpponentChoices: function() {
			return;
			// Somehow determine who is eligible to be fought and display them.
		},

		setOpponent: function(x) {
			game.currentOpponent = x;
			// push content to do with the opponent to the opponenent div.
			$('.stage-2').hide();
			$('.stage-3').show();
		},

		updateHealthAndAttack: function() {
			// Update values.
			game.opponentHealthLost += game.hero.attackPower * game.attackMultiplier;
			game.heroHealthLost += game.opponent.counterAttackPower;
			game.attackMultiplier++;
			// Display them.
		},

		isPlayerDead: function() {
			// Does your opponent have HP remaining or are you out of health?
			if (game.hero.healthPoints - game.heroHealthLost <= 0) {
				return true;
			} else {
				return false;
			}
		},

		isOpponentDead: function(){
			if (game.currentOpponent.healthPoints - game.opponentHealthLost <= 0) {
				game.defeatedOpponents.push(game.currentOpponent);
				return true;
			} else {
				return false;
			}
		},

		isRoundComplete: function() {
			if (game.isPlayerDead()) {
				game.announceGameResult(result = 'loss');
			} else if (game.isOpponentDead()) {
				if (game.isGameComplete()) {
					game.announceGameResult(result='win');
				} else {
					game.createNewround();
				}
			}
		},

		createNewRound: function() {
			game.opponentHealthLost = 0;
			game.currentOpponent = {};
			game.displayOpponentChoices();
		},
 
		isGameComplete: function() {
			if (game.opponentsDefeated.length === 3) {
				return true;
			} else {
				return false;
			}
		},

		announceGameResult: function(result) {
			$('.stage-2').show();
			$('.stage-4').show();
			if (result === 'win') {
				$('#completion-message').text('You win!');
				$('#completion-story').text('Peace abounds + everybody loves you.');
			} else {
				$('#completion-message').text('You lose.');
				$('#completion-story').text('Everyone you care about is dead. Also you.');
			}
		},

		createNewGame: function() {
			game.heroHealthLost = 0;
			game.attackMultiplier = 1;
			game.opponentHealthLost = 0;
			game.currentHero = {};
			game.currentOpponent = {};
			game.opponentsDefeated.empty();
			$('.stage-1').show();
			$('.stage-2').hide();
			$('.stage-4').hide();
		}

		// prepareNewRound: function() {
		// 	// Find the index of the opponent you just defeated.
		// 	var index = game.potentialOpponents.id.indexOf(game.currentOpponent);
		// 	// remove them from the array of potential opponents
		// 	game.potentialOpponents.splice(index, 1);
		// 	game.opponentsDefeated++;
		// 	// If you've defeated 3 opponents, you win the game!
		// 	if (game.opponentsDefeated === 3) {
		// 		game.announceGameResult(result='win');
		// 	}
		// },
	};


	// On-click functions

	$('.hero-select').on('click', function() {
		game.selectHero(this.value);
	});

	$('.opponent-select').on('click', function() {
		game.selectOpponent(this.value);
	});

	$('#button-attack').on('click', function() {
		game.updateHealthAndAttack();
		game.isRoundComplete();	
	});

	$('#button-reset').on('click', function() {
		game.createNewGame();
	});

});

//stage 1: select hero (1)
//stage 2: selected hero (2) + select opponent (3)
//stage 3: faceoff with stats (4) + attack button (5)
//stage 4a: selected hero (2) + select opponent (3)
//stage 4b: selected hero (2) + select opponent (3) + loss (6)
//stage 4c: selected hero (2) + select opponent (3) + win (6)

// 1->2->3->4a->3->4a->3->4c
//        ->4b   ->4b   ->4b

// at end of...
//stage1: hide1, show2, show3
//stage2: hide2, hide3, show4, show5
//stage3-4a: hide4, hide5, show2, show3
//stage4a-3: hide2, hide3, show4, show5
//stage3-4b: hide4, hide5, show2, show3, show 6
//stage3-4c: hide4, hide5, show2, show3, show 6