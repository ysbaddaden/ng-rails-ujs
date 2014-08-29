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
angular.module("rails.ujs")
  .directive("confirm", function () {
    return {
      restrict: "A",
      priority: 0,
      require: ["?method", "?remote", "?disableWith"],

      link: function (_, element, attr, ctrls) {
        function railsConfirm(event) {
          var cancelled = !window.confirm(attr.confirm);

          for (var i = 0; i< ctrls.length; i++) {
            var ctrl = ctrls[i];
            if (ctrl && ctrl.cancel) ctrl.cancel(cancelled);
          }
          if (!cancelled) return;

          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
        }

        element.on("click", railsConfirm);
        element.on("$destroy", function () {
          element.off("click", railsConfirm);
        });
      }
    };
  });
angular.module("rails.ujs")
  .directive("disableWith", function () {
    function RailsConfirmCtrl() {}

    RailsConfirmCtrl.prototype.cancel = function (value) {
      this.cancelled = !!value;
    };

    RailsConfirmCtrl.prototype.setElement = function (element) {
      this.element = element;
    };

    RailsConfirmCtrl.prototype.isButton = function () {
      var nodeName = this.element.prop("nodeName");
      return nodeName === "INPUT" || nodeName === "BUTTON";
    };

    RailsConfirmCtrl.prototype.disable = function (text) {
      if (this.isButton()) {
        this.original = this.element.val();
        this.element.val(text);
      } else {
        this.original = this.element.text();
        this.element.text(text);
      }
      this.element.attr("disabled", true).addClass("disabled");
    };

    RailsConfirmCtrl.prototype.reset = function () {
      if (this.isButton()) {
        this.element.val(this.original);
      } else {
        this.element.text(this.original);
      }
      this.original = null;
      this.element.removeAttr("disabled").removeClass("disabled");
    };

    return {
      restrict: "A",
      priority: 90,
      controller: RailsConfirmCtrl,

      link: function (_, element, attr, ctrl) {
        ctrl.setElement(element);

        function railsDisableWith() {
          if (ctrl.cancelled) return;
          ctrl.disable(attr.disableWith);
        }

        element.on("click", railsDisableWith);
        element.on("$destroy", function () {
          element.off("click", railsDisableWith);
        });
      }
    };
  });
angular.module("rails.ujs")
  .directive("method", function (csrf) {
    function template(attr) {
      return '<form action="' + attr.href + '" method="post">' +
             '  <input type="hidden" name="' + csrf.param + '" value="' + csrf.token + '"/>' +
             '  <input type="hidden" name="_method" value="' + attr.method.toUpperCase() + '"/> ' +
             '</form>';
    }

    function RailsMethodCtrl() {}

    RailsMethodCtrl.prototype.cancel = function (value) {
      this.cancelled = !!value;
    };

    return {
      restrict: "A",
      priority: 92,
      controller: RailsMethodCtrl,

      link: function(_, element, attr, ctrl) {
        if (element.prop("nodeName") !== "A") return;

        function railsMethod(event) {
          if (ctrl.cancelled) return;
          event.preventDefault();

          var form = angular.element(template(attr))[0];
          document.body.appendChild(form);
          form.submit();
        }

        element.on("click", railsMethod);
        element.on("$destroy", function () {
          element.off("click", railsMethod);
        });
      }
    };
  });
angular.module("rails.ujs")
  .directive("remote", function () {

    function RailsRemoteCtrl($scope, $http) {
      this.scope = $scope;
      this.http = $http;
    }

    RailsRemoteCtrl.prototype.cancel = function (cancelled) {
      this.cancelled = cancelled;
    };

    RailsRemoteCtrl.prototype.request = function (attr) {
      var self = this;
      var method = attr.method ? attr.method.toLowerCase() : "get";

      return this.http[method](attr.href).then(
        function (response) {
          return self.scope.success({ response: response, data: response.data });
        },
        function (response) {
          return self.scope.failure({ response: response });
        }
      );
    };

    return {
      restrict: "A",
      priority: 91,
      scope: {
        success: "&remoteSuccess",
        failure: "&remoteFailure",
      },
      controller: ["$scope", "$http", RailsRemoteCtrl],
      require: ["remote", "?method", "?disableWith"],

      link: function (_, element, attr, ctrls) {
        var ctrl = ctrls[0],
            methodCtrl = ctrls[1],
            disableWithCtrl = ctrls[2];

        function railsRemote(event) {
          if (ctrl.cancelled) return;
          if (methodCtrl) methodCtrl.cancel(true);

          var request = ctrl.request(attr);
          if (disableWithCtrl) {
            request.then(function () {
              disableWithCtrl.reset();
            });
          }
          event.preventDefault();
        }

        element.on("click", railsRemote);
        element.on("$destroy", function () {
          element.off("click", railsRemote);
        });
      }
    };
  });
