angular.module("app.proxy", []).factory("RestClient", ["$http", "config", "$localStorage", "$filter", "$rootScope", "$httpParamSerializer", "$base64",
    function($http, config, $localStorage, $filter, $rootScope, $httpParamSerializer, $base64) {

        var lastPolling = new Date();

        function Poll() {
            if ($localStorage.accessToken !== null) {
                var diff = ((new Date()).getTime() - lastPolling.getTime()) / 1000;
                console.log("Polling diff:" + diff);
                if (diff > 1800) {
                    getRequest("/utente/_", function(response) {
                        if (response.data !== undefined && response.data !== null)
                            $rootScope.polled(response.data);
                    });
                    lastPolling = new Date();
                }
            }
        }

        function verifyDateUpload(object) {

            for (var attr in object) {
                var attribute = object[attr];
                if (attribute == null)
                    continue;
                switch (typeof(attribute)) {
                    case "object":
                        if (attribute.getFullYear) {

                            var month = attribute.getMonth() + 1;
                            if (month < 10) {
                                month = "0" + month;
                            }
                            var day = attribute.getDate();
                            if (day < 10) {
                                day = "0" + day;
                            }
                            object[attr] = attribute.getFullYear() + "-" + month + "-" + day + "T00:00:00.000Z";;

                        } else {
                            verifyDateUpload(attribute);
                        }
                        break;
                }
            }
        }

        $rootScope.NET_STATUS_ON = false;

        function getResponse(response) {
            return {
                error: response.status == 200 ? 0 : response.status,
                description: response.statusText,
                data: response.data
            };
        }

        function makeRequest(req, callBack) {

            // Si mostra lo spinner
            $rootScope.NET_STATUS_ON = true;

            if (($localStorage.accessToken !== null && $localStorage.accessToken != undefined) && (req.data === undefined || (req.data !== undefined && req.data.grant_type === undefined)) && req.headers === undefined) {
                req.headers = {
                    'Authorization': 'Bearer ' + $localStorage.accessToken.access_token._id
                };
                console.log("AccessToken: check expire time");
                var diff = ((new Date()).getTime() - (new Date($localStorage.accessToken.time)).getTime()) / 1000;
                if (diff > ($localStorage.accessToken.expires_in - (60 * 5))) {
                    console.log("Token is expiring... Refreshing");
                    var rp = {
                        grant_type: 'refresh_token',
                        client_id: config.client_id,
                        client_secret: config.client_secret,
                        refresh_token: $localStorage.accessToken.refresh_token
                    };
                    //$localStorage.accessToken = null;

                    postRequest("/oauth2/token", rp, function(response) {
                        $localStorage.accessToken = response.data;
                        $localStorage.accessToken.time = new Date();
                        makeRequest(req, callBack);
                    });
                    return; // Ci fermiamo qui poichè bisogna aggiornare il token
                }
            }

            $http(req).
            then(function(response) {
                $rootScope.NET_STATUS_ON = false;
                if (callBack !== undefined) {
                    callBack(getResponse(response));
                    // Polling per nuove notifiche
                    Poll();
                } else {
                    console.log("PostRequestSuccess: " + req.url + "?" + $httpParamSerializer(rp));
                    console.log(response);
                }
            }, function(response) {
                $rootScope.NET_STATUS_ON = false;
                if (callBack !== undefined) {
                    callBack(getResponse(response));
                    // Polling per nuove notifiche
                    Poll();
                } else {
                    console.error("PostRequestError: " + req.url + "?" + $httpParamSerializer(rp));
                    console.error(response);
                }
            });
        }

        function dataRequest(method, path, rp, callBack) {
            verifyDateUpload(rp);
            var req = {
                method: method,
                url: config.endpoint + path,
                data: rp //$httpParamSerializer(rp)//$.param(rp)
            };

            if (rp.client_id !== undefined && rp.client_secret !== undefined) {
                req.headers = {
                    'Authorization': 'Basic ' + $base64.encode(rp.client_id + ':' + rp.client_secret)
                };
                delete rp.client_id;
                delete rp.client_secret;
                req.data = rp; //$httpParamSerializer(rp);
            }

            if (path == "/public/register") {
                req.headers = {
                    'Authorization': 'Bearer 4ryzU7ltSUtrNqmNsKKEbXvf8V0XsUDAGC9J2U9g3zYGPwMeSytjTRjuEB7z25ji'
                };
            }

            makeRequest(req, callBack);
        }

        function queryRequest(method, path, callBack) {
            var req = {
                method: method,
                url: config.endpoint + path
            };

            makeRequest(req, callBack);
        }

        function putRequest(path, rp, callBack) {
            dataRequest("PUT", path, rp, callBack);
        }

        function postRequest(path, rp, callBack) {
            dataRequest("POST", path, rp, callBack);
        }

        function getRequest(path, callBack) {
            queryRequest("GET", path, callBack);
        }

        function deleteRequest(path, callBack) {
            queryRequest("DELETE", path, callBack);
        }

        return {

            current_user: function(callBack) {
                getRequest("/utente", callBack);
            }
        };
    }
]);
