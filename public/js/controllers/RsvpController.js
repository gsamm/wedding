angular.module('wedding').controller('RsvpController', ['$location', '$http', '$scope', '$window', function ($location, $http, $scope, $window) {
	loadInvitation();
	// setTestValues();

	$scope.save = save;

	// function setTestValues() {
	// 	$scope.model = {
	// 		guests: [{
	// 			firstName: 'Garrett',
	// 			lastName: 'Samm',
	// 			isAttending: 'true',
	// 			dietaryConsiderations: 'None'
	// 		}, {
	// 			firstName: 'Veronica',
	// 			lastName: 'Gillis',
	// 			isAttending: 'false'
	// 		}],
	// 		address1: '118 Pinedale Avenue',
	// 		address2: 'Address Line 2',
	// 		city: 'Winnipeg',
	// 		province: 'Manitoba',
	// 		postalCode: 'R2H 1R4',
	// 		arePartyAnimals: 'true'
	// 	};
	// }

	function loadInvitation() {
		var invitationId = $location.search()['id'];

		if (!_.isUndefined(invitationId) && !_.isEmpty(invitationId)) {
			$http.get('/api/invitations/' + invitationId)
				.success(function (data, status, headers, config) {
					var model = {
						id: data.id,
						guests: []
					};

					_.each(data.guests, function (element, index, list) {
						model.guests.push({
							id: element.id,
							firstName: element.firstName,
							lastName: element.lastName
						});
					});

					$scope.model = model;
				})
				.error(function (data, status, headers, config) {
					// TODO: Show an error message and hide the form.
				});
		} else {
			$window.location.href = '/find-invitation';
		}
	}

	function save() {
		// TODO: Save the invitation.
	}
}]);