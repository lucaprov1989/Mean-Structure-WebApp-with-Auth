angular.module('AppControllers', [])
    .controller('LoginCtrl', ['$scope', '$location', '$localStorage', '$sessionStorage', '$rootScope', 'RestClient',
        function($scope, $location, $localStorage, $sessionStorage, $rootScope, RestClient) {

            console.log('ci sono!!');

            if ($localStorage.accessToken !== null && $sessionStorage.user !== undefined) {
                redirectUser();
                return;
            }

            $scope.login = function() {
                $scope.loginerror = "";
                RestClient.login($scope.user, function(response) {
                    console.log(response);
                    switch (response.error) {

                        case 0:
                            $localStorage.accessToken = response.data;
                            $localStorage.accessToken.time = new Date();
                            console.log($localStorage.accessToken);
                            $rootScope.goTo("gestionale");
                            //redirectUser();
                            break;
                        case 403:
                            $scope.loginerror = "Accesso errato, verificare i dati inseriti";
                            break;

                        default:
                            $scope.loginerror = "Assenza di connessione, verificare la connessione.";
                            break;
                    }
                });
            };

            function redirectUser() {
                RestClient.current_user(function(response) {
                    $sessionStorage.user = response.data;
                    switch ($sessionStorage.user._type) {
                        default: $location.path("/");
                        break;
                    }
                });
            }
        }
    ]);
