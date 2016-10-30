'use strict';



angular.module('template_editor').controller('templateEditorController',['$scope','$http','$state', '$mdDialog', function($scope, $http, $state, $mdDialog) {


var vm = this;

var tid = $state.params.tid;
var section_no = $state.params.section_no;

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

vm.delInput = function($event, cc, $index) {

	var promise = $scope.showConfirm($event, 'Delete this input ?');

	promise.then(function() {

			cc.inputs.splice($index,1);


	}, function() {});

}






vm.checkEquality = checkEquality;


$scope.nextSection = function(section,inputs) {

    var isValid = true;

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



 vm.template = {

 			id:0,
 			title:'Macbook Pro',

            sections: [
            {
            	id:0,
            	title: 'Section 1',
            	count: 1,


			containers: [
			{
				id:0,
				title: 'Condition',
				child_containers: [

					{
						id: 1,
						title: 'Is your item new or used ?',
						inputs:[


							

									{
										id:0, type:'radiogroup', text:'select an option', errormsg: '{required:"this input is required"}',  group:'itemcon', value: null, required: true, tip: { label:'Do you need help ?', heading: 'MaBook Serial location', text: 'The serial can be found on the underside of the notebook.', image:'someimage.png' },
										options: [{id:0, text:'item is new', value: 0 }, {id:1, text:'item is used', value: 1}]
									},


									{
										id:1, type:'text', text:'select an option',  group: null, value: null, placeholder:'put some text here',required: true, tip: { label:'Do you need help ?', heading: 'MaBook Serial location', text: 'The serial can be found on the underside of the notebook.', image:'someimage.png' }
										
									},

									{
										id:4, type:'multiselect', text:'select many inputs',  group:'checkgrp', value: null, required: true,
										options: [{id:4, text:'check op 1', value: 4 }, {id:5, text:'check op 2', value: 5},{id:6, text:'check op 3', value: 6 },{id:7, text:'check op 7 testing long text', value: 7 },{id:8, text:'check op 88888', value: 8 }]
									},

									{
										id:55, type:'checkbox', text:'old checkbox', value: null, required: true
										
									},


	
						],

						child_containers: [{id:77,title:'sub-sub-sub', inputs: [{id:95, type:'checkbox', text:'subby checkbox', value: null, required: true}]  }]

					},

					//end child container 1


					{
						id: 2,
						title: 'Rate the condition',
						conditions: { 

										target_input_conditions: 
										//check rules types: all_and_only, all_or_more, atleast_n 
										[ 
											{ input_name: 'multiselect_4',input_value_check_rule: 'all_and_only', test_array: [4,8,7], behavior: 'hide', container_id: 1},
											{ input_name: 'radiogroup_0',input_value_check_rule: 'equals', test_value: 1, behavior: 'disable', container_id: 1},
											{ input_name: 'checkbox_55',input_value_check_rule: 'equals', test_value: true, behavior: 'disable', container_id: 1},




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
					}











				]
			},

		]

	},


    {

       id:1,
       title:'Section Two',
       count: 2,
       containers: [


       					{
						id: 3,


					  child_containers: [{
						id: 4,
						title: '3rd container',
						conditions: { target_input_conditions: 
										[ 
											{ input_name: 'text_3', input_value_check_rule: 'equals', test_value: 'hello', behavior: 'disable', container_id: 2}

										],

									  input_check_rule: '=='
									},

											inputs:[
		
									{
										id:6, type:'checkbox', text:'a checkbox', value: null, required: true
										
									},


									{
										id:7, type:'checkbox', text:'another checkbox', value: null, required: true
										
									},





						],





					}]

				}


       ]


    }

]




	// sections: {

	// 	title:'Section 1',
	// 	containers: [
	// 		{
	// 			id:0,
	// 			title: 'Condition',
	// 			child_containers: [

	// 				{
	// 					id: 1,
	// 					title: 'Is your item new or used ?',
	// 					inputs:[
	// 								{id:0, type:'radio', text:'item is new',  group:'itemcon' value: true},
	// 								{id:0, type:'radio', text:'item is used', group:'itemcon' value: false}
	// 					]

	// 				}
	// 			]
	// 		}
	// 	]



	// }

}


	function checkEquality(cc) {

	//cc - current container
	//co - conditin object

	if(!cc.conditions) return true;

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
		co.targetInput = vm.tForm[co.input_name];

		//if the 'controller' input is disabled, check if its parent container is hidden. If hidden, this sets displayContainer to false, even if this condition only has 'disable' specified.
		//when 
		if(co.targetInput.$inputDisabled) { 

			var cIdentifier =  'container_'+co.container_id+'_show';
			if(vm.tForm[cIdentifier] !== undefined && vm.tForm[cIdentifier] == false) {displayContainer = false;}
			else { displayContainer = setDisplayContainer(displayContainer, co.behavior); }

			falseCount++; continue; 
		}

		var val_id_input = co.targetInput.$modelValue;
		var check_type = co.input_value_check_rule;


		if(!val_id_input) { displayContainer = setDisplayContainer(displayContainer, co.behavior); falseCount++; continue; }

		if(co.test_array && co.test_array.length > 1) {

		    var val_id_arr = co.test_array;

			var match_count = 0;
			for(var m = 0; m < val_id_input.length; m++) {

				if(val_id_arr.includes(val_id_input[m])) {

					match_count++;
				}

			}

			//if all valid value_id's that are present in the test array are selected, even if more are selected.
			// if(check_type == 'all_or_more' && match_count == val_id_arr.length) { trueCount++; continue; }

			//if any selected value_id is present in test (accepted value) array
			if(check_type == 'atleast_n' && match_count >= parseInt(check_type.substr(8,8))) { trueCount++; continue; }

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



  	    function addInputDialogController($scope, $mdDialog, container, input) {

  	        $scope.container = container;

	  		$scope.input_types = [{name:'radiogroup', dname: 'radio group'},{name:'checkbox', dname: 'Checkbox'},{name:'text', dname: 'Text'} ,{name:'select', dname: 'Select list'},{ name:'multiselect', dname: 'Muli-Select list'}];


  	        $scope.initTemplate = function() {

		  	         if(input && !$scope.newinput) {
  	      				
  	      				$scope.max_position = container.inputs.length;
		  	         	$scope.newinput  = angular.copy(input);
		  	         	$scope.isUpdate = true;

		  	         } else if(!$scope.newinput) {

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


		  	          if($scope.newinput.type == 'multiselect') {

		  	          	var copy;

		  	          	if($scope.newinput.value && !Array.isArray($scope.newinput.value)) {

		  	          	    copy = angular.copy($scope.newinput.value);
		  	          	}

		  	          	if(!$scope.newinput.value || !Array.isArray($scope.newinput.value)) $scope.newinput.value = [];


		  	          	if(copy) { $scope.newinput.value = $scope.newinput.value.push(copy); }


		  	          }



		  	          $scope.active_option =  {};		  	          
		  	          $scope.newinput.options = $scope.newinput.options ? $scope.newinput.options : [];


  	        }


  	        $scope.initTemplate();

	  		
		    $scope.cancel = function() {
		      $mdDialog.cancel();
		    };


		    $scope.addInput = function(newinput, update) {


		    				$scope.input_form.$setSubmitted();

				    		if($scope.input_form.$valid) {

				    		 var input_type = $scope.newinput.type;
				    	     var inputs_with_options = ['select','multiselect','radiogroup'];


				    	    // if(input_type == 'select') {

				    	    // 	if(!selected_value) { $scope.newinput.value == null; }
				    	    // 	else {

				    	    // 		newinput.value = selected_value;
				    	    // 	}
				    	    // }


					    	if(!inputs_with_options.includes(input_type)) {

					    		delete newinput.options;
					    	}


					    		if(!update) {

					    		var index = newinput.position ? (newinput.position - 1) : container.inputs.length;
					    		container.inputs.splice(index, 0 , newinput);
					    		$scope.newinput = { type: input_type };
					    		$scope.input_form.$setPristine(true);
					    	    $scope.input_form.$setUntouched(true);


					    	} else if(update) {

					    		angular.copy($scope.newinput, input);

					    	}


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

		    	copy.value = 'x' + Math.random(3,222);

		    	$scope.newinput.options.push(copy);
		    	$scope.active_option = {};
		    	$scope.selectedOption = {};

		    	if($scope.newinput.type == 'select') {
		    	$scope.newinput.value = copy.value;
		    	}

		    	else if($scope.newinput.type == 'multiselect') {
		    	$scope.current_value = copy.value;
		    	}



		    	$scope.setOption(copy.value);
		    }


		    //for select list to display mark or style for select option
		    $scope.checkIfSelected = function(val) {
		    	if(!val) return false;
		    	return $scope.newinput.value.includes(val);
		    }

		    //toggle checkbox and remove or add value in value array
		    $scope.toggleSelected = function(optionSelected) {

		    if(optionSelected) {

		    	$scope.newinput.value.push($scope.selectedOption.value);
		    	// $scope.optionSelected = true;

		    }	else {

		    	  $scope.newinput.value = $scope.newinput.value.filter(function(itm, idx) {

		    	  return itm !== $scope.selectedOption.value; 

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


		    $scope.setOption = function(val) {

		    	if(!val) return;

		    	var option = $scope.newinput.options.find(function(opt) {
		    		return opt.value == val;
		    	});

		    	$scope.active_option = angular.copy(option);
		    	$scope.selectedOption = option;
		    }



		    $scope.updateOption = function() {

		    	if($scope.option_form.option_text.$invalid) return;

		    	if($scope.selectedOption) {


		    			angular.copy($scope.active_option, $scope.selectedOption );

		    	}
		    }



		    $scope.deleteOption = function() {

		    	var index = $scope.selectedOption.position - 1;
		    	$scope.newinput.options.splice(index, 1 );
		    	$scope.selectedOption = undefined;
		    	$scope.newinput.value = null;

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




// '<div class="container" flex-gt-xs="50" ng-repeat="cc in con.child_containers" ng-show="!cc.conditions ? true : checkEquality(cc)"> <h5>{{cc.title}}</h5> <div class="cinput" ng-repeat="inp in cc.inputs track by $index " style="width:100%"> <div class="position">{{inp.position=$index+1}}</div> <div class="edit_button" ng-click="tmp.addEditInput($event, cc, inp)">edit</div> <div class="del_button" ng-click="tmp.delInput($event, cc, $index)">del</div> <md-input-container ng-if="inp.type == \'text\'"> <input ng-init="input_name = (inp.type + \'_\' + inp.id); inputs.push(input_name)" name="{{input_name}}" ng-required="inp.disabled ? '' : inp.required " ng-disabled="inp.disabled" type="text" ng-model="inp.value" placeholder="{{inp.placeholder}}"/> </md-input-container> <md-checkbox ng-init="input_name = (inp.type + \'_\' + inp.id); inputs.push(input_name);" name="{{input_name}}" ng-required="inp.disabled ? '' : inp.required " ng-model="inp.value"     ng-true-value="\'true\'"ng-disabled="inp.disabled" ng-if="inp.type == \'checkbox\'" aria-label="{{inp.text}}"> {{ inp.text }} </md-checkbox> <md-radio-group ng-init="input_name = (inp.type + \'_\' + inp.id); inputs.push(input_name)" name="{{input_name}}" ng-required="inp.disabled ? '' : inp.required "  ng-disabled="inp.disabled" ng-model="inp.value" ng-if="inp.type == \'radiogroup\'"> <md-radio-button ng-repeat="opt in inp.options" value="{{opt.value}}" class="md-primary">{{opt.text}}</md-radio-button> </md-radio-group> <md-input-container ng-if="inp.type == \'select\'"> <md-select placeholder="{{inp.placeholder}}" ng-init="input_name = (inp.type + \'_\' + inp.id); inputs.push(input_name)" name="{{input_name}}" ng-required="inp.disabled ? '' : inp.required "  ng-disabled="inp.disabled" ng-model="inp.value"> <md-option ng-repeat="opt in inp.options" ng-value="opt.value"> {{opt.text}} </md-option> </md-select> </md-input-container> <md-input-container style="max-width:100%" ng-if="inp.type == \'multiselect\'"> <label>{{inp.text}}</label> <md-select ng-disabled="inp.disabled" ng-init="input_name = (inp.type + \'_\' + inp.id); inputs.push(input_name)" name="{{input_name}}" ng-required="inp.disabled ? '' : inp.required "  ng-model="inp.value"multiple> <md-optgroup label="stuff"> <md-option ng-value="opt.value" ng-repeat="opt in inp.options">{{opt.text}}</md-option> </md-optgroup> </md-select> </md-input-container> <div class="tip" ng-if="inp.tip"> <label>Help:</label> <a ng-click="tmp.showTipDialog($event,inp.tip)">{{inp.tip.label}}</a> </div> </div> <md-button ng-click="tmp.addEditInput($event,cc)">+ input</md-button> <md-button>+ container</md-button></div>'

}]).directive('recon',   function recursive_container() {
    return {
      template: '<div class="container" ng-repeat="cc in containers" ng-show="!cc.conditions ? true : tmp.checkEquality(cc)"> <h5>{{cc.title}}</h5> <div class="cinput" ng-repeat="inp in cc.inputs" style="width:100%"> <div class="position">{{inp.position=$index+1}}</div> <div class="edit_button" ng-click="tmp.addEditInput($event, cc, inp)">edit</div> <div class="del_button" ng-click="tmp.delInput($event, cc, $index)">del</div> <md-input-container ng-if="inp.type == \'text\'"> <input ng-init="input_name = (inp.type + \'_\' + inp.id); inputs.push(input_name)" name="{{input_name}}" ng-required="inp.disabled ? \'\' : inp.required " ng-disabled="inp.disabled" type="text" ng-model="inp.value" placeholder="{{inp.placeholder}}"/> </md-input-container> <md-checkbox ng-init="input_name = (inp.type + \'_\' + inp.id); inputs.push(input_name);" name="{{input_name}}" ng-required="inp.disabled ? \'\' : inp.required " ng-model="inp.value"     ng-true-value="\'true\'"ng-disabled="inp.disabled" ng-if="inp.type == \'checkbox\'" aria-label="{{inp.text}}"> {{ inp.text }} </md-checkbox> <md-radio-group ng-init="input_name = (inp.type + \'_\' + inp.id); inputs.push(input_name)" name="{{input_name}}" ng-required="inp.disabled ? \'\' : inp.required "  ng-disabled="inp.disabled" ng-model="inp.value" ng-if="inp.type == \'radiogroup\'"> <md-radio-button ng-repeat="opt in inp.options" value="{{opt.value}}" class="md-primary">{{opt.text}}</md-radio-button> </md-radio-group> <md-input-container ng-if="inp.type == \'select\'"> <md-select placeholder="{{inp.placeholder}}" ng-init="input_name = (inp.type + \'_\' + inp.id); inputs.push(input_name)" name="{{input_name}}" ng-required="inp.disabled ? \'\' : inp.required "  ng-disabled="inp.disabled" ng-model="inp.value"> <md-option ng-repeat="opt in inp.options" ng-value="opt.value"> {{opt.text}} </md-option> </md-select> </md-input-container> <md-input-container style="max-width:100%" ng-if="inp.type == \'multiselect\'"> <label>{{inp.text}}</label> <md-select ng-disabled="inp.disabled" ng-init="input_name = (inp.type + \'_\' + inp.id); inputs.push(input_name)" name="{{input_name}}" ng-required="inp.disabled ? \'\' : inp.required "  ng-model="inp.value"multiple> <md-optgroup label="stuff"> <md-option ng-value="opt.value" ng-repeat="opt in inp.options">{{opt.text}}</md-option> </md-optgroup> </md-select> </md-input-container> <div class="tip" ng-if="inp.tip"> <label>Help:</label> <a ng-click="tmp.showTipDialog($event,inp.tip)">{{inp.tip.label}}</a> </div> </div> <md-button ng-click="tmp.addEditInput($event,cc)">+ input</md-button> <md-button>+ container</md-button><recon ctrl="tmp" inputs="inputs" containers="cc.child_containers"></recon></div>',
      scope: {
        containers: '=',
        tmp: '=ctrl',
        inputs: '=inputs'
      }
    }
  });


