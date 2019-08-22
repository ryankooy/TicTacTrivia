
function reset() {
  time = 20;                                // Resets timer
  $("#timer-1").text("00:20");            // Sets countDown display to "00:00"
  $("#timer-2").text("00:20");  
  if (!clockRunning) {
      intervalId = setInterval(decrement, 1000); // setInterval to initiate the count
      clockRunning = true;                       // Sets the countDown to running
  }
}

function timer() {
  $("#timer-1").text("00:20");                // Sets countDown display to "00:00"
  $("#timer-2").text("00:20");  
  if (!clockRunning) {
      intervalId = setInterval(decrement, 1000); // setInterval to initiate the count
      clockRunning = true;                       // Sets the countDown to running
  }
}
function stop() {
  clearInterval(intervalId);    // ClearInterval to stop the count
  clockRunning = false;         // Stops the countDown
  $('.radio-buttons').hide();
  $(".active-question-1").hide();
  $(".active-question-2").hide();
}
function decrement() {
  time--;                           // Decrements time by 1

  var converted = timeConverter(time); // Gets the current time 
  console.log(converted);             // --> passes it through the timeConverter function                                     // --> Saves the result in a variable
  $("#timer-1").text(converted);  // Updates the converted countDown display
  $("#timer-2").text(converted); 
  if (time === 0) {
      stop();   

      // alert("Time Up!");        //  Alert the user that time is up.
  }
}
function timeConverter(t) {          // Display time converter
  var minutes = Math.floor(t / 60);
  var seconds = t - (minutes * 60);

  if (seconds < 10) {
      seconds = "0" + seconds;
  }
  if (minutes === 0) {
      minutes = "00";
  }
  else if (minutes < 10) {
      minutes = "0" + minutes;
  }
  return minutes + ":" + seconds;
}