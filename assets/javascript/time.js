// var myCounter = new Countdown({  
//     seconds:15,  // number of seconds to count down
//     onUpdateStatus: function(sec){
//         $("#timer").html(sec + ' seconds remaining');}, // callback for each second
//     onCounterEnd: function(){ 
//          $("#timer").html('Time is up!');} // final action
// });

// myCounter.start();

// function Countdown(options) {
//   var timer,
//   instance = this,
//   seconds = options.seconds || 10,
//   updateStatus = options.onUpdateStatus || function () {},
//   counterEnd = options.onCounterEnd || function () {};

//   function decrementCounter() {
//     updateStatus(seconds);
//     if (seconds === 0) {
//       counterEnd();
//       instance.stop();
//     }
//     seconds--;
//   }

//   this.start = function () {
//     clearInterval(timer);
//     timer = 0;
//     seconds = options.seconds;
//     timer = setInterval(decrementCounter, 1000);
//   };

//   this.stop = function () {
//     clearInterval(timer);
//   };
// }