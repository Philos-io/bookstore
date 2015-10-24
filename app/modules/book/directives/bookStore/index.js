import bookStoreTemplate from './bookstore.html';

export default function bookStore(){
  return {
    restrict: 'E',
    template: bookStoreTemplate
  };
}
bookStore.$inject = [];

