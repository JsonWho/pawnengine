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





'use strict';

angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleDependencies);

angular.element(document).ready(function() {

	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);

});
ApplicationConfiguration.registerModule('header');
ApplicationConfiguration.registerModule('home');
'use strict';

angular.module('header').controller('headerController',['$scope','$http', function($scope, $http) {

var vm = this;

}]);

'use strict';

angular.module('home').controller('homeController',['$scope','$http', function($scope, $http) {

var vm = this;

$scope.splitToArr = function(c) {

	var arr = c.condition.split(',');
	return {

		index: arr[0],
		op: arr[1],
        optval: arr[2],
        behavior: arr[3]

	}

}

 vm.template = {

 			id:0,
 			title:'Macbook Pro',



			containers: [
			{
				id:0,
				title: 'Condition',
				child_containers: [

					{
						id: 1,
						title: 'Is your item new or used ?',
						options:[
									{
										id:0, type:'radiogroup', text:'select an option',  group:'itemcon', value: null,
										option_values: [{id:0, text:'item is new', value: 0 }, {id:1, text:'item is used', value: 1}]
									}

						],

				child_containers: [

					{
						id: 2,
						title: 'Rate the condition',
						condition:'0,=,1,show',
						options:[

									{
										id:1, type:'select', text:'select an option',  group: null, value: null,
										option_values: [{id:2, text:'poor', value: 2 }, {id:3, text:'good', value: 3}]
									}

							]
					}

						]

					}
				]
			}
		]






	// option_sections: {

	// 	title:'Section 1',
	// 	containers: [
	// 		{
	// 			id:0,
	// 			title: 'Condition',
	// 			child_containers: [

	// 				{
	// 					id: 1,
	// 					title: 'Is your item new or used ?',
	// 					options:[
	// 								{id:0, type:'radio', text:'item is new',  group:'itemcon' value: true},
	// 								{id:0, type:'radio', text:'item is used', group:'itemcon' value: false}
	// 					]

	// 				}
	// 			]
	// 		}
	// 	]



	// }

}





	function getTemplate() {

		$http.get('/templates/' + 1 ).then(

				function(res) {

					vm.template = res.data;

			},
				function() {


			});
	}


	// getTemplate();


}]);
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

//# sourceMappingURL=app.js.map
