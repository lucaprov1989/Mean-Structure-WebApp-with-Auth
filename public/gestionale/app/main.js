var APP = angular.module('Gestionale', ['ngRoute', 'ngMaterial', 'ngStorage', 'chart.js', 'templates-webapp', 'app.config', 'app.proxy', 'angularFileUpload', 'AppControllers', 'base64', 'a8m.chunk-by']);

APP.config(['$routeProvider', '$mdDateLocaleProvider',
    function($routeProvider, $mdDateLocaleProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'pages/home.html',
            controller: 'HomeCtrl'
        }).
        when('/login', {
            templateUrl: 'pages/login.html',
            controller: 'LoginCtrl'
        }).
        when('/user/:id/:tab?', {
            templateUrl: 'pages/user.html',
            controller: 'UserCtrl'
        }).
        otherwise({
            redirectTo: '/404'
        });

        $mdDateLocaleProvider.months = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
        $mdDateLocaleProvider.shortMonths = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
        $mdDateLocaleProvider.days = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
        $mdDateLocaleProvider.shortDays = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];
        // Can change week display to start on Monday.
        $mdDateLocaleProvider.firstDayOfWeek = 1;
        // Optional.
        //$mdDateLocaleProvider.dates = [1, 2, 3, 4, 5, 6, ...];
        // Example uses moment.js to parse and format dates.
        $mdDateLocaleProvider.parseDate = function(dateString) {
            //console.log('parseDate: ' + dateString);
            var dateParts = dateString.split("/");
            if (dateParts.length == 3) {
                var day = parseInt(dateParts[0]);
                var mnt = parseInt(dateParts[1]);
                var yer = parseInt(dateParts[2]);
                if (!isNaN(day) && !isNaN(mnt) && !isNaN(yer)) {
                    return new Date(yer, mnt - 1, day);
                }
            }

            return new Date(NaN);
            /*var m = moment(dateString, 'L', true);
            return m.isValid() ? m.toDate() : new Date(NaN);*/
        };
        $mdDateLocaleProvider.formatDate = function(date) {
            if (date == undefined)
                return "";

            if (typeof(date) == "string") {
                date = new Date(date);
            }

            var day = date.getDate() + "";
            var monthIndex = (date.getMonth() + 1) + "";
            var year = date.getFullYear();
            var pad = '00';
            return ((pad.substring(0, pad.length - day.length) + day) + '/' + (pad.substring(0, pad.length - monthIndex.length) + monthIndex) + '/' + year);
        };
        $mdDateLocaleProvider.monthHeaderFormatter = function(date) {
            return $mdDateLocaleProvider.shortMonths[date.getMonth()] + ' ' + date.getFullYear();
        };
        // In addition to date display, date components also need localized messages
        // for aria-labels for screen-reader users.
        $mdDateLocaleProvider.weekNumberFormatter = function(weekNumber) {
            return 'Settimana ' + weekNumber;
        };
        $mdDateLocaleProvider.msgCalendar = 'Calendario';
        $mdDateLocaleProvider.msgOpenCalendar = 'Apri il calendario';
    }


]);

APP.run(["$rootScope", "$location", '$localStorage', '$sessionStorage', '$mdToast', 'RestClient',
    function($rootScope, $location, $localStorage, $sessionStorage, $mdToast, RestClient) {

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
            $location.path(p);
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

        $rootScope.verifyDate = function(object) {
            for (var attr in object) {
                var attribute = object[attr];
                switch (typeof(attribute)) {
                    case "string":
                        var iso = /^(\d{4})(?:-?W(\d+)(?:-?(\d+)D?)?|(?:-(\d+))?-(\d+))(?:[T ](\d+):(\d+)(?::(\d+)(?:\.(\d+))?)?)?(?:Z(-?\d*))?$/;
                        var parts = attribute.match(iso);

                        //if(!isNaN(Date.parse(attribute)) && attr != "codice")
                        if (parts != null) {
                            object[attr] = new Date(attribute);
                        }
                        break;
                    case "object":
                        $rootScope.verifyDate(attribute);
                        break;
                }
            }
        }

        $rootScope.openMenu = function($mdOpenMenu, ev) {
            $mdOpenMenu(ev);
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



    }
}]);

APP.filter('filterRichiesta', function() {
    return function(richiesta, outType) {

    }
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

        return arrayOut;
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
