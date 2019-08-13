// Basics of setting up the questions of the tic-tac-toe board 
//-----------------------------------------------------------------------------------------------------
var res = ""
$(".TTTboard").hide()
$("#testSubmit").on("click", function(event){
    event.preventDefault();

    var catagorySelect = $("#catagory-select").val()
    var difficultySelect = $("#difficulty-select").val()
    var triviaApi = "https://opentdb.com/api.php?amount=9&category=" + catagorySelect + "&difficulty=" + difficultySelect+ "&type=multiple"

$.ajax({
    url:triviaApi,
    method: 'GET'
}).then(function(response){
    res = response.results
    console.log(res)
    $(".TTTboard").show()
})
})

var correctAns = 0

$(document).on("click", ".TTTboard", function(){
    var x = $(this).val()
    var correctAns = Math.floor(Math.random() * (4 - 0))
    var answers = res[x].incorrect_answers
    answers.splice(correctAns, 0 , res[x].correct_answer)

    for(var i = 0; i < answers.length; i++){
        var answerButton = $("<button>")
        answerButton.attr("value", i)
        answerButton.attr("class", "guess")
        answerButton.text(answers[i])
        $(".answersTest").append(answerButton)
        console.log(answerButton)
    }

    var questionH1 = $("<h1>")
    questionH1.attr("class", "question")
    questionH1.text(res[x].question)
    $(".questionsTest").append(questionH1)
})

$(document).on("click", ".guess", function(){
    if ($(this).val() == correctAns){
        console.log("correct")
    }
    else{
        console.log("wrong")
    }
})