(function() {

  define([], function() {
    return {
      formatDate: function(timestamp) {
        var date;
        date = new Date(timestamp);
        return "" + (date.getDate()) + "-" + (date.getMonth()) + "-" + (date.getFullYear());
      },
      playVideoFormatter: function(url) {
        var src;
        src = $.trim(url);
        if (src.indexOf('http://') !== 0) {
          return "<span class=\"invalidVideo\">" + url + "</span>";
        }
        return "<a href=\"" + url + "\">Play Video</a>";
      },
      formatNiceDate: function(timestamp) {
        var curr_date, curr_day, curr_month, curr_year, d, d_names, m_names, sup;
        d_names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        m_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        d = new Date(timestamp);
        curr_day = d.getDay();
        curr_date = d.getDate();
        sup = "";
        switch (curr_date) {
          case 1 || 21 || 31:
            sup = 'st';
            break;
          case 2 || 22:
            sup = 'nd';
            break;
          case 3 || 23:
            sup = 'rd';
            break;
          default:
            sup = 'nd';
        }
        curr_month = d.getMonth();
        curr_year = d.getFullYear();
        return [d_names[curr_day], curr_date, m_names[curr_month], curr_year].join(' ');
      },
      isNumber: function(num) {
        return !isNaN(+num);
      },
      formatDecimals: function(num, decimals) {
        var fac;
        fac = Math.pow(10, decimals);
        return Math.round(+num * fac) / fac;
      },
      format: function(value, formatter) {
        if (formatter === 'float') {
          return this.formatDecimals(value, 2);
        } else if (formatter === 'date') {
          return this.formatDate(value);
        } else if (formatter === 'niceDate') {
          return this.formatNiceDate(value);
        } else if (formatter === 'playVideo') {
          return this.playVideoFormatter(value);
        }
        return value;
      }
    };
  });

}).call(this);
