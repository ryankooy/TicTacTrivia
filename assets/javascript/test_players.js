var firebaseConfig = {
    apiKey: "AIzaSyBTEr216H55-c9O3_SlOTnzPBMnK9zn5HM",
    authDomain: "test-ba567.firebaseapp.com",
    databaseURL: "https://test-ba567.firebaseio.com",
    projectId: "test-ba567",
    storageBucket: "",
    messagingSenderId: "30959409325",
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
 var category = database.ref('category');
 var difficulty = database.ref('difficulty');
 
 
 var player = {                  // Stores player details
   name: "",
   email: "",
   choice: "",
   wins: 0,
   losses: 0,
   uid: "", 
 };
 
 var recentWinners = null; 
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
 var addPlayerButton = $('#play');         // Stores new play 
 var convo = database.ref().child('chat');
 var messageField = $('#message');
 var chatLog = $('#chat-log');

 /*
 ========================================
 Hidden Screens on load
 ========================================
 */

 $('Start').hide();                  // Section 1: Start 
 $('introduction').hide();          // Section 2: Introduction 
 $('#player-selection').hide();    // Section 3: Player Selection 
 $('#category-selection').hide(); // Section 4: Category Selection 
 $('#game-play').hide();         // Section 5: Game Play
 $('.chat-box').hide();         // Chat Section 
 $('#outcome').hide();         // Section 6: Outcome 
 $('#results').hide();        // Section 7: Results 
 
 /*
 ========================================
 Add Players 
 ========================================
 */
 
 function newPlayers(){
    $('#player-selection').hide();
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
       $('container-player-1').show();
       $('container-player-2').hide();
       nameField.hide();
       addPlayerButton.hide();
 
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
       $('container-player-2').show();
       $('container-player-1').hide();

       nameField.hide(); 
       addPlayersButton.hide(); 
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
 
     })
   }
 
 
 /*
 ========================================
 Player Count
 ========================================
 */
  
 playerCount.on("value", function(snapshot) {       // Checks player count 
   totalPlayers = snapshot.val();               
   if (totalPlayers === 2) {                      // If the total player count is 2 shoot the game 
       startGame();
   }
   console.log(totalPlayers);
 });
 
 /*
 ========================================
 Start Game
 ========================================
 */
 
 function startGame() {
 
   // Player details from the database
   var playerOne = database.ref('players/' + player_1 + '/');
   var playerTwo = database.ref('players/' + player_2 + '/');
 
   // Player 1 details from the database
   playerOne.on('value', function(snapshot) {
       var data = snapshot.val();
       var playerOneName = data.name;
 
       if (player_1 === 1) {
           $('player-selection').hide();
           $('.game-play').show();
           $('#player-1').html('PLAYER 1: ' + playerOneName + ' ');

       }
   })
   console.log("I am: " + player_1);
 
   // Player 2 details from the database
   playerTwo.on('value', function(snapshot) {
       var data = snapshot.val();
       var playerTwoName = data.name;
       var playerTwoWins = data.wins;
       var playerTwoLosses = data.losses;
 
       if (player_2 === 2) {
            $('player-selection').hide();
            $('.game-play').show();
           $('#player-2').html('PLAYER 2: ' + playerTwoName + ' ');
       }
   });
   console.log("I am: " + player_2);
 
   // Clears player details when a player disconnects
   if (playerOne.onDisconnect().remove()) {
       playerCount.set(totalPlayers - 1);  // Updates player count
       choice = null;                      // Clears choices
   }
   // Clears player details when a player disconnects
   if (playerTwo.onDisconnect().remove()) {
       playerCount.set(totalPlayers - 1);  // Updates player count
       choice = null;                      // Clears choices
   }
 
   // Player turns 
   database.ref('turn').set(1);   // Sets turn count to 1 
   database.ref('turn').on('value', function(snapshot) {
       var turn = snapshot.val();
 
       if (turn === null || turn === 1){
           playerOne.on('value', function(snapshot) {
               var data = snapshot.val();
               var playerOneName = data.name;
 
               $('#status').html('Player 1: ' + playerOneName + '\'s your turn to place an icon');
               console.log('Player 1: ' + playerOneName + '\'s your turn to place an icon');
           })
           console.log("it is player 1's turn");
       } else if (turn === 2){
           playerTwo.on('value', function(snapshot) {
               var data = snapshot.val();
               var playerTwoName = data.name;
               $('#status').html('Player 2: ' + playerOneName + '\'s your turn to place an icon');
               console.log("please update to: " + playerTwoName + "\"s turn");
           })
           console.log("it is player 2's turn");
       }
      
   })
 };
 
 /*
 ========================================
 Current Turn 
 ========================================
 */
  
 
 $(".resetTurn").on('click', function (){
   database.ref().once("value", function(snapshot) {
       var player_1_name = snapshot.child('players/' + player_1 + '/name').val();
       var player_2_name = snapshot.child('players/' + player_2 + '/name').val();
 
 
       turn.once('value').then(function(snapshot) { 
           currentTurn = snapshot.val();
           if (currentTurn === null) {
               currentTurn = 1;
               turn.set(currentTurn); 
           } else if (currentTurn === 1) {
               currentTurn = 2;
               turn.set(currentTurn); 
               console.log("please update to: " + player_1_name + "\"s turn");
               console.log("My turn should be 1: " + currentTurn);
               console.log("player 1 clicked a button");
           } else if (currentTurn === 2) {
               currentTurn = 1;
               turn.set(currentTurn); 
               console.log("please update to: " + player_2_name + "\"s turn");
               console.log("My turn should be 2: " + currentTurn);
               console.log("player 2: clicked a button");
               
           }
       });
   });
 })
 /*
 ========================================
 Chat function 
 ========================================
 */
 
   $('#chat').on('click', function() {
 
     var message = {
       name: nameField.val(),
       message: messageField.val()
     };
     
     convo.push(message);
     messageField.val(' ');
   }); 
 
   convo.limitToLast(5).on('child_added', function(snapshot) {
 
     var data = snapshot.val();
     var player = data.name; 
     var message = data.message;
 
     var messageList = $('<li>');
     var playerName = $('<span id="playerName"></span>');
     playerName.html(player + ": ");
     messageList.html(message).prepend(playerName); 
     chatLog.prepend(messageList); 
   
   }); 
 
   convo.onDisconnect().remove();          // Remove chat when the game is disconnected 
 
 
 })
 