/* */ 
var ng = require("./angular2");
var router = require("./router");
var angular = ng;
window.angular = angular;
var _prevAngular = window.angular;
angular.router = router;
angular.noConflict = function() {
  window.angular = _prevAngular;
  return angular;
};
exports.__esModule = true;
