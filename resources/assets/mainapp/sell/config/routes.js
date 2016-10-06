angular.module('sell').config(function($stateProvider, $urlRouterProvider, $httpProvider) {

 
  $stateProvider

  .state('root.sell', {
  	url: "sell/:tname/:tid/:section_no",
  	views: {
  		'content@root': { templateUrl: "/mainapp/templateform.view.html" }
  	},
  	params: {
  		headerTitle: 'Just sell it!'
  	}
	      // controller: 'rootCtrl'
 
	  })

});
