'use strict';

angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleDependencies);

angular.element(document).ready(function() {

	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);

});