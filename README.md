# Angular Rails UJS

AngularJS directives that implement Rails Unobstrusive JavaScript (UJS) that
don't depend on jquery or jquery-ujs.

## Install

First add ngRailsUJS to your Rails project, for example as a bower dependency:

```
$ bower install --save ng-rails-ujs
```

Require it in `app/assets/javascripts/application.js` and declare it to your
application:

```javascript
//= require ng-rails-ujs

angular.module("myapp", ["rails.ujs"]);
```

## Usage

Only a subset of UJS has currently been implemented, and due to the nature of
Angular directives, some functionality has been changed. For instance the `remote`
directive won't trigger the `ajax:*` DOM events, but instead eval the
`remoteSuccess` and `remoteFailure` attributes, passing along the `response` and
`data` variables.

For example:

```javascript
$scope.success = function (response, data) {
  // ...
};

$scope.error = function (response) {
  // ...
};
```

```eruby
<%= link_to "publish", publish_path, :remote => true,
  "remote-success" => "success(response, data)",
  "remote-failure" => "error(response)",
%>
```

## LICENSE

Distributed under the MIT license.
