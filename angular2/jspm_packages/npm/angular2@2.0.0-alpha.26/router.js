/* */ 
function __export(m) {
  for (var p in m)
    if (!exports.hasOwnProperty(p))
      exports[p] = m[p];
}
var router_1 = require("./src/router/router");
exports.Router = router_1.Router;
exports.RootRouter = router_1.RootRouter;
var router_outlet_1 = require("./src/router/router_outlet");
exports.RouterOutlet = router_outlet_1.RouterOutlet;
var router_link_1 = require("./src/router/router_link");
exports.RouterLink = router_link_1.RouterLink;
var instruction_1 = require("./src/router/instruction");
exports.RouteParams = instruction_1.RouteParams;
var route_registry_1 = require("./src/router/route_registry");
exports.RouteRegistry = route_registry_1.RouteRegistry;
var browser_location_1 = require("./src/router/browser_location");
exports.BrowserLocation = browser_location_1.BrowserLocation;
var location_1 = require("./src/router/location");
exports.Location = location_1.Location;
var pipeline_1 = require("./src/router/pipeline");
exports.Pipeline = pipeline_1.Pipeline;
__export(require("./src/router/route_config_decorator"));
var browser_location_2 = require("./src/router/browser_location");
var router_2 = require("./src/router/router");
var router_outlet_2 = require("./src/router/router_outlet");
var router_link_2 = require("./src/router/router_link");
var route_registry_2 = require("./src/router/route_registry");
var pipeline_2 = require("./src/router/pipeline");
var location_2 = require("./src/router/location");
var application_tokens_1 = require("./src/core/application_tokens");
var di_1 = require("./di");
var lang_1 = require("./src/facade/lang");
exports.routerDirectives = lang_1.CONST_EXPR([router_outlet_2.RouterOutlet, router_link_2.RouterLink]);
exports.routerInjectables = [route_registry_2.RouteRegistry, pipeline_2.Pipeline, browser_location_2.BrowserLocation, location_2.Location, di_1.bind(router_2.Router).toFactory(function(registry, pipeline, location, appRoot) {
  return new router_2.RootRouter(registry, pipeline, location, appRoot);
}, [route_registry_2.RouteRegistry, pipeline_2.Pipeline, location_2.Location, application_tokens_1.appComponentTypeToken])];
exports.__esModule = true;