angular.module('wedding').controller('FindInvitationController', ['$http', '$scope', '$window', function ($http, $scope, $window) {
	$scope.email = 'garrett.samm@gmail.com';
	$scope.isInvitationFound = true;
	$scope.find = find;

	function find(email) {
	 	$http.get('/api/invitations?email=' + email)
	 		.success(function (data, status, headers, config) {
				$window.location.href = '/rsvp?id=' + data;
	 		})
	 		.error(function (data, status, headers, config) {
	 			$scope.isInvitationFound = false;
	 		});
	}
}]);