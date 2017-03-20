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
        play: 1
    },
    player2: {
        name: 1,
        play: 1
    },


    wins: {
        myWins: 0,
        opponentWins: 0,
    },

    opponentName: null

}

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
        
    });



})

//Set up database at start of the game

function start() {
    database.ref().set({
        player1: {
            name: 1,
            play: 1
        },
        player2: {
            name: 1,
            play: 1
        }
    })
};


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
                play: 1
            }
        }); //end of firebase statment
        //playerData.player1.name = sv.player1.name;
        playerData.player1.name = sv.player1.name;
        $('#name-input').val('');
        console.log('name of firebase player1 is ' + sv.player1.name);
        $('.player-signin').html("<h6>Hi " + sv.player1.name + "! You are player 1");
        $('#player1-name').html(sv.player1.name);
        player2OpponentSet();
        $('#player2-name').html(playerData.opponentName);
    } else if (($('#name-input').val() !== "") && (sv.player1.name != playerData.player1.name) && (sv.player2.name === 1)) {
        playerData.player2.name = $('#name-input').val().trim();
        console.log('name input of player two is' + $('#name-input').val().trim());
        console.log('local name of player one two is' + playerData.player2.name);
        //update firebase
        database.ref().update({
            player2: {
                name: playerData.player2.name,
                play: 1
            }
        }); //end of firebase statement
        playerData.player2.name = sv.player2.name;
        $('#name-input').val('');
        console.log('name of firebase player2 is' + sv.player2.name);
        playerData.opponentName = sv.player1.name
        $('#player1-name').html(playerData.opponentName);
        $('.player-signin').html("<h6>Hi " + playerData.player2.name + "! You are player 2");
        $('#player2-name').html(sv.player2.name);
        playersTogether();
    }
};


function player2OpponentSet() {
    if ((sv.player2.name !== playerData.player2.name) && (sv.player1.name === playerData.player1.name) && (sv.player2.name !== 1)) {
        playerData.player2.name = sv.player2.name;
        playerData.opponentName = sv.player2.name;
        console.log('local opponent name (2) is ' + playerData.opponentName);
        playersTogether();
    } else {
        setTimeout(player2OpponentSet, 500);
    }
}; // player2OpponentSet

function playersTogether() {
    if (playerData.opponentName !== null) {
        console.log('opponent is ' + playerData.opponentName);
        startGame();
        
    } 
}; // end playersTogether



function startGame () {
	if ((sv.player1.name !== 1) && (sv.player2.name !== 1)) {

		 for (i=0; i < choicesArray.length; i++){
		 	$('#player1-selection').append('<p>' + choicesArray[i] +'</p>');
		 	$('#player2-selection').append('<p>' + choicesArray[i] +'</p>');
		 
	} 
} else {
	console.log(error);
}

};

