(function() {

  define(['backbone', 'templates/applicationDev', 'views/applicationDevChart'], function(Backbone, applicationDevTmpl, ApplicationDevChart) {
    return Backbone.View.extend({
      tagName: 'div',
      className: 'applicationDevView',
      initialize: function() {
        alert("applicationDevView.coffee initialize");
        this.navigationChart = new ApplicationDevChart({
          testGroups: this.options.testGroups,
          variableAttributeKey: 'navigation',
          fixedAttributeKeys: ['robot', 'scenario'],
          title: 'Different Navigations for fixed robot and scenario'
        });
        return this.robotChart = new ApplicationDevChart({
          testGroups: this.options.testGroups,
          variableAttributeKey: 'robot',
          fixedAttributeKeys: ['navigation', 'scenario'],
          title: 'Different robots for fixed navigations and scenario'
        });
      },
      render: function() {
        this.$el.html(applicationDevTmpl());
        this.renderNavigationChart();
        this.renderRobotChart();
        return this;
      },
      renderNavigationChart: function() {
        var $el;
        $el = this.$('.navigation');
        return $el.html(this.navigationChart.render().el);
      },
      renderRobotChart: function() {
        var $el;
        $el = this.$('.robot');
        return $el.html(this.robotChart.render().el);
      }
    });
  });

}).call(this);
