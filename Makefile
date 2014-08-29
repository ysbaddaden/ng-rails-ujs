.PHONY: test

all:
	cat src/module.js \
	    src/confirm-directive.js \
	    src/disable-with-directive.js \
	    src/method-directive.js \
	    src/remote-directive.js \
	    > ng-rails-ujs.js

test:
	./node_modules/.bin/mocha-phantomjs test/index.html

