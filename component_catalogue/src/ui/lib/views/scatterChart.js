(function() {

  define(['backbone', 'highcharts'], function(Backbone, Highcharts) {
    return Backbone.View.extend({
      tagName: 'div',
      className: 'scatterChart',
      initialize: function() {
        var chartContainer,
          _this = this;
        this.listenTo(this.model, 'change:hcSeries', _.debounce(this.resetSeries.bind(this), 20));
        this.chart = null;
        this.chartContainer = chartContainer = $('<div class="chart" />');
        return chartContainer.highcharts(this.highchartsConfig(), function(chart) {
          return _this.chart = chart;
        });
      },
      resetSeries: function(model, series) {
        var _ref;
        if (!this.chart) return;
        if ((_ref = this.chart.series[0]) != null) _ref.remove();
        this.chart.counters.color = 0;
        this.chart.counters.symbol = 0;
        return this.chart.addSeries(series, {
          redraw: true,
          animation: false
        });
      },
      render: function() {
        this.$el.html(this.chartContainer);
        return this;
      },
      tooltip: function(point) {
        return "Timestamp: " + point.x + "<br>      Value: " + point.y;
      },
      highchartsConfig: function() {
        var self;
        self = this;
        return {
          chart: {
            type: 'scatter',
            animation: false
          },
          title: {
            text: "" + this.options.label + " in " + this.options.unit
          },
          tooltip: {
            formatter: function() {
              return self.tooltip(this);
            }
          },
          plotOptions: {
            series: {
              animation: false
            }
          },
          yAxis: {
            title: {
              text: null
            }
          },
          series: [],
          legend: {
            enabled: false
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
