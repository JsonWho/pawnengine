

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
