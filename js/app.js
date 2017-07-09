var app = angular.module('foe-wiki', ['ngRoute',
									  'angularUtils.directives.dirPagination',
									  'firebase']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/home', {
			templateUrl: 'views/home.html'
		})
		.when('/unidadesMilitares', {
			templateUrl: 'views/unidades_militares.html'
		})
		.otherwise({ 
			redirectTo: '/home' 
		});
});

app.controller('pageController', ['$scope','$firebaseArray', function($scope, $firebaseArray) {

	var config = {
		apiKey: "AIzaSyAJpKVSthdn_BD-E0jPdrIczzcJXGhKGp4",
		authDomain: "api-foe.firebaseapp.com",
		databaseURL: "https://api-foe.firebaseio.com",
		projectId: "api-foe",
		storageBucket: "api-foe.appspot.com",
		messagingSenderId: "15272811973"
	};

	firebase.initializeApp(config);

	var rootRef = firebase.database().ref().child('Eras');

	$scope.unidadesMilitaresSemEra = $firebaseArray(rootRef.child('SemEra').child('UnidadeMilitar'));

}]);
