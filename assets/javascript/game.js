//TODO: remove negative HP. (if dead, display 0.)


$(document).ready(function() {

hero = {};
opponent = {};


    // A static copy of hero data which will be cloned for dynamic use in the game object.
    heroData = [{
        id: 0,
        name: 'Lúcio',
        bio: 'ready to roll',
        attackPower: 8,
        counterAttackPower: 12,
        healthPoints: 110,
        healthLost: 0
    }, {
        id: 1,
        name: 'D.Va',
        bio: 'ready to get some kills',
        attackPower: 5,
        counterAttackPower: 8,
        healthPoints: 150,
        healthLost: 0
    }, {
        id: 2,
        name: 'Symmetra',
        bio: 'will put you in your place',
        attackPower: 7,
        counterAttackPower: 10,
        healthPoints: 130,
        healthLost: 0
    }, {
        id: 3,
        name: 'Zarya',
        bio: 'can bench more than you',
        attackPower: 7,
        counterAttackPower: 14,
        healthPoints: 120,
        healthLost: 0
    }];

    // Game object
    game = {
        heroes: heroData.slice(0),
        attackMultiplier: 1,

        // Methods

        setHero: function(index) {
            // Set hero.
            hero = game.heroes[index];
            // Remove hero from game.heroes array.
            game.heroes.splice(index, 1);
        },

        setOpponent: function(index) {
            // Set opponent.
            opponent = game.heroes[index];
            // Remove opponent from game.heroes array.
            game.heroes.splice(index, 1);
        },

        updateHealthAndAttack: function() {
            // Update values.
            opponent.healthLost += hero.attackPower * game.attackMultiplier;
            hero.healthLost += opponent.counterAttackPower;
            game.attackMultiplier++;
        },

        isPlayerDead: function() {
            // Does your opponent have HP remaining or are you out of health?
            if (hero.healthPoints - hero.healthLost <= 0) {
                return true;
            } else {
                return false;
            }
        },

        isOpponentDead: function() {
            if (opponent.healthPoints - opponent.healthLost <= 0) {
                return true;
            } else {
                return false;
            }
        },

        isRoundComplete: function() {
            // If no one died, round is not complete.
            if (!game.isPlayerDead() && !game.isOpponentDead()) {
                return false;
            } else {
                return true;
            }
        },

        isGameComplete: function() {
            // If there are no opponents left to fight, the game is complete.
            if (game.heroes.length === 0) {
                return true;
            } else {
                return false;
            }
        },

        createNewGame: function() {
            // Reset variables to initial values.
            game.attackMultiplier = 1;
            // Get new copy of heroData.
            game.heroes = heroData.slice(0);
            // Reset all healthLost values to 0.
            for (var l = 0;l < game.heroes.length;l++) {game.heroes[l].healthLost = 0;}
        }
    };


    var DOMFunctions = {
        createCharacterProfile: function(characterObject, type) {
            var characterHTML = (
                '<h3 class="text-center">' + characterObject.name + '</h3>' +
                '<img src="assets/images/' + characterObject.name + '.png" role="button" ' +
                'alt="Image of ' + characterObject.name + '" class="center-block ' + type + '">' +
                '<p class="text-center">' + characterObject.bio + '</p>' +
                '<p class="text-center ' + type + '-health">Health: ' + (characterObject.healthPoints - characterObject.healthLost) + '</p>'
            );
            return characterHTML;
        },

        animateText: function(div) {
            div.animate({ color: '#451111' }, 200, function() {
                $(this).animate({ color: '#333' }, 100);
            });
        },

        // Save a copy of the original HTML.
        saveOriginalHTML: function() {
            return $('body').html();
        },

        renderDOM: function(change) {
            // Change: Initializing game.
            if (change === 'initialize') {
                // Show hero select.
                $('.stage-1').show();
                // For each hero, create and display their profile.
                for (var i = 0; i < game.heroes.length; i++) {
                    var heroDiv = $('#hero-' + i);
                    var heroHTML = DOMFunctions.createCharacterProfile(characterObject = game.heroes[i], type = 'hero');
                    heroDiv.html(heroHTML);
                    heroDiv.children('img').val(i);
                }

            // Change: Hero has been set.
            } else if (change === 'setHero') {
                // Hide hero select.
                $('.stage-1').hide();
                // For each available opponent, create and display their profile.
                for (var j = 0; j < game.heroes.length; j++) {
                    var opponentDiv = $('#opponent-' + j);
                    var opponentHTML = DOMFunctions.createCharacterProfile(characterObject = game.heroes[j], type = 'opponent');
                    opponentDiv.html(opponentHTML);
                    opponentDiv.children('img').val(j);
                }
                // Display opponent select.
                $('.stage-2').show();

            // Change: Opponent has been set.
            } else if (change === 'setOpponent') {
                // Hide opponent select.
                $('.stage-2').hide();
                // Render a profile for the hero and the opponent.
                var heroBattlePortrait = $('#your-hero');
                var opponentBattlePortrait = $('#your-opponent');
                var heroBattleHTML = DOMFunctions.createCharacterProfile(characterObject = hero, type = 'hero');
                var opponentBattleHTML = DOMFunctions.createCharacterProfile(characterObject = opponent, type = 'opponent');
                heroBattlePortrait.html(heroBattleHTML);
                opponentBattlePortrait.html(opponentBattleHTML);
                // Show battle.
                $('.stage-3').show();

            // Change: A normal attack has been made.
            } else if (change === 'attack') {
                // Select the health divs and update their values.
                var heroHPDiv = $('.hero-health');
                var opponentHPDiv = $('.opponent-health');
                var heroHP = hero.healthPoints - hero.healthLost;
                var opponentHP = opponent.healthPoints - opponent.healthLost;
                // Update values, and subtly animate the update.
                heroHPDiv.html('Health: ' + heroHP);
                DOMFunctions.animateText(heroHPDiv);
                opponentHPDiv.html('Health: ' + opponentHP);
                DOMFunctions.animateText(opponentHPDiv);

            // Change: The round was won.
            } else if (change === 'round-win') {
                // Hide battle.
                $('.stage-3').hide();
                $('.col-xs-4:last').remove();
                $('.col-xs-6:last').remove();
                // For each available opponent, create and display their profile.
                for (var k = 0; k < game.heroes.length; k++) {
                    var newOpponentDiv = $('#opponent-' + k);
                    var newOpponentHTML = DOMFunctions.createCharacterProfile(characterObject = game.heroes[k], type = 'opponent');
                    newOpponentDiv.html(newOpponentHTML);
                    // Change column size depending on number of opponents remaining.
                    newOpponentDiv.addClass('col-xs-' + (12 / game.heroes.length));
                    newOpponentDiv.removeClass('col-xs-' + (12 / (game.heroes.length + 1)));
                    newOpponentDiv.children('img').val(k);
                }
                // Display opponent select.
                $('.stage-2').show();

            // Change: The game was won.
            } else if (change === 'game-win') {
                $('.stage-4').show();
                // Hide attack button.
                $('#button-attack').hide();
                // Display opponent health as 0 (manually to avoid negative health.)
                $('.opponent-health').html('Health: 0');
                // Show win messages.
                $('#completion-message').text('You win!');
                $('#button-reset').html('<p class="button-text">Keep on punching</p>');

            // Change: The game was lost.
            } else if (change === 'game-loss') {
                $('.stage-4').show();
                // Hide attack button.
                $('#button-attack').hide();
                // Display hero health as 0 (manually to avoid negative health.)
                $('.hero-health').html('Health: 0');
                // Show loss messages.
                $('#completion-message').text('You lose.');
                $('#button-reset').html('<p class="button-text">Walk it off</p>');

            // Change: The game was reset.
            } else if (change === 'reset') {
                // Revert all the HTML changes made.
                $('body').html(originalHTML);
                // Then initialize the page as normal.
                DOMFunctions.renderDOM(change = 'initialize');
            }
        }
    };

    // Function to run immediately on DOM ready.

    var originalHTML = DOMFunctions.saveOriginalHTML();
    DOMFunctions.renderDOM('initialize');

    // On-click functions


    // Click hero.
    $(document).on('click', '.hero', function(event) {
        var heroIndex = this.value;
        heroIndex = parseInt(heroIndex, 10);
        game.setHero(index = heroIndex);
        DOMFunctions.renderDOM(change = 'setHero');
    });

    // Click opponent.
    $(document).on('click', '.opponent', function() {
        var opponentIndex = this.value;
        opponentIndex = parseInt(opponentIndex, 10);
        game.setOpponent(index = opponentIndex);
        DOMFunctions.renderDOM(change = 'setOpponent');
    });

    // Click attack button.
    $(document).on('click', '#button-attack', function(event) {
        game.updateHealthAndAttack();
        if (game.isPlayerDead()) {
            DOMFunctions.renderDOM(change = 'game-loss');
        } else if (game.isGameComplete()) {
            DOMFunctions.renderDOM(change = 'game-win');
        } else if (game.isRoundComplete()) {
            DOMFunctions.renderDOM(change = 'round-win');
        } else {
            DOMFunctions.renderDOM(change = 'attack');
        }
    });

    // Click reset button.
    $(document).on('click', '#button-reset', function(event) {
        game.createNewGame();
        DOMFunctions.renderDOM(change = 'reset');
    });


});
