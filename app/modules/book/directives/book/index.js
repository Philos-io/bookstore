import bookTemplate from './book.html';

export default function bsBook(){
  return {
    restrict: 'E',
    scope: {
      model: '='
    },
    template: bookTemplate
  };
}

bsBook.$inject = [];

