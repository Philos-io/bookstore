// Book model: Constructor


(function(){
	
	var author = "";

	// DEFINITION
	var Book = {
		this.author : options.author,
		this.topic : options.topic
	};

	function BookService(){
		return Book;
	}

	// INJECTION
	BookService.$inject = [];
	
	angular.module('bookstore').factory('BookService', BookService);


})();



