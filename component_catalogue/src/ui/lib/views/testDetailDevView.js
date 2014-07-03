(function() {

  define(['backbone', 'templates/testDetailDev', 'views/testDetailDevChart', 'views/plot2d'], function(Backbone, testDetailDevTmpl, TestDetailDevChart, Plot2d) {
    return Backbone.View.extend({
      tagName: 'div',
      className: 'testDetailDevView',
      events: {
        'change:testGroup': 'testGroupChanged'
      },
      initialize: function() {
        this.testGroup = null;
        this.deltaX = new TestDetailDevChart({
          label: 'x',
          unit: 'm'
        });
        this.deltaY = new TestDetailDevChart({
          label: 'y',
          unit: 'm'
        });
        this.deltaPhi = new TestDetailDevChart({
          label: 'phi',
          unit: 'rad'
        });
        return this.plot2d = new Plot2d;
      },
      useTestGroup: function(testGroup) {
        this.stopListening(this.testGroup);
        this.testGroup = testGroup;
        return this.listenTo(this.testGroup, 'change:selectedTest', this.selectedTestChanged);
      },
      selectedTestChanged: function(testGroup, value) {
        var deltas, phi, points, t, test, tests, x, y, _ref;
        tests = testGroup.get('tests');
        test = tests.at(value);
        if (test) {
          deltas = test.get('deltas');
          points = test.get('points');
          console.log('test points: ', points);
          _ref = this.parseDeltas(deltas), t = _ref[0], x = _ref[1], y = _ref[2], phi = _ref[3];
          this.deltaX.renderDeltas(t, x);
          this.deltaY.renderDeltas(t, y);
          this.deltaPhi.renderDeltas(t, phi);
          return this.plot2d.renderPoints(points);
        }
      },
      parseDeltas: function(deltas) {
        var k, phi, t, v, x, y;
        t = [];
        x = [];
        y = [];
        phi = [];
        for (k in deltas) {
          v = deltas[k];
          t.push(v[0]);
          x.push(v[1]);
          y.push(v[2]);
          phi.push(v[3]);
        }
        return [t, x, y, phi];
      },
      render: function() {
        this.$el.html(testDetailDevTmpl());
        this.$('.deltaX').html(this.deltaX.render().el);
        this.$('.deltaY').html(this.deltaY.render().el);
        this.$('.deltaPhi').html(this.deltaPhi.render().el);
        this.$('.plot2d').html(this.plot2d.render().el);
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
