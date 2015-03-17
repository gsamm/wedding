angular.module('wedding').controller('RsvpController', ['$location', '$http', '$scope', '$window', function ($location, $http, $scope, $window) {
	loadInvitation();

	$scope.isSaving = false;
	$scope.isSaved = false;
	$scope.isError = false;
	$scope.save = save;

	function loadInvitation() {
		var path = $location.path();
		var invitationId = path.substr(path.lastIndexOf('/') + 1);

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
							name: element.name
						});
					});

					$scope.model = model;
				}).error(function (data, status, headers, config) {
					$window.location.href = '/find-invitation';
				});
		} else {
			$window.location.href = '/find-invitation';
		}
	}

	function save() {
		var path = $location.path();
		var invitationId = path.substr(path.lastIndexOf('/') + 1);

		$scope.isSaving = true;

		$http.put('/api/invitations/' + invitationId, $scope.model)
			.success(function (data, status, headers, config) {
				$scope.isSaved = true;
			}).error(function (data, status, headers, config) {
				$scope.isError = true;
			}).finally(function () {
				$scope.isSaving = false;
			});
	}
}]);