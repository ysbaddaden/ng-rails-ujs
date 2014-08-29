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
