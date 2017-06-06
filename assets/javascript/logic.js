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

	var provider = new firebase.auth.GoogleAuthProvider();

	firebase.auth().signInWithRedirect(provider);

	firebase.auth().getRedirectResult().then(
		function(result) {
 			if (result.credential) {
			    // This gives you a Google Access Token. You can use it to access the Google API.
			    var token = result.credential.accessToken;
			    // ...
			 }
				  // The signed-in user info.
		  	var user = result.user;
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
				});
				updateBoard();
			});


		}

		else {
			console.log("an entry is not filled");
		}

	});

	function updateBoard(){
		database.ref("Trains").once("value").then(function(snapshot){
			$("td").parent().remove();
			if (snapshot.val() !== null){
				var tempArray = Object.keys(snapshot.val());

				for (var i = 0; i < tempArray.length; i++){
					var tempTR = $("<tr>");
					tempTR.append("<td>" + snapshot.child(tempArray[i] + "/name").val() + "</td>");
					tempTR.append("<td>" + snapshot.child(tempArray[i] + "/destination").val() + "</td>");
					// tempTR.append("<td>" + snapshot.child(tempArray[i] + "/firstTime").val() + "</td>");
					tempTR.append("<td>" + snapshot.child(tempArray[i] + "/frequency").val() + "</td>");

					var startTime = moment(snapshot.child(tempArray[i] + "/firstTime").val(), 'HH:mm');
					var endTime = moment().local();
					// console.log(startTime);
					// console.log(endTime);
					
					var duration = endTime.diff(startTime, "minutes");

					var timeLeft = snapshot.child(tempArray[i] + "/frequency").val() - (duration % snapshot.child(tempArray[i] + "/frequency").val());

					var nextTime = endTime.add(timeLeft, "minutes").format("HH:mm");
					tempTR.append("<td>" + nextTime + "</td>");
					tempTR.append("<td>" + timeLeft + "</td>");
					$("table").append(tempTR);
				}

			}
		});
	}

	updateBoard();
	setInterval(updateBoard, 60000);
	

});