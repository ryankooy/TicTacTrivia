// Basics of setting up the questions of the tic-tac-toe board 
//-----------------------------------------------------------------------------------------------------
var res = ""
$(".TTTboard").hide()

//when clicking submit, calls the questions and their answers
$("#catagory-Submit").on("click", function(event){
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


