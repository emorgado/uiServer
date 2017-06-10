(function(angular) {



	angular.module('hello', [ 'ngRoute' ])
		.config(config)
		.controller('home', home)
		.controller('navigation', navigation)
	;

	function config($routeProvider, $httpProvider, $locationProvider ) {
		$routeProvider.when('/', {
			templateUrl : 'home.html',
			controller : 'home',
			controllerAs : 'controller'
		}).when('/login', {
			templateUrl : 'login.html',
			controller : 'navigation',
			controllerAs : 'controller'
		}).otherwise('/');
		$locationProvider.hashPrefix('');
//		$locationProvider.html5Mode({
//            enabled: true,
//            requireBase: true
//        });
		$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
	}

	function home($http, $log) {
		var self = this;
		$http.get('/resource/').then(function(response) {

			$log.info("Success!", response);
			self.greeting = response.data;

		}, function(response) {

			$log.error("Hummm!");
		});
	}

	function navigation($rootScope, $http, $location, $route) {
		var self = this;

		self.tab = function(route) {
			return $route.current && route === $route.current.controller;
		};

		var authenticate = function(credentials, callback) {

			var headers = credentials ? {
				authorization : "Basic "
					+ btoa(credentials.username + ":"
						+ credentials.password)
			} : {};

			$http.get('user', {
				headers : headers
			}).then(function(response) {
				if (response.data.name) {
					$rootScope.authenticated = true;
				} else {
					$rootScope.authenticated = false;
				}
				callback && callback();
			}, function() {
				$rootScope.authenticated = false;
				callback && callback();
			});

		}

		authenticate();

		self.credentials = {};
		self.login = function() {
			authenticate(self.credentials, function() {
				if ($rootScope.authenticated) {
					console.log("Login succeeded")
					$location.path("/");
					self.error = false;
					$rootScope.authenticated = true;
				} else {
					console.log("Login failed")
					$location.path("/login");
					self.error = true;
					$rootScope.authenticated = false;
				}
			})
		};

		self.logout = function() {
			$http.post('logout', {}).finally(function() {
				$rootScope.authenticated = false;
				$location.path("/");
			});
		}

	}
	/*
	function navigation($rootScope, $http, $location, $log, $route) {
		$log.info("navigation");
		var self = this;

		self.tab = function(route) {
			return $route.current && route === $route.current.controller;
		};

		var authenticate = function(credentials, callback) {
			var headers = credentials ? {
				authorization : "Basic " + btoa(creadentials.username + ':' + credentials.password)
			} : {};

			$http.get('user', {
				headers : headers
			}).then(function(response) {
				$log.info("Authenticated!", response);
				if (response.data.name) {
					$rootScope.authenticated = true;
				}
				callback && callback($rootScope.authenticated);
			}, function(response) {
				$log.error("Not authenticated!");
				$rootScope.authenticated = false;
				callback && callback(false);
			});
		}

		authenticate();
		self.credentials = {};
		self.login = function() {
			authenticate(self.credentials, function(authenticated) {
				if (authenticated) {
					$log.info("login succeded!");
					$location.path('/');
					self.error = false;
					$rootScope.authenticated = true;
				} else {
					$log.error("login failed!")
					$location.path('/login');
					self.error = false;
					$rootScope.authenticated = true;
				}
			});
		}

		self.logout = function() {
			$http.post('logout', {}).then(function(response) {
				$rootScope.authenticated = false;
				$location.path("/");
			}, function(response) {
				$rootScope.authenticated = false;
				$location.path("/");
			});
		}
	}
	*/

})(angular);