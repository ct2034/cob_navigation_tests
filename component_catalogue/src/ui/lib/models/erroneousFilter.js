(function() {

  define(['backbone'], function(Backbone) {
    return Backbone.Model.extend({
      defaults: {
        show: true
      },
      complies: function(test) {
        if (this.get('show')) return true;
        return !test.get('error');
      }
    });
  });

}).call(this);
