var app = angular.module('foe-wiki', ['ngRoute',
									  'angularUtils.directives.dirPagination',
									  'firebase',
									  'ngStorage',
									  'luegg.directives']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/home', {
			title: 'Home',
			templateUrl: 'views/home.html'
		})
		.when('/unidadesMilitares', {
			title: 'Unidades',
			templateUrl: 'views/unidades_militares.html',
			controller: 'unidadesController'
		})
		.when('/login', {
			title: 'Login',
			templateUrl: 'views/login.html',
			controller: 'loginController'
		})
		.when('/admin', {
			title: 'Gerenciador',
			templateUrl: 'views/gerenciador.html',
			controller: 'gerenciadorController'
		})
		.when('/eventos', {
			title: 'Eventos',
			templateUrl: 'views/eventos.html'
		})
		.when('/edificios', {
			title: 'Edifícios',
			templateUrl: 'views/edificios.html'
		})
		.when('/chat', {
			title: 'Chat',
			templateUrl: 'views/chat.html',
			controller: 'chatController'
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

	$scope.toggleClass = function($event, className) {
		className = className || 'transparent';
		$($event.target).toggleClass(className);
	};

}]);

app.controller('pageController', ['$scope','$window','bd_app', function($scope, $window, bd_app) {

	$scope.logout = function() {
		bd_app.logout();
	}

	$scope.logoutChat = function() {
		bd_app.logoutChat();
	}

	$window.beforeunload = $scope.logoutChat;

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

app.controller('chatController', ['$scope','bd_app','$localStorage','$rootScope', '$filter', 
	function ($scope, bd_app, $localStorage, $rootScope, $filter) {

	$scope.usuarios = bd_app.getUsuarios();
	$scope.avatars = bd_app.getAvatars();
	$scope.mensagens = bd_app.getMensagens();
	$scope.usrAtual = null;

	$scope.getData = function() {
		return $filter('date')(new Date(), "dd/MM/yyyy - HH:mm");
	}

	if ($localStorage.usuarioChatId != null) {
		$scope.usrAtual = $localStorage.usuarioChatId;
		$localStorage.ultimoAcesso = $scope.usrAtual;
		$scope.codigoAcesso = $localStorage.ultimoAcesso;
	}
	
	$scope.enviarMsg = function(dono, id, data) {
		bd_app.enviarMensagem(
			$scope.corpoMsg,
			dono,
			id,
			$scope.getData()
		);

		$scope.corpoMsg = '';
	}

	$scope.getDonoMsg = function(donoId, attr) {
		for (var i = 0; i < $scope.usuarios.length; i++) {
			if ($scope.usuarios[i].$id == donoId) {

				switch (attr) {
					case 'Id':
						return $scope.usuarios[i].$id;
						break;

					case 'Nick':
						return $scope.usuarios[i].Nick;
						break;

					case 'Avatar':
						return $scope.usuarios[i].Avatar;
						break;

					case 'Admin':
						return $scope.usuarios[i].Admin;
						break;

					case 'Mundo':
						return $scope.usuarios[i].Mundo;
						break;

					case 'Online':
						return $scope.usuarios[i].Online;
				}
			}
		}
	}

	$scope.criarUsuario = function() {
		bd_app.criarUsuario(
			$scope.nickUsuario,
			$scope.mundoUsuario,
			$scope.avatarUsuario
		);

		bd_app.sistemaLogin("entrou.", $rootScope.usuarioChatId);

		$scope.nickUsuario = '';
		$scope.mundoUsuario = '';
		$scope.avatarUsuario = '';

		$scope.usrAtual = $localStorage.usuarioChatId;
		$localStorage.ultimoAcesso = $scope.usrAtual;
		$scope.codigoAcesso = $scope.usrAtual;
	}

	$scope.loginContaExistente = function() {
		bd_app.loginContaExistente($scope.codigoAcesso);
		bd_app.sistemaLogin("entrou.", $rootScope.usuarioChatId);

		$scope.usrAtual = $localStorage.usuarioChatId;
		$localStorage.ultimoAcesso = $scope.usrAtual;
		$scope.ultimoAcesso = $scope.usrAtual;
	}

	$scope.logoutChat = function() {
		$scope.codigoAcesso = $localStorage.ultimoAcesso;
		$scope.usrAtual = null;
		bd_app.sistemaLogout('saiu.', $rootScope.usuarioChatId);
		bd_app.logoutChat();
	}

	$scope.glued = true;
	
}]);


app.service('bd_app', ['$rootScope','$firebaseArray', '$location', '$localStorage', '$window', 
				function ($rootScope, $firebaseArray, $location, $localStorage, $window) {
	
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
	var rootChat = firebase.database().ref().child('Chat');

	this.unidadesMilitares = $firebaseArray(rootRef.child('UnidadeMilitar'));
	this.usuarioAdmin = $firebaseArray(rootAuth);
	this.avatars = $firebaseArray(rootChat.child('Avatars'));
	this.usuarios = $firebaseArray(rootChat.child('Usuarios'));
	this.mensagens = $firebaseArray(rootChat.child('Mensagens'));
	
	this.getUnidadesMilitares = function() {
		return this.unidadesMilitares;
	}

	this.getAvatars = function() {
		return this.avatars;
	}

	this.getUsuarios = function() {
		return this.usuarios;
	}

	this.getMensagens = function() {
		return this.mensagens;
	}

	this.criarUsuario = function(nick, mundo, avatar) {

		if (mundo == null || avatar == null) {
			$window.alert("Todos os campos devem ser preenchidos/selecionados!");
		} else {

			var newUserId = rootChat.child('Usuarios').push({
				Admin: false,
				Nick: nick,
				Mundo: mundo,
				Avatar: avatar,
				Online: true
			}).key;

			$window.alert("Seja bem vindo, " + nick);

			$localStorage.usuarioChatId = newUserId;
			$rootScope.usuarioChatId = $localStorage.usuarioChatId;
		}
	}

	this.enviarMensagem = function(corpo, dono, id, data) {
		
		rootChat.child('Mensagens').push({
			Corpo: corpo,
			Dono: dono,
			Id: id,
			Data: data
		});
	}

	this.sistemaLogin = function(corpo, id) {
		rootChat.child('Mensagens').push({
			Corpo: corpo,
			Id: id,
			Sistema: true
		});
	}

	this.sistemaLogout = function(corpo, id) {
		rootChat.child('Mensagens').push({
			Corpo: corpo,
			Id: id,
			Sistema: true
		});
	}

	this.loginContaExistente = function(contaId) {

		for (var i = 0; i < this.usuarios.length; i++) {
			if (this.usuarios[i].$id == contaId) {

				$rootScope.usuarioChatId = contaId;
				$localStorage.usuarioChatId = $rootScope.usuarioChatId;

				$window.alert("Bem vindo de volta,\n" + this.usuarios[i].Nick);

				rootChat.child('Usuarios').child($rootScope.usuarioChatId).update({
					"Online": true
				});

				return;
			}
		}

		$window.alert("Usuário não encontrado.\nFaça login com um novo usuário!");
	}
	

	this.calculaBonus = function(valor, bonus) {
		return Math.round(valor + ((bonus/100) * valor));
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
				$location.path('/admin');
			}
		});

		$localStorage.usuarioLogado = $rootScope.usuarioLogado;
	}

	this.logout = function() {
		$rootScope.usuarioLogado = null;
		$localStorage.usuarioLogado = null;
		$location.path('/home');
	}

	this.logoutChat = function() {

		rootChat.child('Usuarios').child($rootScope.usuarioChatId).update({
			"Online": false
		});



		$rootScope.usuarioChatId = null;
		$localStorage.usuarioChatId = null;
		$location.path('/chat');
	}

}]);

app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

app.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown", function(e) {
            if(e.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter, {'e': e});
                });
                e.preventDefault();
            }
        });
    };
});

app.run(function ($rootScope, $location, $sessionStorage, $localStorage) {

	$rootScope.usuarioLogado = $sessionStorage.usuarioLogado;
	$rootScope.usuarioChatId = $localStorage.usuarioChatId;

	var rotasBloqueadasNaoLogados = ['/gerenciador'];
	
	var rotasBloqueadasLogados = [];

	$rootScope.$on('$locationChangeStart', function() {

		if ($rootScope.usuarioLogado == null &&
			rotasBloqueadasNaoLogados.indexOf($location.path()) != -1) {

			$location.path('/login');
		} 

		$rootScope.usuarioChatId = $localStorage.usuarioChatId;
	});

	$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
});