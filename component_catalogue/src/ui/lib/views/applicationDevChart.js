(function() {

  define(['backbone', 'templates/applicationDevChart', 'models/barChart', 'views/barChart'], function(Backbone, applicationDevChartTmpl, BarChartModel, BarChartView) {
    return Backbone.View.extend({
      tagName: 'div',
      className: 'applicationDevChart',
      initialize: function() {
        var key, model, _i, _len, _ref, _results;
        this.listenTo(this.options.testGroups, 'change:count change:selected', _.debounce(this.groupsChanged.bind(this, 10)));
        this.triggerResizeOnce = _.once(this.triggerResize);
        this.chartModels = [];
        this.chartViews = [];
        _ref = ['duration', 'distance', 'rotation'];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          key = _ref[_i];
          model = new BarChartModel({
            key: key,
            variableKey: this.options.variableAttributeKey
          });
          this.chartModels.push(model);
          _results.push(this.chartViews.push(new BarChartView({
            model: model,
            title: this.options.title,
            key: key
          })));
        }
        return _results;
      },
      triggerResize: _.debounce(function() {
        return $(window).trigger('resize');
      }, 20),
      render: function() {
        var i, view, _ref;
        this.$el.html(applicationDevChartTmpl());
        _ref = this.chartViews;
        for (i in _ref) {
          view = _ref[i];
          this.$(".chart_" + i).html(view.render().el);
        }
        this.groupsChanged();
        return this;
      },
      groupsChanged: function() {
        var key, model, testGroups, _ref;
        testGroups = this.getInterestingRows();
        if (this.validateTestGroups(testGroups)) {
          _ref = this.chartModels;
          for (key in _ref) {
            model = _ref[key];
            model.set('testGroups', testGroups);
          }
          return this.showCharts();
        }
      },
      validateTestGroups: function(rows) {
        var error;
        error = '';
        if (rows.length === 0) error = 'No TestGroup selected';
        if (!this.hasOnlyOneKindOfEveryFixedAttribute(rows)) {
          error = "Testgroups selected are too diverse";
        }
        if (error) this.error(error);
        return !error.length;
      },
      getInterestingRows: function() {
        return this.options.testGroups.filter(function(testGroup) {
          if (testGroup.get('count') > 0 && testGroup.get('selected')) return true;
        });
      },
      hasOnlyOneKindOfEveryFixedAttribute: function(rows) {
        var state,
          _this = this;
        state = null;
        return rows.every(function(testGroup) {
          var id, key, _i, _len, _ref;
          _ref = _this.options.fixedAttributeKeys;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            key = _ref[_i];
            id = (id || '') + testGroup.get(key);
          }
          if (state === null) state = id;
          return state === id;
        });
      },
      hasNoVariableAttribute: function() {
        return this.testGroupAttributes[this.options.variableAttributeKey].length === 0;
      },
      error: function(msg) {
        this.$el.parent().hide();
        return this.$('.charts').hide();
      },
      showCharts: function() {
        this.$el.parent().show();
        this.$('.charts').show();
        this.$('.error').hide();
        return this.triggerResizeOnce();
      }
    });
  });

}).call(this);
