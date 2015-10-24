export default class BookFactory {

  constructor($q, $http, Config){}

  getAllFromServer(forced){
    forced = forced  || false;
    return $http.get(Config.BooksUrl, {cache: forced});
  }

  covers(){
    return [
      'images/angularjs.jpg',
      'images/coman.jpeg',
      'images/datavis.jpg',
      'images/designpattern.jpg',
      'images/emberjs.jpg',
      'images/ionic.jpg',
      'images/es6.jpg',
      'images/iot.jpg'
    ];
  }

  getAll(){
    let defer = $q.defer();

    if (!books) {
      defer.resolve({data: getBooks});
    }else{
      defer.reject({message:"things are broken!!"});
    }

    return defer.promise;
  }

  getCategories(){
    let defer = $q.defer();

    getAllFromServer().then(success, error);

    success(response){
      let books = response.data;
      let categories = books.map(function(book){
        return book.category;
      });

      defer.resolve(categories);
    }

    error(err){
      defer.reject({message: Config.Errors.NoCategory});
    }

    return defer.promise;
  }

  getBook(bookId){
    let url = Config.BooksUrl + '/' + bookId;
    return $http.get(url);
  }

  addBook(book){
    return $http.post(Config.AddBookUrl, book);
  }
}

bookfactory.$inject = ['$q', '$http', 'Config'];
