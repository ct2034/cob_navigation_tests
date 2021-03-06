(function() {

  define(['backbone', 'views/textFilterRow', 'templates/textFilter', 'models/textFilterCriteria'], function(Backbone, TextFilterRow, textFilterTmpl, TextFilterCriteria) {
    var TextFilterView;
    return TextFilterView = Backbone.View.extend({
      tagName: 'div',
      className: 'textFilter',
      initialize: function() {
        return this.rowViews = [];
      },
      escape: function(view, criteria) {
        var $prev, $row;
        $row = $(view.el);
        $prev = $row.prev();
        if ($prev.length) {
          this.stopListening(view);
          $prev.data('view').focus();
          $row.data('view', null);
          view.remove();
          this.options.textFilter.remove(criteria);
          return this.removeLinkFromLastCriteria();
        } else {
          return view.clear();
        }
      },
      removeLinkFromLastCriteria: function() {
        return this.options.textFilter.last().set('link', '');
      },
      render: function() {
        this.$el.html(textFilterTmpl());
        this.addNewRow();
        return this;
      },
      selectPrevious: function(view) {
        return this.select(view, 'prev');
      },
      selectNext: function(view) {
        return this.select(view, 'next');
      },
      select: function(view, target) {
        var $row, $target, targetView;
        $row = $(view != null ? view.el : void 0);
        $target = $row[target]();
        targetView = $target.data('view');
        if (targetView) return targetView.focus();
      },
      addNewRow: function() {
        var $row, criteria, newView;
        criteria = new TextFilterCriteria;
        newView = new TextFilterRow({
          model: criteria
        });
        this.listenTo(newView, 'escape', this.escape.bind(this, newView, criteria));
        this.listenTo(newView, 'selectNext', this.selectNext.bind(this, newView));
        this.listenTo(newView, 'andClicked', this.addNewRow.bind(this, criteria));
        this.listenTo(newView, 'orClicked', this.addNewRow.bind(this, criteria));
        this.listenTo(newView, 'selectPrevious', this.selectPrevious.bind(this, newView));
        this.options.textFilter.add(criteria);
        $row = newView.render().$el;
        $row.data('view', newView);
        this.$('.rows').append($row);
        return newView.focus();
      }
    });
  });

}).call(this);
