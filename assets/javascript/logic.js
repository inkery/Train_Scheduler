// Initialize Firebase
var config = {
  apiKey: "AIzaSyB8EGq7--vtLgvLduPI0D6QtJ1se4FKIAw",
  authDomain: "train-scheduler-dec76.firebaseapp.com",
  databaseURL: "https://train-scheduler-dec76.firebaseio.com",
  projectId: "train-scheduler-dec76",
  storageBucket: "train-scheduler-dec76.appspot.com",
  messagingSenderId: "332170194392"
};

firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

//Run Time  
setInterval(function(startTime) {
  $("#timer").html(moment().format('hh:mm a'))
}, 1000);

// Capture Button Click
$("#add-train").on("click", function() {
  
  event.preventDefault();

  // Code for storing and retrieving the most recent train info
  var train = $("#trainname-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var frequency = $("#frequency-input").val().trim();
  var firstTime = $("#firsttime-input").val().trim();
  
  
  var trainInfo = { 
    formtrain: train,
    formdestination: destination,
    formfrequency: frequency,
    formfirsttime: firstTime,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  };
    //this is added so we can get most resent user 
  database.ref().push(trainInfo);

  console.log(trainInfo.formtrain);
  console.log(trainInfo.formdestination);
  console.log(trainInfo.formfrequency);
  console.log(trainInfo.formfirsttime);
  console.log(trainInfo.dateAdded);


  // Clears all of the text-boxes
  $("#trainname-input").val("");
  $("#destination-input").val("");
  $("#frequency-input").val("");
  $("#firsttime-input").val("");

});



database.ref().on("child_added", function(childSnapshot, prevChildKey) {  
  var train = childSnapshot.val().formtrain;
  var destination = childSnapshot.val().formdestination;
  var frequency = childSnapshot.val().formfrequency;
  var firstTime = childSnapshot.val().formfirsttime;


  var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  //determine Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm a"));

  //get timer functioning
  $("#timer").text(currentTime.format("hh:mm a"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart
  var tRemainder = diffTime % frequency;
  console.log("Remainder: " + tRemainder);

  //determine Minutes Away
  var minutesAway = frequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + minutesAway);

  //determine Next Train Arrival
  var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");
  console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm a"));

  
 

  //adds back updated information
  $("#train-table > tbody").append("<tr><td>" + '<i class="fa fa-trash" id="trashcan" aria-hidden="true"></i>' + "</td><td>" + train + "</td><td>" + destination + "</td><td>" +
  frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");



// If any errors are experienced, log them to console.
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});


//on click for deleting row if trash can is clicked
$("body").on("click", ".fa-trash", function() {
  $(this).closest("tr").remove(); 
  alert("delete button clicked");
});


// Update minutes away by triggering change in firebase children
function timeUpdater() {
  //empty tbody before appending new information
  $("#train-table > tbody").empty();
  
  database.ref().on("child_added", function(childSnapshot, prevChildKey) {  
  var train = childSnapshot.val().formtrain;
  var destination = childSnapshot.val().formdestination;
  var frequency = childSnapshot.val().formfrequency;
  var firstTime = childSnapshot.val().formfirsttime;


  var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm a"));
  
  $("#timer").text(currentTime.format("hh:mm a"));
  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart 
  var tRemainder = diffTime % frequency;
  console.log("Remainder: " + tRemainder);

  //determine Minutes Away
  var minutesAway = frequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + minutesAway);

  //determine Next Train Arrival
  var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");
  console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm a"));

  // Add each train's data into the table row
  $("#train-table > tbody").append("<tr><td>" + '<i class="fa fa-trash" aria-hidden="true"></i>' + "</td><td>" + train + "</td><td>" + destination + "</td><td>" +
  frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");

  })
};

setInterval(timeUpdater, 6000);



