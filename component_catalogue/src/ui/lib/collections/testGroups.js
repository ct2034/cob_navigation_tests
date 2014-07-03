(function() {

  define(['backbone', 'models/testGroup'], function(Backbone, TestGroup) {
    return Backbone.Collection.extend({
      model: TestGroup,
      constructor: function(models, options) {
        Backbone.Collection.apply(this, arguments);
        return this;
      }
    });
  });

}).call(this);
