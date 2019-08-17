var firebaseConfig = {
   apiKey: "AIzaSyDGxeGNaPIi0Vp018GM7Br7SYonsYESqhg",
   authDomain: "project-1-4a8dc.firebaseapp.com",
   databaseURL: "https://project-1-4a8dc.firebaseio.com",
   projectId: "project-1-4a8dc",
   storageBucket: "",
   messagingSenderId: "650110209456",
   appId: "1:650110209456:web:de4e826c95bd7efe"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

/*
========================================
Global Variables
========================================
*/
var players = database.ref('players');          // Connects players details to the database
var playerCount = database.ref('playerCount'); // Keeps track of the number of players in the database
var outcome = database.ref('gameResults');    // Connects outcomes to the database
var turn = database.ref('turn');

var player = {                  // Stores player details
  name: "",
  email: "",
  choice: "",
  wins: 0,
  losses: 0,
  uid: "", 
};

var player_1 = null;                // Sets up player 1
var player_2 = null;                // Sets up player 2
var totalPlayers = null;            // Sets up total number of players
var gameResults = "";               // Stores game results 

$(document).ready(function() {
/*
========================================
play Game
========================================
*/

$('#play').on('click', newPlayers);
var nameField = $('#userName');             // Hides name feild on click 
var addPlayerButton = $('#play');         // Stoes new play 
var convo = database.ref().child('chat');
var messageField = $('#message');
var chatLog = $('#chat-log');
 /*

/*
========================================
Add Players 
========================================
*/

function newPlayers(){
 
  firebase.auth().signInAnonymously();     
  var playerName = $('#userName').val().trim();
  player.name = playerName; 
  player.uid = firebase.auth().currentUser.uid;

  database.ref().once('value').then(function(snapshot){

    if (!snapshot.child('players/1').exists()) {
      database.ref('players/1/').update(player);
      player_1_details = $('player-1');
      var player_2_details;
      player_1_details.html('PLAYER 1: ' + playerName + ' ');
      player_1 = 1; 
      player_2 = 2; 
      nameField.hide();
      addPlayerButton.hide();
      $('#player-1').show(); 
      $('#player-2').show();
      console.log("This is tthe value of:" + player_1);
      database.ref('turn').set(1);
      playerCount.once('value').then(function(snapshot) {
        totalPlayers = snapshot.val();
          if (totalPlayers === null) {
            totalPlayers = 1;
            playerCount.set(totalPlayers);
          } else {
            totalPlayers++;
            playerCount.set(totalPlayers);
         }
      });
    } else if (!snapshot.child('players/2').exists()) {
      database.ref('players/2/').update(player); 
      player_2_details = $('player-2');
      var player_1_details; 
      player_2_details.html('PLAYER 2: ' + playerName + ' ');
      player_2 = 2; 
      player_1 = 1; 
      nameField.hide(); 
      addPlayersButton.hide(); 
      $('#player-1').show(); 
      $('#player-2').show();
      console.log("This is the value of:" + player_2);
      database.ref('turn').set(1);
      playerCount.once('value').then(function(snapshot) {
        totalPlayers = snapshot.val();
          if (totalPlayers === null) {
            totalPlayers = 1;
            playerCount.set(totalPlayers);
          } else {
            totalPlayers++;
            playerCount.set(totalPlayers);
        }
      });

      } else { // If two players are signed into the database alert that the game is full 
        alert('This game is currently full. Please try again later.');
    }

    });
  }
// })

/*
========================================
Player Count
========================================
*/
 
playerCount.on("value", function(snapshot) {       // Checks player count 
  totalPlayers = snapshot.val();               
  if (totalPlayers === 2) {                      // If the total player count is 2 shoot the game 
      shootGame();
  }
  console.log(totalPlayers);
});

/*
========================================
Add Players 
========================================
*/

  $('#chat').on('click', function() {

    var message = {
      name: nameField.val(),
      message: messageField()
    };
    
    convo.push(message)
    messageField.val(' ');

  convo.limitToLast(5).on('child_added', function(snapshot) {

    var data = snapshot.val();
    var player = data.name; 
    var message = data.message;

    var messageList = $('<li>');
    var playerName = $('<span id="playerName"></span>');
    playerName.html(player + ": ");
    messageList.html(message).prepend(playName); 
    chatLog.prepend(messageList); 
  
  }); 
})

  convo.onDisconnect().remove();          // Remove chat when the game is disconnected 

/*
========================================
Leaderboard Results
========================================
*/

// database.ref().on('value', function(snap) {
  
// });

});
