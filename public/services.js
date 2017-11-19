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
      var deffered = $q.defer();

      $http.post('/user/login', {
          username: username,
          password: password
        })
        .success(function(data, status) {
          if (status === 200 && data.status) {
            user = true;
            deffered.resolve();
          } else {
            user = false;
            deffered.reject();
          }
        })
        .error(function(data) {
          user = false;
          deffered.reject();
        });

      return deffered.promise;
    }

    function logout() {
      var deffered = $q.defer();

      $http.get('/user/logout')
        .success(function(data) {
          user = false;
          deffered.resolve();
        })
        .error(function(data) {
          user = false;
          deffered.reject();
        });

      return deffered.promise;
    }
  }
]);

angular.module('myApp').factory('UserService', ['$q', '$timeout', '$http',
  function($q, $timeout, $http) {
    var santa = false;

    return ({
      userData: userData,
      becomeSanta: becomeSanta,
      getSantaFor: getSantaFor,
      isSanta: isSanta
    });

    function userData() {
      var deffered = $q.defer();

      $http.get('user/currentUser')
        .success(function(data) {
          deffered.resolve(data.user);
        })
        .error(function(data) {
          deffered.reject();
        });

      return deffered.promise;
    }

    function becomeSanta() {
      var deferred = $q.defer();

      $http.post('santa/recipient')
        .success(function(data) {
          deffered.resolve(data);
        })
        .error(function(data) {
          deffered.reject();
        });

      return deffered.promise;
    }

    function getSantaFor() {
      var deffered = $q.defer();

      $http.get('santa/recipient')
        .success(function(data) {
          if (data.recipient) {
            santa = true;
            deffered.resolve(data.recipient);
          }
        })
        .error(function(data) {
          santa = false;
          deffered.reject();
        });

      return deffered.promise;
    }

    function isSanta() {
      var deffered = $q.defer();

      $http.get('santa/recipient')
        .success(function(data) {
          if (data.recipient) {
            santa = true;
            deffered.resolve(true);
          } else {
            deffered.resolve(false);
          }
        })
        .error(function(data) {
          santa = false;
          deffered.reject();
        });

      return deffered.promise;
    }

    function becomeSanta() {
      var deffered = $q.defer();

      $http.post('santa/recipient')
        .success(function(data) {
          santa = true;
          deffered.resolve(data.recipient);
        })
        .error(function(data) {
          santa = false;
          deffered.reject();
        });

      return deffered.promise;
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
      var deffered = $q.defer();

      $http.get('wish/my')
        .success(function(data) {
          deffered.resolve(data.wishes)
        })
        .error(function(data) {
          deffered.reject();
        });

      return deffered.promise;
    }

    function getForWishes() {
      var deffered = $q.defer();

      $http.get('wish/for')
        .success(function(data) {
          deffered.resolve(data.wishes)
        })
        .error(function(data) {
          deffered.reject();
        });

      return deffered.promise;
    }

    function addWish(wishText) {
      var deffered = $q.defer();
      $http.post('wish/', wishText)
        .success(function(data) {
          deffered.resolve(data.wishes)
        })
        .error(function(data) {
          deffered.reject();
        });

      return deffered.promise;
    }

    function removeWish(id) {
      var deffered = $q.defer();

      $http.delete('wish/' + id)
        .success(function(data) {
          deffered.resolve(data.wishes)
        })
        .error(function(data) {
          deffered.reject();
        });

      return deffered.promise;
    }
  }
]);
