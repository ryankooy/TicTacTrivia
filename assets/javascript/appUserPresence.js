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

var userName;
var email;
var highScores;

$('#user-b').on('click', function(event) {
    event.preventDefault();
    userName = $('#username').val().trim();
    email = $('#email').val().trim();
    console.log(userName);

    database.ref().set({
        username: userName,
        email: email,
    });

    database.ref().on('value', function(snap) {
        userName = snap.val().username;
        email = snap.val().email;
        $('#name').text("Hi, " + userName + "!");
        console.log(userName);
    });

});

var provider = new firebase.auth.GoogleAuthProvider();

provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  // ...
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});

firebase.auth().signOut().then(function() {
  // Sign-out successful.
}).catch(function(error) {
  // An error happened.
});