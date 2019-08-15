// Trivia
//-----------------------------------------------------------------------------------------------------
var res = ""
$(".TTTboard").hide()

//when clicking submit, calls the questions and their answers
$("#category-submit").on("click", function(event){
    event.preventDefault();

    //gets the value of the catagory and difficulty and saves them to vars
    var catagorySelect = $("#catagory-select").val()
    var difficultySelect = $("#difficulty-select").val()

    //the link to pull the information with the catagory and difficulty above
    var triviaApi = "https://opentdb.com/api.php?amount=9&category=" + catagorySelect + "&difficulty=" + difficultySelect+ "&type=multiple"

$.ajax({
    url:triviaApi,
    method: 'GET'
}).then(function(response){

    // used to simplify the the response to be easier
    res = response.results
    console.log(res)
    $(".TTTboard").show()
})
})


// filler var for finding the correct answer
var correctAns = 0

//when a spot on the board is clicked
$(document).on("click", ".TTTboard", function(){

    //gets the spot on the board where the user selects and pulls the value (0-8) to get the equivilent number in the question list
    var x = $(this).val()

    //picks a random number 0-3 and splices the correct answer into the API's incorrect answer array
    correctAns = Math.floor(Math.random() * (4 - 0))
    var answers = res[x].incorrect_answers
    answers.splice(correctAns, 0 , res[x].correct_answer)
    // console.log (correctAns)

    //for loop to create 4 buttons with the answer array in them
    for(var i = 0; i < answers.length; i++){
        var answerButton = $("<button>")
        answerButton.attr("value", i)
        answerButton.attr("class", "guess")
        answerButton.text(answers[i])
        $(".answersTest").append(answerButton)
    }

    // adds the question to the page based on which board button was clicked. 
    var questionH1 = $("<h1>")
    questionH1.attr("class", "question")
    questionH1.text(res[x].question)
    $(".questionsTest").append(questionH1)


})

//when the answer is clicked checks to see if the answer is correct.
$(document).on("click", ".guess", function(){
    console.log("clicked: " + $(this).val())
    console.log(" correct:" + correctAns)
    if ($(this).val() == correctAns){

        console.log("correct")
        clearScrn()
    }
    else{
        console.log("wrong")
    }
})

//used to clear the questions and answers divs
function clearScrn(){
    $(".questionsTest").empty()
    $(".answersTest").empty()
}


//--------------------------------------------------------------------------------


// Tic-tac-toe
//--------------------------------------------------------------------------------
var player1 = true
var player2 = false

$(document).on("click", ".TTTboard", function(){

    if (player1 === true){
        $(this).addClass("blue")
        console.log(player1, player2)
        player2 = true
        player1 = false
        checkWins()
    }
    else{
        $(this).addClass("red")
        console.log(player1, player2)
        player1 = true
        player2 = false
        checkWins()
    }

})

function checkWins(){
    var blueWins1 = $("#one.blue, #two.blue, #three.blue").length === 3
    var blueWins2 = $("#four.blue, #five.blue, #six.blue").length === 3
    var blueWins3 = $("#seven.blue, #eight.blue, #nine.blue").length === 3
    var blueWins4 = $("#one.blue, #four.blue, #seven.blue").length === 3
    var blueWins5 = $("#two.blue, #five.blue, eight.blue").length === 3
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
    var redWins5 = $("#two.red, #five.red, eight.red").length === 3
    var redWins6 = $("#three.red, #six.red, #nine.red").length === 3
    var redWins7 = $("#one.red, #five.red, #nine.red").length === 3
    var redWins8 = $("#three.red, #five.red, #seven.red").length === 3
    
    if(redWins1 === true || redWins2 === true || redWins3 === true ||
        redWins4 === true || redWins5 === true || redWins6 === true ||
        redWins7 === true || redWins8 === true){
       alert("Red Wins")
   }
}