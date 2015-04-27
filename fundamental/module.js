var bookService = function(){

	function createBook(){}
	function getBook(){}
	function saveBook(){}
	function updateBook(){}
	function deleteBook(){}

	// Public API
	return {
		get: getBook,
		save: saveBook,
		update: updateBook,
		remove: deleteBook
	}
};

// How do you consume that?
var book = bookService();
