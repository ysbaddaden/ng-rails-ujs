describe("remoteDirective", function () {
  var TEMPLATE = '<a href="/posts/1" id="load"' +
                 '  data-remote="true"' +
                 '  remote-success="ok(data, response)"' +
                 '  remote-failure="fail(response)"></a>' +

                 '<a href="/posts/1/like" id="like"' +
                 '  data-remote="true"' +
                 '  data-method="post"></a>' +

                 '<a href="/posts/1/like" id="disable"' +
                 '  data-remote="true"' +
                 '  data-method="post"' +
                 '  data-disable-with="liking..."></a>';

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

  it("loads a link through $http", inject(function ($httpBackend) {
    var data, response;
    this.scope.ok = function (d, r) {
      data = d;
      response = r;
    };
    $httpBackend.expectGET("/posts/1").respond(200, { title: "Post 1" });

    find("load").triggerHandler("click");
    $httpBackend.flush();
    assert.equal(200, response.status);
    assert.equal("Post 1", data.title);
  }));

  it("fails to load a link", inject(function ($httpBackend) {
    var response;
    this.scope.fail = function (r) {
      response = r;
    };
    $httpBackend.expectGET("/posts/1").respond(404);

    find("load").triggerHandler("click");
    $httpBackend.flush();
    assert.equal(404, response.status);
  }));

  it("uses method and cancels the default remote directive", inject(function ($httpBackend) {
    $httpBackend.expectPOST("/posts/1/like").respond(201);
    find("like").triggerHandler("click");
    $httpBackend.flush();
  }));

  it("talks to disable-with directive", inject(function ($httpBackend) {
    var like = find("disable");
    $httpBackend.expectPOST("/posts/1/like").respond(201);

    like.triggerHandler("click");
    assert.equal("liking...", like.text());

    $httpBackend.flush();
    assert.empty(like.text());
  }));
});
