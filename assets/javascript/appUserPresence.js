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

// var connectionsRef = database.ref("/connections");

// var connectedRef = database.ref(".info/connected");

var userName;
var email;
var phoneNumber;

// connectedRef.on('value', function(snap) {
    
//   // If they are connected..
//   if (snap.val()) {

//     // Add user to the connections list.
//     var con = connectionsRef.push(true);

//     // Remove user from the connection list when they disconnect.
//     con.onDisconnect().remove();
//   }

// });

// connectionsRef.on('value', function(snapshot) {
//     $('#online').text("There are " + snapshot.numChildren() + " players online.");
// });

$('#user-b').on('click', function(event) {
    event.preventDefault();
    userName = $('#username').val().trim();
    email = $('#email').val().trim();
    phoneNumber = $('#phone').val().trim();
    console.log(userName);

    database.ref().set({
        username: userName,
        email: email,
        phonenumber: phoneNumber
    });

    database.ref().on('value', function(snap) {
        userName = snap.val().username;
        email = snap.val().email;
        phoneNumber = snap.val().phonenumber;
        $('#name').text("Hi, " + userName + "!");
        console.log(userName);
    });

});

