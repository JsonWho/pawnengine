'use strict';

angular.module('home').controller('homeController',['$scope','$http', function($scope, $http) {

var vm = this;

$scope.splitToArr = function(c) {

	if(!c.condition) return null;

	var conditions = c.condition.split(';');

	var coArr = [];

	conditions.forEach(function(condition, idx) {


		var conArr = condition.split(',');

        var co = {
        
        cindex : conArr[0],
		optidx : parseInt(conArr[1]),
		operator : conArr[2],
		option_value_id_arr : conArr[3].split('|'),
		behavior : conArr[4]

	    }
		
		co.targetContainer = eval('vm.template.option_sections' + co.cindex);
		co.targetOption = co.targetContainer.options[co.optidx];


		coArr.push(co)


	});



	return coArr;

}


$scope.checkEquality = checkEquality;


$scope.submitTemplate = function() {

	vm.template;
	console.log(vm.tForm.$valid);

}



 vm.template = {

 			id:0,
 			title:'Macbook Pro',

            option_sections: [
            {
            	id:0,
            	title: 'Section 1',
            	posiiton: 1,


			containers: [
			{
				id:1,
				title: 'Condition',
				child_containers: [

					{
						id: 1,
						title: 'Is your item new or used ?',
						options:[
									{
										id:0, type:'radiogroup', text:'select an option',  group:'itemcon', value: null,
										option_values: [{id:0, text:'item is new', value: 0 }, {id:1, text:'item is used', value: 1}]
									},

									{
										id:1, type:'textinput', text:'select an option',  group: null, value: null, placeholder:'put some text here'
										
									},

									{
										id:4, type:'multiselect', text:'select many options',  group:'checkgrp', value: null,
										option_values: [{id:4, text:'check op 1', value: 4 }, {id:5, text:'check op 2', value: 5},{id:6, text:'check op 3', value: 6 },{id:7, text:'check op 7 testing long text', value: 7 },{id:8, text:'check op 88888', value: 8 }]
									},

									{
										id:5, type:'checkbox', text:'a checkbox', value: null
										
									}

						],

						child_containers: []

					},

					//end child container 1


					{
						id: 2,
						title: 'Rate the condition',
								  //container position,option position within container, operator, option_value_id, behavior
						condition:'[0].containers[0].child_containers[0],2,>==,4|8|7,show;[0].containers[0].child_containers[0],0,=,1,show;[0].containers[0].child_containers[0],3,=,true,show',
						options:[

									{
										id:2, type:'select', text:'select an option',  group: null, value: null,
										option_values: [{id:2, text:'poor', value: 2 }, {id:3, text:'good', value: 3}]
									},


									{
										id:3, type:'textinput', text:'select an option',  group: null, value: null, placeholder:'put more text here'
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
       containers: [


       					{
						id: 3,


					  child_containers: [{
						id: 3,
						title: '3rd container',
						condition:'[0].containers[0].child_containers[1],1,=,hello,show',

											options:[
		
									{
										id:6, type:'checkbox', text:'a checkbox', value: null, required: true
										
									},


									{
										id:6, type:'checkbox', text:'another checkbox', value: null, required: null
										
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


	function checkEquality(coArr,cc) {

	//cc - current container
	//co - conditin object

	if(!coArr) return true;

	// var cindex = splitArr[0];

	// var optidx = conArr[0];
	// var operator = conArr[1];
	// var option_value_id = conArr[2];
	// var behavior = conArr[3];

		// var targetContainer = eval('vm.template.containers' + co.cindex);
		// var targetOption = targetContainer.options[co.optidx];





		// if(co.targetContainer.disabled) return false;

		if(inputInValueArray(coArr)) {

			cc.disabled = false; return true;
		}
		else {

			cc.disabled = true;
			return false;
		}


	}

	function inputInValueArray(coArr) {


		var trueCount = 0;
		var falseCount = 0;


		for(var i = 0; i < coArr.length; i++) {

		var co = coArr[i];

		if(co.targetContainer.disabled) { break; return false; }

		var val_id_arr = co.option_value_id_arr;
		var val_id_input = co.targetOption.value;
		var operator = co.operator;


		if(!val_id_input) { falseCount++; continue; }

		if(val_id_arr.length > 1) {

			// if(val_id_input.length < val_id_arr.length) {

			// 	return false;
			// }

			var match_count = 0;
			for(var m = 0; m < val_id_input.length; m++) {

				if(val_id_arr.includes(val_id_input[m].toString())) {

					match_count++;
				}

			}

			//if all valid value_id's that are present in the conditinal array are selected, even if more are selected.
			if(operator == '>*' && match_count == val_id_arr.length) { trueCount++; continue; }

			//if any selected value_id is present in conditinal (accepted value) array
			if(operator == '>n' && match_count >= 1) { trueCount++; continue; }

			//must contain all and only value_id's in the conditional array
			if(operator == '>==' && ( match_count == val_id_arr.length &&  val_id_input.length == val_id_arr.length )) { 

				trueCount++; continue; 
			}

			falseCount++;

		} else {

			 val_id_arr[0].toString() == val_id_input.toString() ? trueCount++ : falseCount++;

			 continue;
		}


		};


	     return coArr.length == trueCount;


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