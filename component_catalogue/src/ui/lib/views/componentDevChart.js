(function() {

  define(['backbone', 'templates/componentDevChart', 'models/componentDevLineChart', 'views/lineChart'], function(Backbone, chartTmpl, LineChart, LineChartView) {
    return Backbone.View.extend({
      tagName: 'div',
      className: 'componentDevChart',
      triggerResize: _.debounce(function() {
        return $(window).trigger('resize');
      }, 20),
      initialize: function() {
        this.listenTo(this.options.testGroups, 'change:empty change:selected', _.debounce(this.groupsChanged.bind(this), 20));
        this.lineChartModel = new LineChart({
          key: this.options.key,
          sortingOptions: this.options.sortingOptions
        });
        this.lineChartView = new LineChartView({
          model: this.lineChartModel,
          label: this.options.label,
          unit: this.options.unit
        });
        return this.triggerResizeOnce = _.once(this.triggerResize);
      },
      render: function() {
        this.$el.html(chartTmpl());
        this.$('.chart').html(this.lineChartView.render().el);
        this.groupsChanged();
        return this;
      },
      groupsChanged: function() {
        var models,
          _this = this;
        models = [];
        this.options.testGroups.each(function(testGroup) {
          if (testGroup.get('selected') && !testGroup.get('empty')) {
            return models.push(testGroup);
          }
        });
        switch (models.length) {
          case 0:
            return this.noItemSelected();
          case 1:
            return this.oneItemSelected(models[0]);
          default:
            return this.multipleItemsSelected();
        }
      },
      noItemSelected: function() {
        return this.errorOccured('no item selected');
      },
      multipleItemsSelected: function() {
        return this.errorOccured('multiple items selected');
      },
      oneItemSelected: function(testGroup) {
        this.noError();
        return this.lineChartModel.set('testGroup', testGroup);
      },
      errorOccured: function(msg) {
        this.$('.error').show().html(msg);
        this.$('.chart').hide();
        return this.lineChartModel.set('testGroup', null);
      },
      noError: function() {
        var chart;
        this.$('.error').hide();
        chart = this.$('.chart');
        if (!chart.is(':visible')) {
          chart.show();
          return this.triggerResizeOnce();
        }
      }
    });
  });

}).call(this);
