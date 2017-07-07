var app = angular.module('foe-wiki', ['ngRoute',
									  'angularUtils.directives.dirPagination']);

app.controller('pageController', ['$scope', function($scope) {
	$scope.usuario = "Johanny LS";
}]);