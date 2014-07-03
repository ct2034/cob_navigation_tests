(function() {

  define(['backbone'], function(Backbone) {
    return Backbone.Model.extend({
      defaults: {
        testGroup: void 0,
        hcSeries: void 0,
        key: '',
        title: '',
        xAxisCategories: null,
        yAxisLabel: '',
        valueSuffix: '',
        filter: null
      },
      updateDeltas: function(t, deltas) {
        var data, hcSeries, i, _ref;
        data = [];
        for (i = 0, _ref = t.length; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
          data.push([parseInt(t[i]), deltas[i]]);
        }
        hcSeries = {
          name: 'test',
          data: data
        };
        return this.set('hcSeries', hcSeries);
      }
    });
  });

}).call(this);
