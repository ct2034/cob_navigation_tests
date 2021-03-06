(function() {
  var __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['backbone', 'underscore', 'collections/tests'], function(Backbone, _, Tests) {
    var TestGroup;
    return TestGroup = Backbone.Model.extend({
      defaults: {
        selected: void 0,
        selectedTest: null,
        count: 0,
        empty: false,
        robot: 'None',
        robots: [],
        scenario: 'None',
        scenarios: [],
        navigation: 'None',
        navigations: [],
        enabled: true,
        'mean.duration': 'N/A',
        'mean.distance': 'N/A',
        'mean.rotation': 'N/A',
        'stdDev.duration': 'N/A',
        'stdDev.distance': 'N/A',
        'stdDev.rotation': 'N/A',
        'mean.collisions': 'N/A',
        'std.collisions': 'N/A',
        indexesByCid: {},
        errorsCombined: 0,
        errorsAborted: 0,
        errorsFailed: 0,
        errorsMissed: 0,
        errorsTimedout: 0,
        title: ''
      },
      constructor: function(args, options) {
        if (!(args != null)) {
          args = {
            tests: []
          };
        }
        if (args instanceof Tests) {
          args = {
            tests: args
          };
        }
        if (!args.tests) args.tests = [];
        if (args.tests && !(args.tests instanceof Tests)) {
          args.tests = new Tests(args.tests);
        }
        if (!(args.id != null)) args.id = _.uniqueId('testGroup');
        Backbone.Model.call(this, args, options);
        return this;
      },
      initialize: function() {
        this.reset();
        this.listenTo(this.get('tests'), 'change:active', _.debounce(this.activeChanged, 100));
        this.set('tests', this.get('tests'));
        this.set('indexesByCid', this.get('tests').getIndexesByCid());
        if (this.get('filters')) return this.setupFilters();
      },
      setupFilters: function() {
        var filter, _i, _len, _ref, _results;
        _ref = this.get('filters');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          filter = _ref[_i];
          _results.push(this.listenTo(filter, 'change', this.filterChanged));
        }
        return _results;
      },
      activeChanged: function() {
        return this.refreshAttributes();
      },
      filterChanged: function() {
        var filters;
        filters = this.get('filters');
        return this.get('tests').applyFilters(filters);
      },
      reset: function() {
        return this.refreshAttributes();
      },
      refreshAttributes: function() {
        var attr, _i, _j, _len, _len2, _ref, _ref2;
        _ref = ['robot', 'scenario', 'navigation'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          attr = _ref[_i];
          this.updateUniqAttribute(attr);
        }
        _ref2 = ['duration', 'distance', 'rotation', 'collisions'];
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          attr = _ref2[_j];
          this.updateMedianAttribute(attr);
          this.updateStdDevAttribute(attr);
        }
        this.updateErrorCount();
        this.updateCount();
        return this.updateTitle();
      },
      updateTitle: function() {
        return this.set('title', [this.get('robot'), '/', this.get('navigation'), '/', this.get('scenario')].join(' '));
      },
      updateCount: function(attr) {
        var activeTests;
        activeTests = this.get('tests').filter(function(test) {
          return test.get('active');
        });
        this.set('count', activeTests.length);
        return this.set('empty', this.get('count') === 0);
      },
      updateUniqAttribute: function(attr) {
        var uniqueValues;
        uniqueValues = [];
        this.get('tests').forEach(function(model) {
          var value;
          if (!model.get('active')) return;
          value = model.get(attr);
          if ((value != null) && __indexOf.call(uniqueValues, value) < 0) {
            return uniqueValues.push(value);
          }
        });
        this.set(attr + 's', uniqueValues);
        switch (uniqueValues.length) {
          case 0:
            return this.set(attr, 'None');
          case 1:
            return this.set(attr, uniqueValues[0]);
          default:
            return this.set(attr, 'various');
        }
      },
      updateMedianAttribute: function(attr) {
        var num, sum;
        sum = num = 0;
        this.get('tests').forEach(function(model) {
          var value;
          if (!model.get('active')) return;
          if (model.get('error')) return;
          value = +model.get(attr);
          if (!isNaN(value)) {
            num++;
            return sum += value;
          }
        });
        return this.set('mean.' + attr, num > 0 ? sum / num : 'N/A');
      },
      updateErrorCount: function() {
        var erroneous, errorKeys, errors, errorsCombined, key, _i, _j, _len, _len2;
        errorsCombined = 0;
        errorKeys = ['Aborted', 'Failed', 'Missed', 'Timedout'];
        errors = {};
        for (_i = 0, _len = errorKeys.length; _i < _len; _i++) {
          key = errorKeys[_i];
          errors[key] = 0;
        }
        erroneous = this.get('tests').forEach(function(model) {
          var key, _j, _len2, _results;
          if (!model.get('error')) return;
          errorsCombined++;
          _results = [];
          for (_j = 0, _len2 = errorKeys.length; _j < _len2; _j++) {
            key = errorKeys[_j];
            if (key.toLowerCase() === model.get('error').toLowerCase()) {
              _results.push(errors[key]++);
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        });
        for (_j = 0, _len2 = errorKeys.length; _j < _len2; _j++) {
          key = errorKeys[_j];
          this.set('errors' + key, errors[key]);
        }
        return this.set('errorsCombined', errorsCombined);
      },
      updateStdDevAttribute: function(attr) {
        var mean, num, sum,
          _this = this;
        mean = this.get('mean.' + attr);
        sum = num = 0;
        this.get('tests').forEach(function(model) {
          var value;
          if (!model.get('active')) return;
          if (model.get('error')) return;
          value = +model.get(attr);
          if (!isNaN(value)) {
            num++;
            return sum += Math.pow(value - mean, 2);
          }
        });
        return this.set('stdDev.' + attr, sum > 0 ? Math.sqrt(sum / num) : 'N/A');
      },
      getDataPointsForKey: function(key) {
        return this.get('tests').map(function(model) {
          if (model.get('error')) return 'error';
          return model.get(key);
        });
      },
      getDetailedDataPointsForKey: function(key) {
        var data, indexesByCid, relevantTests;
        indexesByCid = this.get('indexesByCid');
        relevantTests = this.get('test');
        data = [];
        this.get('tests').forEach(function(model) {
          if (!model.get('active')) return;
          return data.push({
            date: model.get('date'),
            error: model.get('error'),
            index: indexesByCid[model.cid],
            y: model.get(key)
          });
        });
        return data;
      },
      groupBy: function() {
        var tests;
        tests = this.get('tests');
        return tests.groupBy.apply(tests, arguments);
      },
      sortBy: function() {
        var clone, sortedTests, tests;
        clone = this.clone();
        tests = clone.get('tests');
        sortedTests = tests.sortBy.apply(tests, arguments);
        clone.set('tests', sortedTests, {
          silent: true
        });
        return clone;
      }
    });
  });

}).call(this);
