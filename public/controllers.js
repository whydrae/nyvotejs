angular.module('myApp').controller('loginController', ['$scope', '$location', 'AuthService',
  function($scope, $location, AuthService) {
    $scope.login = function() {
      $scope.error = false;
      $scope.disabled = true;

      AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function() {
          $location.path('/');
          $scope.disabled = false;
          $scope.loginForm = {};
        })
        .catch(function() {
          $scope.error = true;
          $scope.errorMessage = "Invalid username or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });
    };
  }
]);

angular.module('myApp').controller('logoutController', ['$scope', '$location', 'AuthService',
  function($scope, $location, AuthService) {
    $scope.logout = function() {
      AuthService.logout()
        .then(function() {
          $location.path('/login')
        });
    };
  }
]);

angular.module('myApp').controller('homeController', ['$scope', '$location', 'UserService',
  function($scope, $location, UserService) {
    $scope.home = function() {
      UserService.userData()
        .then(function(data) {
          $scope.UserName = data.username;
        });
    };
  }
]);
