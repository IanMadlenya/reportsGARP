reportsGARPControllers.controller('deployCalCtrl', ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {
	$scope.envPath = envPath;
	$scope.events = [];
	$scope.calendarView = 'month';
	$scope.calendarDay = new Date();
	$scope.calendarUpdate = false;
	$scope.calendarTitle = 'Deployments';

	debugger;
}]);
