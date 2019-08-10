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
    for(var i = 0; i < res.length; i++){
        console.log(i, res[i].question)
        
    }
    $(".TTTboard").show()
})
})
//-----------------------------------------------------------------------------------------------------
$(document).on("click", ".TTTboard", function(){
    var x = $(this).val()
    console.log(res[x].question)
})
