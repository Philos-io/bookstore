export default class BookController{
  constructor($location, $log, $timeout, bookfactory, toaster){
    bookfactory.getAll()
    .then((response)=>{
      this.books = response.data;
    }, () => {
      $log.error('something weird happened');
    });

    this.covers = bookfactory.getCovers();
  }

  pop(args){
    toaster.pop(args.type, '', args.message);
  }

  addBook(){
    let book = {
      title: vm.book.title,
      cover: vm.book.selectedCover,
      author: vm.book.author,
      price: vm.book.price,
      description: vm.book.description
    };

    bookfactory.addBook(book)
    .then((response) => {
      this.books = response.data;

      let options = {
        type: 'success',
        title: 'Add Book',
        message: 'New Book Added with success'
      };
      this.pop(options);

      $timeout(() => {
        $location.path('/books');
      }, 3000);
    });
  };
}

BookController.$inject = ['$location', '$log', '$timeout', 'bookfactory', 'toaster'];


