angular.module('AppControllers')
    .controller('LoginCtrl', ['$scope', '$location', '$localStorage', '$sessionStorage', '$rootScope', 'RestClient',
        function($scope, $location, $localStorage, $sessionStorage, $rootScope, RestClient) {

            if ($localStorage.accessToken !== null && $rootScope.User !== undefined) {
                $location.path("/");
                return;
            }

            $scope.login = function() {
                $scope.loginerror = "";
                RestClient.login($scope.user, function(response) {
                    switch (response.error) {
                        case 0:
                            $localStorage.accessToken = response.data;
                            $localStorage.accessToken.time = new Date();
                            console.log($localStorage.accessToken);
                            RestClient.current_user(function(response) {
                                $sessionStorage.user = response.data;
                                $location.path("/");
                            });

                            break;

                        default:
                            $scope.loginerror = "Accesso errato, verificare i dati inseriti";
                            break;
                    }
                });
            };
        }
    ]);
