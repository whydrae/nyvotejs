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
    var userDataVar;

    return ({
      userData: userData
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
  }
]);
