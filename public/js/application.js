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

    render: function(options){
      var that = this;
      console.log(options);
      if(options.id) {
        //GET request to grab user info
        // we replace var user, with that.user to attach user to the scope of view
        that.user = new User({id: options.id});
        that.user.fetch({
          // gets user with given ID
          success: function(user){
            var template = _.template( $('#edit-user-template').html(), {user: user} );
            that.$el.html(template);
          }
        }) 
      } else {
        //GET blank form
        var template = _.template( $('#edit-user-template').html(), {user: null} );
        this.$el.html(template);
      }
    },

    events: {
      // Backbone lets us define event listeners like 'click button' : 'doAction'
      'submit .edit-user-form' : 'saveUser',
      'click .delete' : 'deleteUser'
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
    },

    deleteUser: function(event) {
      this.user.destroy({
        // success is only triggered if it receives some json object back from the server
        success: function(){
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
      'new':'editUser',
      'edit/:id':'editUser',
      'delete/:id':'deleteUser'
    }
  });

  //******* INITIALIZE OBJECTS AND START ********//

  var userList = new UserList();
  var userForm = new EditUser();

  var router = new Router();
  
  router.on('route:home', function() {
    userList.render();
  });

  router.on('route:editUser', function(id) {
    userForm.render({id: id});
  });

  Backbone.history.start();
});
