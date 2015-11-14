import shellTemplate from './main.html';

export default function books(){
  return {
    controller: 'BookController',
    controllerAs: 'vm',
    template: shellTemplate
  }
}
