(function() {

  define(['collections/textFilter', 'collections/tests', 'views/resultList', 'views/devView', 'models/testGroup', 'collections/testGroups', 'models/dateFilter', 'models/numberFilter', 'models/erroneousFilter', 'views/filterView', 'views/videoPlayback', 'views/sortingOptions', 'models/sortingOptions'], function(TextFilter, Tests, ResultList, DevView, TestGroup, TestGroups, DateFilter, NumberFilter, ErroneousFilter, FilterView, VideoPlayback, SortingOptionsView, SortingOptions) {
    return function(options) {
      var dateFilter, devView, erroneousFilter, filters, groupedTests, numberFilter, renderDevView, renderFilterView, renderResultListView, renderSortingOptionsView, resultListView, sortingOptions, testCollection, testGroups, tests, textFilter;
      testCollection = new Tests(options.testData);
      textFilter = new TextFilter;
      dateFilter = new DateFilter;
      numberFilter = new NumberFilter({
        tests: testCollection
      });
      erroneousFilter = new ErroneousFilter;
      sortingOptions = new SortingOptions({
        erroneousFilter: erroneousFilter
      });
      filters = [textFilter, dateFilter, numberFilter, erroneousFilter];
      tests = new TestGroup({
        tests: testCollection,
        filters: filters
      });
      groupedTests = tests.groupBy(['robot', 'navigation', 'scenario']);
      testGroups = new TestGroups(groupedTests);
      resultListView = null;
      devView = null;
      renderResultListView = function() {
        var videoOverlay;
        videoOverlay = new VideoPlayback;
        $('body').prepend(videoOverlay.render().el);
        resultListView = new ResultList({
          testGroups: testGroups,
          videoPlayback: videoOverlay
        });
        resultListView.on('expandTestGroup', function(testGroup) {
          return devView.activateTestDetailView(testGroup);
        });
        return $('#resultListView').html(resultListView.render().el);
      };
      renderDevView = function() {
        devView = new DevView({
          testGroups: testGroups,
          sortingOptions: sortingOptions
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
      renderSortingOptionsView = function() {
        sortingOptions = new SortingOptionsView({
          model: sortingOptions
        });
        return this.$('#sortingOptionsContainer').html(sortingOptions.render().el);
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
        renderDevView();
        return renderSortingOptionsView();
      });
    };
  });

}).call(this);
