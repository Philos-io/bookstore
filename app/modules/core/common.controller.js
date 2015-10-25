(function(module){
	'use strict';

	function CommonController(commonFactory, Config){
		this.app = Config.AppTitle;

		this.watchers = commonFactory.getWatchers().length;
		window.watchers = commonFactory.getWatchers;
	}

	CommonController.$inject = ['commonFactory', 'Config'];

	module.controller('CommonController', CommonController);

})(angular.module('core'));
