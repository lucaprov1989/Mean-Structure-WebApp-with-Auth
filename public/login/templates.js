angular.module('templates-webapp', ['../pages/login.html']);

angular.module("../pages/login.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("../pages/login.html",
    "<div layout=\"row\" layout-wrap layout-align=\"center center\" id=\"page-user\" ng-cloack><div flex=\"30\" class=\"login-box\"><md-content class=\"md-padding login-form\"><form class=\"form-horizontal\" name=\"loginForm\"><md-card><md-card-content><md-input-container md-no-float><input ng-model=\"user.name\" type=\"text\" placeholder=\"Username\" ng-model-options=\"{ updateOn: 'blur keyup' }\" required></md-input-container></md-card-content></md-card><md-card><md-card-content><md-input-container md-no-float><input ng-model=\"user.password\" type=\"password\" placeholder=\"Password\" ng-model-options=\"{ updateOn: 'blur keyup' }\" required></md-input-container></md-card-content></md-card><div class=\"md-actions\" layout=\"row\" layout-align=\"end center\"><md-button ng-click=\"login()\" class=\"md-raised md-primary md-fill\" ng-disabled=\"!loginForm.$valid\">Login</md-button></div><div class=\"loginerror\">{{loginerror}}</div></form></md-content></div></div>");
}]);
