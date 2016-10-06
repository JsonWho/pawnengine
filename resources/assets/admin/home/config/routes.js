angular.module('home').config(function($stateProvider, $urlRouterProvider, $httpProvider) {

 
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/");
  //
  $stateProvider

  .state('root', {
  	url: "/",
  	views: {
  		'root': {templateUrl: "/admin/primary.view.html" },
  		'header@root': { templateUrl: "/admin/header.view.html" },
  		'content@root': { templateUrl: "/admin/home.view.html" }
  	},
  	params: {
  		headerTitle: 'Overview'
  	},
	      // controller: 'rootCtrl'

	  })

});
