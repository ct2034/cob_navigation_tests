(function() {

  define(['backbone', 'views/componentDevChart', 'templates/componentDev'], function(Backbone, ComponentDevChart, componentDevTmpl, SortingOptions) {
    return Backbone.View.extend({
      tagName: 'div',
      className: 'componentDevView',
      initialize: function() {
        this.createChart('duration', 'Duration', 's');
        this.createChart('distance', 'Distance', 'm');
        return this.createChart('rotation', 'Rotation', 'deg');
      },
      render: function() {
        this.$el.html(componentDevTmpl());
        this.renderChart('duration');
        this.renderChart('distance');
        this.renderChart('rotation');
        return this;
      },
      createChart: function(key, label, unit) {
        var _ref;
        this.charts = (_ref = this.charts) != null ? _ref : [];
        return this.charts[key] = new ComponentDevChart({
          key: key,
          testGroups: this.options.testGroups,
          sortingOptions: this.options.sortingOptions,
          label: label,
          unit: unit
        });
      },
      renderChart: function(key) {
        return this.$("." + key).html(this.charts[key].render().el);
      }
    });
  });

}).call(this);
