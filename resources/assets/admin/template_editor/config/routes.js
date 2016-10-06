angular.module('template_editor').config(function($stateProvider, $urlRouterProvider, $httpProvider) {

 
  $stateProvider

  .state('root.template_editor', {
  	url: "template_editor/:tid",
  	views: {
  		'content@root': { templateUrl: "/admin/template_editor.view.html" }
  	},
  	params: {
  		headerTitle: 'Template Editor'
  	}
	      // controller: 'rootCtrl'

	  })

});
