angular.module('myApp').factory('AuthService', ['$q', '$timeout', '$http',
    function ($q, $timeout, $http) {
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

        function login(username, password) {
            var deffered = $q.defer();

            $http.post('/user/login', {
                    username: username,
                    password: password
                })
                .success(function (data, status) {
                    if (status === 200 && data.status) {
                        user = true;
                        deffered.resolve();
                    } else {
                        user = false;
                        deffered.reject;
                    }
                })
                .error(function (data) {
                    user = false;
                    deffered.reject();
                });

            return deffered.promise;
        }
    }
]);