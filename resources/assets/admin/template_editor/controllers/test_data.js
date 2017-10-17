
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
