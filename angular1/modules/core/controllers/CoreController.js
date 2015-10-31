export default class CoreController {
  constructor(CoreFactory, Config){
    this.app = Config.AppTitle;
    this.watchers = CoreFactory.getWatchers().length;
    window.watchers = commonFactory.getWatchers;
  }
 }

CoreController.$inject = ['CoreFactory', 'Config'];

