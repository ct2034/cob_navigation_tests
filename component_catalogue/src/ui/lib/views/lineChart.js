(function() {

  define(['backbone', 'highcharts'], function(Backbone, Highcharts) {
    return Backbone.View.extend({
      tagName: 'div',
      className: 'lineChart',
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
        console.log('okay changed');
        if (!this.chart) return;
        if ((_ref = this.chart.series[0]) != null) _ref.remove();
        this.chart.counters.color = 0;
        this.chart.counters.symbol = 0;
        this.chart.addSeries(series, {
          redraw: true,
          animation: false
        });
        return console.log('series added');
      },
      render: function() {
        this.$el.html(this.chartContainer);
        return this;
      },
      tooltip: function(point) {
        var date, index, label, options, roundedY, unit;
        options = point.point.options;
        date = options.date;
        index = options.index;
        roundedY = Math.round(point.y * 100) / 100;
        label = this.options.label;
        unit = this.options.unit;
        return "Test #" + (+index + 1) + " of current series       <br>Date: " + (this.formatDate(date)) + "       <br>" + label + ": " + roundedY + " " + unit;
      },
      formatDate: function(date) {
        var day, hour, minute, month, year;
        year = date.getFullYear();
        month = date.getMonth();
        minute = date.getMinutes();
        hour = date.getHours();
        day = date.getDate();
        return "" + day + "." + month + "." + year + " " + hour + ":" + minute;
      },
      highchartsConfig: function() {
        var self;
        self = this;
        return {
          chart: {
            type: 'line',
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
