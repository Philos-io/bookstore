import angular , {module} from 'angular';
import 'angular-route';

import Config from './services/configProvider';
import CoreController from './controllers/coreController';
import NavController from './controllers/NavController';
import bsHeader from './directives/header';
import bsFooter from './directives/footer';
import shellDirective from './directives/shell';

module('core', ['ngRoute'])
  .value('Config', Config)
  .controller('CoreController', CoreController)
  .controller('NavController', NavController)
  .directive('shell', shellDirective)
  .directive('bsFooter', bsFooter)
  .directive('bsHeader', bsHeader);

