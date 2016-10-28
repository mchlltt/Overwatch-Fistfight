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
        opponent: {},
        heroHealthLost: 0,
        attackMultiplier: 1,
        opponentHealthLost: 0,

        // Methods

        setHero: function(index) {
            // Set hero.
            game.hero = game.heroes[index];
            // Remove hero from heroes array.
            game.heroes.splice(index, 1);
        },

        setOpponent: function(index) {
            game.opponent = game.heroes[index];
            game.heroes.splice(index, 1);

        },

        updateHealthAndAttack: function() {
            // Update values.
            game.opponentHealthLost += game.hero.attackPower * game.attackMultiplier;
            game.heroHealthLost += game.opponent.counterAttackPower;
            game.attackMultiplier++;
        },

        isRoundComplete: function() {
            // If no one died, round is not complete.
            if (!game.isPlayerDead() && !game.isOpponentDead()) {
                return false;
            } else {
                return true;
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
            if (game.opponent.healthPoints - game.opponentHealthLost <= 0) {
                return true;
            } else {
                return false;
            }
        },

        createNewRound: function() {
            // Reset opponent stats.
            game.opponentHealthLost = 0;
            game.opponent = {};
        },

        isGameComplete: function() {
            if (game.heroes.length === 0) {
                return true;
            } else {
                return false;
            }
        },

        createNewGame: function() {
            // Reset variables to initial values.
            game.heroHealthLost = 0;
            game.attackMultiplier = 1;
            game.opponentHealthLost = 0;
            game.currentHero = {};
            game.opponent = {};
            game.heroes = heroData.slice(0);
        }
    };


    renderDOM = function(change) {
        if (change === 'initialize') {
            // Save a copy of the original HTML.
            var originalHTML = $('body').html();
            // For each hero...
            for (var i = 0; i < game.heroes.length; i++) {
                // select the hero div with its ID,
                var heroDiv = $('#hero-' + i);
                // Create HTML based upon the hero's attributes,
                heroHTML = (
                    '<h3 class="text-center">' + game.heroes[i].name + '</h3>' +
                    '<img src="assets/images/' + game.heroes[i].name + '.png" role="button" ' +
                    'alt="Image of ' + game.heroes[i].name + '" class="center-block hero-select" id = "' + i + '">' +
                    '<p class="text-center">' + game.heroes[i].bio + '</p>' +
                    '<p class="text-center">Health: ' + game.heroes[i].healthPoints + '</p>'
                );
                // then set the HTML of the selected div to the HTML defined above.
                heroDiv.html(heroHTML);
            }
        } else if (change === 'setHero') {
            // Hide hero select.
            $('.stage-1').hide();
            heroNameDiv.html(heroNameHTML);
            // Render opponent select.
            for (var i = 0; i < game.heroes.length; i++) {
                var opponentDiv = $('#opponent-' + i);
                opponentHTML = (
                    '<h3 class="text-center">' + game.heroes[i].name + '</h3>' +
                    '<img src="assets/images/' + game.heroes[i].name + '.png" role="button" ' +
                    'alt="Image of ' + game.heroes[i].name + '" class="center-block opponent-select" id = "0' + i + '">' +
                    '<p class="text-center">' + game.heroes[i].bio + '</p>' +
                    '<p class="text-center">Health: ' + game.heroes[i].healthPoints + '</p>'
                );
                opponentDiv.html(opponentHTML);
            }
            $('.stage-2').show();
        } else if (change === 'setOpponent') {
            var heroBattlePortrait = $('#your-hero');
            var opponentBattlePortrait = $('#your-opponent');
            var heroHTML = (
                '<h3 class="text-center">' + game.hero.name + '</h3>' +
                '<img src="assets/images/' + game.hero.name + '.png"' +
                'alt="Image of ' + game.hero.name + '" class="center-block">' +
                '<p class="text-center">' + game.hero.bio + '</p>' +
                '<p class="text-center" id="hero-health">Health: ' + (game.hero.healthPoints - game.heroHealthLost) + '</p>'
            );
            var opponentHTML = (
                '<h3 class="text-center">' + game.opponent.name + '</h3>' +
                '<img src="assets/images/' + game.opponent.name + '.png"' +
                'alt="Image of ' + game.opponent.name + '" class="center-block">' +
                '<p class="text-center">' + game.opponent.bio + '</p>' +
                '<p class="text-center" id="opponent-health">Health: ' + game.opponent.healthPoints + '</p>'
            );
            heroBattlePortrait.html(heroHTML);
            opponentBattlePortrait.html(opponentHTML);
            // Small formatting workaround to make the center column the same height as the outer columns.
            $('.col-xs-2').height($('.col-xs-5').height());
        } else if (change === 'attack') {
            var heroHPDiv = $('#hero-health');
            var opponentHPDiv = $('#opponent-health');
            var heroHP = game.hero.healthPoints - game.heroHealthLost;
            var opponentHP = game.opponent.healthPoints - game.opponentHealthLost;
            // We don't want to display negative values, so set negative values to 0 before display.
            if (heroHP < 0) { heroHP = 0; }
            if (opponentHP < 0) { opponentHP = 0; }
            // Update values, and animate the update.
            heroHPDiv.html('Health: ' + heroHP);
            animateText(heroHPDiv);
            opponentHPDiv.html('Health: ' + opponentHP);
            animatetext(opponentHPDiv);
        } else if (change === 'win') {
            $('.stage-4').show();
            $('#button-attack').hide();
            $('#completion-message').text('You win!');
            $('#button-reset').html('<p class="button-text">Keep on punching</p>');
        } else if (change === 'loss') {
            $('.stage-4').show();
            $('#button-attack').hide();
            $('#completion-message').text('You lose.');
            $('#button-reset').html('<p class="button-text">Walk it off</p>');
        } else if (change === 'reset') {
            // Revert all the HTML changes made.
            $('body').html(originalHTML);
            renderDOM(change='initialize');
        }

    };


    animateText = function(div) {
        div.animate(
            {color: '#451111'},200, function() {
                $(this).animate({color: '#333'},100);
            }
    }

    // Function to run immediately on DOM ready.
    renderDOM('initialize');
    




    // On-click functions
    // Using different listener notation because some classes
    // do not exist when this script is first run.

    $(document).on('click', '.hero-select', function(event) {
        var heroIndex = this.id;
        heroIndex = parseInt(heroIndex, 10);
        game.setHero(index = heroIndex);
        renderDOM(change = 'setHero');
    });

    $(document).on('click', '.opponent-select', function() {
        var opponentIndex = this.id;
        opponentIndex = parseInt(opponentIndex, 10);
        game.setOpponent(index = opponentIndex);
        renderDOM(change = 'setOpponent');
    });

    $(document).on('click', '#button-attack', function(event) {
        game.updateHealthAndAttack();
        game.isRoundComplete();
        renderDOM(change = 'attack');
    });

    $(document).on('click', '#button-reset', function(event) {
        game.createNewGame();
        renderDOM(change = 'reset');
    });


});
