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
