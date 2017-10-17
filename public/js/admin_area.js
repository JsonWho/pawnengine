'use strict';

var ApplicationConfiguration = (function() {

var ApplicationModuleName = 'pawnengine_admin';
var ApplicationModuleDependencies = ['ngMaterial','ui.router','ngMessages'];

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
ApplicationConfiguration.registerModule('template_editor');

'use strict';

angular.module('header').controller('headerController',['$scope','$http', function($scope, $http) {

var vm = this;

}]);

'use strict';

angular.module('pawnengine_admin').controller('rootController',['$scope','$http','$mdDialog', function($scope, $http, $mdDialog) {

var vm = this;

  $scope.showConfirm = function(ev, title) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title(title)
          .ariaLabel('Delete Input')
          .targetEvent(ev)
          .ok('OK')
          .cancel('Cancel');

    return $mdDialog.show(confirm);

}



}])

.directive('validateregex', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.validateregex = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          // consider empty models to be valid
          return true;
        }

        if (viewValue) {
          
                var isValid = true;
                
				try {
				    new RegExp(viewValue);
				} catch(e) {
				    isValid = false;
				}

				return isValid;          
        }

        // it is invalid
        return false;
      };
    }
  };
});

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

'use strict';

angular.module('home').controller('homeController',['$scope','$http', function($scope, $http) {


}]);
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



	function containerDialogController($scope, $mdDialog, container, section, active_section, $q) { 

		$scope.container = container;

		$scope.cancel = function() {
			$mdDialog.cancel();
		};


		$scope.initTemplate = function() {

			if(container && !$scope.con_temp) {

				$scope.max_position = section.containers.length;
				$scope.con_temp  = angular.copy(container);
				$scope.isUpdate = true;

			} else if(!$scope.con_temp) {

				var position = section.containers.length + 1;
				$scope.max_position = position;
				$scope.total_containers = $scope.total_containers + 1;

				$scope.con_temp = { 
					title: 'New Container' ,
					position: position,
					conditions: {target_input_conditions:[], input_check_rule: null }

				};

			}
		}


		$scope.initTemplate();


		var callBackFunc = function callBackFunc(someobj) {

			console.log('running' + someobj);
		}



//container general controls
		$scope.changePosition = function(con_temp) {

			$scope.conflict_message = undefined;

			if(con_temp && con_temp.position <= section.containers.length  && con_temp.position >= 1) {

			   var newindex = con_temp.position - 1;

				//start of condition check logic for container above and under the container changing positions

				//check if conditions on container under with bigger position value reference the container being moved
				if(con_temp.position > container.position) {

					var con_under = section.containers[newindex];
					if(con_under.conditions) {

						var target_input_conditions = con_under.conditions.target_input_conditions;

						for(var i = 0; i < target_input_conditions.length; i++) {

							if(target_input_conditions[i].container_id == container.id ) {

								$scope.conflict_message = 'This container is referenced by conditions on the container below';
								con_temp.position = container.position;
								setTimeout(function() { $scope.conflict_message = null; $scope.$apply(); }, 5000);
								return;
							}

						}
					}

				//check container above, with smaller position value against conditions on container being moved.
				} else if (container.conditions) {

					var con_above = section.containers[newindex];

					var target_input_conditions = container.conditions.target_input_conditions;

					 for(var i = 0; i < target_input_conditions.length; i++) {

							if(target_input_conditions[i].container_id == con_above.id ) {

								$scope.conflict_message = 'The conditions on this container reference the container above';
								con_temp.position = container.position;
								setTimeout(function() { $scope.conflict_message = null; $scope.$apply(); }, 5000);

								return;
							}

						}


				}
				//End of condition check


				section.containers.splice((container.position - 1), 1);
				section.containers.splice(newindex, 0, container);
				vm.update_position_fields(section.containers);


			}
				con_temp.position = container.position;

				callBackFunc();

		}





		// $scope.selected_check = function (obj, prop_name, model_name) {

		//   if($scope.current_state == 'edit') {

		// 	 if(obj.id == $scope.temp_cond[prop_name]) {

		// 					$scope[model_name] = obj;
		// 		}
		// 	 }
		// }


		$scope.clear_edit_objects = function() {

			$scope.temp_cond = undefined;
			$scope.current_state = null;
		}



		$scope.getValidSections = function getValidSections() {

			var valid_sections = template.sections.filter(function(itm, idx) {

				if(itm.count <= active_section) { 

					if($scope.current_state == 'edit' && !$scope.selected_section) {

						if(itm.id == $scope.temp_cond.section_id) {

							$scope.selected_section = itm;
						}
					} 

					return true; 

				}

			});

			$scope.valid_sections = valid_sections;
		}


	


	    $scope.getValidContainers = function getValidContainers(selected_section) {

	        if(!$scope.selected_section) $scope.selected_section = selected_section;

	    	if(!$scope.selected_section) return;

			var valid_containers = $scope.selected_section.containers.filter(function(itm, idx) {

				if($scope.selected_section.count < active_section ||  itm.position < $scope.con_temp.position) { 

	 
					   if($scope.current_state == 'edit' && !$scope.selected_container) {

							if(itm.id == $scope.temp_cond.container_id) {

								$scope.selected_container = itm;
							}
						} 


						return true; 

					}


				}

			);

			$scope.valid_containers = valid_containers;
		}




		$scope.getValidInputs = function getValidInputs() {

	    	if(!$scope.selected_container) return;

			var valid_inputs = $scope.selected_container.inputs;

		if($scope.current_state == 'edit' && !$scope.selected_input) {

			valid_inputs.filter(function(itm, idx) {


				if(itm.id == $scope.temp_cond.input_id) {

					$scope.selected_input = itm;
				}
					

			});
		}

			$scope.valid_inputs = valid_inputs;
		}


		function init_dropdown_lists() {

			$scope.getValidSections();
			$scope.getValidContainers();
			$scope.getValidInputs();

		}


		$scope.edit_condition = function(condition) {

				$scope.current_state = 'edit';
				$scope.temp_cond = condition;
				init_dropdown_lists();

		}


		$scope.new_condition = function() {

			$scope.temp_cond = {};
			// init_dropdown_lists();
			$scope.getValidSections();
		}



		$scope.setRule = function(rule) {

			$scope.temp_cond.input_value_check_rule = rule;
		}


	    $scope.setTestValue = function(value, checked_value) {

	    	if(!checked_value) {

	    		checked_value = null; 
	    		$scope.temp_cond.test_value = null;
	    		return;
	    	}

			$scope.temp.condition.test_value = value;
		}


		$scope.allowNotInArrayCheckBoxState = function() {

			if($scope.temp_cond.test_array && $scope.temp_cond.test_array.length > 0 && $scope.temp_cond.test_array.length < $scope.selected_input.options.length) {

				return false;
			} else {

				$scope.temp_cond.allow_notinarray = null;
				return true;
			}


		}

		$scope.setAllowNotInArrayCheckbox = function() {

			if(!$scope.notInArrayCheckboxIsSet && $scope.temp_cond.allow_notinarray === null ) {

			   $scope.notInArrayCheckboxIsSet = true;
			   $scope.temp_cond.allow_notinarray = true;

			}

		}



		$scope.addCondition = function(con) {

			var conditions = $scope.con_temp.conditions.target_input_conditions;

			var existing_idx;
			var existing_con = conditions.find(function(c, idx){

			    existing_idx = idx;
				return c.input_id == con.input_id;

			});

			if(existing_con) {

				conditions[existing_idx] = con;
			}

			else {

				conditions.push(con);

			}
		}


		$scope.addContainer = function() {

			if($scope.isUpdate) {

				var idx = $scope.con_temp.position - 1;
				section.containers[idx] = $scope.con_temp;

			} else {

				$scope.con_temp.id = UUID.generate();
				// container = $scope.con_temp;
				section.containers.push($scope.con_temp);
				$scope.isUpdate = true;
			}


		}



	}

	function addInputDialogController($scope, $mdDialog, $mdToast, container, input) {

		$scope.container = container;

		$scope.input_types = [{name:'radiogroup', dname: 'radio group'},{name:'checkbox', dname: 'Checkbox'},{name:'text', dname: 'Text'} ,{name:'select', dname: 'Select list'},{ name:'multiselect', dname: 'Muli-Select list'},{ name:'date', dname: 'Date'}];


		$scope.initTemplate = function() {

			if(input && !$scope.newinput) {
				$scope.max_position = container.inputs.length;
				$scope.newinput  = angular.copy(input);
				$scope.isUpdate = true;

			} else if(!$scope.newinput) {

				if(!container.inputs) container.inputs = [];
				var position = container.inputs.length + 1;
				$scope.max_position = position;
				$scope.total_inputs = $scope.total_inputs + 1;

				$scope.newinput = { 
					type: 'checkbox' ,
					value: null,
					position: position

				};

			} else {

				$scope.newinput.value = null;

			}





			//upon input type change if non array value exists, it's pushed into an array. 
			if($scope.newinput.type == 'multiselect') {

				var copy;

				$scope.temp = {};

				if($scope.newinput.value && !Array.isArray($scope.newinput.value)) {

					copy = angular.copy($scope.newinput.value);
				}

				if(!$scope.newinput.value || !Array.isArray($scope.newinput.value)) $scope.newinput.value = [];


				if(copy) { $scope.newinput.value = $scope.newinput.value.push(copy); }


			}



			$scope.active_option =  {};		  	          
			$scope.newinput.options = $scope.newinput.options ? $scope.newinput.options : [];

			$scope.get_max_option_position = function get_max_option_position() {

			   return $scope.newinput.options.length;

			}

		}


		$scope.initTemplate();


		$scope.cancel = function() {
			$mdDialog.cancel();
		};


		$scope.addInput = function(ev, newinput, update) {


			$scope.input_form.$setSubmitted();

			if($scope.input_form.$valid && $scope.constraints.$valid && $scope.option_form.$valid) {

				var input_type = $scope.newinput.type;
				var inputs_with_options = ['select','multiselect','radiogroup'];


				    	    // if(input_type == 'select') {

				    	    // 	if(!selected_value) { $scope.newinput.value == null; }
				    	    // 	else {

				    	    // 		newinput.value = selected_value;
				    	    // 	}
				    	    // }


				    	    if(newinput.attributes && newinput.attributes['pattern']) { 


				    	    	// newinput.pattern = new RegExp(escapeStringRegExp(newinput.pattern.toString())); 

				    	    	var inputstring = newinput.attributes['pattern'].toString();
				    	    	var flags = inputstring.replace(/.*\/([gimy]*)$/, '$1');
				    	    	var pattern = inputstring.replace(new RegExp('^/(.*?)/'+flags+'$'), '$1');
				    	    	var regex = new RegExp(pattern, flags);

				    	    	newinput.attributes['pattern'] = regex;

				    	    }


				    	    if(!inputs_with_options.includes(input_type)) {

				    	    	delete newinput.options;
				    	    }


				    	    if(!update) {

				    	    	var index = newinput.position ? (newinput.position - 1) : container.inputs.length;
				    	    	newinput.id = UUID.generate();
				    	    	container.inputs.splice(index, 0 , newinput);
				    	    	$scope.newinput = { type: input_type };
				    	    	$scope.input_form.$setPristine(true);
				    	    	$scope.input_form.$setUntouched(true);


				    	    } else if(update) {

				    	    	angular.copy($scope.newinput, input);

				    	    }

				    	    $scope.newinput.options = [];


				    	} else {

				    			$mdToast.showSimple('Validation Error');
				    	}



				    }


				    $scope.changePosition = function(newinput) {


				    	var position = newinput.position - 1;

				    	if(input && position <= container.inputs.length) {

				    		container.inputs.splice((input.position - 1), 1);
				    		container.inputs.splice(position, 0, input);
				    		input.position = (position + 1);
				    	}
				    }




		    //option functions
		    $scope.addOption = function() {

		    	if($scope.option_form.option_text.$invalid) return;

		    	var copy = angular.copy($scope.active_option);

		    	copy.uid = UUID.generate();
		    	delete copy['$$mdSelectId'];
		    	delete copy['id'];



		    	$scope.newinput.options.push(copy);
		    	$scope.active_option = {};
		    	$scope.selectedOption = {};

		    	if($scope.newinput.type == 'select') {

		    		$scope.newinput.value = copy.uid;

		    	}

		    	else if($scope.newinput.type == 'multiselect') {

		    		$scope.temp.current_value = copy;

		    	}



		    	$scope.setOption(copy);
		    }


		    //for select list to display mark or style for select option
		    $scope.checkIfSelected = function(opt) {
		    	if(!opt) return false;

		    	var query = opt.uid || opt.id;
		    	return $scope.newinput.value.includes(query);
		    }

		    //toggle checkbox and remove or add value in value array
		    $scope.toggleSelected = function(optionSelected) {


		    	var value = $scope.selectedOption.uid || $scope.selectedOption.id;


		    	if(optionSelected) {

		    		$scope.newinput.value.push(value);
		    	// $scope.optionSelected = true;

		    }	else {

		    	$scope.newinput.value = $scope.newinput.value.filter(function(itm, idx) {

		    		return itm !== value; 

		    	});


		    	  // $scope.optionSelected = false;


		    	}

		    // 	if(!$scope.active_option.selected) {

		    // 	$scope.newinput.value.push($scope.selectedOption.value); 

		    // 	} else {

		    // 	$scope.newinput.value = $scope.newinput.value.filter(function(itm, idx) {

		    // 		return itm !== $scope.current_value; 

		    // 	});


		    // }
		}



		$scope.setOption = function(op) {

			if(!op) return;

		    vm.update_position_fields($scope.newinput.options);
			var query = op.uid || op.id;
			var option = $scope.newinput.options.find(function(opt) {
				var id = opt.uid || opt.id;
				return id == query;
			});

			$scope.active_option = angular.copy(option);
			$scope.selectedOption = option;
			if($scope.temp && $scope.temp.current_value) $scope.temp.current_value = option;
		}






		$scope.updateOption = function() {

			if($scope.option_form.option_text.$invalid) return;

			if($scope.selectedOption) {


				angular.copy($scope.active_option, $scope.selectedOption );

			}
		}



		$scope.deleteOption = function() {

			var opt_id = $scope.selectedOption.id;
			var opt_pos = $scope.selectedOption.position;

			var index = $scope.selectedOption.position - 1;
			$scope.newinput.options.splice(index, 1 );
			$scope.selectedOption = undefined;
			if(!Array.isArray($scope.newinput.value)) {

			 	$scope.newinput.value = null;


			} else {

				$scope.newinput.value = $scope.newinput.value.filter(function(id, idx) {

					return id != opt_id;

				});

				// $scope.temp.current_value = null;

				//after delete set the next option after the deleted one, if deleted was last option, set the first.
				if($scope.newinput.options.length >= opt_pos) {

					$scope.setOption($scope.newinput.options[(opt_pos - 1)]);


					// $scope.temp.current_value = $scope.newinput.options[(opt_pos - 1)];

				} else if ($scope.newinput.options.length > 0 ) {

					// $scope.temp.current_value = $scope.newinput.options[0];

					$scope.setOption($scope.newinput.options[0]);

				}

			}

		}



		$scope.changeOptionPosition = function(active_option) {


			var index = $scope.selectedOption.position - 1;
			var new_index = active_option.position - 1;


			if(new_index <= ($scope.newinput.options.length - 1)) {

				$scope.newinput.options.splice(index, 1);
				$scope.newinput.options.splice(new_index, 0, $scope.selectedOption);
				$scope.selectedOption.position = (new_index + 1)		    	
			}
		}






		    //condition creation functions

		    $scope.getPreceding = function(position) {

		    	if(position > 1) {

		    		var preceding_inputs = container.inputs.filter(function(item, idx) {
		    			return item.position < position;
		    		});


		    		return preceding_inputs;

		    	}
		    }



		}
'use strict';

var UUID = (function() {
	var self = {};
	var lut = []; for (var i=0; i<256; i++) { lut[i] = (i<16?'0':'')+(i).toString(16); }
	self.generate = function() {

		var d0 = Math.random()*0xffffffff|0;

		return lut[d0&0xff]+lut[d0>>8&0xff]+lut[d0>>16&0xff]+lut[d0>>24&0xff];
	}

	return self;

})();





angular.module('template_editor').controller('templateEditorController',['$scope','$http','$state', '$mdDialog', function($scope, $http, $state, $mdDialog) {



	var vm = this;

	vm.template = template;

	var tid = $state.params.tid;
	var section_no = $state.params.section_no;
	$scope.inputs = [];

	vm.active_section = parseInt(section_no ? section_no : 1);

	vm.sectionActive = function(count) {

		return count == vm.active_section;
	}



	vm.showTipDialog = function(ev,tip) {

		$mdDialog.show({
			controller: tipDialogController,
			templateUrl: 'mainapp/tipdialog.tmp.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			locals: {tip:tip},
			clickOutsideToClose:true,
      fullscreen: false // Only for -xs, -sm breakpoints.
  });


	}


	vm.addEditInput = function(ev, cc, input) {

		$mdDialog.show({
			controller: addInputDialogController,
			templateUrl: 'admin/add_input.tmp.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			locals: {container:cc, input: input},
			clickOutsideToClose:true,
      fullscreen: false // Only for -xs, -sm breakpoints.
  });
	}



	vm.addEditContainer = function(ev, con, section) {

		$mdDialog.show({
			controller: containerDialogController,
			templateUrl: 'admin/add_edit_container.tmp.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			locals: {container: con, section: section, active_section: vm.active_section},
			clickOutsideToClose:true,
      fullscreen: false // Only for -xs, -sm breakpoints.
  });
	}



	vm.delInput = function($event, cc, $index) {

		var promise = $scope.showConfirm($event, 'Delete this input ?');

		promise.then(function() {

			cc.inputs.splice($index,1);


		}, function() {});

	}


	vm.del_container = function($event, $index, section) {

		var promise = $scope.showConfirm($event, 'Delete this container and its contents ?');

		promise.then(function() {

			section.containers.splice($index,1);


		}, function() {});

	}






	vm.checkEquality = checkEquality;
	vm.register_conditions = register_conditions;


	$scope.nextSection = function() {

		var isValid = true;
		var inputs = $scope.inputs;

		for(var i = 0; i < inputs.length; i++) {

			var input = vm.tForm[inputs[i]];

			if(input.$invalid && !input.$inputDisabled) {

				input.$setTouched();
				isValid = false;

			}
		}

		if(isValid) vm.active_section++;

		console.log(vm.tForm.$valid);

	}


	$scope.prevSection = function() {


		vm.active_section--;
		console.log(vm.tForm.$valid);

	}

	vm.createDateObject = function(inp) {

		if(!inp.value) { inp.value = new Date(); }
		else { inp.value = new Date(inp.value); }

		if(inp.attributes['minDate']) inp.attributes['minDate'] = new Date(inp.attributes['minDate']);
	    if(inp.attributes['maxDate']) inp.attributes['maxDate'] = new Date(inp.attributes['maxDate']);

	    return;
	}

	



	vm.returnPattern = function(pattern) {


	}



// function getPositionString(ploc) {

// 			return ploc + '-' + $index;
// 		}

vm.set_con_pos = function(con, $index, section, $sindex ) {

	var form = vm.tForm;
	var ploc = '';


	if(section && !section.count) { ploc = form['condata_'+pcon.id].position; }

	form['condata_'+con.id] = {

		position:  (function() { return ploc ? ( ploc + $index + '-') : ($sindex + '-' + $index + '-' ); })(),

	}

}







vm.condition_register = [];
//this register will be used to reference the condition object and accessed through object keys. When a container or input with dependant conditions is deleted,
//the dependant condition(s) registered for this container/input will be deleted. 

function register_conditions(con, secid) {

	
	var conditions = con.conditions.target_input_conditions;

	for(var i = 0; i < conditions.length; i++) {

		//register the target container, target input and dependant container and input
		//format target_section | target_container | target_input | dependant_section | dependant_container 
		var tc_id = conditions[i].container_id;
		var ti_id = conditions[i].input_id;
		var ts_id = conditions[i].section_id;

		var dc_id = con.id;
		var ds_id = secid;



			if(!vm.condition_register[ts_id]) vm.condition_register[ts_id] = {};
			if(!vm.condition_register[ts_id][tc_id]) vm.condition_register[ts_id][tc_id] = {};
		    if(!vm.condition_register[ts_id][tc_id][ti_id]) vm.condition_register[ts_id][tc_id][ti_id] = {};
		    if(!vm.condition_register[ts_id][tc_id][ti_id][ds_id]) vm.condition_register[ts_id][tc_id][ti_id][ds_id] = {};
		    if(!vm.condition_register[ts_id][tc_id][ti_id][ds_id][dc_id]) {

		    	vm.condition_register[ts_id][tc_id][ti_id][ds_id][dc_id] = {};
		    	vm.condition_register[ts_id][tc_id][ti_id][ds_id][dc_id]['con'] = conditions[i];
		    };




		

	}

}







function checkEquality(cc) {

	//cc - current container
	//co - conditin object

	if(!cc || !cc.conditions || cc.conditions.target_input_conditions.length === 0) return true;

	var coArr = cc.conditions.target_input_conditions;
	var inputRules = cc.conditions.input_check_rule;
	var cIdentifier = 'container_'+cc.id+'_show';
	var displayContainer = checkContainerConditions(coArr,cc,inputRules);

		//return if whether container should be visible
		if(displayContainer) {

			vm.tForm[cIdentifier] = true;

			//show ?
			return true;
		}
		else {

			vm.tForm[cIdentifier] = displayContainer;
			//show ?
			return displayContainer;
		}


	}

	function checkContainerConditions(coArr,cc,inputRules) {


		var trueCount = 0;
		var falseCount = 0;

		var displayContainer;

		$scope.thisIsParent = true;

		//check each condition object for container and evaluate expected values specified in condition against those which the 'controller input' model is set to. 
		//if condition is satisfied increment trueCount, else falseCount.
		for(var i = 0; i < coArr.length; i++) {

			var co = coArr[i];

		//the 'controller / target' input (in a different container!), the state or value of which decides whether the current condition (co) is satisfied
		// co.targetInput = co.targetInput ? co.targetInput : vm.tForm[co.input_name];
		co.targetInput = vm.tForm[co.input_type +'_'+co.input_id];

		if(!co.targetInput) continue;

		//if the 'controller' input is disabled, check if its parent container is hidden. If hidden, this sets displayContainer to false, even if this condition only has 'disable' specified.
		//when 
		if(co.targetInput.$inputDisabled) { 

			var cIdentifier =  'container_'+co.container_id+'_show';
			if(vm.tForm[cIdentifier] !== undefined && vm.tForm[cIdentifier] == false) {
				
				displayContainer = false;
			}
			else { displayContainer = setDisplayContainer(displayContainer, co.behavior); }

			falseCount++; continue; 
		}

		//check that it doesn't accept invalid values
		var val_id_input = co.targetInput.$modelValue;
		var check_type = co.input_value_check_rule;


		if(!val_id_input) { displayContainer = setDisplayContainer(displayContainer, co.behavior); falseCount++; continue; }




		// at least N from available input options, if at_least_n is null, than valid if single value is selected
		//if at leat N of options is selected, does not check test array
	    if(check_type == 'any_n' && val_id_input.length >= co.atleast_n) { trueCount++; continue; }



	    // if the condition requires checking against test array
		if(co.test_array && co.test_array.length > 1) {

			var val_id_arr = co.test_array;

			var match_count = 0;
			for(var m = 0; m < val_id_input.length; m++) {

				if(val_id_arr.includes(val_id_input[m])) {

					match_count++;
				}

			}

			// at least N within test array and no input values outside of test array (if at_least value not present, must match all values in test array)



                // option (allow values outside test array ticked)
			// at least N within test array and input values from outside test array are allowed (if at_least value not present, must match all values in test array)





			//if all valid value_id's that are present in the test array are selected, even if more are selected.
			// if(check_type == 'all_or_more' && match_count == val_id_arr.length) { trueCount++; continue; }

			//if any selected value_id is present in test (accepted value) array
			if(check_type == 'atleast_n' && match_count >= co.atleast_n) { trueCount++; continue; }

			//must contain all and only value_id's in the test array
			if(check_type == 'all_and_only' && ( match_count == val_id_arr.length &&  val_id_input.length == val_id_arr.length )) { 

				trueCount++; continue; 
			}

			falseCount++;

			displayContainer = setDisplayContainer(displayContainer, co.behavior);


		} else {

			if(co.test_value.toString().toLowerCase() == val_id_input.toString().toLowerCase()) { 

				trueCount++;

			} else { 

				falseCount++; 

				displayContainer = setDisplayContainer(displayContainer, co.behavior);

			}

			continue;
		}


	};

		//all must be valid - any single one or at least n number - 
		if(inputRules == '==' && coArr.length == trueCount) {

			toggleInputs(cc, false);
			displayContainer = true;

		} else if (inputRules.indexOf('>=') == 0 && trueCount >= parseInt(inputRules.substr(2,2))) {

			toggleInputs(cc, false);
			displayContainer = true;

		} else {

			toggleInputs(cc, true);
		}


		return displayContainer;	     

	}

	function toggleInputs(cc,val) {

		for(var i = 0; i < cc.inputs.length; i++) {

			var input = cc.inputs[i];
			input.disabled = val;
			var input_name = input.type + '_' + input.id;
			if(vm.tForm[input_name]) vm.tForm[input_name].$inputDisabled = val;

		}
	}

	function setDisplayContainer(displayContainer, behavior) {

					//if condition not satisfied, decide whether to hide the container
					if(displayContainer !== false && behavior == 'disable') {

						displayContainer = true;
					} else {

						displayContainer = false;
					}

					return displayContainer;
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



	function tipDialogController($scope, $mdDialog, tip) {

		$scope.tip = tip;

		$scope.cancel = function() {
			$mdDialog.cancel();
		};

	}



	vm.initInputPosition = function(input, index) {

		input.position = index + 1;
		return input.position;
	}



	vm.update_position_fields = function(collection) {

			collection.forEach(function(itm, idx) {

				itm.position = idx + 1;
			});
		}








}]);






// .directive ('setAttrValues', function() {
//     return {
//         restrict: 'A',
//         scope : {
//           inp : '=inp'
//         },
//         link : function(scope, ele, attr)	{

//         		if(!scope.inp || !scope.inp.attributes) return;
//         		var attrs = scope.inp.attributes;
          
// 	          	for(var i = 0; i < attrs.length; i++) {

// 	          		switch(attrs[i].name) {


// 	          		    case 'min-date':
// 	          			break;

// 	          		    case 'max-date':
// 	          			break;

// 	          		    case 'ngPattern':

// 	          				attr[attrs[i].name] = attrs[i].val.toString();

// 	          			break;

// 	          		}

	            
// 	        }

//         }
// }});



var template = {

	id:0,
	title:'Macbook Pro',

	sections: [
	{
		id:0,
		title: 'Section 1',
		count: 1,


		containers: [


			//start con 1
			{
				id: 1,
				position: 1,
				title: 'Is your item new or used ?',
				inputs:[




				{
					id:0, type:'radiogroup', text:'select an option', errormsg: [{required: 'this input is required'}],  group:'itemcon', title:'some title for radio', value: null, required: true, tip: { label:'Do you need help ?', heading: 'MaBook Serial location', text: 'The serial can be found on the underside of the notebook.', image:'someimage.png' },
					options: [{id:0, text:'item is new', value: 0 }, {id:1, text:'item is used', value: 1}, {id:11, text:'item is broken', value: 11}, {id:12, text:'item is open', value: 12}]
				},

				{
					id:0, type:'date', errormsg: '{required:"this input is required"}',title:'Select puchase date', attributes: { minDate: '05/05/2017' , maxDate: '10/20/2018'}, value: null, required: true, tip: { label:'Do you need help ?', heading: 'MaBook Serial location', text: 'The serial can be found on the underside of the notebook.', image:'someimage.png' }
				},



				{
					id:1, type:'text', required: true,  group: null, value: null, placeholder:'put some text heree', attributes: { pattern : /^(\d)+$/ }, tip: { label:'Do you need help ?', heading: 'MaBook Serial location', text: 'The serial can be found on the underside of the notebook.', image:'someimage.png' }

				},

				{
					id:4, type:'multiselect', title:'select many inputs',  group:'checkgrp', value: null, required: true,
					options: [{id:4, text:'check op 1', value: 4 }, {id:5, text:'check op 2', value: 5},{id:6, text:'check op 3', value: 6 },{id:7, text:'check op 7 testing long text', value: 7 },{id:8, text:'check op 88888', value: 8 }]
				},

				{
					id:55, type:'checkbox', text:'old checkbox', value: false, title: 'Just a checkbox', required: true

				},



				]},

						//end con1


						//start con 2

						{ id:77,title:'num two', position: 2, inputs: [{id:95, type:'checkbox', text:'subby checkbox', value: null, required: true}]  },

						//start con 3
						{
							id: 2,
							title: 'Rate the condition',
							position: 3,
							conditions: { 

								target_input_conditions: 
										//check rules types: all_and_only, all_or_more, atleast_n 
										[ 
											{ input_type: 'multiselect', input_id: 4, input_value_check_rule: 'all_and_only', test_array: [4,8,7], behavior: 'hide', container_id: 1, section_id: 0, uid: UUID.generate() },
											{ input_type: 'radiogroup',input_id: 0,input_value_check_rule: 'equals', test_value: 1, behavior: 'disable', container_id: 1, section_id: 0, uid: UUID.generate() },
											{ input_type: 'checkbox',input_id: 55,input_value_check_rule: 'equals', test_value: true, behavior: 'disable', container_id: 1, section_id: 0, uid: UUID.generate()},


										],

										input_check_rule: '>=2'
									},



								  //container position,option position within container, operator, option_value_id, behavior, container_id
						// condition:'multiselect_4,>==,4|8|7,show,1;radiogroup_0,=,1,disable,1;checkbox_5,=,true,disable,1~>=2',
						inputs:[

						{
							id:2, type:'select', text:'select an option',  group: null, value: null, required: true,
							options: [{id:2, text:'poor', value: 2 }, {id:3, text:'good', value: 3}]
						},


						{
							id:3, type:'text', text:'select an option',  group: null, value: null, placeholder:'put more text here', required: true
						}
						]
					}]
				},
				//section 1 end

				//section 2 start


				{

					id:1,
					title:'Section Two',
					count: 2,
					containers: [{
						id: 3,
						position: 1,





					}]

				}]

			}

//# sourceMappingURL=admin_area.js.map
