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
