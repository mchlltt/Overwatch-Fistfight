$( document ).ready(function() {
	// Game object
	game = {
	// Variables
		heroes: [
			hero1 = {
				name: '',
				bio: '',
				attackPower: 14,
				counterAttackPower: 10,
				healthPoints: 100
			},
			hero2 = {
				id: 2,
				name: '',
				bio: '',
				attackPower: 8,
				counterAttackPower: 12,
				healthPoints: 120
			},
			hero3 = {
				id: 3,
				name: '',
				bio: '',
				attackPower: 6,
				counterAttackPower: 8,
				healthPoints: 150
			},
			hero4 = {
				id: 4,
				name: '',
				bio: '',
				attackPower: 4,
				counterAttackPower: 12,
				healthPoints: 180
			}
		],
		hero: 0,
		currentOpponent: '',
		heroHealthLost: 0,
		attackMultiplier: 1,
		opponentHealthLost: 0,
		potentialOpponents: [],

	// Methods
		stage1: function(str) {
			game.hero = str;
			// Your potential opponents are all of the heroes
			game.potentialOpponents = game.heroes;
			// Except your hero. Find its index and remove it.
			var index = game.potentialOpponents.indexOf(str);
			game.potentialOpponents.splice(index, 1);
		},


		stage2: function(x) {
			game.currentOpponent = str;

		},


		attackUpdate: function() {
			// Update values then display them.
			game.winLossCheck();
		},


		winLossCheck: function() {
			if (game.hero.healthPoints - game.heroHealthLost <= 0) {
				game.lossBehavior();
			}
			 else if (game.currentOpponent.healthPoints - game.opponentHealthLost <= 0) {
				game.roundWinBehavior();
			} else {
				return;
			}
		},

		roundWinBehavior: function() {
			// Find the index of the opponent you just defeated.
			var index = game.potentialOpponents.id.indexOf(game.currentOpponent);
			// remove them from the array of potential opponents
			game.potentialOpponents.splice(index, 1);
			if (game.potentialOpponents.length === 0) {
				game.gameWinBehavior();
			}
		},

		gameWinBehavior: function() {
			$('.stage-5').show();
			$('#completion-message').text('You win!');
			$('#completion-story').text('Peace abounds + everybody loves you.');
		},

		lossBehavior: function() {
			$('.stage-5').show();
			$('#completion-message').text('You lose.');
			$('#completion-story').text('Everyone you care about is dead.');
		},

		gameReset: function() {
			game.heroHealthLost = 0;
			game.attackMultiplier = 1;
			game.opponentHealthLost = 0;
			game.currentHero = '';
			game.currentOpponent = '';
			potentialOpponents = game.heroes;
			$('.stage-1').show();
			$('.stage-5').hide();
		}
	};


	// On-click functions

	$('.hero-select').on('click', function() {
		var hero = this.id;
		game.stage1(hero);
		$('.stage-1').hide();
		$('.stage-2').show();
	});

	$('.opponent-select').on('click', function() {
		var opponent = this.id;
		game.stage2(opponent);
		$('.stage-2').hide();
		$('.stage-3').show();
	});


});