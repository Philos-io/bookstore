(function(module){
	'use strict';

	function NavController(Config){
		this.title = Config.AppTitle
	}

	NavController.$inject  = ['Config'];

	module.controller('NavController', NavController);

	
})(angular.module('core'));
