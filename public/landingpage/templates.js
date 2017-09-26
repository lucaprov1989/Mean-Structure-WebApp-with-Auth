angular.module("templates-webapp", ["../pages/index.html"]);

angular.module("../pages/index.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../pages/index.html",
    "<div layout=\"row\" layout-wrap layout-align=\"center center\" id=\"page-user\" ng-cloack><div layout=\"column\" flex-sm=\"100\" flex-gt-sm=\"100\" flex-gt-md=\"100\" class=\"ts-titolo\"><div layout=\"row\"><div flex><h2>LANDING PAGE</h2></div></div></div><div class=\"md-actions\" layout=\"row\" layout-align=\"end center\" flex-sm=\"95\" flex-gt-sm=\"95\" flex-gt-md=\"95\"><md-button ng-click=\"goTo('login')\" class=\"md-raised md-primary\">Log In</md-button></div></div>");
}]);
