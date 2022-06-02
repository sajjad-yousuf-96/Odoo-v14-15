$(document).ready(function() {
	/**/
	$('[data-toggle="tooltip-prog"]').tooltip();
	
	/**/
	autosize($('textarea'));
	
	/**/
	$.validator.setDefaults({ignore:':hidden, [readonly=readonly]'});
	
	/**/
	$.validator.addMethod("passwordFormatCheck", function(value, element) {
    return this.optional(element) || /^(?=.*\d)(?=.*[A-Z])(?=.*\W).*$/i.test(value);
	}, "Password must contain one capital letter, one numerical and one special character");
	
	/**/
	$.validator.addMethod('filesize', function (value, element, param) {
		return this.optional(element) || (element.files[0].size <= param)
	}, 'File size is too large.');
	
	/**/
	$('input[name="cnic_no"]').mask("00000-0000000-0", {placeholder: "_____-_______-_"});	
	
	/**/
	$.validator.addMethod("validate_photo", function(value, element, params){
        var image_url   = $("img[id='user-image']").attr('src').lastIndexOf("/") + 1;
        var filename    = $("img[id='user-image']").attr('src').substr(image_url);
        if(filename == "no-image.gif"){
            return false;
        }else{
            return true;
        }
    },jQuery.validator.format("You didn't upload your photo. Please upload your photo before submitting form."));
	
	/**/
	function getWordCount(wordString) {
		var words = wordString.split(" ");
			words = words.filter(function(words) { 
				return words.length > 0
			}).length;
		return words;
	}
	
	/**/
	$.validator.addMethod("lettersonly", function(value, element) {
		return this.optional(element) || /^[a-z\s]+$/i.test(value);
	}, "Only alphabetical characters");
	
	/**/
	$.validator.addMethod("wordCountMax",function(value, element, params) {
        var count = getWordCount(value);
		if(count <= params[0]) {
			return true;
		}},jQuery.validator.format("Only {0} words allowed."));
	
	/**/
	$.validator.addMethod("wordCountMin",function(value, element, params) {
		var count = getWordCount(value);
		if(count >= params[0]) {
			return true;
		}
	},jQuery.validator.format("A minimum of {0} words is required."));
	
	/**/
	$('#register_frm input[name=nationality]').change(function() {
		if (this.value == 'Pakistani') {
			$("#cnic_no_box").show();
			$("#passport_no_box").hide();
			$("#passport_no").val("");
		}else{
			$("#passport_no_box").show();
			$("#cnic_no_box").hide();
			$("#cnic_no").val("");
		}
	});
	
	/**/
	$("#register_frm").validate({
		rules: {
			first_name: "required",
			last_name: "required",
			email: {
				required: true,
				email:true,
				remote:{url:'ajax',type: "post",data:{
					email:function(){ return $("[name='email']").val();},
					action: function(){return 'chk_email_already_exists';},
						}
					}
				},
			country_code: "required",
			mobile_no:{
				required: true,
				minlength:5,
				maxlength:11,
				number:true,
			},
			cnic_no:{
				required: true,
				minlength:15,
				maxlength:15,
				remote:{url:'ajax',type: "post",data:{
					cnic_no:function(){ return $("[name='cnic_no']").val();},
					action: function(){return 'chk_cnic_already_exists';},
						}
					}
			},
			passport_no: {
				required: true,
				remote: {url:'ajax',type: "post",data:{
					passport_no: function(){ return $("[name='passport_no']").val();},
					action: function(){return 'chk_passport_no_already_exists';},
						}
					}
			},			
			country: "required",			
			password: {
				required: true,
				minlength: 8,
				maxlength:20,
				passwordFormatCheck:true,
			},
			confirm_password: {
				required: true,
				minlength: 8,
				maxlength:20,
				equalTo: "#password",
			},
			"programs_interested_in[]":"required",
		},
		messages: {
			email: {
				remote: "Email address is already used for another account"
			},
			cnic_no: {
				remote: "CNIC number is already used for another account"
			},
			passport_no: {
				remote: "Passport number is already used for another account"
			},
			password: {
				required: "Please provide a password",
				minlength: "Your password must be at least 8 characters long"
			},
			confirm_password: {
				required: "Please provide a password",
				minlength: "Your password must be at least 8 characters long",
				equalTo: "Please enter the same password as above"
			},
		},
		errorElement: "em",
		errorPlacement: function ( error, element ) {
		error.addClass("help-block");
		if ( element.prop("type") === "checkbox") {
			error.insertAfter(element.parent("label"));
		} else {
			error.insertAfter(element);
			}
		},
		highlight: function ( element, errorClass, validClass ) {
			$(element).parents(".col-sm-5").addClass( "has-error").removeClass("has-success");
		},
		unhighlight: function (element, errorClass, validClass) {
			$(element).parents(".col-sm-5").addClass("has-success").removeClass("has-error");
		}
	});
	
	/**/
	$( "#login_frm").validate({
		rules: {
			email: {
				required: true,
				email:true,
				},			
			password: {
				required: true,
			},
		},
		messages: {
			password: {
				required: "Please provide a password",
			},
		},
		errorElement: "em",
		errorPlacement: function ( error, element ) {
		error.addClass( "help-block" );
		if ( element.prop( "type" ) === "checkbox" ) {
			error.insertAfter( element.parent( "label" ) );
		} else {
			error.insertAfter( element );
			}
		},
		highlight: function ( element, errorClass, validClass ) {
			$( element ).parents( ".col-sm-5" ).addClass( "has-error" ).removeClass( "has-success" );
		},
		unhighlight: function (element, errorClass, validClass) {
			$( element ).parents( ".col-sm-5" ).addClass( "has-success" ).removeClass( "has-error" );
		}
	});
	
	/**/
	$( "#verification_frm").validate({
		rules: {
			email_code: {
				required: true,
				minlength: 5,
				maxlength: 5,
				number:true,
				},
			mobile_code: {
				minlength: 5,
				maxlength: 5,
				number:true,
				},	
		},
		messages: {
		},
		errorElement: "em",
		errorPlacement: function ( error, element ) {
		error.addClass( "help-block" );
		if ( element.prop( "type" ) === "checkbox" ) {
			error.insertAfter( element.parent( "label" ) );
		} else {
			error.insertAfter( element );
			}
		},
		highlight: function ( element, errorClass, validClass ) {
			$( element ).parents( ".col-sm-5" ).addClass( "has-error" ).removeClass( "has-success" );
		},
		unhighlight: function (element, errorClass, validClass) {
			$( element ).parents( ".col-sm-5" ).addClass( "has-success" ).removeClass( "has-error" );
		}
	});
	/**/
	$bypass_submit_step = false;
	/**/
	$("#form-wizard").on("stepContent", function(e, anchorObject, stepIndex, stepDirection) {
		if(stepIndex == 4){
			$(".sw-btn-next").hide();
			$(".sw-btn-finish").show();
		}else if(stepIndex == 5){
			$(".sw-btn-next").hide();
			$(".sw-btn-finish").hide();
		}else{
			$(".sw-btn-next").show();
			$(".sw-btn-finish").hide();
		}
		/**/
		var repo    = anchorObject.data('repo');
		var ajaxURL = 'ajax?action=form-wizard';
		// Return a promise object
		return new Promise((resolve, reject) => {
			$.ajax({
				method  : "POST",
				data:{"step_number":stepIndex + 1},
				url : ajaxURL,
				beforeSend: function(xhr){
					$('#form-wizard').smartWizard("loader", "show");
				}
				}).done(function(res){
					resolve(res);
					$('#form-wizard').smartWizard("loader", "hide");
				}).fail(function(err){
						reject( "An error loading the resource" );
						$('#form-wizard').smartWizard("loader", "hide");
				});
		});
   });
   
	/**/
    $('#form-wizard').smartWizard({lang:{next:'Save & Next',previous:'Previous',finish:'Submit',},
        toolbarSettings: {
        toolbarExtraButtons:[$('<button></button>').text('Submit').addClass('btn btn-info sw-btn-finish').on('click', function(){
			onFinishCallback();
			}),
        ],    
      showPreviousButton: true,
	  },
      hiddenSteps: [],
      autoAdjustHeight: false,
      selected: defaultFormStepSelected,//set in profile page.
	  keyboardSettings: {keyNavigation: false},
	  contentCache:false,
	  transitionEffect: 'none',
	  theme: 'arrows',
    });

	/**/
    $("#form-wizard").on("leaveStep", function(e, anchorObject, stepIndex, stepDirection) {
           return leaveStepCallBack(anchorObject,e,stepIndex,stepDirection);
    });

	/**/
    function leaveStepCallBack(obj, context,stepIndex,stepDirection){
		if(stepDirection < stepIndex){
				return true;
			}else{
				return validateSteps(stepIndex);    
           }
    }
	
	/*Finish Button*/
    function onFinishCallback(objs, context){
    isSubmitValid = "no";    
      var validate_submit = $("#frm_submit").validate({
		  rules:{
			  agree:{
				  required:true, validate_photo:true
				  }
				},
          messages:{
			  agree:{
				  required:"You have not agreed to terms & condition"
				  }
				}
      }).form(); 
	  
	  /**/
      if(validate_submit){
            bootbox.confirm("Are you sure you want to submit your profile ? Once submitted data cannot be edited.", function(result){
            if(result==true){
				 //bootbox.alert("Submitting your profile. Please wait...");
            var dataString = JSON.stringify({action:'submit_form'});
            $.post("ajax",{post_data:dataString},function(response){
                if(response.error){
                    bootbox.alert(response.error); 
                    isSubmitValid = "no";
                }else{
					bootbox.hideAll();
					$('#form-wizard').smartWizard("goToStep", 5);
					$('#form-wizard').smartWizard({anchorSettings:{enableAllAnchors: false}});
					$('#form-wizard').smartWizard("stepState", [0,1,2,4], "disable");
					//$('#form-wizard ul li a:not(.active)').addClass("disabled");
					//$('#form-wizard ul li a:not(.done)').addClass("disabled");
					$(".sw-btn-prev").hide();
					$(".sw-btn-next").hide();
					isSubmitValid = "yes";
					}
				},"json");
				}
            });
        }else{
            isSubmitValid = "no";
            $(".agreeError").show();
        }
    }
	
	/**/
	function validateSteps(stepnumber){
		/**/
		stepnumber += 1;
		/*Reload the preview page again*/
		if($bypass_submit_step == true){
			$bypass_submit_step = false;
			return true;
		}
		/**/	
		var isStepValid 	= false;
        var submitFormData	= false;
		/*Step#1*/
		if(stepnumber == 1){
			var validate_form = $("#frm_personal_info").validate({
				rules: {
					first_name:"required",
					last_name:"required",			
					country: "required",
					alternate_email:{
						email:true,
					},
					mobile_no:{
						required: true,
						minlength:5,
						maxlength:11,
						number:true,
					},
					country_code: "required",
					gender:"required",
					date_of_birth:"required",
					house_no:"required",
					postal_address:"required",
					city:"required",
					state:"required",
					country:"required",
					fathers_first_name:"required",
					fathers_last_name:"required",
					fathers_cnic:"required",
					marital_status:"required",
					spouse_first_name:"required",
					spouse_last_name:"required",
					mothers_first_name:"required",
					mothers_last_name:"required",
					is_disable:"required",
					disability:"required",
					domicile:"required",
					erp_id:{
						required:true,
						number:true,
					}
				},
				messages: {
				},
				errorElement: "em",
				errorPlacement: function (error, element){
				error.addClass("help-block");
				if( element.prop("type") === "checkbox"){
					error.insertAfter(element.parent("label"));
				}else{
					error.insertAfter(element);
					}
				},
				highlight: function (element, errorClass, validClass){
					$(element).parents(".col-sm-5").addClass( "has-error").removeClass("has-success");
				},
				unhighlight: function (element, errorClass, validClass){
					$(element).parents(".col-sm-5").addClass("has-success").removeClass("has-error");
				},
				invalidHandler: function(form, validator){
                        if(!validator.numberOfInvalids())
                            return;
                        $('html, body').animate({scrollTop: $(validator.errorList[0].element).offset().top-100},1000);
                }
			}).form();
			
			/**/
			if(validate_form){
                submitFormData 	= true;
				isStepValid 	= true;
				var form_data_array = {"data":[]};
				var formData		= new FormData();
				var form 			= $("#frm_personal_info");
				var formParams 		= form.serializeArray();
				formData.append("form_data", JSON.stringify(formParams));
				formData.append("post_data",JSON.stringify({action:"save_form_data",step_type:"basic_info",step_number:stepnumber}));	
				}
			}
			
			/*Step#2*/
			if(stepnumber == 2){
				var form_data_array = {"data":[]};
				var formData		= new FormData();
				var breakLoop		= false;
				var loop = 1;
				$("form[id^='frm_academic_rec']").each(function(e){
					var form = $(this);
					var not_applicable = form.find("input[name='not_applicable']").val();
					var certificate	   = form.find("select[name='certificate']").val();
					if(not_applicable == 0 && certificate == ""){
						var form_validation_required = true;
						$('#collapse'+loop).collapse('show');
						breakLoop	= true;
					}else{
						var form_validation_required = false;
						breakLoop	= false;
					}
					
					/**/		
					if(loop == 1){
						var level_subjects_needed	 = 5;
						var ssc_hssc_subjects_needed = 3;
					}else{
						var level_subjects_needed	 = 3;
						var ssc_hssc_subjects_needed = 3;
					}
					/**/
					var validate_form = form.validate({
						rules:{
							certificate:{
								required:function(){
									return form_validation_required;
								}},
							other:{
								required:function(){
									if(loop < 5){
										return form.find("select[name='certificate']").val() == "other";
									}
								}
							},
							school_college:{
								required:function(){
									return form_validation_required;
								}},	
							school_address:{
								required:function(){
									return form_validation_required;
								}},		
							board_univ:{
								required:function(){
									if(loop < 5){
										return form.find("select[name='certificate']").val() != "";
									}else{
										return form.find("input[name='other']").val() != "";
									}
								}},
							passing_year:{
								required:function(){
									if(loop < 5){
										return form.find("select[name='certificate']").val() != "";
									}else{
										return form.find("input[name='other']").val() != "";
									}
								}},
							grade_cgpa:{
								required:function(){
									if(loop < 5){
										if(loop == 2 && form.find("select[name='result_status']").val() == undefined){
											return true;
										}else if(loop == 2 && form.find("select[name='result_status']").val() != "Exam given and result in Hand"){
											return false;	
										}else{
											return form.find("select[name='certificate']").val() != "";
										}
									}else{
										return form.find("input[name='other']").val() != "";
									}
								}},
							discipline:{
								required:function(){
									if(loop < 5){
										return form.find("select[name='certificate']").val() != "";
									}else{
										return form.find("input[name='other']").val() != "";
									}
								}},
							medium:{
								required:function(){
									return form.find("select[name='certificate']").val() != "";
								}},
							current_level:{
								required:true
							},
							result_status:{
								required:true
							},
							marking_criteria:{
								required:function(){
									if(loop < 5){
										return form.find("select[name='certificate']").val() != "";
									}else{
										return form.find("input[name='other']").val() != "";
									}
								}},						
							studied_economics:{
								required:true
								},
							studied_maths:{
								required:true
								},
							level_subject:{
								require_from_group: [level_subjects_needed, ".level_subject_frm_fields"]
								},
							subject_grade:{
								require_from_group: [level_subjects_needed, ".level_grade_frm_fields"]
								},
							subject_id:{
								require_from_group: [ssc_hssc_subjects_needed, ".ssc_hssc_frm_fields1"]
								},
							subject_obtained_marks:{
								number:true,
								minlength:1,
								maxlength:4,
								require_from_group: [ssc_hssc_subjects_needed, ".ssc_hssc_frm_fields2"]
								},
							subject_total_marks:{
								number:true,
								minlength:1,
								maxlength:4,
								require_from_group: [ssc_hssc_subjects_needed, ".ssc_hssc_frm_fields3"]
								},
							obtained_marks:{
								required: true,
								number:true,
								minlength:1,
							},
							total_marks:{
								required: true,
								number:true,
								minlength:1,
							},							
							attachment:{
								required:function(){
									if(loop < 5){
										return form.find("select[name='certificate']").val() != "";
									}else{
										return form.find("input[name='other']").val() != "";
									}
								},extension: "jpg|jpeg|png|gif|pdf"
								,filesize:5242880
							},
							obtained_marks:{
								min:0,number:true,
							},
							total_marks:{
								min:0,number:true,
							}							
						},messages:{
							grade_cgpa:{
								required:"Enter Grade/CGPA"
								},
							level_subject:{
								require_from_group:"These field(s) are required"
								},
							subject_grade:{
								require_from_group:"These field(s) are required"
								},								
							subject_id:{
								require_from_group:"These field(s) are required"
								},
							subject_obtained_marks:{
								require_from_group:"These field(s) are required"
								},
							subject_total_marks:{
								require_from_group:"These field(s) are required"
								},								
						},
						invalidHandler: function(form, validator){
							if(!validator.numberOfInvalids())
								return;
							$('html, body').animate({scrollTop: $(validator.errorList[0].element).offset().top - 100}, 1000);
						}
					}).form();
				/**/
				if(validate_form || not_applicable == 1){	
					var formParams = form.serializeArray();
					var form_data = JSON.stringify(formParams);
					form_data_array.data.push(formParams);
					var file_data = form.find('input[name="attachment"]').get(0).files[0];
					if(file_data != undefined){
						formData.append("attachment_"+loop, file_data);
					}
				}else{
					breakLoop	= true;
					return false;
					}	
				//Increment
				loop = loop+1;
				});
				
			/**/
			if(breakLoop == false){	
				var form_data = JSON.stringify(form_data_array);
				formData.append("form_data", form_data);
                var post_data = JSON.stringify({action:"save_form_data",step_type:"academic_record",step_number:stepnumber});
				formData.append("post_data",post_data);
                submitFormData	= true;
                isStepValid		= true;
            }else{
                isStepValid = false;
				}
			}
			
			//Step # 3
			if(stepnumber == 3){
				var form_data_array = {"data":[],"innerDataExp":[],"innerDataExams":[],"innerDataTraining":[]};
				var validate_forms = true;
				var formData		= new FormData();
				/**/
				if($("form[id='profile_fulltime_exp']") && $("form[id='profile_fulltime_exp']").length > 0){
					var validate_form = $("#profile_fulltime_exp").validate({
						rules:{
							total_exp_years:{
								required:true,
								number:true,
								min:0,
								max:100,
							},
							total_exp_months:{
								required:true,
								number:true,
								min:0,
								max:12,
							},
						}
						,messages:{}
						,invalidHandler: function(form, validator){
							if(!validator.numberOfInvalids())
								return;
								$('html, body').animate({scrollTop:($(validator.errorList[0].element).offset().top - 50)},1000);
						}
						}).form();
					if(validate_form){
						isStepValid = true;
						var profile_fulltime = $("#profile_fulltime_exp").serializeArray();
						form_data_array.data.push({"fulltime_exp":profile_fulltime});
					}else{
							isStepValid = false;
							return false
						}
					}
				/*Work experience*/	
				if($("form[id^='frm_work_experience_']") && $("form[id^='frm_work_experience_']").length > 0){
					var breakLoop		= false;
					var loop = 1;
                    $.this_form_submit = true;
                        $("form[id^='frm_work_experience_']").each(function(e){
							var $this_form = $(this);
							var validate_form = $this_form.validate({
								rules:{
									organization:"required",
									position:"required",
									currently_working:"required",
									from_date:"required",
									supervisor_name:"required",
									}
									,messages:{}
									,invalidHandler: function(form, validator){
										if(!validator.numberOfInvalids())
											return;
											$('html, body').animate({scrollTop:($(validator.errorList[0].element).offset().top - 50)},1000);
										}
									}).form();
									/**/
									if(validate_form){
										var work_experience = $this_form.serializeArray();
										form_data_array.innerDataExp.push(work_experience);
									}else{
										breakLoop	= true;
										return false;
									}
							
							loop = loop+1;
						});	
					
						/**/
						if(breakLoop == false){
							//form_data_array.data.push({"work_experience":form_data_array.innerDataExp});
						}else{
							isStepValid = false;
							return false;
						}
					}
				/*International exams*/
				if($("form[id^='frm_intern_exams']") && $("form[id^='frm_intern_exams']").length > 0){
					var validate_forms = $("#frm_intern_exams1").validate({
						rules:{
							mathematics:{
								required:true,
								number:true,
								max:800,
							},
						evidence_based_r_w:{
							required:true,
							number:true,
							max:800,
						},
						essay_reading:{
							required:false,
							number:true,
							max:8,
						},
						essay_analysis:{
							required:false,
							number:true,
							max:8,
						},
						essay_writing:{
							required:false,
							number:true,
							max:8,
						},
						satII_maths:{
							required:false,
							number:true,
							max:800,
						},	
						composite_score:{
							required:true,
							number:true,
							max:36
						},
						english_writing_score:{
							required:true,
							number:true,
							max:36
						},
						quantitative_gre:{
							required:true,
							number:true,
							min:130,
							},
						verbal_gre:{
							required:true,
							number:true,
							min:130,
							},	
						score_grade:{
							required:true,
							number:true,
							min:600
							},
						CB_student_ID:{
							required:true,
						},	
						score_card:{
							required:true,
							extension: "jpg|jpeg|png|gif|pdf",
							filesize:5242880,
							},	
						},
                    messages:{},
                    invalidHandler: function(form, validator){
                        if(!validator.numberOfInvalids())
                            return;
                        $('html, body').animate({scrollTop:($(validator.errorList[0].element).offset().top - 50)},1000);
                    }
                }).form();
				if(validate_forms){
					$("form[id^='frm_intern_exams']").each(function(e){
						var intern_exams = $(this).serializeArray();
						form_data_array.innerDataExams.push(intern_exams);
					});
                	form_data_array.data.push({"intern_exams":form_data_array.innerDataExams});
				}else{
                    isStepValid = false;
                    return false;
                }
            }
			
			/**/	
			if($("form[id='frm_supporters']") && $("form[id='frm_supporters']").length > 0){
                var validate_form = $("#frm_supporters").validate({
                rules:{
                    supported_by:{
                        required:true
                        },
                    supp_first_name:{
                        required:function(){ 
                        return $("#supported_by").val() != "self";}
                        ,lettersonly: true
                        ,maxlength:50
                        },
                    supp_last_name:{
                        required:function(){
                        return $("#supported_by").val() != "self";}
                        ,lettersonly: true
                        ,maxlength:50
                        },
                    relationship:{
                        required:function(){
                            return $("#supported_by").val() != "self";}
                            ,maxlength:50
                        },
                    supp_profession:{
                        required:function(){
                            return $("#supported_by").val() != "self";}
                            ,maxlength:50
                        },
                    supp_contact_no:{
                        required:function(){
                            return $("#supported_by").val() != "self";}
                        ,number:true
                        ,minlength:11
                        ,maxlength:13
                        },
                    supp_email:{
                        email:true
                    }
                }
                ,messages:{}
                ,invalidHandler: function(form, validator){
                    if(!validator.numberOfInvalids())
                        return;
                    $('html, body').animate({scrollTop:($(validator.errorList[0].element).offset().top - 50)},1000);
                }
            }).form();
            if(validate_form){
                isStepValid = true;
                var supporters_info = $("#frm_supporters").serializeArray();
                form_data_array.data.push({"supporters_info":supporters_info});
            }else{
                isStepValid = false;
                return false
				}
            }
			
			/**/
			if($("form[id='frm_more_info']") && $("form[id='frm_more_info']").length > 0){
                var validate_forms = $("#frm_more_info").validate({
                    rules:{	
						hear_about_us:{
							required:true,
							}							
						},
                    messages:{},
                    invalidHandler: function(form, validator){
                        if(!validator.numberOfInvalids())
                            return;
                        $('html, body').animate({scrollTop: $(validator.errorList[0].element).offset().top + 50}, 1000);
                    }
                }).form();
                if(validate_forms){
                    isStepValid = true;
                    var more_info = $("#frm_more_info").serializeArray();
                    form_data_array.data.push({"more_info":more_info});

                }else{
                    isStepValid = false;
                    return false
                }
            }
			
			/**/
			if($("form[id='user_more_questions']") && $("form[id='user_more_questions']").length > 0){
                var validate_forms = $("#user_more_questions").validate({
                    rules:{
						convicted:{required:true},
						indicted:{required:true},
						extradited:{required:true},
						psychiatric:{required:true},
						convicted_details:{
							required:function(){
								return $("input[name='convicted']").val() == "Yes";	
								}
							},
						indicted_details:{
							required:function(){
								return $("input[name='indicted']").val() == "Yes";	
								}
							},
						extradited_details:{
							required:function(){
								return $("input[name='extradited']").val() == "Yes";	
								}
							},
						psychiatric_details:{
							required:function(){
								return $("input[name='psychiatric']").val() == "Yes";	
								}
							},
						},
                    messages:{
						convicted:{required:"Check Yes Or No"},
						indicted:{required:"Check Yes Or No"},
						extradited:{required:"Check Yes Or No"},
                        psychiatric:{required:"Check Yes Or No"}
						},
                    invalidHandler: function(form, validator){
                        if(!validator.numberOfInvalids())
                            return;
                        $('html, body').animate({scrollTop: $(validator.errorList[0].element).offset().top + 30}, 1000);
                    }
                }).form();
                if(validate_forms){
                    isStepValid = true;
                    var more_questions = $("#user_more_questions").serializeArray();
                    form_data_array.data.push({"more_questions":more_questions});
                }else{
                    isStepValid = false;
                    return false
                }
            }
			
			/**/
			if(isStepValid == true){
				submitFormData 	= true;
				var file_data = $("#frm_intern_exams1").find('input[name="score_card"]').get(0).files[0];
				if(file_data != undefined){
					formData.append("score_card", file_data);
				}
				var form_data = JSON.stringify(form_data_array);
				formData.append("form_data", form_data);
                var post_data = JSON.stringify({action:"save_form_data",step_type:"more_info",step_number:stepnumber});
				formData.append("post_data",post_data);
			}
		}
		if(stepnumber == 4){
			return true;
		}
		if(stepnumber == 5){
			return true;
		}
		if(stepnumber == 6){
			return true;
		}
		/**/
		if(submitFormData == true){
			isStepValid = true;	
			$.ajax({url:"ajax",dataType:'json',method:"post",processData:false,contentType:false,data:formData,success:function(response) {
				if(response.status == "ok"){
					/*return true;*/
					if(response.step_type == "more_info"){
						  $bypass_submit_step = true;
						 $('#form-wizard').smartWizard("goToStep", 3);
					}
					
				}else{
					if(response.error){
						bootbox.alert(response.error);
						}
						return false;
						}
					}
				});
			}
		
		return isStepValid;
	}
	
	/**/
    $(document).on('change', '#photo_upload', function(){
        var photoForm = new FormData();
        var photo = $('#photo_upload')[0].files;
        if(photo.length){
            $(".imgUpload-alert").removeClass("alert-danger").addClass("alert-info").show().empty().text("Uploading...");
            photoForm.append('photo_upload',photo[0]);
            photoForm.append('action','photo_upload');
			$.ajax({url:'ajax', type: 'post', data: photoForm, contentType: false, processData: false, success: function(response){
                response = JSON.parse(response);
                if(response.success){
					$("#user-image").attr("src",response.img_url);
					$(".imgUpload-alert").removeClass("alert-danger").addClass("alert-success").show().empty().hide(); 
                    $(".preview img").show();
                }else{
					$(".imgUpload-alert").removeClass("alert-danger").addClass("alert-danger").show().empty().text(response.error); 
                 }},
				 });
			}
        return false;
        });
		
	/**/
	$(document).on('change', "select#marital_status", function(){	
		var this_value = $(this).val();
		if(this_value == "Married"){
			$("#spouse_info_box").show();
		}else{
			$("#spouse_info_box").hide();
			$("#spouse_first_name, #spouse_last_name, #spouse_cnic").val("");
		}
		
	 });
	 
	 /**/
	$(document).on('change', "select#is_disable", function(){	
		var this_value = $(this).val();
		if(this_value == "1"){
			$("#disability_opt_box").show();
		}else{
			$("#disability_opt_box").hide();
			$("#disability").val("");
		}
		
	 });
	 
	/**/
	$(document).on('change',"[name='studied_before']",function() {
		if($(this).val() == 1){
			$("#erp_id").closest(".form-group").show();
			$("#erp_id").attr("required", "true");
		}else{
			$("#erp_id").val("");
			$("#erp_id").closest(".form-group").hide();
			$("#erp_id").removeAttr("required");
		}
	});
	
	/**/
	$(document).on("change", "#acad_not_applicable", function(){
        if($(this).is(':checked')){
			$(this).val("1");
        }else{
            $(this).val("0");
        }
    });
	
	/**/
	$(document).on("change", "select[name ^= 'certificate']", function(){
		$(this).closest("form").find("select[name='result_status']").val("");
        if($('option:selected', this).text() == "O-Level"){
			$(this).closest("form").find("input[name='other']").hide();
			$(this).closest("form").find("#level_subjects").show();
			$(this).closest("form").find("div.acad_marks_box").hide();
			$(this).closest("form").find("div.acad_grade_cgpa_box").hide().find("input").val("");
			$(this).closest("form").find("select[name = 'level_subject'], input[name = 'subject_grade'], select[name = 'subject_grade']").val("").attr("disabled",false);
			$(this).closest("form").find("#ssc_hssc_subjects").hide();
		}else if($('option:selected', this).text() == "A-Level"){
			$(this).closest("form").find("input[name='other']").hide();
            $(this).closest("form").find("#level_subjects").show();
			$(this).closest("form").find("div.acad_marks_box").hide();
			$(this).closest("form").find("select[name = 'level_subject'], input[name = 'subject_grade'], select[name = 'subject_grade']").val("").attr("disabled",false);
			$(this).closest("form").find("div.acad_grade_cgpa_box").hide().find("input").val("");
			$(this).closest("form").find("#ssc_hssc_subjects").hide();
		}else if($(this).val() == "other"){
            $(this).closest("form").find("input[name='other']").show();
			$(this).closest("form").find("div.acad_marks_box").show();
            $(this).closest("form").find("#level_subjects").hide();
			$(this).closest("form").find("select[name = 'level_subject'], input[name = 'subject_grade'], select[name = 'subject_grade']").val("").attr("disabled",true);
			$(this).closest("form").find("div.acad_grade_cgpa_box").show();
			$(this).closest("form").find("#ssc_hssc_subjects").hide();
        }else{
            $(this).closest("form").find("input[name='other']").val("").hide();
            $(this).closest("form").find("#level_subjects").hide();
            $(this).closest("form").find("select[name = 'level_subject'], input[name = 'subject_grade'], select[name = 'subject_grade']").val("").attr("disabled",true);
			$(this).closest("form").find("div.acad_marks_box").show();
			$(this).closest("form").find("div.acad_grade_cgpa_box").show();
			$(this).closest("form").find("#ssc_hssc_subjects").show();
        }
    });
	
	/**/
	$(document).on("change","[name='result_status']",function(event){
		var parent_obj = $(this);
		if($(this).val() == "Exam given and result in Hand"){
			parent_obj.closest("form").find(".attachment_lbl_extra").html("Final Transcript/Mark sheet/CAIE");
			parent_obj.closest("form").find("[id^='attachment_']").show();
			if($('option:selected', parent_obj.closest("form").find("[name='certificate']")).text() == "A-Level"){
				parent_obj.closest("form").find("div.acad_marks_box").hide().find("input").val("");
				parent_obj.closest("form").find("div.acad_grade_cgpa_box").hide().find("input").val("");
			}else{
				parent_obj.closest("form").find("div.acad_marks_box").show();
				parent_obj.closest("form").find("div.acad_grade_cgpa_box").show();
			}
		}else if($(this).val() == "Exam given - Result Pending"){
			parent_obj.closest("form").find("div.acad_marks_box").hide();
			parent_obj.closest("form").find("[id^='attachment_']").show();
			parent_obj.closest("form").find(".attachment_lbl_extra").html("First Year Transcript/Mark sheet/CAIE");
			parent_obj.closest("form").find("div.acad_grade_cgpa_box").hide();
		}else if($(this).val() == "Promoted and result awaited"){
			parent_obj.closest("form").find("[id^='attachment_']").hide();
			parent_obj.closest("form").find("div.acad_marks_box").hide().find("input").val("");
			parent_obj.closest("form").find("div.acad_grade_cgpa_box").hide();
		}else if($(this).val() == "Exam will be given in the next six months"){
			parent_obj.closest("form").find("div.acad_marks_box").hide().find("input").val("");
			parent_obj.closest("form").find("[id^='attachment_']").show();
			parent_obj.closest("form").find(".attachment_lbl_extra").html("First Year Transcript/Mark sheet/CAIE");
			parent_obj.closest("form").find("div.acad_grade_cgpa_box").hide();
		}
	});
	
	/**/
    $(document).on("click","input[name='add_more_subject']",function(event){
        var current_object = $(this);
        var current_object_size = $(this).closest('form').find("[name='level_subject']").length;
        if(current_object_size < 15){
            var object_clone = $(this).closest(".inner_level_subject_contents").last().clone();
            object_clone.find('input,select').attr("disabled",false);
            //object_clone.find('span').text(parseInt(current_object_size)+1+".");
			object_clone.find('input[type="text"], select').val("");
            current_object.closest(".level_subjects").append(object_clone).animate({opacity:"show"},"slow");
        }else{
            bootbox.alert("Sorry! You can not add more then 15 subjects");
            return false;
        }
    });
	
	/**/
 	$(document).on("click","input[name='remove_subject']",function(event){
		var subject_type = $(this).closest('form').find("[name='certificate']").val(); 
		var countRecords = $(this).closest('form').find("[name='level_subject']").length;
		if(subject_type == 3 && countRecords <= 5){
			bootbox.alert("Sorry! You should have at least 5 subjects");
		}else if(subject_type == 4 && countRecords <= 3){
			bootbox.alert("Sorry! You should have at least 3 subjects");
		}else{
			$(this).closest('#level_subject_div').remove();
		}
	 });
	 
	 /**/
	$(document).on("click","a[id='change_file']",function(event){
		var parent_obj = $(this);
		parent_obj.closest("form").find("[id^='attachment']").show();
		return false;
	});
	
	/**/
	$(document).on("click","a[id='change_score_card']",function(event){
		var parent_obj = $(this);
		parent_obj.closest("form").find("[id^='score_card']").show();
		return false;
	});
	/**/
	$(document).on("change","[name='course_name']",function(event){
		$(".sat1_fields_box, .act_fields_box, .gre_fields_box, .gmat_fields_box").hide().find("input").val("");
		$("#di_code_sat, #di_code_act, #di_code_gre").hide();
		$(".score_card_box").hide();
		if($(this).val() == "SAT I"){
			$(".sat1_fields_box").show().find("input").val("");
			$(".score_card_box").show();
			$("#di_code_sat").show();
		}else if($(this).val() == "ACT"){
			$(".act_fields_box").show().find("input").val("");
			$(".score_card_box").show();
			$("#di_code_act").show();
		}else if($(this).val() == "GRE"){
			$(".gre_fields_box").show().find("input").val("");
			$(".score_card_box").show();
			$("#di_code_gre").show();
		}else if($(this).val() == "GMAT"){
			$(".gmat_fields_box").show().find("input").val("");
			$(".score_card_box").show();
		}
	});
	
	/**/
	$(document).on("change","[name='supported_by']",function(event){
		if($(this).val() == "Self"){
			$("#supp_first_name, #supp_last_name, #supp_profession, #supp_designation, #supp_contact_no, #supp_email, #supp_cnic").val("").attr("readonly",true);
		}else{
			$("#supp_first_name, #supp_last_name, #supp_profession, #supp_designation, #supp_contact_no, #supp_email, #supp_cnic").val("").attr("readonly",false);
		}
	});
	
	/**/
	$(document).on("change","[name='convicted'],[name='indicted'],[name='extradited'],[name='psychiatric']",function(event){
        if($(this).attr('name') == "convicted"){
           if($(this).val() == "Yes"){
               $("[name='convicted_details']").attr("disabled",false);
           }else{
               $("[name='convicted_details']").val("").attr("disabled",true);
           }
        }else if($(this).attr('name') == "indicted"){
            if($(this).val() == "Yes"){
                $("[name='indicted_details']").attr("disabled",false);
            }else{
                $("[name='indicted_details']").val("").attr("disabled",true);
            }
        }else if($(this).attr('name') == "extradited"){
            if($(this).val() == "Yes"){
                $("[name='extradited_details']").attr("disabled",false);
            }else{
                $("[name='extradited_details']").val("").attr("disabled",true);
            }
        }else if($(this).attr('name') == "psychiatric"){
            if($(this).val() == "Yes"){
                $("[name='psychiatric_details']").attr("disabled",false);
            }else{
                $("[name='psychiatric_details']").val("").attr("disabled",true);
            }
        }
    });
	
	/**/
	$(document).on("keyup","#personal_statement",function(){
		var resultArray = [];
		  var str = this.value.replace(/[\t\n\r\.\?\!]/gm,' ');
		  var wordArray = str.split(" ");
		  for (var i = 0; i < wordArray.length; i++) {
				var item = wordArray[i].trim();
				if(item.length > 0){
				  resultArray.push(item);
				}
			  }	  
		  $("#span_wc_ps").html(resultArray.length);
	});
	
	/**/
	$(document).on("keyup","[id ^= 'personal-statements_']",function(){
		var objectId 	= $(this).attr('id');
		var objectNo 	= objectId.split("_");
		/**/
		var resultArray = [];
		  var str = this.value.replace(/[\t\n\r\.\?\!]/gm,' ');
		  var wordArray = str.split(" ");
		  for (var i = 0; i < wordArray.length; i++) {
				var item = wordArray[i].trim();
				if(item.length > 0){
				  resultArray.push(item);
				}
			  }	  
		  $("#span_wc_ps_"+objectNo[1]).html(resultArray.length);
	});
	/**/
	$(document).on("click","button[name='frm_apply_submit']",function(){
		$apply_button 	= $(this);
		$appy_form		= $apply_button.closest('form');
		var validate_forms = $($appy_form).validate({
                    rules:{
						test_center:"required",
						program_priority_no1:"required",
						personal_statements:{
							required:true,
							wordCountMax:['600']
							},
						},
                    messages:{
						},
                    invalidHandler: function(form, validator){
                        if(!validator.numberOfInvalids())
                            return;
                        //$('html, body').animate({scrollTop: $(validator.errorList[0].element).offset().top + 30}, 1000);
                    }
                }).form();
			/**/	
			if(validate_forms){
				$apply_button.attr("disabled",true);
				$($appy_form).find(".apply_progress_display").show().find(".alert-warning").show().html("Loading Please wait...");
				var formData		= new FormData();
				formData.append("form_data", JSON.stringify($($appy_form).serializeArray()));
				formData.append("post_data",JSON.stringify({action:"apply_form_submitted"}));
				$.ajax({url:"ajax",dataType:'json',method:"post",processData:false,contentType:false,data:formData,success:function(response){
				if(response.success){
					$($appy_form).find(".apply_progress_display").find(".alert-warning").hide().html("");
					$($appy_form).find(".apply_progress_display").find(".alert-success").show().html(response.success);
					setTimeout(function() {
						location.reload();
						}, 3000);
					/*return true;*/
				}else{
					$($appy_form).find(".apply_progress_display").find(".alert-success").hide().html("");
					$($appy_form).find(".apply_progress_display").find(".alert-warning").show().html(response.error);
					}
				}});	
			}				
		return false;
	});
	
	/**/
	$("#frm_change_password").validate({
		rules: {			
			password: {
				required: true,
				minlength: 8,
				maxlength:20,
				passwordFormatCheck:true,
			},
			confirm_password: {
				required: true,
				minlength: 8,
				maxlength:20,
				equalTo: "#password",
			},
		},
		messages: {
			password: {
				required: "Please provide a password",
				minlength: "Your password must be at least 8 characters long"
			},
			confirm_password: {
				required: "Please provide a password",
				minlength: "Your password must be at least 8 characters long",
				equalTo: "Please enter the same password as above"
			},
		},
		errorElement: "em",
		errorPlacement: function ( error, element ) {
		error.addClass("help-block");
		if ( element.prop("type") === "checkbox") {
			error.insertAfter(element.parent("label"));
		} else {
			error.insertAfter(element);
			}
		},
		highlight: function ( element, errorClass, validClass ) {
			$(element).parents(".col-sm-5").addClass( "has-error").removeClass("has-success");
		},
		unhighlight: function (element, errorClass, validClass) {
			$(element).parents(".col-sm-5").addClass("has-success").removeClass("has-error");
		}
	});
	
	/**/
	$(document).on("click","button[name='btn_add_work_exp']",function(){
		$work_experience_content = $("#work_experience_content");
		//$work_experience_content.toggle("slow");
		$work_experience_content.show("slow");
		return false;
	});
	
	/**/
	$(document).on("click","button[name ^= 'btn_add_more_work_exp']",function(){
		var current_object = $(this);
		$this_form 		= $(this).closest('form');
		$this_form_id 	= $this_form.attr('id');
		//$object_split = $this_form_id.split("_");
		$last_id	= $this_form_id.substring($this_form_id.lastIndexOf("_")+1,$this_form_id.length);
		$new_id		=  parseInt($last_id) + 1;
		var validate = validate_experience_form($this_form);
		if(validate){
            var object_clone = $this_form.closest("#work_experience_inner_content").last().clone();
			object_clone.find("button[name='btn_remove_more_work_exp']").show();
			object_clone.find("input").val("").removeAttr('checked');
			object_clone.find("form").attr("id","frm_work_experience_"+$new_id);
			object_clone.find("#work_exp_inner_box_"+$last_id).attr("id","work_exp_inner_box_"+$new_id);
            current_object.closest("#work_experience_inner_content").append(object_clone).animate({opacity:"show"},"slow");
			$this_form.find("button[name='btn_add_more_work_exp']").hide();
			$this_form.find("button[name='btn_remove_more_work_exp']").show();				
		}
		return false;
	});
	
	/**/
	$(document).on("click","button[name='btn_remove_more_work_exp']",function(){
		var current_object = $(this);
		$this_form 		= $(this).closest('form');
		$this_form_id	= $this_form.attr('id');
		$record_id		= $this_form.find("input[name='id']").val();
		$last_id		= $this_form_id.substring($this_form_id.lastIndexOf("_")+1,$this_form_id.length);
		$before_last	= parseInt($last_id) - 1;
		var current_object_size = $("form[id ^= 'frm_work_experience_']").length;
		if(current_object_size == 1){
			bootbox.alert("Sorry! You can not remove the last item");
		}else{
			bootbox.confirm("Are you sure",function (result){
				if(result) {
					//Ajax Call here to remove the Item.
					var formData		= new FormData();
					formData.append("post_data",JSON.stringify({action:"remove_work_exp","record_id":$record_id}));
					$.ajax({url:"ajax",dataType:'json',method:"post",processData:false,contentType:false,data:formData,success:function(response){
						//bootbox.alert(response.success);
					}});
					if($before_last == 1){
						$("form#frm_work_experience_"+$last_id).find("button[name='btn_add_more_work_exp']").show();
					}else{
						$("form#frm_work_experience_"+$before_last).find("button[name='btn_add_more_work_exp']").show();
					}
					$this_form.closest("div#work_exp_inner_box_"+$last_id).remove();
					}
				});
			}
		return false;
	});
	
	/**/
	function validate_experience_form(form){
		var validate_form = $(form).validate({
		rules: {
			organization: "required",
			position: "required",
			currently_working: "required",
			from_date: "required",
			to_date: function(){
				return form.find("input[name='currently_working']:checked").val() == 0;
			},
			supervisor_name: "required",
		},
		messages: {
		},
		errorElement: "em",
		errorPlacement: function ( error, element ) {
		error.addClass( "help-block" );
		if ( element.prop( "type" ) === "checkbox" ) {
			error.insertAfter( element.parent( "label" ) );
		} else {
			error.insertAfter( element );
			}
		},
		highlight: function ( element, errorClass, validClass ) {
			$( element ).parents( ".col-sm-5" ).addClass( "has-error" ).removeClass( "has-success" );
		},
		unhighlight: function (element, errorClass, validClass) {
			$( element ).parents( ".col-sm-5" ).addClass( "has-success" ).removeClass( "has-error" );
		}
	}).form();
	if(validate_form){
		return true;
	}else{
		return false;
	}
	
	}
	
	/**/
	$("#frm_forgot_password").validate({
		rules: {
			cnic_no:{
				required: true,
			},
			email:{
				required: true,
				email:true,
			},
		},
		messages: {
		},
		errorElement: "em",
		errorPlacement: function (error, element) {
		error.addClass("help-block");
		if (element.prop("type") === "checkbox") {
			error.insertAfter(element.parent("label"));
		} else {
			error.insertAfter(element);
			}
		},
		highlight: function ( element, errorClass, validClass ) {
			$(element).parents(".col-sm-5").addClass( "has-error").removeClass("has-success");
		},
		unhighlight: function (element, errorClass, validClass) {
			$(element).parents(".col-sm-5").addClass("has-success").removeClass("has-error");
		}
	});
	
	/**/
	$(document).on("click","a[id='resend_mobile_code']",function(){
		$mobile_number = $("#mobile_no").val();
		$country_code  = $("select[name='country_code']").val();
		if($mobile_number.length < 5 || $mobile_number.length > 15){
			bootbox.alert("Sorry! You have entered invalid mobile number. ");
			$("#mobile_no").focus();
		}else{
			bootbox.confirm("Make sure you have entered correct mobile number.<br> Should we resend the code?",function (result){
			if(result) {
				var formData		= new FormData();
				formData.append("post_data",JSON.stringify({action:"resend_mobile_code","mobile_no":$mobile_number,"country_code":$country_code}));
				$.ajax({url:"ajax",dataType:'json',method:"post",processData:false,contentType:false,data:formData,success:function(response){
					bootbox.alert(response.success);
				}});
				
			}});
		}			
		return false;
	});
	
	/**/
	$(document).on('keyup',"input[name='obtained_marks'],input[name='total_marks']",function(e){
        var form_id = $(this).closest("form").attr('id');
        var obtained_marks  = parseInt($("#"+form_id).find("input[name='obtained_marks']").val());
        var total_marks = parseInt($("#"+form_id).find("input[name='total_marks']").val());
        if(obtained_marks > 0 && total_marks > 0){
            var percentage_result = ((obtained_marks / total_marks) * 100).toFixed(2);
            if(percentage_result != "NaN"){
                $("#"+form_id).find("input[name='percentage']").val(percentage_result);
            }
        }else{
            $("#"+form_id).find("input[name='percentage']").val(0);
        }
    });
	
	/**/
	$(document).on('keyup',"input[name='subject_obtained_marks'],input[name='subject_total_marks']",function(e){
		var $subject_box = $(this).closest(".inner_ssc_hssc_contents");
		var obtained_marks  = parseInt($subject_box.find("input[name='subject_obtained_marks']").val());
        var total_marks 	= parseInt($subject_box.find("input[name='subject_total_marks']").val());
        if(obtained_marks > 0 && total_marks > 0){
            var percentage_result = ((obtained_marks / total_marks) * 100).toFixed(2);
            if(percentage_result != "NaN"){
                $subject_box.find("input[name='subject_percentage']").val(percentage_result);
            }
        }else{
            $subject_box.find("input[name='subject_percentage']").val(0);
        }
	});
	
	/**/
    $(document).on("click","input[name='add_more_ssc_hssc_subject']",function(event){
        var current_object = $(this);
        var current_object_size = $(this).closest('form').find("[name='subject_id']").length;
        if(current_object_size < 15){
            var object_clone = $(this).closest(".inner_ssc_hssc_contents").last().clone();
            object_clone.find('input,select').attr("disabled",false);
			object_clone.find('input[type="text"], select').val("");
            current_object.closest(".ssc_hssc_subjects").append(object_clone).animate({opacity:"show"},"slow");
        }else{
            bootbox.alert("Sorry! You can not add more then 15 subjects");
            return false;
        }
    });

	/**/
 	$(document).on("click","input[name='remove_ssc_hssc_subject']",function(event){
		var subject_type = $(this).closest('form').find("[name='certificate']").val(); 
		var countRecords = $(this).closest('form').find("[name='subject_id']").length;
		if(subject_type == 1 && countRecords <= 3){
			bootbox.alert("Sorry! You should have at least 3 subjects");
		}else if(subject_type == 2 && countRecords <= 3){
			bootbox.alert("Sorry! You should have at least 3 subjects");
		}else{
			$(this).closest('.inner_ssc_hssc_contents').remove();
		}
	 });
	 
	/**/
	$(document).on("click","button[id ^= 'scheduleOnlineTestBtn']",function(event){
		var objectId 	= $(this).attr('id');
		return load_cbt_slots_objects(objectId,'new');
	});
	
	/**/
	$(document).on("click","button[id ^= 'ViewscheduledOnlineTestBtn']",function(event){
		var objectId 	= $(this).attr('id');
		return load_cbt_slots_objects(objectId,'view');
	});
	
	/**/
	$(document).on("click","button[id ^= 'ChangeSlotBtn_']",function(event){
		$(this).attr("disabled",true);
		var objectId 	= $(this).closest("h3").find("button[id ^= 'ViewscheduledOnlineTestBtn']").attr('id');
		return load_cbt_slots_objects(objectId,'change');
	});
	
	/**/
	function load_cbt_slots_objects(objectId, action_status){
		var objectNo 	= objectId.split("_");
		$("[id ^= scheduleOnlineTestModalTbl_"+objectNo[1]+"_paginate]").empty().hide();
		$("#scheduleOnlineTestModalLoading_"+objectNo[1]).text("Loading...").show();
		if(action_status != "change"){
			$("#viewScheduledOnlineTestModalTbl_"+objectNo[1]).hide();
		}
		if(action_status == "change"){
			$("#scheduleOnlineTestModalTblHead_"+objectNo[1]).empty().append("<tr><td colspan='6'><strong>Please select a slot from below given list to change your reservation.</strong></td></tr>");
		}
		$("#scheduleOnlineTestModalTbl_"+objectNo[1]).hide();
		$("button[id ^= 'bookbtn']").attr("disabled",false).show();
		$("img[id ^= 'bookloader']").hide();
		var UserApplId 	= $("#scheduleOnlineTestAppl_"+objectNo[1]).val();
		var formData	= new FormData();
		formData.append("post_data",JSON.stringify({action:"load_onlinetest_slots","appl_id":UserApplId,"action_status":action_status}));
		$.ajax({url:"ajax",method:"post",processData:false,contentType:false,data:formData,success:function(response){
			$("#scheduleOnlineTestModalLoading_"+objectNo[1]).hide();
			if(action_status == "view"){
				$("#viewScheduledOnlineTestModalTbl_"+objectNo[1]).show();
				$("#ViewscheduledOnlineTestModalTblBody_"+objectNo[1]).html(response);
			}else{
				$("#scheduleOnlineTestModalTblBody_"+objectNo[1]).html(response);
				$("#scheduleOnlineTestModalTbl_"+objectNo[1]).show();
				$('#scheduleOnlineTestModalTbl_'+objectNo[1]).DataTable({
					  "pagingType": "simple",
					  "language": {
						"emptyTable": "No online test scheduling available for your selected test center."
						},					  
                      "destroy": true, //use for reinitialize datatable
					  "ordering": false,
					  "info":false,
					  "searching":false,
					  "lengthChange": false,
					  "pageLength": 6,
					  "autoWidth": false,
					  "columnDefs": [
						{ "width": "23%", "targets": 0},
						{ "width": "13%", "targets": 1},
						{ "width": "18%", "targets": 2},
						{ "width": "18%", "targets": 3},
						{ "width": "13%", "targets": 4},
						{ "width": "15%", "targets": 5},
					  ],
					  fixedColumns: true,
                   });
			}
		}});
	}
	
	/**/
	$('.email_sent_div').hide();
	var timeleft = 60;
    var downloadTimer = setInterval(function(){
	    timeleft--;
	    $('.timer_span').html("Resend code: "+timeleft);
	    if(timeleft <= 0){
	    	clearInterval(downloadTimer);
	    	$('.timer_span').hide();
	    	$('.resend_email_link_span').show();
	    }
    },1000);
	});
/**/
$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results[1] || 0;
}
/**/
function resend_email_code(){
	$('.email_sent_div').html("Sending....");
	$('.email_sent_div').show();
	var email = $.urlParam('email');
	$.post("resend_email_code",{email: email},function(res){
		res = $.parseJSON(res);
		if(res.success){
			$('.email_sent_div').html(res.msg);
			$('.email_sent_div').show();
				setTimeout(function(){
				$('.email_sent_div').hide();
				},5000)
				$('.resend_email_link_span').hide();
				var timeleft = 60;
				var downloadTimer = setInterval(function(){
				timeleft--;
				$('.timer_span').html("Resend code: "+timeleft);
				$('.timer_span').show();
				if(timeleft <= 0){
					clearInterval(downloadTimer);
					$('.timer_span').hide();
					$('.resend_email_link_span').show();
				}
				},1000);
			}
		})
	}
/**/
function bookSlotByCandidate(slot_id, appl_id, date, unique_key){
	bootbox.confirm({
    message: "Are you sure you want to reserve this slot?",
    buttons: {
        confirm: {
            label: 'Yes',
            className: 'btn-success'
        },
        cancel: {
            label: 'No',
            className: 'btn-danger'
        }
    },
    callback: function (result) {
		if(result){
		$("[id ^= scheduleOnlineTestModalLoading]").hide();
		$("div.dataTables_paginate paging_simple").hide();
		$("[id ^= viewScheduledOnlineTestModalTbl]").hide();
		$("#bookloader"+unique_key).show();
		$("#bookbtn"+unique_key).hide();
		$("button[id ^= 'bookbtn']").attr("disabled",true);
		var formData	= new FormData();
		formData.append("post_data",JSON.stringify({action:"book_online_test_slot","slot_id":slot_id,"appl_id":appl_id,"book_date":date}));
		$.ajax({url:"ajax",dataType:'json',method:"post",processData:false,contentType:false,data:formData,success:function(response){
			if(response.error){
				$("[id ^= scheduleOnlineTestModalLoading]").html(response.error).show();
				$("#bookloader"+unique_key).hide();
			}
			if(response.success){
				$("[id ^= scheduleOnlineTestModalLoading]").html(response.success).show();
				$("#bookloader"+unique_key).hide();
				$("#bookbtn"+unique_key).closest("tr").css("backgroundColor","green");
				$("#cap_avl_"+unique_key).text(response.remaining_capacity);
				setTimeout(function(){
					window.location.reload(1);
				},5000);
			}
		}});
	}}
});
}

/**/
function changeSlotByCandidate(scheduled_id){
	bootbox.confirm({
    message: "Are you sure you want to change your reservation?",
    buttons: {
        confirm: {
            label: 'Yes',
            className: 'btn-success'
        },
        cancel: {
            label: 'No',
            className: 'btn-danger'
        }
    },
    callback: function (result) {
	if(result){
		$("[id ^= bookloader]").show();
		$("[id ^= slotRemoveBtn]").hide();
		var formData	= new FormData();
		formData.append("post_data",JSON.stringify({action:"remove_candidate_booked_slot","scheduled_id":scheduled_id}));
		$.ajax({url:"ajax",dataType:'json',method:"post",processData:false,contentType:false,data:formData,success:function(response){
			if(response.error){
				$("[id ^= scheduleOnlineTestModalLoading]").html(response.error).show();
				$("[id ^= bookloader]").hide();
			}
			if(response.success){
				$("[id ^= scheduleOnlineTestModalLoading]").html(response.success).show();
				$("[id ^= bookloader]").hide();
				$("[id ^= scheduleOnlineTestModalTblBody]").html("");
				setTimeout(function(){
					window.location.reload(1);
				},5000);
				}
			}});
			}
		}
	});
}
