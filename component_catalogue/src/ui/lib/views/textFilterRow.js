(function() {

  define(['backbone', 'templates/textFilterRow', 'chosen'], function(Backbone, textFilterRowTmpl, chosen) {
    return Backbone.View.extend({
      tagName: 'div',
      className: 'textFilterRow',
      events: {
        'change': 'change',
        'keyup': 'keyup',
        'keydown': 'keydown',
        'click .and': 'andClicked',
        'click .or': 'orClicked',
        'click .expand': 'expandClicked'
      },
      initialize: function() {
        return this.listenTo(this.model, 'change:link', this.linkChanged);
      },
      render: function() {
        this.$el.html(textFilterRowTmpl());
        return this;
      },
      keyup: function(e) {
        if (e.keyCode === 27) this.trigger('escape');
        if (e.keyCode === 13) this.andClicked();
        return this.change();
      },
      keydown: function(e) {
        var event, inputHasFocus;
        inputHasFocus = this.$('input').is(':focus');
        if (inputHasFocus && e.keyCode === 9) {
          event = e.shiftKey ? 'selectPrevious' : 'selectNext';
          this.trigger(event);
          return e.preventDefault();
        }
      },
      change: function() {
        this.model.set('field', this.$('.filterField').val());
        this.model.set('type', this.$('.filterType').val());
        return this.model.set('value', $.trim(this.$('.filterValue').val()));
      },
      andClicked: function() {
        this.trigger('andClicked');
        return this.setAndLink();
      },
      orClicked: function() {
        this.trigger('orClicked');
        return this.setOrLink();
      },
      expandClicked: function() {
        return this.$('.top').toggle();
      },
      setAndLink: function() {
        this.$('.and, .or').hide();
        this.$('.link').text('and');
        return this.model.set('link', 'and');
      },
      setOrLink: function() {
        this.$('.and, .or').hide();
        this.$('.link').text('or');
        return this.model.set('link', 'or');
      },
      linkChanged: function() {
        var link;
        link = this.model.get('link');
        if (!link) {
          this.$('.and, .or').show();
          return this.$('.link').text('');
        } else {
          this.$('.and, .or').hide();
          return this.$('.link').text(link);
        }
      },
      focus: function() {
        return this.$('input[type=text]:first').focus();
      },
      clear: function() {
        return this.$('input[type=text]:first').val('');
      }
    });
  });

}).call(this);
