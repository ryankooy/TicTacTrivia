//  var duration = moment.duration({
//     'seconds': 30,
//         'hour': 2,
//         'minutes': 10
// });

// var timestamp = new Date(0,0,0,2,10,30);
// var interval = 1;
// setInterval(function () {
//     timestamp = new Date(timestamp.getTime() + interval*1000);
    
//     duration = moment.duration(duration.asSeconds() + interval, 'seconds');
//     //.asSeconds() 
//     $('.countdown').text(Math.round(duration.asHours()) + 'h:' + Math.round(duration.asMinutes()) + 'm:' + Math.round(duration.asSeconds()) + 's'); //.seconds() 
//     $('.countdown1').text(duration.days() + 'd:' + duration.hours() + 'h:' + duration.minutes() + 'm:' + duration.seconds() + 's');
// })



var count=15;

var counter=setInterval(timer, 1000); 

function timer() {
  count=count-1;
  if (count < 0)   {
     clearInterval(counter);
     return;
     
  } 
  $("#timer").html(count + " secs")
}



