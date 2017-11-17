var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/home.html',
      controller: 'homeController',
      access: {
        restricted: true
      }
    })
    .when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'loginController',
      access: {
        restricted: false
      }
    })
    .when('/logout', {
      controller: 'logoutController',
      access: {
        restricted: true
      }
    })
    .when('/one', {
      template: '<h1>This is page one</h1>',
      access: {
        restricted: true
      }
    })
    .otherwise({
      redirectTo: '/'
    });
});

myApp.run(function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    AuthService.getUserStatus()
      .then(function () {
        console.log(next);
        if ((!next.access || next.access.restricted) && AuthService.isLoggedIn() === false) {
          $location.path('/login');
          //$route.reload();
        }
      });
  });
});