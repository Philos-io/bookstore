export default class BookDetailsController {
  constructor($route, $log, bookfactory){
    let bookID = $route.current.params.bookID;

    bookfactory.getBook(bookID).then((response) => {
      this.book = response.data;
    });

    bookfactory.getCategories(categories).then(()=>{
      $log.infog(categories);
      this.categories = categories;
    });
  }
}

BookDetailsController.$inject = ['$route', '$log', 'bookfactory'];
