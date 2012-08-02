/* 
   To-do list: sample Cloudmine app

   Features: - Simple data pushing: Creating new items, updating them as "done," and deleting them using Cloudmine object storage
             - Easy and secure user management: Logging in or registering as a new user, with the session saved 
               for seven days or until the user logs out.

   Global variables: - cloudmine:       instance of Cloudmine js library
                     - todo:            object of functions for this app
                     - priority_button: prototype for custom button that sets new todo item priority, 
                                        called by todo.draw_item

   Cloudmine library functions implemented: login, logout, createUser, update, destroy
*/

$(document).ready(function(){
  /*
    todo will be an object of functions that makes our to-do list run
    cm will be an instance of the cloudmine.WebService library object
  */
  var ninjaHq = {}, cm = {};

  /*
    Binding UI events to buttons, and login on hitting Enter while in the password field. Focus on the email field automatically.
  */
  $('#ninja-tag').keyup(function(){    ninjaHq.check_tag();    });
  $('#sign-up-button').click(function(){ ninjaHq.sign_up(); });
  $('#lninja-tag').focus();

  /*
    Function to initialize the cloudmine.WebService library, we'll call this at the very end of $(document).ready
    after the todo object is defined.
  */
  var init_cloudmine = function(){

    // Set up an object with our App id and API key
    var init_vals = {
      appid: '529245ccd595492d852febbfb85ad2a0',
      apikey: '7c33a1a72cfb4af2bd75e2b50da115a7'
    }

    // Initialize Cloudmine library using everything in init_vals
    cm = new cloudmine.WebService(init_vals);
  }

  
  /*
    Set up the todo object with all we need to make this to-do list work dynamically with no refreshes.
    We'll mostly be using jQuery to manipulate DOM elements and our instance of the Cloudmine JS library - cm - to make all the data calls.
  */
  ninjaHq = {

    available_ninja_tag: false,
    
    push_item: function(data, unique_id){
      if (unique_id == undefined){        // The unique_id will be the key for this object in Cloudmine's database.
        unique_id = new Date().getTime(); // When creating objects with Cloudmine you get to specify their key yourself.
        data = {                          // In our case, we'll use javascript's built-in new Date().getTime() to get an ID unique for the moment
          text: data.title,               // this item was created if a unique_id hasn't been specified (which means we're making a new item
          priority: data.priority,        // and not updating an existing one).
          picture: null,
          __class__: 'TBTodoItem',
          deadline: {
            __class__: 'datetime',
            timestamp: data.deadline
          },
          location: null,
          __id__: unique_id,
          done: false
        }
        callback = function(response){ todo.draw_item(data) }
      } else {
        callback = function() {}
      }

      // Make the Cloudmine library call to send the data to the cloud, along with the unique_id
      
      cm.update(unique_id, data)
        .on('success', function(){
          todo.draw_item(data);
        })
        .on('unauthorized', function(data){
          todo.error('list', data.errors[0]);
        })
        .on('notfound', function(data){
          todo.error('list', data.errors[0]);
        });
    },
    
    sign_up: function(){
    	
    	ninjaHq.check_tag();
    	if(ninjaHq.available_ninja_tag){
    		
    		
    	
    	}
    	
    },

    check_tag: function(){
      cm.search("[ninja-tag=\"" + $('#ninja-tag').val() + "\"]").on('success', function(data){
        if (!ninjaHq.is_empty_object(data))
        {
        	ninjaHq.error('ninja-tag','Sorry, this ninja tag is already taken!');
        	ninjaHq.available_ninja_tag = false;
        }
        else
        {
        	ninjaHq.success('ninja-tag','available!');
        	ninjaHq.available_ninja_tag = true;
        }
      });
    },


    is_empty_object: function(item) { 
      if (item) {
        for (var k in item) {
          if (item.hasOwnProperty(k)) return false;
        }
      }
      return true;
    },
    
    error: function(view, message){
      $('#error-' + view).css({display: 'inline'}).text(message);
      $('#control-group-' + view).attr('class','control-group error');
    },
    
    success: function(view, message){
      $('#error-' + view).css({display: 'inline'}).text(message);
      $('#control-group-' + view).attr('class','control-group success');
    }
  }

  /* 
    After everything is defined, finally initialize Cloudmine.
  */

  init_cloudmine();
});