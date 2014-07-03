(function() {

  define(['templates/filter', 'views/dateFilterView', 'views/textFilterView', 'views/numberFilterView'], function(filterTmpl, DateFilterView, TextFilterView, NumberFilterView) {
    return Backbone.View.extend({
      tagName: 'div',
      className: 'filterView',
      render: function() {
        this.$el.html(filterTmpl());
        this.renderTextFilterView(this.$('.textFilterContainer'));
        this.renderDateFilterView(this.$('.dateFilterContainer'));
        this.renderNumberFilterView(this.$('.numberFilterContainer'));
        return this;
      },
      renderTextFilterView: function($el) {
        var textFilterView;
        textFilterView = new TextFilterView({
          textFilter: this.options.textFilter
        });
        return $el.html(textFilterView.render().el);
      },
      renderDateFilterView: function($el) {
        var dateFilterView;
        dateFilterView = new DateFilterView({
          dateFilter: this.options.dateFilter
        });
        return $el.append(dateFilterView.render().el);
      },
      renderNumberFilterView: function($el) {
        var numberFilterView;
        numberFilterView = new NumberFilterView({
          numberFilter: this.options.numberFilter
        });
        return $el.append(numberFilterView.render().el);
      }
    });
  });

}).call(this);
