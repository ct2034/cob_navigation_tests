(function() {

  define(['backbone'], function(Backbone) {
    return Backbone.Model.extend({
      defaults: {
        field: '',
        type: 'includes',
        value: '',
        link: ''
      },
      complies: function(test) {
        var comparator, fieldsOfInterest;
        if (!this.get('value')) return null;
        fieldsOfInterest = this.getFieldsOfInterest(test);
        comparator = this.getComparator();
        return comparator.call(this, fieldsOfInterest);
      },
      getFieldsOfInterest: function(test) {
        var navigation, robot, scenario;
        robot = test.get('robot');
        navigation = test.get('navigation');
        scenario = test.get('scenario');
        switch (this.get('field')) {
          case 'any':
            return [robot, navigation, scenario];
          case 'robot':
            return [robot];
          case 'navigation':
            return [navigation];
          case 'scenario':
            return [scenario];
          default:
            console.warn('Invalid filter field', this.get('field'));
            return [];
        }
      },
      getComparator: function() {
        var type;
        type = this.get('type');
        if (type === 'includes') return this.includesComparator;
        if (type === 'excludes') return this.excludesComparator;
        return false;
      },
      includesComparator: function(fields) {
        var field, value, _i, _len;
        value = this.get('value');
        for (_i = 0, _len = fields.length; _i < _len; _i++) {
          field = fields[_i];
          if (field.indexOf(value) > -1) return true;
        }
        return false;
      },
      excludesComparator: function(fields) {
        var field, value, _i, _len;
        value = this.get('value');
        for (_i = 0, _len = fields.length; _i < _len; _i++) {
          field = fields[_i];
          if (field.indexOf(value) > -1) return false;
        }
        return true;
      }
    });
  });

}).call(this);
