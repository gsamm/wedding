angular.module('wedding').controller('RsvpController', ['$location', '$scope', function ($location, $scope) {
	setInvitationId();
	setTestValues();

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
			address1: '118 Pinedale Avenue',
			address2: 'Address Line 2',
			city: 'Winnipeg',
			province: 'Manitoba',
			postalCode: 'R2H 1R4',
			arePartyAnimals: 'true'
		};
	}

	function setInvitationId() {
		$scope.invitationId = $location.search()['id'];
	}

	function setInitialValues() {
		$scope.model = {
			guests: [{}]
		};
	}

	function save() {
		setInitialValues();
	}
}]);