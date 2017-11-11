angular.module('AppControllers')
    .controller('LoginCtrl', ['$scope', '$location', '$localStorage', '$sessionStorage', '$rootScope', 'RestClient',
        function($scope, $location, $localStorage, $sessionStorage, $rootScope, RestClient) {

            if ($localStorage.accessToken !== null && $rootScope.User !== undefined) {
                $location.path("/");
                return;
            }

            $scope.login = function() {
                $scope.loginerror = "";
                //RestClient Service to process the login, add more cases to manage more errors
                RestClient.login($scope.user, function(response) {
                    switch (response.error) {
                      //ok you are logged and directed into home page
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
                        //there must be some error
                            $scope.loginerror = "Accesso errato, verificare i dati inseriti";
                            break;
                    }
                });
            };
        }
    ]);
