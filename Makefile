.PHONY: test

all:
	cat src/module.js \
	    src/confirm-directive.js \
	    src/disable-with-directive.js \
	    src/method-directive.js \
	    src/remote-directive.js \
	    > ng-rails-ujs.js
	./node_modules/.bin/uglifyjs ng-rails-ujs.js --mangle > ng-rails-ujs.min.js

test: all
	./node_modules/.bin/mocha-phantomjs test/index.html
	./node_modules/.bin/mocha-phantomjs test/minimized.html

