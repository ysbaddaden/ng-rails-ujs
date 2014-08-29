describe("disableWithDirective", function () {
  var TEMPLATE = '<a href="/posts/1" id="link" data-disable-with="loading..." ng-click=""></a>' +
                 '<form ng-submit="">' +
                 '  <input type="submit" id="input" data-disable-with="creating..."/>' +
                 '  <button id="button" data-disable-with="cancelling..."/>' +
                 '</form>';

  beforeEach(module("rails.ujs"));

  beforeEach(inject(function ($rootScope, $compile) {
    this.scope = $rootScope.$new();

    this.element = angular.element(TEMPLATE);
    $compile(this.element)(this.scope);
    angular.element(document.body).append(this.element);

    $rootScope.$digest();
  }));

  afterEach(inject(function ($httpBackend) {
    this.element.remove();
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  }));

  var find = function (id) {
    return angular.element(document.getElementById(id));
  };

  it("replaces a link text", function () {
    var link = find("link");
    link.triggerHandler("click");
    assert.equal("loading...", link.text());
  });

  it("replaces an input text", function () {
    var input = find("input");
    input.triggerHandler("click");
    assert.equal("creating...", input.val());
  });

  it("replaces a button text", function () {
    var button = find("button");
    button.triggerHandler("click");
    assert.equal("cancelling...", button.val());
  });
});
