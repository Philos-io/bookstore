import angular , {module} from 'angular';
import Config from './services/configProvider';
import CoreController from './controllers/coreController';
import NavController from './controllers/NavController';
import bsHeader from './directives/header';
import bsFooter from './directives/footer';

module('core', [])
  .value('Config', Config)
  .controller('CoreController', CoreController)
  .controller('NavController', NavController)
  .directive('bsFooter', bsFooter)
  .directive('bsHeader', bsHeader);

