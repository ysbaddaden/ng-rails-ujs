function read(name) {
  var meta = document.querySelector("meta[name='csrf-" + name + "']");
  if (meta) {
    return meta.getAttribute("content");
  }
}

angular.module("rails.ujs", [])
  .service("csrf", function () {
    Object.defineProperties(this, {
      param: { get: function () { return read("param"); } },
      token: { get: function () { return read("token"); } }
    });
  })
  .config(function ($httpProvider) {
    $httpProvider.defaults.headers.common["X-CSRF-Token"] = read("token");
  });
