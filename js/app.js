var app = angular.module('foe-wiki', ['ngRoute',
									  'angularUtils.directives.dirPagination',
									  'firebase',
									  'ngStorage',
									  'luegg.directives']);



/*
	CONFIG: ROTAS
*/
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
			title: 'Administração',
			templateUrl: 'views/admin.html',
			controller: 'adminController'
		})



		.when('/admin/novaUnidade', {
			title: 'Admin - Nova unidade',
			templateUrl:'views/admin/nova_unidade.html',
			controller: 'adminController'
		})
		.when('/admin/listaUnidades', {
			title: 'Admin - Lista de Unidades',
			templateUrl: 'views/admin/lista_unidades.html',
			controller: 'adminController'
		})
		.when('/admin/listaUnidades/:id', {
			title: 'Admin - Editar Unidade',
			templateUrl: 'views/admin/detalhe_unidade.html',
			controller: 'adminController'
		})



		.when('/admin/gerenciarGuildas', {
			title: 'Admin - Guildas',
			templateUrl: 'views/admin/ranking_guildas_adm.html',
			controller: 'adminController'
		})
		.when('/admin/gerenciarGuildas/editarRanking', {
			title: 'Admin - Guildas - Editar Ranking',
			templateUrl: 'views/admin/ranking_guildas_edit.html',
			controller: 'adminController'
		})



		.when('/admin/gerenciarJogadores', {
			title: 'Admin - Jogadores',
			templateUrl: 'views/admin/ranking_jogadores_adm.html',
			controller: 'adminController'
		})
		.when('/admin/gerenciarJogadores/editarRanking', {
			title: 'Admin - Jogadores - Editar Ranking',
			templateUrl: 'views/admin/ranking_jogadores_edit.html',
			controller: 'adminController'
		})



		.when('/rankingGuildas', {
			title: 'Ranking de Guildas',
			templateUrl: 'views/ranking_guildas.html',
			controller: 'adminController'
		})
		.when('/rankingJogadores', {
			title:'Ranking de Jogadores',
			templateUrl:'views/ranking_jogadores.html',
			controller: 'adminController'
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



/*
	CONTROLLER: ADMINISTRAÇÃO
*/
app.controller('adminController', ['$scope', '$rootScope', '$filter', '$routeParams', 'bd_app', 
						  function($scope, $rootScope, $filter, $routeParams, bd_app) {

	/*
		ADMIN: UNIDADES MILITARES
	*/
	$scope.addUnidade = function() {

		bd_app.addUnidade($scope.nomeUnidade, 
						  $scope.tipoUnidade,
						  $scope.eraUnidade,
						  $scope.atkUnidade,
						  $scope.defUnidade,
						  $scope.alcanceUnidade,
						  $scope.movimentoUnidade,
						  $scope.imagemUnidade,
						  $scope.imagemUnidade2,
						  $scope.iconeUnidade);
		
		$scope.nomeUnidade = '';
		$scope.tipoUnidade = '';
		$scope.atkUnidade = '';
		$scope.defUnidade = '';
		$scope.alcanceUnidade = '';
		$scope.movimentoUnidade = '';
		$scope.imagemUnidade = '',
		$scope.imagemUnidade2 = '';
	}


	$scope.listaUnidades = bd_app.getUnidadesMilitares();

	$scope.unidadeDetalhe = bd_app.getUnidade($routeParams.id);

	$scope.toggleClass = function($event, className) {
		className = className || 'transparent';
		$($event.target).toggleClass(className);
	};



	/*
		ADMIN: RANKING DE GUILDAS
	*/
	$scope.rankingGuildas = bd_app.getRankingGuildas();

	$scope.currentPage = 1;

	$scope.addGuilda = function() {
		bd_app.addGuilda($scope.nomeGuilda, $scope.mundoGuilda, $scope.prestigioGuilda);
		$scope.nomeGuilda = '';
		$scope.prestigioGuilda = '';
		
	}

	$scope.editGuilda = function(id, nome, mundo, prestigio) {

		bd_app.editGuilda(
			id,
			nome,
			mundo,
			prestigio
		);

	}

	$scope.removeGuilda = function(id) {
		bd_app.removeGuilda(id);
	}




	/*
		ADMIN: RANKING DE JOGADORES
	*/
	$scope.rankingJogadores = bd_app.getRankingJogadores();

	$scope.addJogador = function() {
		bd_app.addJogador(
			$scope.nomeJogador, 
			$scope.guildaJogador, 
			$scope.mundoJogador, 
			$scope.pontosJogador,
			$scope.batalhasJogador
		);

		$scope.nomeJogador = '';
		$scope.guildaJogador = '';
		$scope.pontosJogador = '';
		$scope.batalhasJogador = '';
	}

	$scope.editJogador = function(id, nome, guilda, mundo, pontos, batalhas) {
		bd_app.editJogador(
			id,
			nome,
			guilda,
			mundo,
			pontos,
			batalhas
		)
	}

	$scope.removeJogador = function(id) {
		bd_app.removeJogador(id);
	}

}]);



/*
	CONTROLLER: UNIDADES MILITARES
*/
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




/*
	CONTROLLER: PAGINA PRINCIPAL
*/
app.controller('pageController', ['$scope','$window','bd_app', function($scope, $window, bd_app) {

	$scope.logout = function() {
		bd_app.logout();
	}

	$scope.logoutChat = function() {
		bd_app.logoutChat();
	}

	$window.beforeunload = $scope.logoutChat;

}]);



/*
	CONTROLLER: LOGIN
*/
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



/*
	CONTROLLER: CHAT
*/
app.controller('chatController', ['$scope','bd_app','$localStorage','$rootScope', '$filter', 
	function ($scope, bd_app, $localStorage, $rootScope, $filter) {

	$scope.usuarios = bd_app.getUsuarios();
	$scope.avatars = bd_app.getAvatars();
	$scope.mensagens = bd_app.getMensagens();
	$scope.usrAtual = null;

	if ($localStorage.usuarioChatId != null) {
		$scope.usrAtual = $localStorage.usuarioChatId;
		$localStorage.ultimoAcesso = $scope.usrAtual;
		$scope.codigoAcesso = $localStorage.ultimoAcesso;
	}
	
	$scope.enviarMsg = function(dono, id) {
		bd_app.enviarMensagem(
			$scope.corpoMsg,
			dono,
			id
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



/*
	SERVICE: BANCO DE DADOS
*/
app.service('bd_app', ['$rootScope','$firebaseArray', '$location', '$localStorage', '$window', '$filter', 
				function ($rootScope, $firebaseArray, $location, $localStorage, $window, $filter) {
	
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
	var rootContent = firebase.database().ref().child('Conteudo');

	this.unidadesMilitares = $firebaseArray(rootRef.child('UnidadeMilitar'));
	this.usuarioAdmin = $firebaseArray(rootAuth);
	this.avatars = $firebaseArray(rootChat.child('Avatars'));
	this.usuarios = $firebaseArray(rootChat.child('Usuarios'));
	this.mensagens = $firebaseArray(rootChat.child('Mensagens'));
	this.rankingGuildas = $firebaseArray(rootContent.child('RankingGuildas'));
	this.rankingJogadores = $firebaseArray(rootContent.child('RankingJogadores'));

	this.ultimoUpdateGuildas = $firebaseArray(rootContent.child('UltimoUpdate').child('0'));
	this.ultimoUpdateJogadores = $firebaseArray(rootContent.child('UltimoUpdate').child('1'));

	$rootScope.ultimoUpdtGuildas = this.ultimoUpdateGuildas;
	$rootScope.ultimoUpdtJogadores = this.ultimoUpdateJogadores;

	this.getData = function() {
		return $filter('date')(new Date(), "dd/MM/yyyy - HH:mm");
	}
	
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

	this.getRankingGuildas = function() {
		return this.rankingGuildas;
	}

	this.getRankingJogadores = function() {
		return this.rankingJogadores;
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

	this.enviarMensagem = function(corpo, dono, id) {
		
		rootChat.child('Mensagens').push({
			Corpo: corpo,
			Dono: dono,
			Id: id,
			Data: this.getData()
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

	this.addUnidade = function(nome, tipo, era, atk, def, alcance, movimento, imagem, imagem2, tipoIcone) {
		rootRef.child('UnidadeMilitar').push({
			Nome: nome,
			Tipo: tipo,
			Era: era,
			Ataque: atk,
			Defesa: def,
			Alcance: alcance,
			Movimento: movimento,
			Imagem: imagem,
			Imagem2: imagem2,
			TipoIcone: tipoIcone
		});
	};

	this.addGuilda = function(nome, mundo, prestigio) {
		rootContent.child('RankingGuildas').push({
			Nome: nome,
			Mundo: mundo,
			Prestigio: prestigio
		});

		rootContent.child('UltimoUpdate').child('0').update({
			"Data": this.getData()
		});

	};

	this.editGuilda = function(id, nome, mundo, prestigio) {
		rootContent.child('RankingGuildas').child(id).update({
			"Nome": nome,
			"Mundo": mundo,
			"Prestigio": prestigio
		});

		rootContent.child('UltimoUpdate').child('0').update({
			"Data": this.getData()
		});
	};

	this.removeGuilda = function(id) {
		rootContent.child('UltimoUpdate').child('0').update({
			"Data": this.getData()
		});

		rootContent.child('RankingGuildas').child(id).set(null);

	};

	this.addJogador = function(nome, guilda, mundo, pontos, batalhas) {
		rootContent.child('RankingJogadores').push({
			Nome: nome,
			Guilda: guilda,
			Mundo: mundo,
			Pontos: pontos,
			Batalhas: batalhas
		});

		rootContent.child('UltimoUpdate').child('1').update({
			"Data": this.getData()
		});
	};

	this.editJogador = function(id, nome, guilda, mundo, pontos, batalhas) {
		rootContent.child('RankingJogadores').child(id).update({
			"Nome": nome,
			"Guilda": guilda,
			"Mundo": mundo,
			"Pontos": pontos,
			"Batalhas": batalhas
		});

		rootContent.child('UltimoUpdate').child('1').update({
			"Data": this.getData()
		});
	};

	this.removeJogador = function(id) {
		rootContent.child('UltimoUpdate').child('1').update({
			"Data": this.getData()
		});
		
		rootContent.child('RankingJogadores').child(id).set(null);

	}

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

	this.getUnidade = function(id) {
		for (i = 0; i < this.unidadesMilitares.length; i++) {
			if (this.unidadesMilitares[i].$id == id) {
				return this.unidadesMilitares[i];
			}
		}
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

	$rootScope.usuarioLogado = $localStorage.usuarioLogado;
	$rootScope.usuarioChatId = $localStorage.usuarioChatId;

	var rotasBloqueadasNaoLogados = ['/admin'];
	
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