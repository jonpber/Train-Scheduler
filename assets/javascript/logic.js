$(function(){
 // Initialize Firebase
	var config = {
		apiKey: "AIzaSyAJ3rnx95RBQfVgA1Ajy40aNNYdFQhBSJA",
		authDomain: "train-scheduler-cd211.firebaseapp.com",
		databaseURL: "https://train-scheduler-cd211.firebaseio.com",
		projectId: "train-scheduler-cd211",
		storageBucket: "train-scheduler-cd211.appspot.com",
		messagingSenderId: "671755418196"
	};
	firebase.initializeApp(config);

	var database = firebase.database();
	
	$("input[type='submit']").on("click", function(event){
		event.preventDefault();

		trainName = $("input[name='trainName']").val();
		destination = $("input[name='destination']").val();
		firstTime = $("input[name='firstTime']").val();
		frequency = $("input[name='frequency']").val();

		var numOkay = true;
		
		var timeTest = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
		if (!timeTest.test(firstTime)){
			$(".timeLabel").css("color", "red");
			numOkay = false;
		}

		if (trainName && destination && firstTime && frequency && numOkay){
			$(".timeLabel").css("color", "black");
			$("input[name='trainName']").val("");
			$("input[name='destination']").val("");
			$("input[name='firstTime']").val("");
			$("input[name='frequency']").val("");
			$(".errorMessage").hide();
			$(".timeError").hide();
			database.ref("Trains").push({
				name: trainName,
				destination: destination,
				firstTime: firstTime,
				frequency: frequency,
			})
		}

		else {
			$(".errorMessage").show();
		}

	});

	database.ref("Trains").on("child_added", function(snapshot){
		var tempTR = $("<tr>");
		tempTR.append("<td>" + snapshot.val().name + "</td>");
		tempTR.append("<td>" + snapshot.val().destination + "</td>");
		tempTR.append("<td>" + snapshot.val().frequency + "</td>");

		var startTime = moment(snapshot.val().firstTime, 'HH:mm');

		
		var duration = moment().diff(startTime, "minutes");

		var timeLeft = snapshot.val().frequency - (duration % snapshot.val().frequency);

		var nextTime = moment().add(timeLeft, "minutes").format("HH:mm");
		tempTR.append("<td>" + nextTime + "</td>");
		tempTR.append("<td>" + timeLeft + "</td>");

		// var button = $("<button>").attr("data-key", snapshot.key).text("X");
		// console.log(button);
		tempTR.append("<td><button data-key=" + snapshot.key + ">X</button></td>");
		$("table").append(tempTR);
	})

	database.ref("Trains").on("child_removed", function(snapshot){
		$("button[data-key=" + snapshot.key + "]").closest("tr").remove();
	})

	$("body").on("click", "button", function(){
		database.ref().child("Trains/" + $(this).attr("data-key")).remove();
	})

});