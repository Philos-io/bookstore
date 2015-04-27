// Book model: Constructor
var Book = function(options){
	this.author = options.author;
	this.topic = options.topic;
};


// Create a singleton book
var singleton = (function(){

	var instance;

	return {
		getInstance: function(){
			if (!instance) {
				instance = new Book(arguments[0])
			}
			return instance;
		}
	};

})();

debugger;

// setting options
var options = {
	author: 'Davy Mitchel',
	topic: 'JavaScript'
};

var book = singleton.getInstance(options);
var book1 = singleton.getInstance();

console.warn(book === book1);
