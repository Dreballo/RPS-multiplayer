/*Psuedocode for RPS With Friends

1. initialze firebase and confirm that we are receiving data from forms
2. Once players input their names, a greeting should appear on the page
3. DOM should indicate who's turn it is.
4. Create & print links for RPS selections for both players
5. Calculate round winner and print to the winner box
6. Add values to the player Wins or Losses
7. Set values in database/firebase and print to DOM
8. Create logic for chat box

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

//Global variables for counters

var wins = 0; //Wins counter for $('#player[i]-wins')
var losses = 0; //Losses counter for $('#player[i]-losses')

//Global variables for DOM elements
var $playerGreeting = $('#player-greeting'); //HTML DOM for plater greeting
var $player1Name = $('#player1-name'); //HTML DOM span for player 1 name
var $player2Name = $('#player2-name');  //HTML DOM span for player 2 name
var $displayWinner = $('display-winner'); //DOM span for winner results (should show player name input)


//Global variables for form submit fields

var $nameInput = $('#name-input').val().trim(); //value for player name input


//logging input to the from the database


