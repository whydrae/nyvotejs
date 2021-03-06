var myApp = angular.module("myApp");

myApp.controller("loginController", [
  "$scope",
  "$location",
  "AuthService",
  function($scope, $location, AuthService) {
    $scope.login = function() {
      $scope.error = false;
      $scope.disabled = true;

      AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        .then(function() {
          $location.path("/");
          $scope.disabled = false;
          $scope.loginForm = {};
        })
        .catch(function() {
          $scope.error = true;
          $scope.errorMessage = "Введен неправильный пользователь или пароль";
          $scope.disabled = false;
        });
    };
  }
]);

myApp.controller("logoutController", [
  "$scope",
  "$location",
  "AuthService",
  function($scope, $location, AuthService) {
    $scope.logout = function() {
      AuthService.logout().then(function() {
        $location.path("/login");
      });
    };
  }
]);

myApp.directive("ngReallyClick", [
  "$uibModal",
  function($uibModal) {
    var ModalInstanceCtrl = function($scope, $uibModalInstance) {
      $scope.ok = function() {
        $uibModalInstance.close();
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss("cancel");
      };
    };

    return {
      restrict: "A",
      scope: {
        ngReallyClick: "&"
      },
      link: function(scope, element, attrs) {
        element.bind("click", function() {
          var message = attrs.ngReallyMessage || "Вы уверены?";

          var modalHtml = '<div class="modal-body">' + message + "</div>";
          modalHtml =
            modalHtml +
            `
        <div class="modal-footer">
          <button class="btn btn-primary" data-ng-click="ok()">Удалить</button>
          <button class="btn btn-default" data-ng-click="cancel()">Отмена</button>
        </div>`;

          var modalInstance = $uibModal.open({
            template: modalHtml,
            controller: ModalInstanceCtrl
          });

          modalInstance.result.then(
            function() {
              scope.ngReallyClick();
            },
            function() {
              return;
            }
          );
        });
      }
    };
  }
]);

myApp.controller("homeController", [
  "$scope",
  "UserService",
  "WishService",
  "VerseService",
  function($scope, UserService, WishService, VerseService) {
    UserService.userData().then(function(data) {
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
          }
        })
        .catch(function() {
          $scope.santaErrorMessage =
            "Не удалось стать Сантой! Ты остался один :-(";
          $scope.santaError = true;
        });
    };

    function setSantaScope() {
      UserService.getSantaFor().then(function(data) {
        if (data) {
          $scope.forName = data.forname;
        }
      });

      UserService.isSanta().then(function(data) {
        $scope.showSanta = data || false;
      });

      WishService.getForWishes().then(function(data) {
        $scope.forWishes = data;
      });      
    }

    WishService.getMyWishes().then(function(data) {
      $scope.myWishes = data;
    });

    WishService.getForWishes().then(function(data) {
      $scope.forWishes = data;
    });

    $scope.addWish = function() {
      WishService.addWish($scope.formData).then(function(data) {
        $scope.myWishes = data;
        $scope.formData = {};
      });
    };

    $scope.removeWish = function(id) {
      WishService.removeWish(id).then(function(data) {
        $scope.myWishes = data;
      });
    };

    $scope.editWishMode = false;
    $scope.editWishId = null;

    $scope.editWish = function(id, wishEditText) {
      $scope.editWishMode = true;
      $scope.editWishId = id;
      $scope.formData = { wish: wishEditText };
    };

    $scope.saveWish = function() {
      $scope.editWishMode = false;
      WishService.saveWish($scope.editWishId, $scope.formData).then(function(
        data
      ) {
        $scope.myWishes = data;
        $scope.formData = {};
      });
      $scope.editWishId = null;
    };

    $scope.cancelEdit = function() {
      $scope.editWishMode = false;
      $scope.formData = {};
    };

    VerseService.getMyVerse().then(function(data) {
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
