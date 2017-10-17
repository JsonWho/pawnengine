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