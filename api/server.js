var express = require('express'),
	app = express(),
	cors = require('cors'),
	bodyParser = require('body-parser');


function getBooks(){

            return [
                {
                  bookID: 9809,
                  author: 'Davy Mitchel',
                  title: 'Functional JavaScript',
                  description: 'Functional programming in JavaScript',
                  price: 29.99,
                  category: 'Programming language',
                  cover: 'images/javascript.jpg'
                },
                {
                  bookID: 9100,
                  author: 'Max Mitchel',
                  title: 'AngularJS: Up and Running',
                  description: 'Enhanced Productivity with Structured Web Apps',
                  price: 19.99,
                  category: 'Web Frameworks',
                  cover: 'images/angularjs.jpg'
                },
                {
                  bookID: 9353,
                  author: 'Jesse Cravens, Thomas Q Brady',
                  title: 'Introduction to IOT Programming with JavaScript',
                  description: "In this book you will build robot, connected apps and devices applications.",
                  price: 18.99,
                  category: 'Web Frameworks',
                  cover: 'images/iot.jpg'
                },
                {
                  bookID: 9300,
                  author: 'Jesse Cravens, Thomas Q Brady',
                  title: 'Data visualisation in JavaScript',
                  description:'Building data visualisation apps using JavaScript',
                  price: 20.99,
                  category: 'Web Frameworks',
                  cover: 'images/datavis.jpg'
                },
                {
                  bookID: 9657,
                  author: 'Jesse Cravens, Thomas Q Brady',
                  title: 'ES6: JavaScript Next',
                  description: "This book will cover ES6 entirely and will show you how to use ES6 today.",
                  price: 9.99,
                  category: 'Web Frameworks',
                  cover: 'images/es6.jpg'
                },
                {
                  bookID: 9887,
                  author: 'Jesse Cravens, Thomas Q Brady',
                  title: 'Ionic Framework: Building hybrid app',
                  description: "Build Hybrid apps using Angular, Ionic and deliver fast.",
                  price: 9.99,
                  category: 'Web Frameworks',
                  cover: 'images/ionic.jpg'
                },
                {
                  bookID: 9546,
                  author: 'Backstop Media, Rick Waldron',
                  title: 'Make: JavaScript Robotics',
                  description: 'Building NodeBots with Raspberry Pi, Arduino, and BeagleBone',
                  price: 10.99,
                  category: 'Robotic & Programming',
                  cover: 'images/robot.jpg'
                }
              ];}

var books = getBooks();

var port = process.env.PORT || 9000;

app.use(cors());
app.use(bodyParser.urlencoded({
        extended: true
    }));
app.use(bodyParser.json());

/** Route API definition**/
app.get('/api/books', function(req, res){
	res.json(books);
});

app.get('/api/books/:bookID', function(req, res){
    
    var bookID = Number(req.params.bookID);

    var book = books.filter(function(book){
        return book.bookID === bookID;
    })[0];

    if (book) {
        res.json(book)
    }else{
        res.status(404).send({message:'No book found with ID: '+bookID});
    }
});

app.post('/api/books/add', function(req, res){
	var book = req.body;
    book.bookID = Math.floor(Math.random(1000,9999)*10000);
    books.push(book);

	res.json(books);
});

app.put('/api/books/:bookID', function(req, res){
    
    var bookID = Number(req.params.bookID), updatedBook = req.body, found = false;

    var books = getBooks();

    books.forEach(function(book, index){
        if(book.bookID === bookID){
            books[index] = updatedBook;
            found = true;
            res.json(books);
        }
    });

    if(!found){
        res.status(500).send({message: 'Update failed!'});
    } 
});

app.listen(port, function(){
	console.log('app is running on port: '+port);
});