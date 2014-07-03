(function() {

  define(['backbone'], function(Backbone) {
    return Backbone.Model.extend({
      defaults: {
        key: '',
        title: '',
        xAxisCategories: null,
        yAxisLabel: '',
        valueSuffix: '',
        filter: null
      },
      initialize: function() {
        var _ref, _ref2, _ref3;
        if ((_ref = this.get('groups')) != null) {
          _ref.bind('select', this.groupSelected, this);
        }
        if ((_ref2 = this.get('groups')) != null) {
          _ref2.bind('unselect', this.groupUnselected, this);
        }
        return (_ref3 = this.get('filter')) != null ? _ref3.bind('change:range', this.setExtremes, this) : void 0;
      },
      groupSelected: function(model) {
        var hcSeries;
        hcSeries = this.testGroupToHighchartSeries(model);
        return this.trigger('addSeries', hcSeries);
      },
      groupUnselected: function(model) {
        var hcSeries;
        hcSeries = this.testGroupToHighchartSeries(model);
        return this.trigger('removeSeries', hcSeries);
      },
      testGroupToHighchartSeries: function(model) {
        var data, date, key, nameChunks, _i, _len, _ref;
        nameChunks = [];
        _ref = ['robot', 'algorithm', 'scenario'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          key = _ref[_i];
          nameChunks.push(model.get(key));
        }
        date = model.getDataPointsForKey('date');
        data = model.getDataPointsForKey(this.attributes.key);
        return {
          name: nameChunks.join(' / '),
          id: model.id,
          data: _.zip(date, data)
        };
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
      },
      highchartsConfig: function() {
        var _this = this;
        return {
          series: [],
          title: {
            text: this.attributes.title
          },
          xAxis: {
            events: {
              setExtremes: function(e) {
                return _this.extremesChanged(e.min, e.max);
              }
            }
          },
          credits: {
            enabled: false
          },
          scrollbar: {
            enabled: false
          },
          rangeSelector: {
            enabled: false
          }
        };
      }
    });
  });

}).call(this);
