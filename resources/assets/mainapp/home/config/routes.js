angular.module('home').config(function($stateProvider, $urlRouterProvider, $httpProvider) {

 
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/");
  //
  $stateProvider

  .state('root', {
  	url: "/",
  	views: {
  		'root': {templateUrl: "/mainapp/primary.view.html" },
  		'header@root': { templateUrl: "/mainapp/header.view.html" },
  		'content@root': { templateUrl: "/mainapp/home.view.html" }
  	},
  	params: {
  		headerTitle: 'Just sell it!'
  	},
	      // controller: 'rootCtrl'

	  })

});
