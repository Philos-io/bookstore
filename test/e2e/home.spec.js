describe('BookStore Application', function() {
  var url = 'http://localhost:8080/#/';
  beforeEach(function(){
    browser.get(url);
  });

  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('Bookstore by Philos');
  });

  it('should do a search on book', function(){
    element(by.model('title')).sendKeys('javascript');
    var result = element.all(by.repeater('book in vm.books'));

    browser.debugger();

    expect(result.count()).toEqual(1);
  });
});
