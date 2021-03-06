(function() {

  define(['backbone', 'templates/numberFilter', 'jquery-numeric'], function(Backbone, numberFilterTmpl, numeric) {
    return Backbone.View.extend({
      tagName: 'div',
      className: 'numberFilter',
      events: {
        'keyup .count': 'change'
      },
      render: function() {
        this.$el.html(numberFilterTmpl({}));
        this.$('.count').numeric({
          decimal: false,
          negative: false
        });
        return this;
      },
      initialize: function() {
        var _this = this;
        return this.deferedUpdate = _.debounce(function(value) {
          return _this.options.numberFilter.set('count', value);
        }, 200);
      },
      change: function(e) {
        var input;
        input = this.$('.count');
        if (e.keyCode === 27) input.val('');
        return this.deferedUpdate(input.val());
      }
    });
  });

}).call(this);
