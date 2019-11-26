angular.module("myApp").factory("AuthService", [
  "$q",
  "$timeout",
  "$http",
  function($q, $timeout, $http) {
    var user = null;

    return {
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout
    };

    function isLoggedIn() {
      return user ? true : false;
    }

    function getUserStatus() {
      return $http
        .get("/user/status")
        .then(function(response) {
          if (response.data.status) {
            user = true;
          } else {
            user = false;
          }
        })
        .catch(function() {
          user = false;
        });
    }

    function login(username, password) {
      var deferred = $q.defer();

      $http
        .post("/user/login", {
          username: username,
          password: password
        })
        .then(function(response) {
          if (response.status === 200 && response.data.status) {
            user = true;
            deferred.resolve();
          } else {
            user = false;
            deferred.reject();
          }
        })
        .catch(function(err) {
          user = false;
          deferred.reject(err);
        });

      return deferred.promise;
    }

    function logout() {
      var deferred = $q.defer();

      $http
        .get("/user/logout")
        .then(function(response) {
          user = false;
          deferred.resolve(response);
        })
        .catch(function(err) {
          user = false;
          deferred.reject(err);
        });

      return deferred.promise;
    }
  }
]);

angular.module("myApp").factory("UserService", [
  "$q",
  "$timeout",
  "$http",
  function($q, $timeout, $http) {
    return {
      userData: userData,
      becomeSanta: becomeSanta,
      getSantaFor: getSantaFor,
      isSanta: isSanta
    };

    function userData() {
      var deferred = $q.defer();

      $http
        .get("user/currentUser")
        .then(function(response) {
          deferred.resolve(response.data.user);
        })
        .catch(function(err) {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    function becomeSanta() {
      var deferred = $q.defer();
      $http
        .post("santa/recipient")
        .then(function(response) {
          deferred.resolve(response.data);
        })
        .catch(function(err) {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    function getSantaFor() {
      var deferred = $q.defer();

      $http
        .get("santa/recipient")
        .then(function(response) {
          if (response.data.recipient) {
            deferred.resolve(response.data.recipient);
          }
        })
        .catch(function(err) {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    function isSanta() {
      var deferred = $q.defer();

      $http
        .get("santa/recipient")
        .then(function(response) {
          if (response.data.recipient) {
            deferred.resolve(true);
          } else {
            deferred.resolve(false);
          }
        })
        .catch(function(err) {
          deferred.reject(err);
        });

      return deferred.promise;
    }
  }
]);

// Wishes
angular.module("myApp").factory("WishService", [
  "$q",
  "$http",
  function($q, $http) {
    return {
      getMyWishes: getMyWishes,
      getForWishes: getForWishes,
      addWish: addWish,
      saveWish: saveWish,
      removeWish: removeWish
    };

    function getMyWishes() {
      var deferred = $q.defer();

      $http
        .get("wish/my")
        .then(function(response) {
          deferred.resolve(response.data.wishes);
        })
        .catch(function(err) {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    function getForWishes() {
      var deferred = $q.defer();

      $http
        .get("wish/for")
        .then(function(response) {
          deferred.resolve(response.data.wishes);
        })
        .catch(function(err) {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    function addWish(wishText) {
      var deferred = $q.defer();
      $http
        .post("wish/", wishText)
        .then(function(response) {
          deferred.resolve(response.data.wishes);
        })
        .catch(function(err) {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    function saveWish(id, wishText) {
      var deferred = $q.defer();

      $http
        .put("wish/" + id, wishText)
        .then(function(response) {
          deferred.resolve(response.data.wishes);
        })
        .catch(function(err) {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    function removeWish(id) {
      var deferred = $q.defer();

      $http
        .delete("wish/" + id)
        .then(function(response) {
          deferred.resolve(response.data.wishes);
        })
        .catch(function(err) {
          deferred.reject(err);
        });

      return deferred.promise;
    }
  }
]);

// Verses
angular.module("myApp").factory("VerseService", [
  "$q",
  "$http",
  function($q, $http) {
    return {
      getMyVerse: getMyVerse,
      setMyVerse: setMyVerse
    };

    function getMyVerse() {
      var deferred = $q.defer();

      $http
        .get("verse/my")
        .then(function(response) {
          deferred.resolve(response.data.verse);
        })
        .catch(function(err) {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    function setMyVerse(wishText) {
      var deferred = $q.defer();
      $http
        .post("verse/set", wishText)
        .then(function(response) {
          deferred.resolve(response.data.verse);
        })
        .catch(function(err) {
          deferred.reject(err);
        });

      return deferred.promise;
    }
  }
]);
