<<<<<<< HEAD
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
=======
<script src="https://www.gstatic.com/firebasejs/6.3.5/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/6.3.5/firebase-auth.js"></script>
// ^ add to index.html

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

var connectionsRef = database.ref("/connections");

var connectedRef = database.ref(".info/connected");

connectionsRef.on('value', function(snap) {
    $('#').text(snap.numChildren());
});

database.ref().on('value', function(snap) {
    $('input').val().trim();
});

// add username that new user picks
>>>>>>> f6691260fe27639c6979fa28add87f1e999e3bd5
