(function() {

  define(['backbone', 'highcharts-more', 'templates/tooltip'], function(Backbone, Highcharts, tooltipTmpl) {
    return Backbone.View.extend({
      classname: '.application-view',
      tagName: 'div',
      initialize: function() {
        var chartContainer,
          _this = this;
        this.listenTo(this.model, 'change:hcSeries', _.debounce(this.updateChart.bind(this), 20));
        this.id = _.uniqueId('appChart');
        this.elements = [];
        this.chartContainer = chartContainer = $('<div class="chart" />');
        return this.chartContainer.highcharts(this.highchartsConfig(), function(chart) {
          return _this.chart = chart;
        });
      },
      render: function(width) {
        this.$el.html(this.chartContainer);
        return this;
      },
      updateChart: function() {
        var copy, series, _i, _len, _ref;
        if (!this.chart) return;
        this.clear();
        _ref = this.model.get('hcSeries');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          series = _ref[_i];
          copy = _.extend({}, series);
          this.chart.addSeries(copy, false, null);
        }
        return this.chart.redraw();
      },
      clear: function() {
        var _results;
        this.chart.counters.color = 0;
        _results = [];
        while (this.chart.series.length) {
          _results.push(this.chart.series[0].remove(false));
        }
        return _results;
      },
      tooltipFormatter: function() {
        var units, values;
        units = {
          duration: 's',
          distance: 'm',
          rotation: 'deg'
        };
        values = this.points.map(function(point) {
          var mean, stdDev;
          mean = (point.point.high + point.point.low) / 2;
          stdDev = point.point.high - mean;
          return {
            label: point.series.name,
            mean: Math.round(mean * 100) / 100,
            stdDev: Math.round(stdDev * 100) / 100,
            color: point.series.color
          };
        });
        return tooltipTmpl({
          name: this.x,
          points: values,
          unit: units[this.x.toLowerCase()] || ''
        });
      },
      highchartsConfig: function() {
        return {
          chart: {
            animation: false,
            type: 'columnrange',
            events: {
              redraw: this.redrawElements.bind(this)
            }
          },
          title: {
            text: this.options.title
          },
          plotOptions: {
            series: {
              animation: false
            }
          },
          yAxis: [
            {
              title: {
                text: ''
              },
              title: {
                text: ''
              },
              title: {
                text: ''
              }
            }
          ],
          series: [],
          tooltip: {
            shared: true,
            formatter: this.tooltipFormatter
          },
          xAxis: {
            categories: [this.options.key]
          }
        };
      },
      redrawElements: function() {
        var element, fillColor, lineHeight, plotLeft, plotTop, point, points, rect, series, shape, _i, _j, _len, _len2, _ref, _ref2, _results;
        lineHeight = 2;
        if (this.elements.length) {
          _ref = this.elements;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            element = _ref[_i];
            element.destroy();
          }
          this.elements = [];
        }
        _ref2 = this.chart.series;
        _results = [];
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          series = _ref2[_j];
          fillColor = 'white';
          points = series.points;
          plotLeft = this.chart.plotLeft;
          plotTop = this.chart.plotTop;
          _results.push((function() {
            var _k, _len3, _results2;
            _results2 = [];
            for (_k = 0, _len3 = points.length; _k < _len3; _k++) {
              point = points[_k];
              shape = point.shapeArgs;
              if (lineHeight > shape.height) fillColor = 'red';
              rect = this.chart.renderer.rect(shape.x + plotLeft, shape.y + plotTop + shape.height / 2, shape.width, lineHeight);
              rect.attr({
                'stroke-width': 0,
                'fill': fillColor
              }).add().toFront();
              _results2.push(this.elements.push(rect));
            }
            return _results2;
          }).call(this));
        }
        return _results;
      }
    });
  });

}).call(this);
