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
