(function() {

  define(['backbone', 'templates/dateFilter', 'jquery-ui'], function(Backbone, dateFilterTmpl, jqueryUi) {
    return Backbone.View.extend({
      tagName: 'div',
      className: 'dateFilter',
      dateFormat: 'dd.mm.yy',
      events: {
        'click .start.clear': 'clearStart',
        'click .end.clear': 'clearEnd'
      },
      render: function() {
        this.$el.html(dateFilterTmpl({}));
        this.$('input.start').datepicker({
          onClose: this.startChanged.bind(this),
          dateFormat: this.dateFormat
        });
        this.$('input.end').datepicker({
          onClose: this.endChanged.bind(this),
          dateFormat: this.dateFormat
        });
        return this;
      },
      startChanged: function(selectedDate) {
        this.$('input.end').datepicker('option', 'minDate', selectedDate);
        return this.options.dateFilter.set('start', this.$('.start').datepicker('getDate'));
      },
      endChanged: function(selectedDate) {
        this.$('input.start').datepicker('option', 'maxDate', selectedDate);
        return this.options.dateFilter.set('end', this.$('.end').datepicker('getDate'));
      },
      clearStart: function(e) {
        this.clearInput(e.currentTarget);
        return this.$('input.end').datepicker('option', 'minDate', '');
      },
      clearEnd: function(e) {
        this.clearInput(e.currentTarget);
        return this.$('input.start').datepicker('option', 'maxDate', '');
      },
      clearInput: function(input) {
        input = $(input).siblings('input');
        input.val('');
        return this.options.dateFilter.set(input.attr('name'), null);
      }
    });
  });

}).call(this);
