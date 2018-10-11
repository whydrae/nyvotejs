angular.module('myApp').factory('AuthService', ['$q', '$timeout', '$http',
  function($q, $timeout, $http) {
    var user = null;

    return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout,
    });

    function isLoggedIn() {
      if (user) {
        return true;
      } else {
        return false;
      }
    }

    function getUserStatus() {
      return $http.get('/user/status')
        .success(function(data) {
          if (data.status) {
            user = true;
          } else {
            user = false;
          }
        })
        .error(function(data) {
          user = false;
        });
    }

    function login(username, password) {
      var deferred = $q.defer();

      $http.post('/user/login', {
          username: username,
          password: password
        })
        .success(function(data, status) {
          if (status === 200 && data.status) {
            user = true;
            deferred.resolve();
          } else {
            user = false;
            deferred.reject();
          }
        })
        .error(function(data) {
          user = false;
          deferred.reject();
        });

      return deferred.promise;
    }

    function logout() {
      var deferred = $q.defer();

      $http.get('/user/logout')
        .success(function(data) {
          user = false;
          deferred.resolve();
        })
        .error(function(data) {
          user = false;
          deferred.reject();
        });

      return deferred.promise;
    }
  }
]);

angular.module('myApp').factory('UserService', ['$q', '$timeout', '$http',
  function($q, $timeout, $http) {
    return ({
      userData: userData,
      becomeSanta: becomeSanta,
      getSantaFor: getSantaFor,
      isSanta: isSanta
    });

    function userData() {
      var deferred = $q.defer();

      $http.get('user/currentUser')
        .success(function(data) {
          deferred.resolve(data.user);
        })
        .error(function(data) {
          deferred.reject();
        });

      return deferred.promise;
    }

    function becomeSanta() {
      var deferred = $q.defer();
      $http.post('santa/recipient')
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(data) {
          deferred.reject();
        });

      return deferred.promise;
    }

    function getSantaFor() {
      var deferred = $q.defer();

      $http.get('santa/recipient')
        .success(function(data) {
          if (data.recipient) {
            deferred.resolve(data.recipient);
          }
        })
        .error(function(data) {
          deferred.reject();
        });

      return deferred.promise;
    }

    function isSanta() {
      var deferred = $q.defer();

      $http.get('santa/recipient')
        .success(function(data) {
          if (data.recipient) {
            deferred.resolve(true);
          } else {
            deferred.resolve(false);
          }
        })
        .error(function(data) {
          deferred.reject();
        });

      return deferred.promise;
    }
  }
]);

//// Wishes

angular.module('myApp').factory('WishService', ['$q', '$timeout', '$http',
  function($q, $timeout, $http) {

    return ({
      getMyWishes: getMyWishes,
      getForWishes: getForWishes,
      addWish: addWish,
      removeWish: removeWish
    });

    function getMyWishes() {
      var deferred = $q.defer();

      $http.get('wish/my')
        .success(function(data) {
          deferred.resolve(data.wishes)
        })
        .error(function(data) {
          deferred.reject();
        });

      return deferred.promise;
    }

    function getForWishes() {
      var deferred = $q.defer();

      $http.get('wish/for')
        .success(function(data) {
          deferred.resolve(data.wishes)
        })
        .error(function(data) {
          deferred.reject();
        });

      return deferred.promise;
    }

    function addWish(wishText) {
      var deferred = $q.defer();
      $http.post('wish/', wishText)
        .success(function(data) {
          deferred.resolve(data.wishes)
        })
        .error(function(data) {
          deferred.reject();
        });

      return deferred.promise;
    }

    function removeWish(id) {
      var deferred = $q.defer();

      $http.delete('wish/' + id)
        .success(function(data) {
          deferred.resolve(data.wishes)
        })
        .error(function(data) {
          deferred.reject();
        });

      return deferred.promise;
    }
  }
]);
