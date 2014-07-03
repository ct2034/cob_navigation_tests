(function() {

  define(['backbone'], function(Backbone) {
    return Backbone.Model.extend({
      defaults: {
        testGroups: null,
        key: '',
        title: '',
        xAxisCategories: null,
        yAxisLabel: '',
        valueSuffix: '',
        filter: null
      },
      initialize: function() {
        return this.on('change:testGroups', this.testGroupsChanged);
      },
      testGroupsChanged: function() {
        var testGroup, _i, _len, _ref;
        this.stopListeningToPreviousTestGroups();
        _ref = this.get('testGroups');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          testGroup = _ref[_i];
          this.listenTo(testGroup, 'change', _.debounce(this.updateHcSeries, 200));
        }
        return this.updateHcSeries();
      },
      stopListeningToPreviousTestGroups: function() {
        var prevTestGroups, testGroup, _i, _len, _results;
        prevTestGroups = this.previous('testGroups');
        if (!prevTestGroups) return;
        _results = [];
        for (_i = 0, _len = prevTestGroups.length; _i < _len; _i++) {
          testGroup = prevTestGroups[_i];
          _results.push(this.stopListening(testGroup));
        }
        return _results;
      },
      updateHcSeries: function() {
        var newHcSeries, oldHcSeries;
        oldHcSeries = this.get('hcSeries');
        newHcSeries = this.asHighchartsSeries();
        if (!_.isEqual(oldHcSeries, newHcSeries)) {
          return this.set('hcSeries', newHcSeries);
        }
      },
      asHighchartsSeries: function() {
        var data, key, mean, series, stdDev, testGroup, _i, _len, _ref;
        series = [];
        key = this.get('key');
        _ref = this.get('testGroups');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          testGroup = _ref[_i];
          data = [];
          mean = (+testGroup.get('mean.' + key)) || 0;
          stdDev = (+testGroup.get('stdDev.' + key)) || 0;
          data.push([mean - stdDev, mean + stdDev]);
          series.push({
            name: testGroup.get(this.get('variableKey')),
            id: testGroup.id,
            data: data
          });
        }
        return _.sortBy(series, function(item) {
          return item.name;
        });
      }
    });
  });

}).call(this);
