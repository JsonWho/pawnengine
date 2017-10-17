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

