/*Psuedocode for RPS With Friends

1. initialze firebase and confirm that we are receiving data from forms
2. Once players input their names, a greeting should appear on the page
	a. function to assign player value (p1 or p2)
3. DOM should indicate who's turn it is.
4. Create & print links for RPS selections for both players
5. Calculate round winner and print to the winner box
6. Add values to the player Wins or Losses
7. Set values in database/firebase and print to DOM
8. Create logic for chat box.
	a. append latest child + playerName
	b. use timestamp or server time value

9. Listen for connections and print to page
10. update turns


 */

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDeNeOnuLqs89o_C3eG5myFKCJk_FYBKiw",
    authDomain: "rpswithfriends-d92ac.firebaseapp.com",
    databaseURL: "https://rpswithfriends-d92ac.firebaseio.com",
    storageBucket: "rpswithfriends-d92ac.appspot.com",
    messagingSenderId: "429775469473"
};

firebase.initializeApp(config);

//Creating database variable
var database = firebase.database();

var sv;

//Global variables for player name and maximum allowed in game
var playerData = {
    player1: {
        name: 1,
        play: 1,
        message: null
    },
    player2: {
        name: 1,
        play: 1,
        message: null
    },
    plays: {
        myPlay: 1,
        opponentPlay: 1
    },

    wins: {
        myWins: 0,
        opponentWins: 0,
        ties: 0
    },
    messages: {
        myMsg: null,
        opponentMsg: null
    },

    opponentName: null

};

//Array for game choices
var choicesArray = ['Rock', 'Paper', 'Scissors'];


//On page load...

$(document).ready(function() {

    console.log('ready');
    database.ref().on('value', function(snap) {
        sv = snap.val();
    });
    start();
    $('#start').on('click', function(event) {
        event.preventDefault();
        addName();
        talkTrash();

    });



});

//Set up database at start of the game

function start() {
    database.ref().set({
        player1: {
            name: 1,
            play: 1,
            message: 1
        },
        player2: {
            name: 1,
            play: 1,
            message: 1
        }
    });
}


//Sets Player 1 and Player 2 
function addName() {

    if ((sv.player1.name === 1) && $('#name-input').val() !== "") {
        playerData.player1.name = $('#name-input').val().trim();
        console.log('name-input of player one is' + $('#name-input').val().trim());
        console.log('local name of player one 1' + playerData.player1.name);
        //updating firebase
        database.ref().update({
            player1: {
                name: playerData.player1.name,
                play: 1,
                message: 1
            }
        }); //end of firebase statment
        //playerData.player1.name = sv.player1.name;
        playerData.player1.name = sv.player1.name;
        $('#name-input').val('');
        console.log('name of firebase player1 is ' + sv.player1.name);
        $('.player-signin').html("<h6>Hi " + sv.player1.name + "! You are player 1");
        $('#player1-name').html(sv.player1.name);
        player2OpponentSet();

    } else if (($('#name-input').val() !== "") && (sv.player1.name != playerData.player1.name) && (sv.player2.name === 1)) {
        playerData.player2.name = $('#name-input').val().trim();
        console.log('name input of player two is' + $('#name-input').val().trim());
        console.log('local name of player one two is' + playerData.player2.name);
        //update firebase
        database.ref().update({
            player2: {
                name: playerData.player2.name,
                play: 1,
                message: 1
            }
        }); //end of firebase statement
        playerData.player2.name = sv.player2.name;
        $('#name-input').val('');
        console.log('name of firebase player2 is' + sv.player2.name);
        playerData.opponentName = sv.player1.name;
        $('#player2-name').html(playerData.opponentName);
        $('.player-signin').html("<h6>Hi " + playerData.player2.name + "! You are player 2");
        $('#player1-name').html(sv.player2.name);
        playersTogether();
    }
}


function player2OpponentSet() {
    if ((sv.player2.name !== playerData.player2.name) && (sv.player1.name === playerData.player1.name) && (sv.player2.name !== 1)) {
        playerData.player2.name = sv.player2.name;
        playerData.opponentName = sv.player2.name;
        console.log('local opponent name (2) is ' + playerData.opponentName);
        $('#player2-name').html(playerData.opponentName);
        playersTogether();
    } else {
        setTimeout(player2OpponentSet, 500);
    }
} // player2OpponentSet

function playersTogether() {
    if (playerData.opponentName !== null) {
        console.log('opponent is ' + playerData.opponentName);
        startGame();


    }
} // end playersTogether



function startGame() {
    if ((sv.player1.name !== 1) && (sv.player2.name !== 1)) {

        $('#player1-selection').append('<p><div class ="btn btn-primary">' + choicesArray[0] + '</div></p>');
        $('#player1-selection').append('<p><div class ="btn btn-danger">' + choicesArray[1] + '</div></p>');
        $('#player1-selection').append('<p><div class ="btn btn-success">' + choicesArray[2] + '</div></p>');

        $('.btn-primary').attr('data-type', 'rock');
        $('.btn-danger').attr('data-type', 'paper');
        $('.btn-success').attr('data-type', 'scissors');

        $('.btn').on('click', function(event) {

            // Capture the data attribute of the button that was clicked by using this keyword.
            var myPlay = $(this).attr('data-type');

            // Pass the value of that to your makeMove function call so that you can use it in that function.
            makeMove(myPlay);
        });

    }
}


function makeMove(myPlay) {
    playerData.plays.myPlay = myPlay;
    console.log('myPlay is ' + playerData.plays.myPlay);
    $('#selction').html('<h2>' + playerData.plays.myPlay + '</h2>');
    if ((playerData.opponentName === sv.player2.name) && (sv.player1.play === 1)) {
        console.log('player 1 set play value in firebase');
        playerData.player1.play = playerData.plays.myPlay;
        database.ref().update({
            player1: {
                name: sv.player1.name,
                play: playerData.player1.play
            }
        }); // end firebase update data.player1.play
        console.log('set player1 play complete.  playerData.plays.myPlay for player 1 is "' + playerData.plays.myPlay + '" and sv.player1.play is "' + sv.player1.play + '"');
        setLocalOpponent1Play();
    } else if ((playerData.opponentName === sv.player1.name) && (sv.player2.play === 1)) {
        console.log('player2 set play value in firebase');
        playerData.player2.play = playerData.plays.myPlay;
        database.ref().update({
            player2: {
                name: sv.player2.name,
                play: playerData.player2.play
            }
        }); // end firebase update data.player2.play
        console.log('set player2 play complete.  playerData.plays.myPlay for player2 is "' + playerData.plays.myPlay + '" and data.player2.play is "' + sv.player2.play + '"');
        setLocalOpponent2Play();
    }
}

function setLocalOpponent1Play() {
    if (sv.player2.play !== 1) {
        console.log('player1 set opponent play value locally');
        playerData.player2.play = sv.player2.play;
        playerData.plays.opponentPlay = playerData.player2.play;
        $('#player1-').html('<img class="battle-img" src="img/' + playerData.plays.opponentPlay + '.jpg" alt="Your opponent played ' + playerData.plays.opponentPlay + '" />');
        $('.opponent-move-caption').html('<span>' + playerData.plays.opponentPlay + '</span>');
        setTimeout(findWinner, 3000);
    } else {
        setTimeout(setLocalOpponent1Play, 500);
    }
} // end set local opponent 1 play
function setLocalOpponent2Play() {
    if (sv.player1.play !== 1) {
        console.log('player2 set opponent play value locally');
        playerData.player1.play = sv.player1.play;
        playerData.plays.opponentPlay = playerData.player1.play;
        setTimeout(findWinner, 3000);
    } else {
        setTimeout(setLocalOpponent2Play, 500);
    } // end else if set opponent values
} // end set local opponent values


function findWinner() {

    if (playerData.plays.opponentPlay === playerData.plays.myPlay) {
        $('#display-winner').html('You Tied');
        playerData.wins.ties++;
        console.log('ties is ' + playerData.wins.ties);
    } else if ((playerData.plays.myPlay == 'rock' && playerData.plays.opponentPlay == 'scissors') || (playerData.plays.myPlay == 'scissors' && playerData.plays.opponentPlay == 'paper') || (playerData.plays.myPlay == 'paper' && playerData.plays.opponentPlay == 'rock')) {
        $('#display-winner').html('<span>' + playerData.plays.myPlay + ' beats ' + playerData.plays.opponentPlay + '.  you win!</span>');
        playerData.wins.myWins++;
        $('#player1-wins').html(playerData.wins.myWins);
        $('#player2-losses').html(playerData.wins.myWins);
        console.log('myWins is ' + playerData.wins.myWins);
    } else {
        $('#display-winner').html('<span>' + playerData.plays.opponentPlay + ' beats ' + playerData.plays.myPlay + '.  you lose!</span>');
        playerData.wins.opponentWins++;
        $('#player1-losses').html(playerData.wins.opponentWins);
        $('#player2-wins').html(playerData.wins.opponentWins);
        console.log('opponentWins is ' + playerData.wins.opponentWins);
    } // end reckoning game logic
    setTimeout(setNext, 3000);
} // end reckoning

function setNext() {

    database.ref().update({
        player1: {
            name: sv.player1.name,
            play: 1,
            message: 1
        },
        player2: {
            name: sv.player2.name,
            play: 1,
            message: 1
        }
    });

    $('#display-winner').html('Next Round');
}

//Functions to send and receive messages
function talkTrash() {
    if ((sv.player1.name !== 1) && (sv.player2.name !== 1)) {
        $('#message-display').prepend('<p>' + sv.player1.name + " and " + sv.player2.name + " have entered the game room. Let\'s get ready to rumble!</p>");
    } ;

    $('#send-message').on('click', function(event) {

    	event.preventDefault();

        if (playerData.opponentName === sv.player2.name) {

            playerData.player1.message = $('#chat-input').val().trim();
            database.ref().update({
                player1: {
                	name: sv.player1.name,
                	play: playerData.player1.play,
                    message: playerData.player1.message
                }
            });
            var $p = $('<p>');
            $p.css('color', 'blue');
            $p.text(sv.player1.name + ": " + sv.player1.message);
            $('#message-display').prepend($p);
        } else if ((playerData.opponentName === sv.player1.name) && (playerData.player1.message === sv.player1.message)){

        	$p.css('color', 'red');
            $p.text(sv.player1.name + ": " + sv.player1.message);
            $('#message-display').prepend($p);

        } else if (playerData.opponentName === sv.player1.name){
            
            playerData.player2.message = $('#chat-input').val().trim();
            database.ref().update({
                player2: {
                    name: sv.player2.name,
                	play: playerData.player2.play,
                    message: playerData.player2.message
                }
            });
            var $p = $('<p>');
            $p.css('color', 'blue');
            $p.text(sv.player2.name + ": " + sv.player2.message);
            $('#message-display').prepend($p);
        } else if ((playerData.opponentName === sv.player2.name) && (playerData.player2.message === sv.player2.message)){

        	$p.css('color', 'red');
            $p.text(sv.player2.name + ": " + sv.player2.message);
            $('#message-display').prepend($p);

        }
       
    });

}
