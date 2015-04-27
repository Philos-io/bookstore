// Book model: Constructor
var Book = function(options){
	this.author = options.author;
	this.topic = options.topic;
};

debugger;

var book = new Book({author: 'Mehdi Mitchel', topic: 'Design for developers'});
var book2 = new Book({author: 'Max Mitchel', topic: 'Product management done well'});

console.info(book === book2);