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

		var inputArray = [trainName, destination, firstTime, frequency];

		var allFilled = true;

		for (var i = 0; i < 4; i++){
			if (inputArray[i] === undefined){
				allFilled = false;
			}
		}

		if (allFilled){
			database.ref("Trains").once("value").then(function(snapshot){
				database.ref("Trains/" + trainName).set({
					name: trainName,
					destination: destination,
					firstTime: firstTime,
					frequency: frequency,
					minAway: 1000
				});
			});
		}

		else {
			console.log("an entry is not filled");
		}

	});


	database.ref("Trains").on("value", function(snapshot){
		$("td").parent().remove();
		if (snapshot.val() !== null){
			var tempArray = Object.keys(snapshot.val());

			for (var i = 0; i < tempArray.length; i++){
				var tempTR = $("<tr>");
				tempTR.append("<td>" + snapshot.child(tempArray[i] + "/name").val() + "</td>");
				tempTR.append("<td>" + snapshot.child(tempArray[i] + "/destination").val() + "</td>");
				tempTR.append("<td>" + snapshot.child(tempArray[i] + "/firstTime").val() + "</td>");
				tempTR.append("<td>" + snapshot.child(tempArray[i] + "/frequency").val() + "</td>");
				tempTR.append("<td>" + snapshot.child(tempArray[i] + "/minAway").val() + "</td>");
				$("table").append(tempTR);
			}

		}
	});
		

});