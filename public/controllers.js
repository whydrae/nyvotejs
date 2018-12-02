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
          $scope.errorMessage = "Введен неправильный пользователь или пароль";
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
          $location.path('/login');
        });
    };
  }
]);

angular.module('myApp').controller('homeController', ['$scope', '$location', 'UserService', 'WishService', 'VerseService',
  function($scope, $location, UserService, WishService, VerseService) {
    UserService.userData()
      .then(function(data) {
        if (data.name) {
          $scope.UserName = data.name;
        }
      });

    setSantaScope();

    $scope.becomeSanta = function() {
      UserService.becomeSanta()
        .then(function(data) {
          $scope.santaError = false;
          if (data) {
            $scope.showSanta = true;
            setSantaScope();
          } else {
            $scope.showSanta = false;
          }
        })
        .catch(function() {
          $scope.santaErrorMessage = "Не удалось стать Сантой! Ты остался один :-(";
          $scope.santaError = true;
        });
    };

    function setSantaScope() {
      UserService.getSantaFor()
        .then(function(data) {
          if (data) {
            $scope.ForName = data.forname;
          }
        });

      UserService.isSanta()
        .then(function(data) {
          if (data) {
            $scope.showSanta = data;
          } else {
            $scope.showSanta = false;
          }
        });
    }

    WishService.getMyWishes()
      .then(function(data) {
        $scope.myWishes = data;
      });

    WishService.getForWishes()
      .then(function(data) {
        $scope.forWishes = data;
      });

    $scope.addWish = function() {
      WishService.addWish($scope.formData)
        .then(function(data) {
          $scope.myWishes = data;
          $scope.formData = {};
        });
    };

    $scope.removeWish = function(id) {
      WishService.removeWish(id)
        .then(function(data) {
          $scope.myWishes = data;
        });
    };

    VerseService.getMyVerse()
      .then(function(data) {
        $scope.myVerse = data;
        $scope.showVerse = false;
        if (data) {
          $scope.showVerse = true;
        }
      });

    $scope.setMyVerse = function() {
      VerseService.setMyVerse()
        .then(function(data) {
          if (data) {
            $scope.myVerse = data;
            $scope.showVerse = true;
          }
        })
        .catch(function() {
          $scope.error = true;
          $scope.errorMessage = "Произошла ошибка :( Ты знаешь кому написать.";
        });
    };
  }
]);
