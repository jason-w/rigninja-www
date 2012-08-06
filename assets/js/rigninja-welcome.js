$(document).ready(function() {
	/*
	 todo will be an object of functions that makes our to-do list run
	 cm will be an instance of the cloudmine.WebService library object
	 */
	var ninjaHq = {}, cm = {};

	/*
	 Binding UI events to buttons, and login on hitting Enter while in the password field. Focus on the email field automatically.
	 */
	$('#ninja-tag').keyup(function() {
		clearTimeout($.data(this, 'timer'));
		var wait = setTimeout(ninjaHq.check_ninja_tag, 500);
		$(this).data('timer', wait);
	});
	$('#sign-up-button').click(function() {
		ninjaHq.sign_up();
	});
	$('#lninja-tag').focus();

	/*
	 Function to initialize the cloudmine.WebService library, we'll call this at the very end of $(document).ready
	 after the todo object is defined.
	 */
	var init_cloudmine = function() {

		// Set up an object with our App id and API key
		var init_vals = {
			appid : '529245ccd595492d852febbfb85ad2a0',
			apikey : '7c33a1a72cfb4af2bd75e2b50da115a7'
		}

		// Initialize Cloudmine library using everything in init_vals
		cm = new cloudmine.WebService(init_vals);
	}
	/*
	 Set up the todo object with all we need to make this to-do list work dynamically with no refreshes.
	 We'll mostly be using jQuery to manipulate DOM elements and our instance of the Cloudmine JS library - cm - to make all the data calls.
	 */
	ninjaHq = {

		available_ninja_tag : false,

		sign_up : function() {

			ninjaHq.check_tag();
			if (ninjaHq.available_ninja_tag) {

			}

		},

		check_ninja_tag : function() {
			
			var ninjaTag = $("#ninja-tag").val();
			
			if(ninjaTag.length == 0){			
				ninjaHq.clear('ninja-tag');
				return;
			}

			cm.search("[ninja-tag=\"" + ninjaTag + "\"]").on('success', function(data) {
				if (!ninjaHq.is_empty_object(data)) {
					ninjaHq.error('ninja-tag', 'not available!');
				} else {
					ninjaHq.success('ninja-tag', 'available!');
				}
			});
		},

		is_empty_object : function(item) {
			if (item) {
				for (var k in item) {
					if (item.hasOwnProperty(k))
						return false;
				}
			}
			return true;
		},

		error : function(view, message) {
			$('#error-' + view).css({
				display : 'inline'
			}).text(message);
			$('#control-group-' + view).attr('class', 'control-group error');
		},

		success : function(view, message) {
			$('#error-' + view).css({
				display : 'inline'
			}).text(message);
			$('#control-group-' + view).attr('class', 'control-group success');
		},
		
		clear : function(view) {
			$('#error-' + view).css({
				display : 'inline'
			}).text('');
			$('#control-group-' + view).attr('class', 'control-group');
		}
	}

	/*
	 After everything is defined, finally initialize Cloudmine.
	 */

	init_cloudmine();
});
