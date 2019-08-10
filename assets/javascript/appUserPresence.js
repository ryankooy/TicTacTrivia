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

$('submit').on('click', function(event) {
    event.preventDefault();
    var userName = $('#').val().trim();
    var phoneNumber = $('#').val().trim();
});

database.ref().set({
    username: userName,
    phonenumber: phoneNumber
});

// $('input').val().trim();

database.ref().on('value', function(snap) {
    userName = snap.val().username;
    phoneNumber = snap.val().phonenumber;
    $('#').text(userName);

});

// add username that new user picks - push to db
// phone number - optional - push to db
