var myApp = angular.module("myApp", ["ngRoute", "ngSanitize", "ui.bootstrap"]);

myApp.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "partials/home.html",
      controller: "homeController",
      access: {
        restricted: true
      },
      resolve: {
        factory: checkLogin
      }
    })
    .when("/login", {
      templateUrl: "partials/login.html",
      controller: "loginController",
      access: {
        restricted: false
      }
    })
    .when("/logout", {
      controller: "logoutController",
      access: {
        restricted: true
      }
    })
    .otherwise({
      redirectTo: "/"
    });

  $locationProvider.html5Mode(true);
});

myApp.run(function($rootScope, $location, $route, AuthService) {
  $rootScope.$on("$routeChangeStart", function(event, next) {
    AuthService.getUserStatus().then(function() {
      if (
        (!next.access || next.access.restricted) &&
        !AuthService.isLoggedIn()
      ) {
        $location.path("/login");
        $route.reload();
      }
    });
  });
});

var checkLogin = function($location, $q, AuthService) {
  var deferred = $q.defer();

  AuthService.getUserStatus().then(
    function() {
      if (AuthService.isLoggedIn()) {
        deferred.resolve(true);
      } else {
        deferred.reject();
        $location.path("/login");
      }
    },
    function(err) {
      deferred.reject(err);
      $location.path("/login");
    }
  );

  return deferred.promise;
};
