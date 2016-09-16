'use strict';

var ApplicationConfiguration = (function() {

var ApplicationModuleName = 'pawnengine';
var ApplicationModuleDependencies = ['ngMaterial','ui.router'];

var registerModule = function(moduleName, moduleDependencies) {

  angular.module(moduleName, moduleDependencies || []);

  angular.module(ApplicationModuleName).requires.push(moduleName);
}


  return {

    applicationModuleName : ApplicationModuleName,
    applicationModuleDependencies : ApplicationModuleDependencies,
    registerModule : registerModule
  };


})();




