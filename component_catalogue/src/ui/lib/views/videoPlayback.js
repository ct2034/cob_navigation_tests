(function() {

  define(['backbone', 'templates/videoPlayback', 'flowplayer'], function(Backbone, videoPlaybackTmpl, flowplayer) {
    return Backbone.View.extend({
      events: {
        'click .close': 'hide'
      },
      options: {
        online: false
      },
      render: function() {
        var html;
        html = videoPlaybackTmpl();
        this.$el.html(html);
        this.$el.hide();
        return this;
      },
      play: function(src) {
        var html,
          _this = this;
        html = videoPlaybackTmpl({
          src: src
        });
        this.$el.html(html);
        return _.defer(function() {
          _this.$('.flowplayer').flowplayer({
            swf: "assets/flowplayer/flowplayer.swf"
          });
          console.log('play');
          return _this.show();
        });
      },
      show: function() {
        console.log('show');
        return this.$el.show();
      },
      hide: function() {
        this.$el.hide();
        return this.$el.html('');
      },
      videoExists: function(filename) {
        var dfd;
        dfd = this.videosExist([filename]);
        return dfd.pipe(function(results) {
          return results[0];
        });
      },
      videosExist: function(filenames) {
        var dfd;
        if (!this.options.online) {
          dfd = $.Deferred();
          dfd.reject('Could not connect to the video server');
        } else {
          dfd = this.query({
            exists: filenames
          });
        }
        return dfd;
      },
      query: function(data) {
        return $.ajax({
          url: '/video',
          crossDomain: true,
          data: data,
          dataType: 'jsonp'
        });
      }
    });
  });

}).call(this);
