(function() {

  define(['backbone'], function(Backbone) {
    return Backbone.Model.extend({
      defaults: {
        count: -1
      },
      complies: function(test) {
        var count, minDate;
        count = this.get('count');
        if (count < 0 || !count) return true;
        minDate = this.getMinDate();
        return test.get('date') >= minDate;
      },
      getMinDate: function() {
        var count, test, tests;
        tests = this.get('tests');
        count = this.get('count');
        test = tests.at(tests.length - count);
        if (test) {
          return test.get('date');
        } else {
          return 0;
        }
      }
    });
  });

}).call(this);
