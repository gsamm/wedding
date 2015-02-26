angular.module('wedding').controller('RsvpController', ['$scope', '$firebase', function ($scope, $firebase) {
	setTestValues();

	$scope.addGuest = addGuest;
	$scope.removeGuest = removeGuest;
	$scope.save = save;

	function setTestValues() {
		$scope.model = {
			guests: [{
				firstName: 'Garrett',
				lastName: 'Samm',
				isAttending: 'true',
				dietaryConsiderations: 'None'
			}, {
				firstName: 'Veronica',
				lastName: 'Gillis',
				isAttending: 'false'
			}],
			isInterestedInTransit: 'true',
			address1: '118 Pinedale Avenue',
			address2: 'Address Line 2',
			city: 'Winnipeg',
			province: 'Manitoba',
			postalCode: 'R2H 1R4'
		};
	}

	function setInitialValues() {
		$scope.model = {
			guests: [{}]
		};
	}

	function addGuest() {
		$scope.model.guests.push({});
	}

	function removeGuest(index) {
		$scope.model.guests.splice(index, 1);
	}

	function save() {
		var firebase = new Firebase('https://g-v.firebaseio.com/responses');

		firebase.push($scope.model, function (error) {
			if (error) {
				console.log('Error occurred:' + error);
			} else {
				console.log('Response saved.');
			}
		});

		setInitialValues();
	}
}]);