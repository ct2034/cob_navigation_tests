(function() {

  define(['backbone', 'raphael'], function(Backbone, Raphael) {
    var Test;
    return Test = Backbone.Model.extend({
      defaults: {
        active: true,
        deltas: [],
        points: [],
        error: '',
        collisions: 0,
        date: 0,
        robot: '',
        scenario: '',
        navigation: '',
        testResults: null,
        duration: null,
        distance: null,
        rotation: null,
        video: 'lol'
      },
      initialize: function() {
        var date;
        date = this.get('localtime') * 1000;
        return this.set('date', new Date(date));
      },
      applyFilters: function(filters) {
        var filter, _i, _len;
        for (_i = 0, _len = filters.length; _i < _len; _i++) {
          filter = filters[_i];
          if (!filter.complies(this)) return this.set('active', false);
        }
        return this.set('active', true);
      }
    });
  });

}).call(this);
