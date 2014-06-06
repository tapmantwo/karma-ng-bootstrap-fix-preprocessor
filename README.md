karma-ng-bootstrap-fix-preprocessor
===================================

Preprocessor that adds ng-app tags to the served document if manually bootstrapped.

Why?
====
If you have an angular application where you manually bootstrap the module (i.e. call angular.bootstrap instead of putting a ng-app tag somewhere in your application), you will likely find that any tests that run with the ng-scenario library through karma will fail.  This is because ng-scenario doesn't seem to play nicely with manually bootstrapped pages.

See; http://stackoverflow.com/questions/15499997/how-to-use-angular-scenario-with-requirejs or https://github.com/karma-runner/karma/issues/422 for more information.

Why manually bootstrap? If you are using a loader to load remote modules through something like $script (tested) or RequireJS for example, you'll want to the bootstrapping to wait until all dependencies are loaded.

What does it do?
================
It turns out the issue is that ng-scenario looks for the ng-app statement to determine the root of the application.  As such, the 'fix' is to manually append a ng-app statement after your bootstrap call - so maybe something like this;


```
angular.bootstrap(document, ["my.module"]);
try {
   $(document.body).attr("ng-app", "my.module");
} catch(e){};
```

However, this sucks.  We don't need the stuff inside the try block for normal execution, only for the tests to run.  So to avoid this bleeding out into production, you can use this preprocessor, which searches for any calls to angular bootstrap,  takes the module name out of the call, and writes out the ng-app statement (the bit in the try block) to the page for you.

To set it up, modify your karma config file to include this preprocessor for your html pages;

```
 preprocessors: { "**/*.html": ['ngbootstrapfix'] },
```
