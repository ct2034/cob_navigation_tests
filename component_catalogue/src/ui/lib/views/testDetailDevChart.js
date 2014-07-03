(function() {

  define(['backbone', 'models/testDetailScatterChart', 'views/scatterChart'], function(Backbone, ScatterChart, ScatterChartView) {
    return Backbone.View.extend({
      tagName: 'div',
      className: 'testDetailDevChart',
      initialize: function() {
        this.chartModel = new ScatterChart;
        return this.chartView = new ScatterChartView({
          model: this.chartModel,
          label: this.options.label,
          unit: this.options.unit
        });
      },
      renderDeltas: function(t, deltas) {
        return this.chartModel.updateDeltas(t, deltas);
      },
      render: function() {
        this.$el.html(this.chartView.render().el);
        return this;
      },
      renderDataset: function() {}
    });
  });

}).call(this);
