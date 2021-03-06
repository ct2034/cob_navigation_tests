(function() {

  define(['underscore', 'backbone', 'models/test'], function(_, Backbone, Test) {
    var Tests;
    return Tests = Backbone.Collection.extend({
      model: Test,
      comparator: 'localtime',
      groupBy: function(groups) {
        var groupKey, groupedSiblings, key, model, siblings, _i, _len, _ref;
        groupedSiblings = {};
        groupKey = function(model) {
          var group, key, _i, _len;
          key = '';
          for (_i = 0, _len = groups.length; _i < _len; _i++) {
            group = groups[_i];
            key += model.get(group);
          }
          return key;
        };
        _ref = this.models;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          model = _ref[_i];
          key = groupKey(model);
          siblings = groupedSiblings[key] || (groupedSiblings[key] = []);
          siblings.push(model);
        }
        return _(groupedSiblings).values().map(function(models) {
          return new Tests(models);
        });
      },
      getIndexesByCid: function() {
        var index, indexesByCid, model, _ref;
        indexesByCid = {};
        _ref = this.models;
        for (index in _ref) {
          model = _ref[index];
          indexesByCid[model.cid] = index;
        }
        return indexesByCid;
      },
      applyFilters: function(filters) {
        var model, _i, _len, _ref, _results;
        _ref = this.models;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          model = _ref[_i];
          _results.push(model.applyFilters(filters));
        }
        return _results;
      }
    });
  });

}).call(this);
