//TODO: remove negative HP. (if dead, display 0.)


$(document).ready(function() {

    // A static copy of hero data to clone for use in the game object.
    heroData = [{
        id: 0,
        name: 'Lúcio',
        bio: 'ready to roll',
        attackPower: 8,
        counterAttackPower: 12,
        healthPoints: 110
    }, {
        id: 1,
        name: 'D.Va',
        bio: 'ready to get some kills',
        attackPower: 5,
        counterAttackPower: 8,
        healthPoints: 150
    }, {
        id: 2,
        name: 'Symmetra',
        bio: 'will put you in your place',
        attackPower: 7,
        counterAttackPower: 10,
        healthPoints: 130
    }, {
        id: 3,
        name: 'Zarya',
        bio: 'can bench more than you',
        attackPower: 7,
        counterAttackPower: 14,
        healthPoints: 120
    }];

    // Game object
    game = {
        heroes: heroData.slice(0),
        hero: {},
        currentOpponent: {},
        heroHealthLost: 0,
        attackMultiplier: 1,
        opponentHealthLost: 0,

        // Methods
        displayHeroChoices: function() {
            // For each hero...
            for (var i = 0; i < game.heroes.length; i++) {
                // select the hero div with its ID,
                var heroDiv = $('#hero-' + i);
                // Create HTML based upon the hero's attributes,
                heroHTML = (
                    '<h2 class="text-center">' + game.heroes[i].name + '</h2>' +
                    '<img src="assets/images/' + game.heroes[i].name + '.png" role="button" ' +
                    'alt="Image of ' + game.heroes[i].name + '" class="center-block hero-select" id = "' + i + '">' +
                    '<p class="text-center">' + game.heroes[i].bio + '</p>' +
                    '<p class="text-center">Health:' + game.heroes[i].healthPoints + '</p>'
                );
                // then set the HTML of the selected div to the HTML defined above.
                heroDiv.html(heroHTML);
            }
        },

        setHero: function(index) {
            // Set hero.
            game.hero = game.heroes[index];
            // Hide hero select.
            $('.stage-1').hide();
            // Remove hero from heroes array.
            game.heroes.splice(index, 1);
            // Display selected hero's name.
            game.displaySelectedHeroName();
            // Display opponents to choose from.
            game.displayOpponentChoices();
        },

        displaySelectedHeroName: function() {
            // Select div for displaying selected hero's name.
            var heroNameDiv = $('#selected-hero');
            // Create HTML based on the selected hero's name.
            var heroNameHTML = (
                'Playing as ' + game.hero.name
            );
            // Set the HTML of the selected div to the HTML created above.
            heroNameDiv.html(heroNameHTML);
        },

        displayOpponentChoices: function() {
            for (var i = 0; i < game.heroes.length; i++) {
                var opponentDiv = $('#opponent-' + i);
                opponentHTML = (
                    '<h2 class="text-center">' + game.heroes[i].name + '</h2>' +
                    '<img src="assets/images/' + game.heroes[i].name + '.png" role="button" ' +
                    'alt="Image of ' + game.heroes[i].name + '" class="center-block opponent-select" id = "0' + i + '">' +
                    '<p class="text-center">' + game.heroes[i].bio + '</p>' +
                    '<p class="text-center">Health:' + game.heroes[i].healthPoints + '</p>'
                );
                opponentDiv.html(opponentHTML);
            }
            $('.stage-2').show();
        },

        setOpponent: function(index) {
            game.currentOpponent = game.heroes[index];
            $('.stage-3').show();
            game.heroes.splice(index, 1);
            $('.stage-2').hide();
            // Removes a column and resizes the others when an opponent is selected.
            if (game.heroes.length === 2) {
                $('.col-xs-4:last').remove();
                $('.col-xs-4').addClass('col-xs-6');
                $('.col-xs-6').removeClass('col-xs-4');
            } else if (game.heroes.length === 1) {
                $('.col-xs-6:last').remove();
                $('.col-xs-6').addClass('col-xs-12');
                $('.col-xs-12').removeClass('col-xs-6');
            }
            game.displayBattle();
            $('#selected-hero').hide();
        },

        displayBattle: function() {
            var heroBattlePortrait = $('#your-hero');
            var opponentBattlePortrait = $('#your-opponent');
            var heroHTML = (
                '<h2 class="text-center">' + game.hero.name + '</h2>' +
                '<img src="assets/images/' + game.hero.name + '.png"' +
                'alt="Image of ' + game.hero.name + '" class="center-block">' +
                '<p class="text-center">' + game.hero.bio + '</p>' +
                '<p class="text-center" id="hero-health">Health:' + (game.hero.healthPoints - game.heroHealthLost) + '</p>'
            );
            var opponentHTML = (
                '<h2 class="text-center">' + game.currentOpponent.name + '</h2>' +
                '<img src="assets/images/' + game.currentOpponent.name + '.png"' +
                'alt="Image of ' + game.currentOpponent.name + '" class="center-block">' +
                '<p class="text-center">' + game.currentOpponent.bio + '</p>' +
                '<p class="text-center" id="opponent-health">Health:' + game.currentOpponent.healthPoints + '</p>'
            );
            heroBattlePortrait.html(heroHTML);
            opponentBattlePortrait.html(opponentHTML);
        },

        updateHealthAndAttack: function() {
            // Update values.
            game.opponentHealthLost += game.hero.attackPower * game.attackMultiplier;
            game.heroHealthLost += game.currentOpponent.counterAttackPower;
            game.attackMultiplier++;
        },

        isRoundComplete: function() {
            game.displayUpdatedBattle();
            // If the player dies, game is over.
            if (game.isPlayerDead()) {
                // The player loses.
                game.announceGameResult(result = 'loss');
                // If the opponent dies, the round is over.
            } else if (game.isOpponentDead()) {
                // If all opponents are dead, game is over.
                if (game.isGameComplete()) {
                    // The player wins!
                    game.announceGameResult(result = 'win');
                    // If not all opponents are dead, round is over.
                } else {
                    // Another round is created.
                    game.createNewRound();
                }
                // If no one died, do nothing.
            }
        },

        isPlayerDead: function() {
            // Does your opponent have HP remaining or are you out of health?
            if (game.hero.healthPoints - game.heroHealthLost <= 0) {
                return true;
            } else {
                return false;
            }
        },

        isOpponentDead: function() {
            if (game.currentOpponent.healthPoints - game.opponentHealthLost <= 0) {
                $('.stage-3').hide();
                return true;
            } else {
                return false;
            }
        },

        displayUpdatedBattle: function() {
            var heroHPDiv = $('#hero-health');
            var opponentHPDiv = $('#opponent-health');
            var heroHP = game.hero.healthPoints - game.heroHealthLost;
            var opponentHP = game.currentOpponent.healthPoints - game.opponentHealthLost;
            // We don't want to display negative values, so set negative values to 0 before display.
            if (heroHP < 0) {
                heroHP = 0;
            }
            if (opponentHP < 0) {
                opponentHP = 0;
            }
            heroHPDiv.html('Health:' + heroHP);
            opponentHPDiv.html('Health:' + opponentHP);
        },

        createNewRound: function() {
            // Reset opponent stats.
            game.opponentHealthLost = 0;
            game.currentOpponent = {};
            // Display opponent choices again.
            game.displayOpponentChoices();
        },

        isGameComplete: function() {
            if (game.heroes.length === 0) {
                return true;
            } else {
                return false;
            }
        },

        announceGameResult: function(result) {
            $('.stage-3').show();
            $('.stage-4').show();
            $('#button-attack').hide();
            if (result === 'win') {
                $('#completion-message').text('You win!');
                $('#button-reset').html('<p class="button-text">Keep on punching</p>');
            } else {
                $('#completion-message').text('You lose.');
                $('#button-reset').html('<p class="button-text">Walk it off</p>');
            }
        },

        createNewGame: function() {
            // Reset variables to initial values.
            game.heroHealthLost = 0;
            game.attackMultiplier = 1;
            game.opponentHealthLost = 0;
            game.currentHero = {};
            game.currentOpponent = {};
            $('body').html(originalHTML);
            game.heroes = heroData.slice(0);
            // Hide all but the hero select div.
            $('.stage-1').show();
            $('.stage-2').hide();
            $('.stage-3').hide();
            $('.stage-4').hide();
        }
    };


    // Function to run immediately on DOM ready.

    game.displayHeroChoices();
    var originalHTML = $('body').html();


    // On-click functions

    $(document).on('click', '.hero-select', function(event) {
        var heroIndex = this.id;
        heroIndex = parseInt(heroIndex, 10);
        game.setHero(index = heroIndex);
    });


    // Use different listener notation because .opponent-select
    // does not exist when this script is first run.
    $(document).on('click', '.opponent-select', function() {
        var opponentIndex = this.id;
        opponentIndex = parseInt(opponentIndex, 10);
        game.setOpponent(index = opponentIndex);
        $('.stage-2').hide();
    });

    $(document).on('click', '#button-attack', function(event) {
        game.updateHealthAndAttack();
        game.displayUpdatedBattle();
        game.isRoundComplete();
    });

    $(document).on('click', '#button-reset', function(event) {
        game.createNewGame();
    });

});
