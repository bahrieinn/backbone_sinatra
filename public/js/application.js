$(document).ready(function() {
  

  //******* BACKBONE COLLECTIONS ********//

  var Users = Backbone.Collection.extend({
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

          // $el is backbone helper to reference cached element.
          that.$el.html(template);
        }
      })
    }
  });

  //******* BACKBONE ROUTERS ********//

  var Router = Backbone.Router.extend({
    routes: {
      '' : 'home'
    }
  });

  //******* INITIALIZE OBJECTS AND START ********//

  var userList = new UserList();

  var router = new Router();
  
  router.on('route:home', function() {
    userList.render();
  });

  Backbone.history.start();
});
