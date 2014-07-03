(function() {

  define(['backbone'], function(Backbone) {
    return Backbone.Model.extend({
      defaults: {
        sorting: 'date',
        erroneousFilter: null
      }
    });
  });

}).call(this);
