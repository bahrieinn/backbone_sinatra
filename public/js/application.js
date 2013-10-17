$(document).ready(function() {
  
  // Snippet taken from StackOverflow to serialize form data into JSON objects
  $.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
  };  

  //******* BACKBONE MODELS ********//

  var User = Backbone.Model.extend({
    // backbone knows to append to url depending on HTTP request
    // e.g. PUT will use '/users/id'
    // but  POST will simply use '/users'
    urlRoot: '/users'
  });


  //******* BACKBONE COLLECTIONS ********//

  var Users = Backbone.Collection.extend({
    // this sets the destination of a fetch call
    url: '/users'
  });


  //******* BACKBONE VIEWS ********//

  //Change templating from ERB style <% %> to mustache style {{ }}
  _.templateSettings = {
    interpolate: /\{\{\=(.+?)\}\}/g,
    evaluate: /\{\{(.+?)\}\}/g
  };

  var UserList = Backbone.View.extend({
    el: '.page',

    render: function() {
      var that = this
      var users = new Users();
      users.fetch({
        success: function(users){
          // _.template(string literal representing HTML, data)
          var template = _.template($('#user-list-template').html(), {users: users.models});

          // $el is backbone helper to reference cached element in this case .page
          that.$el.html(template);
        }
      })
    }
  });

  var EditUser = Backbone.View.extend({
    el: '.page',

    render: function(){
      var template = _.template( $('#edit-user-template').html(), {} );

      this.$el.html(template);
    },

    events: {
      // Backbone lets us define event listeners like 'click button' : 'doAction'
      'submit .edit-user-form' : 'saveUser'
    },

    saveUser: function(event){
      var userDetails = $(event.currentTarget).serializeObject();
      var user = new User();
      user.save(userDetails, {
        success: function(user){
          //navigate back to home
          // by default, navigate only updates url, and doesnt actually trigger route
          router.navigate('', {trigger: true});
        }
      });
      return false;
    }
  });

  //******* BACKBONE ROUTERS ********//

  var Router = Backbone.Router.extend({
    routes: {
      '' : 'home',
      'new':'editUser'
    }
  });

  //******* INITIALIZE OBJECTS AND START ********//

  var userList = new UserList();
  var userForm = new EditUser();

  var router = new Router();
  
  router.on('route:home', function() {
    userList.render();
  });

  router.on('route:editUser', function() {
    userForm.render();
  });

  Backbone.history.start();
});
