var app = angular.module('foe-wiki', ['ngRoute',
									  'angularUtils.directives.dirPagination',
									  'firebase',
									  'ngStorage']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/home', {
			templateUrl: 'views/home.html'
		})
		.when('/unidadesMilitares', {
			templateUrl: 'views/unidades_militares.html',
			controller: 'unidadesController'
		})
		.when('/login', {
			templateUrl: 'views/login.html',
			controller: 'loginController'
		})
		.when('/gerenciador', {
			templateUrl: 'views/gerenciador.html',
			controller: 'gerenciadorController'
		})
		.when('/eventos', {
			templateUrl: 'views/eventos.html'
		})
		.when('/edificios', {
			templateUrl: 'views/edificios.html'
		})
		.otherwise({ 
			redirectTo: '/home' 
		});
});

app.controller('gerenciadorController', ['$scope', 'bd_app', function($scope, bd_app) {

	$scope.addUnidade = function() {

		bd_app.addUnidade($scope.nomeUnidade, 
						  $scope.tipoUnidade,
						  $scope.eraUnidade,
						  $scope.atkUnidade,
						  $scope.defUnidade,
						  $scope.alcanceUnidade,
						  $scope.movimentoUnidade,
						  $scope.imagemUnidade,
						  $scope.iconeUnidade);
		
		$scope.nomeUnidade = '';
		$scope.tipoUnidade = '';
		$scope.atkUnidade = '';
		$scope.defUnidade = '';
		$scope.alcanceUnidade = '';
		$scope.movimentoUnidade = '';
		$scope.imagemUnidade = '';
	}

}]);

app.controller('unidadesController', ['$scope', 'bd_app', function($scope, bd_app) {

	$scope.unidadesMilitares = bd_app.getUnidadesMilitares();

	$scope.calculaBonus = function(valor, bonus) {
		return bd_app.calculaBonus(valor, bonus);
	};

}]);

app.controller('pageController', ['$scope','bd_app', function($scope, bd_app) {

	$scope.logout = function() {
		bd_app.logout();
	}

}]);

app.controller('loginController', ['$scope', 'bd_app', function($scope, bd_app) {

	$scope.logar = function(user) {

		if (user.Username != null && user.Password != null) {

			bd_app.validaLogin(user);
			
			if (bd_app.validaLogin(user)) {
				$scope.logado = 1;
			} else {
				$scope.logado = 0;
			}
		} else {
			alert("Erro");
		}
		
	}

}]);

app.service('bd_app', ['$rootScope','$firebaseArray', '$location', '$localStorage', 
				function ($rootScope, $firebaseArray, $location, $localStorage) {
	
	var config = {
		apiKey: "AIzaSyAJpKVSthdn_BD-E0jPdrIczzcJXGhKGp4",
		authDomain: "api-foe.firebaseapp.com",
		databaseURL: "https://api-foe.firebaseio.com",
		projectId: "api-foe",
		storageBucket: "api-foe.appspot.com",
		messagingSenderId: "15272811973"
	};

	firebase.initializeApp(config);

	var rootRef = firebase.database().ref().child('Recursos');
	
	var rootAuth = firebase.database().ref().child('Admin');

	this.unidadesMilitares = $firebaseArray(rootRef.child('UnidadeMilitar'));
	this.usuarioAdmin = $firebaseArray(rootAuth);
	
	this.getUnidadesMilitares = function() {
		return this.unidadesMilitares;
	}

	this.calculaBonus = function(valor, bonus) {
		return Math.round(valor + ((bonus/100) * valor));
	}

	this.getNumUnidades = function() {
		return this.unidadesMilitares.length;
	}

	this.addUnidade = function(nome, tipo, era, atk, def, alcance, movimento, imagem, tipoIcone) {
		rootRef.child('UnidadeMilitar').push({
			Nome: nome,
			Tipo: tipo,
			Era: era,
			Ataque: atk,
			Defesa: def,
			Alcance: alcance,
			Movimento: movimento,
			Imagem: imagem,
			TipoIcone: tipoIcone
		});
	};

	this.validaLogin = function(user) {
		
		$localStorage.usuarioLogado = null;

		angular.forEach(this.usuarioAdmin, function(value, index) {
			if(value.Username == user.Username &&
				value.Password == user.Password) {
				$rootScope.usuarioLogado = value;
				$location.path('/home');
			}
		});

		$localStorage.usuarioLogado = $rootScope.usuarioLogado;
	}

	this.logout = function() {
		$rootScope.usuarioLogado = null;
		$localStorage.usuarioLogado = null;
		$location.path('/home');
	}

}]);

app.run(function ($rootScope, $location, $localStorage) {

	$rootScope.usuarioLogado = $localStorage.usuarioLogado;

	var rotasBloqueadasNaoLogados = ['/gerenciador'];
	
	var rotasBloqueadasLogados = [];

	$rootScope.$on('$locationChangeStart', function() {

		if ($rootScope.usuarioLogado == null &&
			rotasBloqueadasNaoLogados.indexOf($location.path()) != -1) {

			$location.path('/login');
		} 
	});
});
