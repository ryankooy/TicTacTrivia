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
 var categoryResults = database.ref('categoryResults');
 var activeQuestion = database.ref('activeQuestion');
 var questionResults = database.ref("questionResults/");
 
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
 
 var currentTurn = null; 
 var player_1 = null;                // Sets up player 1
 var player_2 = null;                // Sets up player 2
 var totalPlayers = null;            // Sets up total number of players
 var gameResults = "";               // Stores game results 
 var blueGame = false;               // True if Blue wins
 var redGame = false;                // True if Red wins
 
 $(document).ready(function() {

 /*
 ========================================
 play Game
 ========================================
 */
 
//  $('#play').on('click', newPlayers);
 var nameField = $('#userName');             // Hides name feild on click 
 var convo = database.ref().child('chat');
 var messageField = $('#message');
 var chatLog = $('#chat-log');
 var options = $('#answers');

 /*
 ========================================
 Hidden Screens on load
 ========================================
 */

 /* ----------------------------------------------------------------- */
 $('.containerMain').hide();          // Hides main container 
 $('#introduction').hide();          // Section 2: Introduction 
 $('#player-selection').hide();     // Section 3: Player Selection 
  $('#category-selection-1').hide(); // Section 4: Category Selection 
  // $('#category-selection-2').hide(); // Section 4: Category Selection 
 $('#game-play').hide();         // Section 5: Game Play
 $('.chat-box').hide();         // Chat Section 
//  $('#outcome').hide();         // Section 6: Outcome 
//  $('#results').hide();        // Section 7: Results 
/* ----------------------------------------------------------------- */

    $('#start').show();                     // Section 1: Start 
    
    $('#instructions').on('click', function() {   // Hides start page on click 
      $('#introduction').show();         // Shows intrduction page 
      $('#start').hide();
      $('.containerMain').show();   
    })

    $('#play').on('click', function() {   // Hides start page on click 
      $('#player-selection').show();     // Section 3 - player secetions
      $('#start').hide();
      $('.containerMain').show();   
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
       $('#section-3-player-1').html(playerName + 'YOU ARE PLAYER 1')
       $('#section-3-player-1').append('WAITING FOR PLAYER 2...')
       player_1_details.html('PLAYER 1: ' + playerName + ' ');
       player_1 = 1; 
       player_2 = 2; 
       $('#user-info').hide();
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
      // $('#category-selection-2').show();
      // $('.chat-box').show();  
       database.ref('players/2/').update(player); 
       player_2_details = $('player-2');
       var player_1_details; 
       $('#section-3-player-2').html(playerName + 'YOU ARE PLAYER 2')
       player_2_details.html('PLAYER 2: ' + playerName + ' ');
       player_2 = 2; 
       player_1 = 1; 
       $('#player-selection').hide();
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
       })
       
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
    $('.chat-box').show();  
    $('#category-selection-1').show();   
    $('#player-selection').hide();
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
           $('.game-play').show();
           $('#player-1').html('PLAYER 1: ' + playerOneName + ' ');
       }
   })
   console.log("I am: " + player_1);
 
   // Player 2 details from the database
   playerTwo.on('value', function(snapshot) {
       var data = snapshot.val();
       var playerTwoName = data.name;
 
       if (player_2 === 2) {
        $('.chat-box').show();  
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

/*
 ========================================
 Resets Firebase Data on Disconnect 
 ========================================
 */
 
   convo.onDisconnect().remove();           // Remove chat when the game is disconnected 
   categoryResults.onDisconnect().remove(); 
   activeQuestion.onDisconnect().remove(); 
   questionResults.onDisconnect().remove();
 

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
      alert("Blue Wins");
      blueGame = true;

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
     alert("Red Wins")
     redGame = true;
 }
}

/*
============================
Setting a category 
============================
*/
var res = ""
$(".TTTboard").hide()


$("#category-submit").on("click", function(event){ //Clicking the submit button on category select
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
  $("#category-selection").hide()
  $(".TTTboard").show()
})
/*
====================
Checking answer 
*********needs work*********
====================
*/

var correctAns = 0

var whoIsRight = 0

$(document).on("click", "#answersPlayer1 > .guess", function(){
    if ($(this).val() == correctAns){
        console.log("correct")
        clearScrn()
        $(".TTTboard").show()
        whoIsRight = 1
    triviaWinner()
    }
    else{
        console.log("wrong")    
        $("#answersPlayer1").empty()
        guesses++
        triviaWinner()

    }
})

$(document).on("click", "#answersPlayer2 > .guess", function(){
    if ($(this).val() == correctAns){
        console.log("correct")
        clearScrn()
        $(".TTTboard").show()
        whoIsRight = 2
        triviaWinner()
    }
    else{
        console.log("wrong")    
        $("#answersPlayer2").empty()
        guesses++
        triviaWinner()
    }
})


/*
================
Getting the question and answers function
================
*/

function question(data){
  
  database.ref("questionResults/").on("child_added",function(childSnapshot){
  var res = childSnapshot.val().results[data]
  //picks a random number 0-3 and splices the correct answer into the API's incorrect answer array
  correctAns = Math.floor(Math.random() * (4 - 0))
  
  var answers = res.incorrect_answers
  answers.splice(correctAns, 0 , res.correct_answer)
  
  whoIsRight = 0
  
    var chosenSquare = {
      question: res.question,
      answer: answers
    }

      database.ref('activeQuestion').set(chosenSquare)
      database.ref('activeQuestion').on('value', function(snapshot) {
        var data = snapshot.val();
        var question = data.question;
        var answer_1 = data.answer;


        
        console.log('The length of the answers: '+ answer_1.length)

        // answer_1.forEach(function(answer_1) {
        //    var row = $('<button>');
       
        for (var i = 0; i < 4; i++ ) {
          var buttonDiv = $("<div class='row'>");
          var radioButton = $("<button>");
          radioButton.append('<label><input class="record"' 
          +i+' type="radio" name="' + answer_1.length +'"  value="' + answer_1[i] + '" /> ' + answer_1[i] + '</label>');
          buttonDiv.append(radioButton)
          $('.active-answers-1').append(buttonDiv);
        } 
     
        for (var i = 0; i < 4; i++ ) {
          var buttonDiv = $("<div class='row'>");
          var radioButton = $("<button>");
          radioButton.append('<label><input class="record"' 
          +i+' type="radio" name="' + answer_1.length +'"  value="' + answer_1[i] + '" /> ' + answer_1[i] + '</label>');
          buttonDiv.append(radioButton)
          $('.active-answers-2').append(buttonDiv);
        } 

      $('.active-question').html(question + ' ');
      console.log('The current question is: ' + question + ' ');
      console.log('The current options are: ' + answer_1 + ' ');
    })
 
   
// database.ref("activeQuestion").on("child_added", function(childSnapshot){
//  console.log(database.ref().activeQuestion)

})
}
  


  /*
  ======================
  clicking the board and brining the questions and answers up
  ======================
  */

 var x = 0;

 $(document).on("click", ".TTTboard", function(){
     $(".TTTboard").hide()
 
     x = parseInt($(this).val())

     question(x)
     

 })
})
  //    database.ref().once("value", function(snapshot) {
  //     var player_1_name = snapshot.child('players/' + player_1 + '/name').val();
  //     var player_2_name = snapshot.child('players/' + player_2 + '/name').val();


  //     turn.once('value').then(function(snapshot) { 
  //         currentTurn = snapshot.val();
  //         if (currentTurn === null) {
  //             currentTurn = 1;
  //             turn.set(currentTurn); 
  //         } else if (currentTurn === 1) {
  //             currentTurn = 2;
  //             turn.set(currentTurn); 
  //         } else if (currentTurn === 2) {
  //             currentTurn = 1;
  //             turn.set(currentTurn); 
              
  //         }
  //     });
  // });

  /*
====================
Leaderboard results
*********needs work*********
====================
*/

// var leaderBoard = $('<tr>').append(
//   $('<td>').text(),
//   $('<td>').text(),
//   $('<td>').text()
// );

// database.ref().on('value', function() {
//   checkWins();
//   if (blueGame === true) {
//     $('.table > tbody').text(leaderBoard);
//   } else if (redGame === true) {
    
//   }
// });

//  })
