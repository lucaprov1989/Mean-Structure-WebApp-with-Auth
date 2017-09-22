var APP = angular.module('GestionaleLogin', ['ngRoute', 'ngMaterial', 'ngStorage', 'templates-webapp', 'app.config', 'app.proxy', 'AppControllers', 'base64', 'a8m.chunk-by']);

APP.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'pages/login.html',
            controller: 'LoginCtrl'
        })
    }
]);

APP.run(["$rootScope", "$location", '$localStorage', '$sessionStorage', '$mdToast', 'RestClient', '$window',
    function($rootScope, $location, $localStorage, $sessionStorage, $mdToast, RestClient, $window) {

        $rootScope.auth = function(callBack) {

            if ($location.path().indexOf("search") == -1) {
                $rootScope.search = "";
            }

            // Check access token
            if ($localStorage.accessToken === null || $localStorage.accessToken === undefined) {
                $location.path("/login");
                return;
            }
            // Check expire time
            var diff = ((new Date()).getTime() - (new Date($localStorage.accessToken.access_token.expire_time)).getTime());
            if (diff > 0) {
                $localStorage.accessToken = null;
                $location.path("/login");
                return;
            }

            console.log("Authenticated");
            console.log($localStorage.accessToken);
            if ($sessionStorage.user === null || $sessionStorage.user === undefined) {
                RestClient.current_user(function(response) {
                    $rootScope.User = $sessionStorage.user = response.data;
                    callBack();
                });
            } else {
                $rootScope.User = $sessionStorage.user;
                console.log($rootScope.User);
                callBack();
            }
        };

        $rootScope.goTo = function(p) {
            if (p.charAt(0) == "/") {
                $location.path(p);
            } else {
                var url = $location.protocol() + "://" + $location.host();
                if ($location.port() != 80)
                    url += ":" + $location.port();
                url += "/";
                if (p != "")
                    url += p + "/";

                $window.location.href = url;
            }
        };

        $rootScope.search = "";
        $rootScope.doSearch = function() {
            //$rootScope.search
            if ($location.path().indexOf("search") == -1) {
                $location.path("/search");
            }
        };

        $rootScope.showToast = function(message) {
            $mdToast.show(
                $mdToast.simple()
                .content(message)
                .position("bottom right")
                .hideDelay(3000)
            );
        };

        $rootScope.logout = function() {
            $localStorage.accessToken = null;
            $sessionStorage.user = null;
            $location.path("/login");
        };

    }
]);

APP.controller("TopToolBarCtrl", ['$scope', '$location',
    function($scope, $location) {
        $scope.isLogin = function() {
            return !($location.path().indexOf('login') == 1);
        };
    }
]);

/* FILTRI CUSTOM */

APP.filter('filterAttivita', ['filterWatcher', function(filterWatcher) {
    return function(array) {
        if (array === undefined) return [];

        return filterWatcher.isMemoized('filterAttivita', arguments) || filterWatcher.memoize('filterAttivita', arguments, this, _filterAttivita(array));

        return arrayOut;
    }

}]);

APP.filter('filterRichiesta', function() {
    return function(richiesta, outType) {}
});

APP.directive('statoRichiesta', function() {
    return {
        restrict: 'E',
        scope: {
            richiesta: '='
        },
        templateUrl: function(elem, attr) {
            return 'directive/stato-richiesta/' + attr.tipo + '.html';
        }
    };
});

APP.filter('filterPagamenti', ['filterWatcher', function(filterWatcher) {
    return function(array) {
        if (array === undefined) return [];

        return filterWatcher.isMemoized('filterPagamenti', arguments) || filterWatcher.memoize('filterPagamenti', arguments, this, _filterPagamenti(array));

    }
}]);

APP.directive("uiJqvmap", [
    function() {
        return {
            restrict: "A",
            scope: {
                options: "="
            },
            link: function(scope, ele) {
                var options;

                return options = scope.options, jQuery(ele).vectorMap(options);
            }
        };
    }
]);
