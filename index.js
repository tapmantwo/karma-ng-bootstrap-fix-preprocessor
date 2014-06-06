var ngBootStrapFixPreprocessor = function(args, config, logger, helper) {
  config = config || {};

  var log = logger.create('preprocessor.ngbootstrapfix');

  return function(content, file, done) {
    var result = null;
    var map;
    var datauri;

    log.debug('Processing "%s".', file.originalPath);
    try {
        var bootstrapSearch = /(angular.bootstrap\()(.+)(\);)/igm;
        var matches = bootstrapSearch.exec(content);
        if (matches) {
            var moduleNameSearch = /(\[)(.+)(\])/;
            var moduleName = moduleNameSearch.exec(matches[2]);
            if ( moduleName ) {
                var replacement = matches[0] + '\r\ntry {$(document.body).attr("ng-app",' + moduleName[2] + ');} catch(e){};\r\n';
                result = content.replace(bootstrapSearch, replacement);
                result = result + "<!-- The content of this file has been modified by the ng-bootstrap-fix (tm) preprocessor. Enjoy! -->"
            }
        } else {
            result = content;
        }
    } catch (e) {
        log.error('%s\n  at %s:%d', e.message, file.originalPath, e.location.first_line);
        return done(e, null);
    }

    done(null, result);
  };
};

ngBootStrapFixPreprocessor.$inject = ['args', 'config', 'logger', 'helper'];

// PUBLISH DI MODULE
module.exports = {
  'preprocessor:ngbootstrapfix': ['factory', ngBootStrapFixPreprocessor]
};