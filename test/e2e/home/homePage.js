module.exports = function(){
  this.books = element.all(by.repeater('book in vm.books'));
  this.searchFor = function(value){
    return element(by.model('title')).sendKeys(value);
  };

  this.addNewBook = function(){
    element(by.css('.btn-floating.btn-large.waves-effect.waves-light')).click();
  };
};
