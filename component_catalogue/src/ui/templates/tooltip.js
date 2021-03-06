define( [ 'ecoHelper' ], function( helper ){(function() {
  this.ecoTemplates || (this.ecoTemplates = {});
  this.ecoTemplates["tooltip"] = function(__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
        var point, _i, _len, _ref;
      
        __out.push('<b>');
      
        __out.push(__sanitize(this.name));
      
        __out.push('</b>\n<br />\n');
      
        _ref = this.points;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          point = _ref[_i];
          __out.push('\n    <span style="color:');
          __out.push(__sanitize(point.color));
          __out.push('">');
          __out.push(__sanitize(point.label));
          __out.push(' </span>:  Mean: ');
          __out.push(__sanitize(point.mean));
          __out.push(' ');
          __out.push(__sanitize(this.unit));
          __out.push(', StdDev: ');
          __out.push(__sanitize(point.stdDev));
          __out.push(' ');
          __out.push(__sanitize(this.unit));
          __out.push('<br />\n');
        }
      
        __out.push('\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
return this.ecoTemplates[ 'tooltip' ];});