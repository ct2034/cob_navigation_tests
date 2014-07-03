(function() {

  define(['backbone'], function(Backbone) {
    return Backbone.Model.extend({
      defaults: {
        start: '',
        end: ''
      },
      complies: function(test) {
        var date, end, start;
        date = test.get('date');
        start = this.get('start');
        end = this.get('end');
        return (!start || date >= start) && (!end || date <= end);
      }
    });
  });

}).call(this);
