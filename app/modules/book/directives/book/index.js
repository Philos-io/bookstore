import bookTemplate from './book.html';

export default function bsBook(){
  return {
    restrict: 'E',
    scope: {
      model: '='
    },
    templateUrl: 'templates/book.html'
  };
}

bsBook.$inject = [];

