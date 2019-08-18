$(document).ready(function(){



//-------------------------------------------------------------------------------------------------------------------
//
//-----------------------------------------------------------------------------------------------------------------------
var res = ""
$(".TTTboard").hide()

//when clicking submit, calls the questions and their answers
$("#category-submit").on("click", function(event){
    event.preventDefault();
    //gets the value of the catagory and difficulty and saves them to vars
    var catagorySelect = $("#catagory-select").val()
    var difficultySelect = $("#difficulty-select").val()
    
    var triviaApi = "https://opentdb.com/api.php?amount=9&category=" + catagorySelect + "&difficulty=" + difficultySelect + "&type=multiple"

    $.ajax({
        url:triviaApi,
        method: 'GET'
}).then(function(response){

    // used to simplify the the response to be easier
    res = response.results
    console.log(res)

    var categoryChoice = {
        category: catagorySelect,
        difficulty: difficultySelect,
    }
    var questions ={
        results: response,
    }
    

    database.ref("categoryResults/").push(categoryChoice)
    database.ref("questionResults/").push(questions)
    
})
})
//-------------------------------------------------------------------------------------------------------------------
//

   // console.log("works",childSnapshot.val().category,childSnapshot.val().difficulty )
    //the link to pull the information with the catagory and difficulty above
    
//-----------------------------------------------------------------------------------------------------------------------
database.ref("categoryResults/").on("child_added", function(){   
    $("#categorySelect").hide()
    $(".TTTboard").show()
})

database.ref("questionResults/").on("child_added",function(childSnapshot){
})


// filler var for finding the correct answer
var correctAns = 0

var whoIsRight = 0

var guesses = 0


//-------------------------------------------------------------------------------------------------------------------
//
//-----------------------------------------------------------------------------------------------------------------------
//when the answer is clicked checks to see if the answer is correct.
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

//used to clear the questions and answers divs
function clearScrn(){
    $("#question").empty()
    $("#answersPlayer1").empty()
    $("#answersPlayer2").empty()
}
//-------------------------------------------------------------------------------------------------------------------
//
//-----------------------------------------------------------------------------------------------------------------------


//-------------------------------------------------------------------------------------------------------------------
//
//-----------------------------------------------------------------------------------------------------------------------
function question(data){

database.ref("questionResults/").on("child_added",function(childSnapshot){

    

var res = childSnapshot.val().results.results[data]

console.log(res)
//picks a random number 0-3 and splices the correct answer into the API's incorrect answer array
correctAns = Math.floor(Math.random() * (4 - 0))
var answers = res.incorrect_answers
answers.splice(correctAns, 0 , res.correct_answer)

whoIsRight = 0

//for loop to create 4 buttons with the answer array in them
for(var i = 0; i < answers.length; i++){
    var answerButton = $("<button>")
    answerButton.attr("value", i)
    answerButton.attr("class", "guess")
    answerButton.text(answers[i])
    $("#answersPlayer1").prepend(answerButton)
    
}
for(var i = 0; i < answers.length; i++){
    var answerButton = $("<button>")
    answerButton.attr("value", i)
    answerButton.attr("class", "guess")
    answerButton.text(answers[i])
    $("#answersPlayer2").append(answerButton)
}
// adds the question to the page based on which board button was clicked. 
var questionH1 = $("<h1>")
questionH1.attr("class", "question")
questionH1.text(res.question)
$("#question").html(questionH1)

})  
}
//-------------------------------------------------------------------------------------------------------------------
//each players color. 
//to send the data to firebase for global use
//
//-----------------------------------------------------------------------------------------------------------------------



//-------------------------------------------------------------------------------------------------------------------
// tic-tac-toe board does not hide on question instead becomes disabled 
//-----------------------------------------------------------------------------------------------------------------------
var x = 0

$(document).on("click", ".TTTboard", function(){
    $(".TTTboard").hide()

    x = $(this).val()

    guesses = 0

    question(x)


})
//-------------------------------------------------------------------------------------------------------------------
//do while test
//add to firebase?????
//-----------------------------------------------------------------------------------------------------------------------

function triviaWinner(){
    if(whoIsRight === 0 && guesses === 2){
        console.log("No winner")
        $(".TTTboard").show()
        clearScrn()
    }
    if(whoIsRight === 1){
        console.log("Player1 wins")
            }
    if(whoIsRight === 2){
        console.log("Player2 wins")
    }
    
}
//-------------------------------------------------------------------------------------------------------------------
//
//-----------------------------------------------------------------------------------------------------------------------
//need to clean up but the function the checks for a win
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
        alert("Blue Wins")
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
   }
}
//-------------------------------------------------------------------------------------------------------------------
//
//-----------------------------------------------------------------------------------------------------------------------

//Notes: 
//Order of events of game
//1)sets each player to a "color"
//2)sets turn to player 1
//3)player 1 selects a tile
//4)game shows player 1 the question
//5)both players answer, faster answer gets the question, if its a tie player one would get the point. 
//6)sets the board point selectet to disabled and changes turn to player 2. rinse repeat.
//6)game carries on until win criteria are met. 


// if (player1Turn === true){
//     $(this).addClass("blue")
//     $(this).addClass("btn-primary")
//     $(this).prop('disabled', true)
//     player2Turn = true
//     player1Turn = false
//     checkWins()
// }
// else{
//     $(this).addClass("red")
//     $(this).addClass("btn-danger")
//     $(this).prop('disabled', true)
//     player1Turn = true
//     player2Turn = false
//     checkWins()
// }
})