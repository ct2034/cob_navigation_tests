(function() {

  define(['backbone', 'models/textFilterCriteria'], function(Backbone, TextFilterCriteria) {
    return Backbone.Collection.extend({
      model: TextFilterCriteria,
      complies: function(number, test) {
        var result;
        result = this.evaluate(number, test, 0);
        if (result === null) return true;
        return result;
      },
      evaluate: function(number, test, index) {
        var criteria, link, nextResult, result;
        criteria = this.models[index];
        if (!criteria) return null;
        result = criteria.complies(number, test);
        link = criteria.get('link');
        if (result === null) return null;
        nextResult = this.evaluate(number, test, index + 1);
        if (link === 'and') {
          if (nextResult === null) return result;
          return result && nextResult;
        }
        if (link === 'or') return result === true || nextResult === true;
        return result;
      }
    });
  });

}).call(this);
