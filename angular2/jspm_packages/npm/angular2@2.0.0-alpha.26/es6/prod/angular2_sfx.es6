import * as ng from './angular2';
import * as router from './router';
var angular = ng;
window.angular = angular;
var _prevAngular = window.angular;
angular.router = router;
/**
 * Calling noConflict will restore window.angular to its pre-angular loading state
 * and return the angular module object.
 */
angular.noConflict = function () {
    window.angular = _prevAngular;
    return angular;
};
//# sourceMappingURL=angular2_sfx.js.map