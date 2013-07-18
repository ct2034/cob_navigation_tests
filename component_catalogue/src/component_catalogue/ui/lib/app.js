// Generated by CoffeeScript 1.6.2
(function() {
  define(['collections/textFilter', 'collections/tests', 'views/resultList', 'views/devView', 'models/testGroup', 'collections/testGroups', 'models/dateFilter', 'models/numberFilter', 'views/filterView', 'views/videoPlayback'], function(TextFilter, Tests, ResultList, DevView, TestGroup, TestGroups, DateFilter, NumberFilter, FilterView, VideoPlayback) {
    return function(options) {
      var dateFilter, filters, groupedTests, numberFilter, renderDevView, renderFilterView, renderResultListView, resultListView, testCollection, testGroups, tests, textFilter;

      testCollection = new Tests(options.testData);
      textFilter = new TextFilter;
      dateFilter = new DateFilter;
      numberFilter = new NumberFilter({
        tests: testCollection
      });
      filters = [textFilter, dateFilter, numberFilter];
      tests = new TestGroup({
        tests: testCollection,
        filters: filters
      });
      groupedTests = tests.groupBy(['robot', 'navigation', 'scenario']);
      testGroups = new TestGroups(groupedTests);
      resultListView = null;
      renderResultListView = function() {
        var videoOverlay;

        videoOverlay = new VideoPlayback;
        $('body').prepend(videoOverlay.render().el);
        resultListView = new ResultList({
          testGroups: testGroups,
          videoPlayback: videoOverlay
        });
        return $('#resultListView').html(resultListView.render().el);
      };
      renderDevView = function() {
        var devView;

        devView = new DevView({
          testGroups: testGroups
        });
        devView.on('changeView', function(view) {
          switch (view) {
            case 'application':
              resultListView.setSelectionMode('promiscuous');
              break;
            case 'component':
              resultListView.setSelectionMode('exclusive');
          }
          return _.defer(function() {
            return $(window).trigger('resize');
          });
        });
        return $('#devView').html(devView.render().el);
      };
      renderFilterView = function() {
        var filterView;

        filterView = new FilterView({
          textFilter: textFilter,
          dateFilter: dateFilter,
          numberFilter: numberFilter
        });
        return $('#filterView').html(filterView.render().el);
      };
      return $(function() {
        renderResultListView();
        renderFilterView();
        return renderDevView();
      });
    };
  });

}).call(this);
