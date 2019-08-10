// Basics of setting up the questions of the tic-tac-toe board 
//-----------------------------------------------------------------------------------------------------

// var catagorySelect = 0

//each catagory has a different number per catagory, go through the catagory list and
// gather the numbers for the HTML value




$("#testSubmit").on("click", function(event){
    event.preventDefault();

    var catagorySelect = $("#catagory-select").val()
    console.log(catagorySelect)
    var difficultySelect = $("#difficulty-select").val()
    var triviaApi = "https://opentdb.com/api.php?amount=9&category=" + catagorySelect + "&difficulty=" + difficultySelect+ "&type=multiple"






$.ajax({
    url:triviaApi,
    method: 'GET'
}).then(function(response){
    console.log(response)


})
})
//-----------------------------------------------------------------------------------------------------