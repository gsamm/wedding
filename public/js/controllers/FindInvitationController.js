angular.module('wedding').controller('FindInvitationController', ['$http', '$scope', '$window', function ($http, $scope, $window) {
	$scope.isInvitationFound = true;
	$scope.find = find;

	function find(email) {
	 	$http.get('/api/invitations?email=' + email)
		 	.success(function (data, status, headers, config) {
		 		// Data is a uuid
				$window.location.href = '/rsvp/' + data;
		 	})
		 	.error(function (data, status, headers, config) {
		 		$scope.isInvitationFound = false;
		 	});
	}
}]);