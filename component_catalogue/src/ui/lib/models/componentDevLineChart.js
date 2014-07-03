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
      initialize: function() {
        this.on('change:testGroup', this.testGroupChanged);
        return this.listenTo(this.get('sortingOptions'), 'change', this.sortingChanged);
      },
      testGroupChanged: function() {
        var testGroup;
        testGroup = this.get('testGroup');
        if (this.previous('testGroup')) {
          this.stopListening(this.previous('testGroup'));
        }
        if (testGroup) this.listenTo(testGroup, 'change', this.updateHcSeries);
        return this.updateHcSeries();
      },
      sortingChanged: function() {
        return this.updateHcSeries();
      },
      updateHcSeries: function() {
        return this.set('hcSeries', this.asHighchartsSeries());
      },
      asHighchartsSeries: function() {
        var data, key, nameChunks, sortingOptions, testGroup, _i, _len, _ref;
        testGroup = this.get('testGroup');
        sortingOptions = this.get('sortingOptions');
        if (!testGroup) return {};
        if ('date' !== (key = sortingOptions.get('sorting'))) {
          testGroup = testGroup.sortBy(key);
        }
        nameChunks = [];
        _ref = ['robot', 'navigation', 'scenario'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          key = _ref[_i];
          nameChunks.push(testGroup.get(key));
        }
        data = testGroup != null ? testGroup.getDetailedDataPointsForKey(this.get('key')) : void 0;
        this.formatErrorPoints(data);
        return {
          name: nameChunks.join(' / '),
          id: testGroup.id,
          data: data
        };
      },
      formatErrorPoints: function(data) {
        var current, i, _results;
        _results = [];
        for (i in data) {
          current = data[i];
          if (!current.error) continue;
          _results.push(current.marker = {
            symbol: 'square',
            fillColor: 'red'
          });
        }
        return _results;
      },
      extremesChanged: function(min, max) {
        var _ref;
        this._swallowNextExtremesEvent = true;
        return (_ref = this.get('filter')) != null ? _ref.setExtremes(min, max) : void 0;
      },
      setExtremes: function(range) {
        if (this._swallowNextExtremesEvent) {
          return this._swallowNextExtremesEvent = false;
        }
        return this.set('range', this.get('filter').get('range'));
      }
    });
  });

}).call(this);
