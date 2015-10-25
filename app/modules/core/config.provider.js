(function(module){
	'use strict';

	module.value('Config', {
		AppTitle: 'Book Store',
		BooksUrl: 'http://localhost:9000/api/books',
		AddBookUrl: 'http://localhost:9000/api/books/add',
		Errors:{
			NoCategory: 'No category found'
		}
	});

})(angular.module('core'));