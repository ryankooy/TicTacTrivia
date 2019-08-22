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
 var players = database.ref('players');          // Connects players' details to the database
 var playerCount = database.ref('playerCount'); // Keeps track of the number of players in the database
 var outcome = database.ref('gameResults');    // Connects outcomes to the database
 var turn = database.ref('turn');
 var categoryResults = database.ref('categoryResults');
 var activeQuestion = database.ref('activeQuestion');
 var questionResults = database.ref("questionResults/");
 var boardValue = database.ref("boardvalue/");
 
 var categories = {  //used to save the category and difficulty used for the leaderboards
  category: "", 
  difficulty: "",
}
var questions = { //saves the response from the trivia api into our firebase database
  results: "",
}
var chosenSquare;

 var player = {                  // Stores player details
   name: "",
   email: "",
   choice: "",
   wins: 0,
   losses: 0,
   uid: "", 
 };
 
 var time = 20;
 var clockRunning = false;
 var board = null;
 var currentTurn = null; 
 var player_1 = null;                // Sets up player 1
 var player_2 = null;                // Sets up player 2
 var totalPlayers = null;            // Sets up total number of players
 var gameResults = "";               // Stores game results 
 var blueGame = false;               // True if Blue wins
 var redGame = false;                // True if Red wins
 var question1 = '';
 $(document).ready(function() {

 /*
 ========================================
 play Game
 ========================================
 */
 
//  $('#play').on('click', newPlayers);
 var nameField = $('#userName');             // Hides name field on click 
 var convo = database.ref().child('chat');
 var messageField = $('#message');
 var chatLog = $('#chat-log');
 var options = $('#answers');

/*
========================================
Sound Effects
========================================
*/

 var s_buttonClick = document.getElementById("button-click");
 var s_wonGame = document.getElementById("won-game");
 var s_drawGame = document.getElementById("game-draw");
 var s_gameFull = document.getElementById("game-is-full");
 var s_2players = document.getElementById('2-players-in-game');
 


 /*
 ========================================
 Hidden Screens on load
 ========================================
 */

 /* ----------------------------------------------------------------- */

    $('.containerMain').hide();          // Hides main container 
    $('.containerMain2').hide(); 
    $('#introduction').hide();          // Section 2: Introduction 
    $('#player-selection').hide();     // Section 3: Player Selection 
    $('#category-selection-1').hide(); // Section 4: Category Selection 
      // $('#category-selection-2').hide(); // Section 4: Category Selection 
    $('#game-play').hide();         // Section 5: Game Play
    $("#winner").hide()
    $('.chat-box').hide();         // Chat Section 
    //  $('#outcome').hide();         // Section 6: Outcome 
    $('#results').hide();        // Section 7: Results 

/* ----------------------------------------------------------------- */
    $('.waiting').hide();
    $("myVideo").show()
    $('#start').show();                     // Section 1: Start 
    $('.containerMain2').hide();
    
    $('#instructions').on('click', function() {   // Hides start page on click 
        $('#introduction').show();         // Shows intrduction page 
        $('#start').hide();
        $('.containerMain').show();   
    })
    
    $('#invite-friend').hide(); 
    
    $('#play').on('click', function() {   // Hides start page on click 
        $('#player-selection').show();     // Section 3 - player secetions
        $('#start').hide();
        $('.containerMain').show();   
    })
/* ----------------------------------------------------------------- */
$("#submit-player").hide();
$('#introduction').hide();

$('#play').on('click', function() {   // Hides start page on click 
  $('#player-selection').show();     // Section 3 - player secetions
  $('.containerMain').show();   
})

$('#play-now').on('click', function() {   // Hides start page on click 
  $('#player-selection').show();     // Section 3 - player secetions
  $('#introduction').hide();
  $('.containerMain').show();   
})

$("#userName").keyup(function() {
  $("#submit-player").show();
});

/* ----------------------------------------------------------------- */

$('#play-again').on('click', function(){
  $('#player-selection').show();
  $('.containerMain').show();   
  $('.containerMain2').hide();   
  $('#results').hide(); 
})

/* ----------------------------------------------------------------- */

    $('#to-section-3').on('click', function(){
      $('#player-selection').show();
      $('#introduction').hide(); 
    })

/* ----------------------------------------------------------------- */

    $('#submit-player').on('click', newPlayers);
      
     $('#to-section-4').on('click', function(){
      $('#player-selection').hide();
    })
/* ----------------------------------------------------------------- */
    $('#containerP-1').hide();      // Hides player 1's game section 
    $('#containerP-2').hide();      // Hides player 2's game section 

    $(".radio-buttons").hide(); 
    $("#timer-1").hide();
    $("#timer-2").hide();

 /*
 ========================================
 Invite A Friend Via Email 
 ========================================
 */

$('#submit_invite').on('click', function() {
  var e = $('#friend_email').val().trim();
  $('#friend_email').attr('value', 'e');

});

 /*
 ========================================
 Add Players 
 ========================================
 */
 
 function newPlayers(){
   firebase.auth().signInAnonymously();     
   var playerName = $('#userName').val().trim();
   var playerEmail = $('#email').val().trim();
   player.email = playerEmail;
   player.name = playerName; 
   player.uid = firebase.auth().currentUser.uid;
 
   database.ref().once('value').then(function(snapshot){
 
     if (!snapshot.child('players/1').exists()) {
       database.ref('players/1/').update(player);
       player_1_details = $('player-1');
       var player_2_details;
       $('#section-3-player-1').html('<h2>' + playerName + ' You Are Player 1' + '</h2>');
       $('#section-3-player-1').append('<h2>' + 'You are currently the only player online. Waiting for player 2...' + '</h2>');
       $('.waiting').show();
       player_1_details.html('PLAYER 1: ' + playerName + ' ');
       player_1 = 1; 
       currentTurn = 1;
       $('#invite-friend').show(); 
       $('#user-info').hide();
       $('#submit-player').hide();
       console.log("This is tthe value of:" + player_1);
       database.ref('turn').set(1);
       playerCount.once('value').then(function(snapshot) {
         totalPlayers = snapshot.val();
            if (totalPlayers === null) {
              totalPlayers = 1;
              playerCount.set(totalPlayers); // Updates the playerCount in the database = totalPlayers
          } else {
              totalPlayers++;
              playerCount.set(totalPlayers);
          }
       });
 
     } else if (!snapshot.child('players/2').exists()) {
      $('#invite-friend').hide();  
      $('.waiting').hide();
       database.ref('players/2/').update(player); 
       player_2_details = $('player-2');
       var player_1_details; 
       $('#section-3-player-2').html(playerName + 'YOU ARE PLAYER 2')
       player_2_details.html('PLAYER 2: ' + playerName + ' ');
       player_2 = 2; 
       currentTurn = 2;
       $('#player-selection').hide();
       console.log("This is the value of:" + player_2);
       database.ref('turn').set(1);
       playerCount.once('value').then(function(snapshot) {
         totalPlayers = snapshot.val();
           if (totalPlayers === 1) {
             totalPlayers = 2;
             playerCount.set(totalPlayers);
           } 
       })
       
       } else { // If two players are signed into the database alert that the game is full 
         alert('This game is currently full. Please try again later.');
         s_gameFull.play();
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
   console.log('Total number of active players: ' + totalPlayers);
 });

 /*
 ========================================
 Start Game
 ========================================
 */
 
 function startGame() {
  
  s_2players.play();
  $('.chat-box').show();  
  $('#category-selection-1').show();   
  $('#player-selection').hide();
   // Player details from the database
   var playerOne = database.ref('players/' + player_1 + '/');
   var playerTwo = database.ref('players/' + player_2 + '/');
 
   // Player 1 details from the database
   playerOne.on('value', function(snapshot) {
       var data = snapshot.val();
       var playerOneName = data.name;
 
       if (player_1 === 1) { 
        $('#player-2').html('PLAYER 2: ' + playerOneName + ' ');
       }
   })
   console.log("I am: " + player_1);
 
   // Player 2 details from the database
   playerTwo.on('value', function(snapshot) {
       var data = snapshot.val();
       var playerTwoName = data.name;
 
       if (player_2 === 2) {
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
       var boardValFB = database.ref("boardvalue")
       boardValFB.once("value", function(snapshot){
         board = snapshot.val()
         question(board);
    
         $(".active-question-1").html(question1 + ' ');
         $(".active-question-2").html(question1 + ' ');
       })
 
       if (turn === null || turn === 1){
           playerOne.on('value', function(snapshot) {
               var data = snapshot.val();
               var playerOneName = data.name;
               $('.status').html('Player 1: ' + playerOneName + '\'s your turn to choose a square!');
  
               console.log('Player 1: ' + playerOneName + '\'s your turn to place an icon');
           })
           console.log("it is player 1's turn");
       } else if (turn === 2){
           playerTwo.on('value', function(snapshot) {
               var data = snapshot.val();
               var playerTwoName = data.name;
               $('.status').html('Player 2: ' + playerTwoName + '\'s your turn to choose a square!');
           
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
              //  question(board);
              $('.status').html('Player 1: ' + player_1_name + '\'s your turn to choose a square!');
              // $('#status-2').html('Player 1: ' + player_1_name + '\'s your turn to choose a square!');
               console.log("please update to: " + player_1_name + "\"s turn");
               console.log("My turn should be 1: " + currentTurn);
               console.log("player 1 clicked a button");
           } else if (currentTurn === 2) {
               currentTurn = 1;
               turn.set(currentTurn); 
              //  question(board);
              $('.status').html('Player 2: ' + player_2_name + '\'s your turn to choose a square!');
              // $('#status-2').html('Player 2: ' + player_2_name + '\'s your turn to choose a square!');
               console.log("please update to: " + player_2_name + "\"s turn");
               console.log("My turn should be 2: " + currentTurn);
               console.log("player 2: clicked a button");
               
           }
        
       });
   });
 })

   //  if (currentTurn === 1){
          //   $('.status').html('Player 1: ' + player_1_name + '\'s your turn to choose a square!');
          //   // $('#status-2').html('Player 1: ' + player_1_name + '\'s your turn to choose a square!');
          //  } else if (currentTurn === 2){
          //   $('.status').html('Player 2: ' + player_2_name + '\'s your turn to choose a square!');
          //   // $('#status-2').html('Player 2: ' + player_2_name + '\'s your turn to choose a square!');
            
          //  }
//  database.ref().once("value", function(snapshot) {
//   var player_1_name = snapshot.child('players/' + player_1 + '/name').val();
//   var player_2_name = snapshot.child('players/' + player_2 + '/name').val();

//  turn.once('value').then(function(snapshot) { 
//   currentTurn = snapshot.val();
 
 /*
 ========================================
 Chat function 
 ========================================
 */
 
   $('#chat').on('click', function() {
    s_buttonClick.play();
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

/*
 ========================================
 Resets Firebase Data on Disconnect 
 ========================================
 */
 
   convo.onDisconnect().remove();           // Remove chat when the game is disconnected 
   categoryResults.onDisconnect().remove(); 
   activeQuestion.onDisconnect().remove(); 
   boardValue.onDisconnect().remove();
   questionResults.onDisconnect().remove();
   players.onDisconnect().remove();
 

 /*
 ============================
 Win results
  **************need to DRY****************************
 ============================
 */

function checkWins(){
  var blueWins1 = $("#one.blue, #two.blue, #three.blue").length === 3
  var blueWins2 = $("#four.blue, #five.blue, #six.blue").length === 3
  var blueWins3 = $("#seven.blue, #eight.blue, #nine.blue").length === 3
  var blueWins4 = $("#one.blue, #four.blue, #seven.blue").length === 3
  var blueWins5 = $("#two.blue, #five.blue, #eight.blue").length === 3
  var blueWins6 = $("#three.blue, #six.blue, #nine.blue").length === 3
  var blueWins7 = $("#one.blue, #five.blue, #nine.blue").length === 3
  var blueWins8 = $("#three.blue, #five.blue, #seven.blue").length === 3

  if(blueWins1 === true || blueWins2 === true || blueWins3 === true ||
       blueWins4 === true || blueWins5 === true || blueWins6 === true ||
       blueWins7 === true || blueWins8 === true){
      alert("player 2 Wins");
      gameEnd = true;

  }
  
  var redWins1 = $("#one.red, #two.red, #three.red").length === 3
  var redWins2 = $("#four.red, #five.red, #six.red").length === 3
  var redWins3 = $("#seven.red, #eight.red, #nine.red").length === 3
  var redWins4 = $("#one.red, #four.red, #seven.red").length === 3
  var redWins5 = $("#two.red, #five.red, #eight.red").length === 3
  var redWins6 = $("#three.red, #six.red, #nine.red").length === 3
  var redWins7 = $("#one.red, #five.red, #nine.red").length === 3
  var redWins8 = $("#three.red, #five.red, #seven.red").length === 3
  
  if(redWins1 === true || redWins2 === true || redWins3 === true ||
      redWins4 === true || redWins5 === true || redWins6 === true ||
      redWins7 === true || redWins8 === true){
     alert("player 1 Wins");
     gameEnd = true;
 }
}

/*
===================================================
Setting a category 
===================================================
*/
    var res = ""

 
    $("#category-submit").on("click", function(event){ //Clicking the submit button on category select
      s_buttonClick.play();
      $('#game-play').show();
      $('#category-selection-1').hide();
        event.preventDefault();
        
        var catagorySelect = $("#catagory-select").val() //the number associated with the category
        var difficultySelect = $("#difficulty-select").val() //the difficulty chosen
        
        var triviaApi = "https://opentdb.com/api.php?amount=9&category=" + catagorySelect + "&difficulty=" + difficultySelect + "&type=multiple"// the api to get our trivia

        $.ajax({
            url:triviaApi,
            method: 'GET'
        }).then(function(response){

        // used to simplify the the response to be easier
        res = response.results
        console.log(res)

        var categoryChoice = {  //used to save the category and difficulty used for the leaderboards
            category: catagorySelect, 
            difficulty: difficultySelect,
        }

        
        var questions ={ //saves the response from the trivia api into our firebase database
            results: response,
        }
        

        database.ref("categoryResults/").set(categoryChoice)
        database.ref("questionResults/").set(questions)
        
    })
    })

    database.ref("categoryResults/").on("child_added", function(){  
      
      $('.chat-box').removeClass("row");       // Removes & adds classes to shift the chat box when containerMain 2 is introduced 
      $('.chat-box').removeClass("chat-2");
      $('.chat-box').addClass("chat-3");
      $('#myVideo').hide();                   // Hides the background video and reveals a static background
      $('.containerMain').hide();  
      $('.containerMain2').show();            // Introduces a new - centered container 
      $("#category-selection-1").hide()
      $("#game-play").show()

      // database.ref().once("value", function(snapshot) {
      //   var player_1_name = snapshot.child('players/' + player_1 + '/name').val();
      //   var player_2_name = snapshot.child('players/' + player_2 + '/name').val();
  
        if (player_1 === 1) {
          $('#containerP-1').show();
          // $('#status-1').html('Player 1: ' + player_1_name + '\'s your turn to choose a square!');
          // $('#status-2').append('Player 1: ' + player_1_name + '\'s your turn to choose a square!');
          
          // timer();

        }
        if (player_2 === 2) {
          $('#containerP-2').show();
          // $('#status-1').html('Player 2: ' + player_2_name + '\'s your turn to choose a square!');
          // $('#status-2').append('Player 2: ' + player_2_name + '\'s your turn to choose a square!');
           
          // timer();
        
        }
    })
  // })


/*
===========================================
Checking answer 
===========================================
*/
  var correctANSText = ""
  var guesses = database.ref("TotalGuesses")
  database.ref("TotalGuesses").onDisconnect().remove();
 
  if (clockRunning === false){
    $('.radio-buttons').hide()
    $(".active-question-1").hide();
    $(".active-question-2").hide();
    $("#timer-1").hide();
    $("#timer-2").hide();
  }
  

  $(document).on("click", '#btn-1-1', function(){
    var pl_1 = database.ref("players/1/choice");
    if($("#btn-1-1").is(':checked') && $(this).val() === correctANSText && clockRunning === true){
      pl_1.set(true);
      stop();
      console.log('player 1 gets this square');
      console.log('the time is running' + clockRunning);

    } else if ($("#btn-1-1").is(':checked') && $(this).val() != correctANSText && clockRunning === true){
      pl_1.set(false);
      stop();
      console.log('the time is running' + clockRunning);
    }
  })

  $(document).on("click", '#btn-2-1', function(){
    var pl_1 = database.ref("players/1/choice");
    event.preventDefault();
    if($("#btn-2-1").is(':checked') && $(this).val() === correctANSText && clockRunning === true){
      pl_1.set(true);
      stop();
      console.log('the time is running' + clockRunning);

    } else if ($("#btn-2-1").is(':checked') && $(this).val() != correctANSText && clockRunning === true){
      pl_1.set(false);
      stop();
      console.log('the time is running' + clockRunning);
    }
  })

  $(document).on("click", '#btn-3-1', function(){
    var pl_1 = database.ref("players/1/choice");
    event.preventDefault();

    if($("#btn-3-1").is(':checked') && $(this).val() === correctANSText && clockRunning === true){
      pl_1.set(true);
      stop();
      console.log('player 1 gets this square');
      console.log('the time is running' + clockRunning);

    } else if ($("#btn-3-1").is(':checked') && $(this).val() != correctANSText && clockRunning === true){
      pl_1.set(false);
      stop();
      console.log('the time is running' + clockRunning);
    }
  })

  $(document).on("click", '#btn-4-1', function(){
    var pl_1 = database.ref("players/1/choice");
    event.preventDefault();
    if($("#btn-4-1").is(':checked') && $(this).val() === correctANSText && clockRunning === true ){
      pl_1.set(true);
      stop();
      console.log('player 1 gets this square');
      console.log('the time is running' + clockRunning);

    } else if ($("#btn-4-1").is(':checked') && $(this).val() != correctANSText && clockRunning === true){
      pl_1.set(false);
      stop();
      console.log('the time is running' + clockRunning);
    }
  })

  $(document).on("click", '#btn-1-2', function(){
    var pl_2 = database.ref("players/2/choice");

    if($("#btn-1-2").is(':checked') && $(this).val() === correctANSText && clockRunning === true){
      pl_2.set(true);
      stop();
      console.log('player 1 gets this square');
      console.log('the time is running' + clockRunning);

    } else if ($("#btn-1-2").is(':checked') && $(this).val() != correctANSText && clockRunning === true){
      pl_2.set(false);
      stop();
      console.log('the time is running' + clockRunning);
    }
  })

  $(document).on("click", '#btn-2-2', function(){
    var pl_2 = database.ref("players/2/choice");
    event.preventDefault();
    if($("#btn-2-2").is(':checked') && $(this).val() === correctANSText && clockRunning === true){
      pl_2.set(true);
      stop();
      console.log('the time is running' + clockRunning);

    } else if ($("#btn-2-2").is(':checked') && $(this).val() != correctANSText && clockRunning === true){
      pl_2.set(false);
      stop();
      console.log('the time is running' + clockRunning);
    }
  })

  $(document).on("click", '#btn-3-2', function(){
    var pl_2 = database.ref("players/2/choice");
    event.preventDefault();

    if($("#btn-3-2").is(':checked') && $(this).val() === correctANSText && clockRunning === true){
      pl_2.set(true);
      stop();
      console.log('player 1 gets this square');
      console.log('the time is running' + clockRunning);

    } else if ($("#btn-3-2").is(':checked') && $(this).val() != correctANSText && clockRunning === true){
      pl_2.set(false);
      stop();
      console.log('the time is running' + clockRunning);
    }
  })

  $(document).on("click", '#btn-4-2', function(){
    var pl_2 = database.ref("players/2/choice");
    event.preventDefault();
    if($("#btn-4-2").is(':checked') && $(this).val() === correctANSText && clockRunning === true ){
      pl_2.set(true);
      stop();
      console.log('player 1 gets this square');
      console.log('the time is running' + clockRunning);

    } else if ($("#btn-4-2").is(':checked') && $(this).val() != correctANSText && clockRunning === true){
      pl_2.set(false);
      stop();
      console.log('the time is running' + clockRunning);
    }
  })

  var player1Guess ="" 
  var player2Guess = ""
  database.ref("players/1/choice").on("value", function(snapshot){
    var p1Exists = (snapshot.val())
    player1Guessed(p1Exists)
    console.log("p1: " + p1Exists)
    console.log(player1Guess,player2Guess)
    winner()
    if(player1Guess === false && player2Guess === false){
      console.log("both fail")
    }
  })
  database.ref("players/2/choice").on("value", function(snapshot){
    var p2Exists = (snapshot.val())
    player2Guessed(p2Exists)
    console.log("p2: " + p2Exists)
    console.log(player1Guess,player2Guess)
    winner()
    if(player1Guess === false && player2Guess === false){
      console.log("both fail")
    }
  })
  function player1Guessed(data1){
    player1Guess = data1
    console.log(player1Guess)
  }
  function player2Guessed(data2){
    player2Guess = data2
    console.log(player2Guess)
  }
  function winner(){
    if (player1Guess === true){
      // $("#containerP-1").hide()
      // $("#containerP-2").hide()
      console.log("player 1 wins")
      $("[value=" + board + "]").attr("class", "red").addClass("player-1-botton")
      checkWins()
      clearWinCriteria()

    }
    if (player2Guess === true){
      console.log("player 2 wins")
      // $("#containerP-1").hide()
      // $("#containerP-2").hide()
      $("[value=" + board + "]").attr("class", "blue").addClass("player-2-botton")
      checkWins()
      setTimeout(clearWinCriteria, 2000)
    }
  }

    function clearWinCriteria(){
      // $("#containerP-1").show()
      // $("#containerP-2").show()
      database.ref("players/2/choice").remove()
      database.ref("players/1/choice").remove()
      player1Guess = ""
      player2Guess = ""
    }

/*
==========================================
Question Function to Generate the Q & A's 
==========================================
*/

    function question(data){
   
   
      $(".active-question-1").show();
      $(".active-question-2").show();
      
      var playerOne = database.ref('players/' + player_1 + '/');
      var playerTwo = database.ref('players/' + player_2 + '/');
            playerOne.on('value', function(snapshot) {
              var data = snapshot.val();
              var playerOneName = data.name;
          $('#player-1').html('PLAYER 1: ' + playerOneName + ' ');
          })

          playerTwo.on('value', function(snapshot) {
            var data = snapshot.val();
            var playerTwoName = data.name;
        $('#player-2').html('PLAYER 2: ' + playerTwoName + ' ');
        })

      timer();
      clockRunning = true; 
        $(".active-answers-1").empty();        // Empties player-1's answers before a new question is generated
        $(".active-answers-2").empty();        // Empties player-2's answers before a new question is generated
        
        guesses = 0;                          // Locally sets initial guesses to 0 
        database.ref("TotalGuesses").set(guesses);   // Sets TotalGuesses in the database equal to the local guesses variable
        
        // When a child is added to the questionResults in the data base run the following function to generate the corresponding answers
        database.ref("questionResults/").on("child_added",function(childSnapshot){
            var res = childSnapshot.val().results[data]
            //picks a random number 0-3 and splices the correct answer into the API's incorrect answer array
            correctAns = Math.floor(Math.random() * (4 - 0))
            correctANSText = res.correct_answer               // Collects the correct answer data from the database
            var answers = res.incorrect_answers               // Collects the incorrect answer data from the database
            answers.splice(correctAns, 0 , res.correct_answer)
            
            whoIsRight = 0                                 
            
                var chosenSquare = {
                  question: res.question,
                  answer: answers,
                }

                var correct = {
                  correct: correctANSText,
                }

                database.ref("correctAnswer").set(correct)
                database.ref('activeQuestion').set(chosenSquare)

                database.ref('activeQuestion').once('value', function(snapshot) {
                  
                  var data = snapshot.val();
                  question1 = data.question;
                  var answer_1 = data.answer;
                  console.log('The length of the answers: '+ answer_1.length);
                  $('.option-1').html(answer_1[0]).attr('value', answer_1[0]);
                  $('.option-2').html(answer_1[1]).attr('value', answer_1[1]);
                  $('.option-3').html(answer_1[2]).attr('value', answer_1[2]);
                  $('.option-4').html(answer_1[3]).attr('value', answer_1[3]);
                
                });
                $('.radio-buttons').show();
                reset();
                $("#timer-1").show();
                $("#timer-2").show();
            
              
        });
    }
  


/*
===========================================================
Board onClick function (generating Q & A's 
===========================================================
*/

    $(document).on("click", ".TTTboard", function(){
      s_buttonClick.play();
      $(".TTTboard").add('animated', 'shake')
        board = parseInt($(this).val())
        database.ref("boardvalue").set(board)

    })

/* ----------------------------------------------------------------- */
}) // End of main document on ready function 
/* ----------------------------------------------------------------- */

  // $('#results').show();


