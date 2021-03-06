(function() {

  define(['backbone', 'templates/sortingOptions'], function(Backbone, sortingOptionsTmpl) {
    return Backbone.View.extend({
      events: {
        'click  input.sort': 'sortingChanged',
        'change #showErrorsChkbx': 'showErrorsChanged'
      },
      render: function() {
        var filter;
        filter = this.model.get('erroneousFilter');
        this.$el.html(sortingOptionsTmpl({
          sorting: this.model.get('sorting'),
          showErrors: filter != null ? filter.get('show') : void 0
        }));
        return this;
      },
      sortingChanged: function(e) {
        var input, value;
        input = $(e.currentTarget);
        value = input.val();
        if (value) return this.model.set('sorting', value);
      },
      showErrorsChanged: function(e) {
        var filter, input, value;
        input = $(e.currentTarget);
        value = input.prop('checked');
        filter = this.model.get('erroneousFilter');
        return filter != null ? filter.set('show', value) : void 0;
      }
    });
  });

}).call(this);
