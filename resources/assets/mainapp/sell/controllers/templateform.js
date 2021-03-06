'use strict';



angular.module('sell').controller('templateFormController',['$scope','$http','$state', '$mdDialog', function($scope, $http, $state, $mdDialog) {


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







$scope.checkEquality = checkEquality;


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

            option_sections: [
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
						options:[
									{
										id:0, type:'radiogroup', text:'select an option', errormsg: '{required:"this input is required"}',  group:'itemcon', value: null, required: true, tip: { label:'Do you need help ?', heading: 'MaBook Serial location', text: 'The serial can be found on the underside of the notebook.', image:'someimage.png' },
										option_values: [{id:0, text:'item is new', value: 0 }, {id:1, text:'item is used', value: 1}]
									},

									{
										id:1, type:'textinput', text:'select an option',  group: null, value: null, placeholder:'put some text here',required: true, tip: { label:'Do you need help ?', heading: 'MaBook Serial location', text: 'The serial can be found on the underside of the notebook.', image:'someimage.png' }
										
									},

									{
										id:4, type:'multiselect', text:'select many options',  group:'checkgrp', value: null, required: true,
										option_values: [{id:4, text:'check op 1', value: 4 }, {id:5, text:'check op 2', value: 5},{id:6, text:'check op 3', value: 6 },{id:7, text:'check op 7 testing long text', value: 7 },{id:8, text:'check op 88888', value: 8 }]
									},

									{
										id:5, type:'checkbox', text:'a checkbox', value: null, required: true
										
									}

						],

						child_containers: []

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
											{ input_name: 'checkbox_5',input_value_check_rule: 'equals', test_value: true, behavior: 'disable', container_id: 1},




										],

									  input_check_rule: '>=2'
									},



								  //container position,option position within container, operator, option_value_id, behavior, container_id
						// condition:'multiselect_4,>==,4|8|7,show,1;radiogroup_0,=,1,disable,1;checkbox_5,=,true,disable,1~>=2',
						options:[

									{
										id:2, type:'select', text:'select an option',  group: null, value: null, required: true,
										option_values: [{id:2, text:'poor', value: 2 }, {id:3, text:'good', value: 3}]
									},


									{
										id:3, type:'textinput', text:'select an option',  group: null, value: null, placeholder:'put more text here', required: true
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
											{ input_name: 'textinput_3', input_value_check_rule: 'equals', test_value: 'hello', behavior: 'disable', container_id: 2}

										],

									  input_check_rule: '=='
									},

											options:[
		
									{
										id:6, type:'checkbox', text:'a checkbox', value: null, required: true
										
									},


									{
										id:6, type:'checkbox', text:'another checkbox', value: null, required: true
										
									},





						],





					}]

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


	function checkEquality(cc) {

	//cc - current container
	//co - conditin object

	if(!cc.conditions) return true;


	// var cindex = splitArr[0];

	// var optidx = conArr[0];
	// var operator = conArr[1];
	// var option_value_id = conArr[2];
	// var behavior = conArr[3];

		// var targetContainer = eval('vm.template.containers' + co.cindex);
		// var targetOption = targetContainer.options[co.optidx];





		// if(co.targetContainer.disabled) return false;
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
	
		//check each condition object for container and evaluate expected values specified in condition against those which the 'controller input' model is set to. 
		//if condition is satisfied increment trueCount, else falseCount.
		for(var i = 0; i < coArr.length; i++) {

		var co = coArr[i];

		//the 'controller / target' input (in a different container!), the state or value of which decides whether the current condition (co) is satisfied
		if(!co.targetOption) co.targetOption = vm.tForm[co.input_name];

		//if the 'controller' input is disabled, check if its parent container is hidden. If hidden, this sets displayContainer to false, even if this condition only has 'disable' specified.
		//when 
		if(co.targetOption.$inputDisabled) { 

			var cIdentifier =  'container_'+co.container_id+'_show';
			if(vm.tForm[cIdentifier] !== undefined && vm.tForm[cIdentifier] == false) {displayContainer = false;}
			else { displayContainer = setDisplayContainer(displayContainer, co.behavior); }

			falseCount++; continue; 
		}

		var val_id_input = co.targetOption.$modelValue;
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

		for(var i = 0; i < cc.options.length; i++) {

			var option = cc.options[i];
			option.disabled = val;
			var input_name = option.type + '_' + option.id;
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





}]);



