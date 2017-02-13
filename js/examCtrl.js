reportsGARPControllers.controller('mapCtrl', ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout, $location) {
  $scope.envPath = envPath;

  //$.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=world-population.json&callback=?', function (data) {

  $rootScope.$on('drawMap', function(event, sdata) {

    var mapData = Highcharts.geojson(Highcharts.maps['custom/world']);

    var data = [];

    for (var i = 0; i < sdata.length; i++) {

      var fnd = _.findWhere(mapData, {
        name: sdata[i].Country
      })

      if (defined(fnd) && sdata[i].Total > 0) {
        var obj = {
          code: fnd.properties['iso-a2'],
          name: sdata[i].Country,
          value: sdata[i].Total
        }
        data.push(obj);
      } else {
        console.log('Not Found: ' + sdata.Country);
      }
    }

    // Correct UK to GB in data
    $.each(data, function() {
      if (this.code === 'UK') {
        this.code = 'GB';
      }
    });

    $('#containerMap').highcharts('Map', {
      chart: {
        borderWidth: 1
      },

      title: {
        text: 'Registrations By Country'
      },

      legend: {
        layout: 'horizontal',
        borderWidth: 0,
        backgroundColor: 'rgba(255,255,255,0.85)',
        floating: true,
        verticalAlign: 'top',
        y: 25
      },

      mapNavigation: {
        enabled: true
      },

      colorAxis: {
        min: 1,
        type: 'logarithmic',
        minColor: '#EEEEFF',
        maxColor: '#000022',
        stops: [
          [0, '#EFEFFF'],
          [0.67, '#4444FF'],
          [1, '#000022']
        ]
      },

      series: [{
        animation: {
          duration: 1000
        },
        data: data,
        mapData: mapData,
        joinBy: ['iso-a2', 'code'],
        dataLabels: {
          enabled: true,
          color: 'white',
          format: '{point.code}'
        },
        name: 'Registrations',
        tooltip: {
          pointFormat: '{point.name}: {point.value}'
        }
      }]
    });
  });
}]);

reportsGARPControllers.controller('examsCtrl', ['$scope', '$rootScope', '$timeout', '$stateParams', 'uiGridConstants',
  function($scope, $rootScope, $timeout, $stateParams, uiGridConstants) {

    $scope.envPath = envPath;

    $scope.sortingAlgorithm = function(a, b) {
      if(a==null)
        a = -99999;
      if(b==null)
        b = -999999;

      if (a > b)
        return 1;
      else if (a < b)
        return -1;
      else return 0;
    }

    $scope.gridOptions1 = {
      enableSorting: true,
      enableFiltering: true,
      filterOptions: {
        filterColumn: "Country",
      },
      data: null
    };

    $scope.examDatesMay = [{
      datetext: '12/1/2009',
      key: 'May 2010',
      done: false
    }, {
      datetext: '12/1/2010',
      key: 'May 2011',
      done: false
    }, {
      datetext: '12/1/2011',
      key: 'May 2012',
      done: false
    }, {
      datetext: '12/1/2012',
      key: 'May 2013',
      done: false
    }, {
      datetext: '12/1/2013',
      key: 'May 2014',
      done: false
    }, {
      datetext: '12/1/2014',
      key: 'May 2015',
      done: false
    }]

    $scope.examDatesNov = [{
      datetext: '12/1/2010',
      key: 'Nov 2010',
      done: false
    }, {
      datetext: '11/19/2011',
      key: 'Nov 2011',
      done: false
    }, {
      datetext: '11/17/2012',
      key: 'Nov 2012',
      done: false
    }, {
      datetext: '11/16/2013',
      key: 'Nov 2010',
      done: false
    }, {
      datetext: '11/15/2014',
      key: 'Nov 2014',
      done: false
    }, {
      datetext: '11/21/2015',
      key: 'Nov 2015',
      done: false
    }]

    //if(defined(localStorage,"rptData"))
    //  $scope.rptData = JSON.parse(localStorage.rptData);
    //else $scope.rptData = {};
    $scope.err = {};

    $scope.rptData = {};
    $scope.rptData.isCache = false;
    $scope.rptData.forceReload = false;
    $scope.rptData.disableExamYear = false;
    $scope.rptData.disableExamMonth = false;
    $scope.rptData.disableExamType = false;
    $scope.rptData.includeUnPaid = false;
    $scope.rptData.allOrders = "New Lead,Closed Won,Closed, Closed Lost";
    $scope.rptData.paidOrders = "Closed Won, Closed";

    $scope.rptData.currentReportType = null;
    $scope.rptData.currentExamType = null;
    $scope.rptData.currentCountryType = null;
    $scope.rptData.currentMapType = null;
    $scope.rptData.currentExamMonth = null;
    $scope.rptData.currentExamYear = null;
    $scope.rptData.currentStartExamYear = null;
    $scope.rptData.currentEndExamYear = null;
    $scope.rptData.aggregatesIndex = 0;


    $scope.rptData.reportTypeList = [{
      name: "Exam Registrations By Country",
      description: "Table and Map of where people registered for exams. Choose an Exam Type, Month and Year. Choose 'Include Unpaid' to see all Registrations versus just paid for ones.",
      reportId: "00O40000004LWK5",
      reportType: 'table',
      cumlative: false,
      applyFilters: true,
      columnDefs: [{
        field: 'Country'
      }, {
        field: 'Total',
        sort: {
          direction: uiGridConstants.DESC,
          priority: 1
        },
        sortingAlgorithm: $scope.sortingAlgorithm
      }, {
        name: 'Paid',
        field: 'Closed',
        sort: {
          direction: uiGridConstants.DESC,
          priority: 2
        },
        sortingAlgorithm: $scope.sortingAlgorithm
      }, {
        name: 'Cancelled',
        field: 'Closed Lost',
        sort: {
          direction: uiGridConstants.DESC,
          priority: 3
        },
        sortingAlgorithm: $scope.sortingAlgorithm
      }, {
        name: 'Unpiad',
        field: 'New Lead',
        sort: {
          direction: uiGridConstants.DESC,
          priority: 4
        },
        sortingAlgorithm: $scope.sortingAlgorithm
      }],
      hasUnpaid: false,
      hasYearToDate: false,
      hasExamType: true,
      hasExamMonth: true,
      hasExamYear: true,
      hasExamYearRange: false,
      hasExport: true
    },
    {
      name: "Exam Registrations By Country Year Over Year",
      description: "Table and Map of where people registered for exams over years. Choose an Location, Map Type, Exam Type, Month and Years. Choose 'Include Unpaid' to see all Registrations versus just paid for ones.",
      reportId: "00O40000004TuVm",
      reportSiteId: "00O40000004TuW1",
      reportIdCombined: "00O40000004TuVm",
      reportType: 'table',
      cumlative: false,
      applyFilters: true,
      columnDefs: [{
        field: 'Country'
      }, {
        field: 'Total',
        sort: {
          direction: uiGridConstants.DESC,
          priority: 1
        },
        sortingAlgorithm: $scope.sortingAlgorithm
      }, {
        field: 'Closed',
        sort: {
          direction: uiGridConstants.DESC,
          priority: 2
        },
        sortingAlgorithm: $scope.sortingAlgorithm
      }, {
        field: 'Closed Lost',
        sort: {
          direction: uiGridConstants.DESC,
          priority: 3
        },
        sortingAlgorithm: $scope.sortingAlgorithm
      }, {
        field: 'New Lead',
        sort: {
          direction: uiGridConstants.DESC,
          priority: 4
        },
        sortingAlgorithm: $scope.sortingAlgorithm
      }],
      hasUnpaid: true,
      hasYearToDate: true,
      hasExamType: true,
      hasExamMonth: true,
      hasExamYear: false,
      hasExamYearRange: true,
      hasExport: true,
      hasDiff: true,
      hasSite: true
    }, {
      name: "Exam Attendance By Country",
      description: "Table and Map of where people registered for exams. Broken out by Exam Attendance (Atteneded, Deferred, No-Show). Choose an Exam Type, Month and Year. Choose 'Include Unpaid' to see all Registrations versus just paid for ones.",
      reportId: "00O40000004LVJV",
      reportType: 'table',
      cumlative: false,
      applyFilters: true,
      columnDefs: [{
        field: 'Country'
      }, {
        field: 'Total',
        sort: {
          direction: uiGridConstants.DESC,
          priority: 1
        },
        sortingAlgorithm: $scope.sortingAlgorithm
      }, {
        field: 'Will Attend',
        sort: {
          direction: uiGridConstants.DESC,
          priority: 2
        },
        sortingAlgorithm: $scope.sortingAlgorithm
      }, {
        field: 'Deferred',
        sort: {
          direction: uiGridConstants.DESC,
          priority: 3
        },
        sortingAlgorithm: $scope.sortingAlgorithm
      }, {
        field: 'Attended',
        sort: {
          direction: uiGridConstants.DESC,
          priority: 2
        },
        sortingAlgorithm: $scope.sortingAlgorithm
      }, {
        field: 'No-Show',
        sort: {
          direction: uiGridConstants.DESC,
          priority: 4
        },
        sortingAlgorithm: $scope.sortingAlgorithm
      }],
      hasUnpaid: true,
      hasYearToDate: false,
      hasExamType: true,
      hasExamMonth: true,
      hasExamYear: true,
      hasExamYearRange: false,
      hasExport: true
    }, {
      name: "Exam Registrations By Day Of Year",
      description: "Cumulative line graph of what time of year people register for the Exam. Choose an Exam Type and Month. Choose 'Combine Exams' to combine FRM or ERP Exam Part I and II. Choose 'Include Unpaid' to see all Registrations versus just paid for ones.",
      reportId: "00O40000004To1R",
      reportIdCombined: "00O40000004TpDi",
      reportType: 'stackedline',
      hasUnpaid: true,
      cumlative: true,
      applyFilters: true,
      hasYearToDate: false,
      hasExamType: true,
      hasExamMonth: true,
      hasExamYear: false,
      hasExamYearRange: true,
      hasExport: true,
      colors: {
        erp : [GREEN1, GREEN2, GREEN3],
        frm : [BLUE1,  BLUE2,  BLUE3 ]
      }
    }, {
      name: "Exam Registrations By Type By Year",
      description: "Bar graph of exam registrations by year. Broken out by Type (Deferred In, Deferred Out, Early, Late, Standard). Choose an Exam Type and Month. Choose 'Combine Exams' to combine FRM or ERP Exam Part I and II. Choose 'Include Unpaid' to see all Registrations versus just paid for ones.",
      reportId: "00O40000004LUNM",
      reportIdCombined: "00O40000004LUNW",
      reportType: 'stackedbar',
      exportLabel: 'Date',
      hasUnpaid: true,
      cumlative: false,
      applyFilters: true,
      hasYearToDate: false,
      hasExamType: true,
      hasExamMonth: true,
      hasExamYear: false,
      hasExamYearRange: true,
      hasExport: true
    }, {
      name: "ERP Exam Registrations By Year",
      description: "Bar graph of ERP exam registrations by year. Broken out by Exam (ERP, ERP Part I and ERP Part II). Choose 'Include Unpaid' to see all Registrations versus just paid for ones.",
      reportId: "00O40000004TpDx",
      reportType: 'stackedbar',
      exportLabel: 'Year',
      hasUnpaid: true,
      cumlative: false,
      applyFilters: true,
      hasYearToDate: true,
      hasExamType: false,
      hasExamMonth: true,
      hasExamYear: false,
      hasExamYearRange: true,
      hasExport: true
    }, {
      name: "FRM Exam Registrations By Year",
      description: "Bar graph of FRM exam registrations by year. Broken out by Exam (FRM Part I, FRM Part II). Choose 'Include Unpaid' to see all Registrations versus just paid for ones.",
      reportId: "00O40000004TtwS",
      reportType: 'stackedbar',
      exportLabel: 'Year',
      hasUnpaid: true,
      cumlative: false,
      applyFilters: true,
      hasYearToDate: true,
      hasExamType: false,
      hasExamMonth: true,
      hasExamYear: false,
      hasExamYearRange: true,
      hasExport: true
    }, {
      name: "Exam Registrations By Year All Time",
      description: "Bar graph of FRM and/or ERP exam registrations by year. Choose Exam Types you want to report on. Select a 'Start Year' and 'End Year' if you want to select a range. Choose 'Include Unpaid' to see all Registrations versus just paid for ones.",
      reportId: "00O40000004Tu8O",
      reportIdCombined: "00O40000004Tu9g",
      reportType: 'stackedbar',
      exportLabel: 'Year',
      hasUnpaid: true,
      cumlative: false,
      applyFilters: true,
      hasYearToDate: false,
      hasExamType: true,
      hasExamMonth: false,
      hasExamYear: false,
      hasExamYearRange: true,
      hasExport: true,
      isAllTime: true
    }];

    $scope.rptData.examTypeList = [{
      name: "ERP",
      value: "ERP"
    }, {
      name: "ERP I",
      value: "ERP Exam Part I"
    }, {
      name: "ERP II",
      value: "ERP Exam Part II"
    }, {
      name: "ERP All",
      value: "ERP,ERP Exam Part I,ERP Exam Part II"
    }, {
      name: "FRM I",
      value: "FRM Part 1"
    }, {
      name: "FRM II",
      value: "FRM Part 2"
    }, {
      name: "FRM All",
      value: "FRM Part 1,FRM Part 2"
    }, {
      name: "All",
      value: "FRM Part 1,FRM Part 2,ERP,ERP Exam Part I,ERP Exam Part II"
    }];

    $scope.rptData.examFullTypeList = [{
      name: "ERP",
      value: "ERP",
      type: "ERP",
      number: "Full",
      label: "ERP Exam Part Full",
      color: GREEN1
    }, {
      name: "ERP I",
      value: "ERP Exam Part I",
      type: "ERP",
      number: "I",
      label: "ERP Exam Part I",
      color: GREEN2
    }, {
      name: "ERP II",
      value: "ERP Exam Part II",
      type: "ERP",
      number: "II",
      label: "ERP Exam Part II",
      color: GREEN3       
    }, {
      name: "ERP All",
      value: "ERP, ERP Exam Part I, ERP Exam Part II",
      type: "ERP",
      number: "Full,I,II",
      color: GREEN1          
    }, {
      name: "FRM",
      value: "FRM",
      type: "FRM",
      number: "Full",
      label: "FRM Exam Part Full",
      color: BLUE1
    }, {
      name: "FRM I",
      value: "FRM Part 1",
      type: "FRM",
      number: "I",
      label: "FRM Exam Part I",
      color: BLUE2
    }, {
      name: "FRM II",
      value: "FRM Part 2",
      type: "FRM",
      number: "II",
      label: "FRM Exam Part II",
      color: BLUE3
    }, {
      name: "FRM All",
      value: "FRM Part 1,FRM Part 2",
      type: "FRM",
      number: "Full,I,II",
      color: BLUE1
    }, {
      name: "All",
      value: "FRM Part 1,FRM Part 2,ERP, ERP Exam Part I, ERP Exam Part II",
      type: "FRM,ERP",
      number: "Full,I,II",
      color: BLUE1
    }];    

    $scope.rptData.examMonthList = [{
      name: "May",
      value: "May"
    }, {
      name: "November",
      value: "Nov"
    }, {
      name: "Both",
      value: "May,Nov"
    }];

    $scope.rptData.examRegType = [{
      name: "Deferral In",
      color: '#1CE7D8'
    }, {
      name: "Deferral Out",
      color: '#00A0DD'
    }, {
      name: "Early Registration",
      color: '#5BD2FF'
    }, {
      name: "Late Registration",
      color: '#56EBD7'
    }, {
      name: "Standard Registration",
      color: '#29CEB7'
    }];

    $scope.rptData.examYearAllTimeList = [];
    for (var i = 1997; i <= 2017; i++) {
      var obj = {
        name: i.toString(),
        value: i
      }
      $scope.rptData.examYearAllTimeList.push(obj);
    }

    $scope.rptData.examYearList = [];
    for (var i = 2010; i <= 2017; i++) {
      var obj = {
        name: i,
        value: i
      }
      $scope.rptData.examYearList.push(obj);
    }

    function findIndexDeep(arry, subProp, prop, value) {
      for (var i = 0; i < arry.length; i++) {
        var obj = arry[i];
        if(defined(obj,subProp)) {
          for(var j=0; j < obj[subProp].length; j++) {
            var subObj = obj[subProp][j];
            if(subObj[prop] == value && !defined(subObj,"used"))
              return true;
          }          
        }
      }
      return false;
    }

    $scope.isCombined = function(reportId) {
      var fnd = _.findWhere($scope.rptData.reportTypeList, {reportId: reportId});
      if(defined(fnd,'reportIdCombined'))
        return true;
      else return false;
    }

    $scope.getDescription = function() {
      var fndRpt = _.findWhere($scope.rptData.reportTypeList, {
        reportId: $scope.rptData.currentReportType
      });
      if (fndRpt != null) {
        return fndRpt.description;
      }

    }

    function setIsCache() {
      var key = $scope.reportId + "~" + 
                $scope.rptData.currentCountryType + "~" + 
                $scope.rptData.currentMapType + "~" + 
                $scope.rptData.currentExamType + "~" + 
                $scope.rptData.combineExams + "~" + 
                $scope.rptData.currentExamMonth + "~" + 
                $scope.rptData.currentExamYear + "~" + 
                $scope.rptData.currentStartExamYear + "~" + 
                $scope.rptData.currentEndExamYear + "~" + 
                $scope.rptData.includeUnPaid + "~" + 
                $scope.rptData.yearToDate;

      if (defined($scope.rptData[key])) {
        $scope.rptData.isCache = true;
      } else {
        $scope.rptData.isCache = false;
      }
    }

    $scope.selectPaid = function() {
      var fndRpt = _.findWhere($scope.rptData.reportTypeList, {
        reportId: $scope.rptData.currentReportType
      });
      $scope.fndRpt = fndRpt;

      if (fndRpt.name == 'Exam Registrations By Year All Time' && $scope.rptData.includeUnPaid) {
        $scope.rptData.aggregatesIndex = 0;
      } else if (fndRpt.name == 'Exam Registrations By Year All Time' && !$scope.rptData.includeUnPaid) {
        $scope.rptData.aggregatesIndex = 1;
      }
      setIsCache();
    }

    $scope.selectOptions = function() {
      setIsCache();
    }

    $scope.selectType = function() {

      var fndRpt = _.findWhere($scope.rptData.reportTypeList, {
        reportId: $scope.rptData.currentReportType
      });
      $scope.fndRpt = fndRpt;
      $scope.rptData.aggregatesIndex = 0;

      $scope.err = {};
      $scope.rptData.currentCountryType = null; 
      $scope.rptData.currentMapType = null; 
      $scope.rptData.currentExamType = null; 
      $scope.rptData.combineExams = false; 
      $scope.rptData.currentExamMonth = null; 
      $scope.rptData.currentExamYear = null; 
      $scope.rptData.currentStartExamYear = null; 
      $scope.rptData.currentEndExamYear = null;
      $scope.rptData.includeUnPaid = false;
      $scope.rptData.yearToDate = false;

      if (fndRpt.name == 'Exam Registrations By Year All Time' && $scope.rptData.includeUnPaid) {
        $scope.rptData.aggregatesIndex = 0;
      } else if (fndRpt.name == 'Exam Registrations By Year All Time' && !$scope.rptData.includeUnPaid) {
        $scope.rptData.aggregatesIndex = 1;
      }

      if (fndRpt.name == 'Exam Registrations By Country Year Over Year') {
        $scope.rptData.currentCountryType = 'Country';
        $scope.rptData.currentMapType = 'Total';
      }

      setIsCache();
      
    }

    var conn = jsForceConn;
    var reportId = '00O400000048eLH';
    var displayType = 'stackedbar';
    $scope.cumlative = false;
    if ($stateParams.reportId != null && $stateParams.reportId != '') {
      reportId = $stateParams.reportId;
    }
    if ($stateParams.displayType != null && $stateParams.displayType != '') {
      displayType = $stateParams.displayType;
    }

    if ($stateParams.cumlative != null && $stateParams.cumlative != '') {
      $scope.cumlative = $stateParams.cumlative;
    }

    $scope.refresh = function(reload, exportData) {

      debugger;

      $scope.err = {};
      if (defined($scope, "rptData.currentReportType")) {

        $scope.fndRpt = _.findWhere($scope.rptData.reportTypeList, {
          reportId: $scope.rptData.currentReportType
        });
        $scope.reportId = $scope.fndRpt.reportId;

        if ($scope.rptData.combineExams) {
          $scope.reportId = $scope.fndRpt.reportIdCombined;
        }

        if ($scope.rptData.currentCountryType == 'Exam Site') {
          $scope.reportId = $scope.fndRpt.reportSiteId;
        }

        // Validation
        if($scope.fndRpt.hasExamType == true && $scope.rptData.currentExamType == null) {
          $scope.err['hasExamType'] = 'Exam Type is required';
        }
        if($scope.fndRpt.hasExamMonth == true && $scope.rptData.currentExamMonth == null) {
          $scope.err['hasExamMonth'] = 'Exam Month is required';
        }
        if($scope.fndRpt.hasExamYear == true && $scope.rptData.currentExamYear == null) {
          $scope.err['hasExamYear'] = 'Exam Year is required';
        }

        if($scope.fndRpt.hasExamYearRange == true && ($scope.rptData.currentStartExamYear == null || $scope.rptData.currentEndExamYear == null)) {
          $scope.err['hasExamYearRange'] = 'Start and End Year are required';
        } else if(parseInt($scope.rptData.currentStartExamYear) > parseInt($scope.rptData.currentEndExamYear)) {
          $scope.err['hasExamYearRange'] = 'Start Year must be less than End Year';
        }


        if($scope.fndRpt.hasSite == true && $scope.rptData.currentCountryType == null) {
          $scope.err['hasSiteCountry'] = 'Location is required.';
        }
        if($scope.fndRpt.hasSite == true && $scope.rptData.currentMapType == null) {
          $scope.err['hasSiteMap'] = 'Map Display is required.';
        }
        var foundErr = false;
        _.each($scope.err, function(err) {
          foundErr = true;
        });
        if(foundErr)
          return;

        var key = $scope.reportId + "~" + 
                  $scope.rptData.currentCountryType + "~" + 
                  $scope.rptData.currentMapType + "~" + 
                  $scope.rptData.currentExamType + "~" + 
                  $scope.rptData.combineExams + "~" + 
                  $scope.rptData.currentExamMonth + "~" + 
                  $scope.rptData.currentExamYear + "~" + 
                  $scope.rptData.currentStartExamYear + "~" + 
                  $scope.rptData.currentEndExamYear + "~" + 
                  $scope.rptData.includeUnPaid + "~" + 
                  $scope.rptData.yearToDate;

        if (defined($scope.rptData[key]) && $scope.rptData.forceReload == false) {
          drawGraph(false, exportData);
        } else {
          loadData(exportData);
        }
        $scope.rptData.forceReload = false;
      } else {
        // Error
        $scope.err['currentReportType'] = 'Please select a report';
      }

    }

    function execReport(options, callback) {
      var metadata = options;
      var report = conn.analytics.report($scope.reportId);
      report.execute({
        metadata: metadata
      }, function(err, result) {
        var obj = {
          result: result
        };
        fnd = _.findWhere(metadata.reportMetadata.reportFilters, {column: "Exam_Attempt__c.RPT_Exam_Year__c"});
        if(defined(fnd,"value")) {
          obj.year = fnd.value;
        }
        callback(null, obj);
      });
    }


    function loadData(exportData) {


      $scope.fndRpt = _.findWhere($scope.rptData.reportTypeList, {
        reportId: $scope.rptData.currentReportType
      });
      $scope.reportId = $scope.fndRpt.reportId;

      if ($scope.rptData.combineExams) {
        $scope.reportId = $scope.fndRpt.reportIdCombined;
      }

      if ($scope.rptData.currentCountryType == 'Exam Site') {
        $scope.reportId = $scope.fndRpt.reportSiteId;
      }

      var report = conn.analytics.report($scope.reportId);

      conn.analytics.report($scope.reportId).describe(function(err, meta) {
        if (err) {
          $('#myGlobalErrorModal p').html("There has been an unexpected error:" + err)
          $("#myGlobalErrorModal").modal();
          alert('There has been an error please refresh your browser window and try again.');

          window.location.href = 'https://c.na2.visual.force.com/apex/reportsGARP2#!/exams?rptId=' + $scope.reportId;

          return console.error(err);
        }
        console.log(meta.reportMetadata);
        console.log(meta.reportTypeMetadata);
        console.log(meta.reportExtendedMetadata);


        var oppStages = $scope.rptData.paidOrders;
        if ($scope.rptData.includeUnPaid) {
          oppStages = $scope.rptData.allOrders;
        }

        var srtDate = '2014-12-01';
        if ($scope.rptData.currentExamMonth == 'Nov')
          var srtDate = '2015-05-01'

        if (defined(meta, "reportMetadata.reportFilters.length")) {
          for (var i = 0; i < meta.reportMetadata.reportFilters.length; i++) {
            var rf = meta.reportMetadata.reportFilters[i];
            switch (rf.column) {
              case 'Exam_Attempt__c.RPT_Exam_Description__c':
                if ($scope.fndRpt.applyFilters && $scope.fndRpt.hasExamType)
                  rf.value = $scope.rptData.currentExamMonth;
                break;

              case 'Exam_Attempt__c.Section__c':
                if ($scope.fndRpt.applyFilters && $scope.fndRpt.hasExamType)
                  rf.value = $scope.rptData.currentExamType;
                break;

              case 'Exam_Attempt__c.Opportunity_StageName__c':
              if($scope.fndRpt.hasUnpaid)
                  rf.value = oppStages;
                break;

              case 'Exam_Attempt__c.Exam_Type__c':
                if ($scope.rptData.currentExamYear != null && $scope.fndRpt.hasExamYear)
                  rf.value = $scope.rptData.currentExamYear;
                else rf.value = '2010,2011,2012,2013,2014,2015,2016,2017';
                break;

              case 'Exam_Stat__c.Exam_Type__c':
                if ($scope.fndRpt.applyFilters && $scope.fndRpt.hasExamType) {
                  var fnd = _.findWhere($scope.rptData.examFullTypeList, {value: $scope.rptData.currentExamType});
                  if(fnd != null) {
                    rf.value = fnd.type;
                  }
                  else rf.value = 'FRM,ERP'
                }
                break;

              case 'Exam_Stat__c.Exam_Number__c':
                if ($scope.fndRpt.applyFilters && $scope.fndRpt.hasExamType) {
                  var fnd = _.findWhere($scope.rptData.examFullTypeList, {value: $scope.rptData.currentExamType});
                  if(fnd != null) {
                    rf.value = fnd.number;
                  }
                  else rf.value = 'Full,I,II'
                }
                break;

              case 'Exam_Attempt__c.RPT_Exam_Month__c':
                if ($scope.fndRpt.applyFilters && $scope.fndRpt.hasExamMonth) {
                  if($scope.rptData.currentExamMonth == null) {
                    var fnd = _.findWhere($scope.rptData.examMonthList, {name: 'Both'});
                    if(fnd != null)
                      rf.value = fnd.value;
                  } else {
                    rf.value = $scope.rptData.currentExamMonth;  
                  }

                  
                }
                break;

              case 'Exam_Stat__c.Year__c':
              case 'Exam_Attempt__c.RPT_Exam_Year__c':
                if ($scope.fndRpt.applyFilters) {
                  if($scope.fndRpt.hasExamYearRange && $scope.rptData.currentStartExamYear != null && $scope.rptData.currentEndExamYear != null) {
                    var startYear=null;
                    var endYear=null;
                    if($scope.rptData.currentStartExamYear != null)
                      startYear=$scope.rptData.currentStartExamYear;
                    else startYear=$scope.rptData.examYearAllTimeList[0].value;

                    if($scope.rptData.currentEndExamYear != null)
                      endYear=$scope.rptData.currentEndExamYear;
                    else endYear=$scope.rptData.examYearAllTimeList[$scope.rptData.examYearAllTimeList.length-1].value;

                    if($scope.fndRpt.hasDiff == true) {
                      startYear--;
                    }

                    var yearStr="";
                    for(var j=startYear; j<=endYear; j++) {
                      if(yearStr=="")
                        yearStr = j;
                      else yearStr = yearStr + "," + j;
                    }                    
                    rf.value = yearStr;
                  } else {
                    if($scope.fndRpt.hasExamYear)
                      rf.value = $scope.rptData.currentExamYear;
                  }
                }
                break;

              case 'Exam_Attempt__c.Days_Since_Dec__c':
                if ($scope.rptData.yearToDate && $scope.fndRpt.hasYearToDate) {
                  var mnow = moment();
                  if(mnow.month() == 11) {
                    var dec = moment('12/1/' + mnow.year());
                    rf.value = mnow.diff(dec, 'days');
                  } else {
                   var dec = moment('12/1/' + (mnow.year()-1).toString());
                    rf.value = mnow.diff(dec, 'days');
                  }
                } else {
                  rf.value = 999999  
                }
                break;

              case 'Exam_Attempt__c.Days_Since_Dec_Cal_Date__c':
              if ($scope.rptData.yearToDate && $scope.fndRpt.hasYearToDate) {
                var mnow = moment();
                if(mnow.month() == 11) {
                  var day = mnow.date();
                  rf.value = moment('11/' + day.toString() + '/15').format('YYYY-MM-DD');
                } else {
                  var month = mnow.month()+1 ;
                  var day = mnow.date();
                  rf.value = moment(month.toString() + '/' + day.toString() + '/16').format('YYYY-MM-DD');
                }
              } else {
                rf.value = '3030-01-01';  
              }
              break;                

            }
          }
        }


        var metadata = {
          reportMetadata: {
            reportFilters: meta.reportMetadata.reportFilters
          }
        };

        var selector = '#mainspin';
        var obj = $(selector)
        $scope.mainSpinner;
        if (obj !== null && typeof obj !== "undefined" && obj.length !== null && typeof obj.length !== "undefined") {
          $scope.mainSpinner = new Spinner(spinnerOptions).spin(obj[0]);
        }

        var fnd = _.findWhere($scope.rptData.reportTypeList, {reportId: $scope.rptData.currentReportType})
        if(defined(fnd,"name") && fnd.name == 'Exam Registrations By Day Of Year') {

          fnd = _.findWhere(metadata.reportMetadata.reportFilters, {column: "Exam_Attempt__c.RPT_Exam_Year__c"});
          if(defined(fnd,"value")) {

            var yearArray = fnd.value.split(',');
            var options = [];
            for(var i=0; i<yearArray.length; i++) {

              var obj = jQuery.extend(true, {}, metadata);
              fnd = _.findWhere(obj.reportMetadata.reportFilters, {column: "Exam_Attempt__c.RPT_Exam_Year__c"});
              if(defined(fnd,"value")) {
                fnd.value = yearArray[i].trim();
                options.push(obj);
              }
            }
          }

          $scope.reportDataCombined=null;
          async.map(options, execReport, function(err, results){
            try {
              for(var i=0; i<results.length; i++) {
                var res = results[i].result;
                var year = results[i].year;
                if($scope.reportDataCombined == null) {
                  $scope.reportDataCombined = res;
                  $scope.reportDataCombined.factMaps = {};
                  $scope.reportDataCombined.factMaps[year] = res.factMap;
                  delete results[i].factMap;

                  $scope.reportDataCombined.groupingsDowns = {};
                  $scope.reportDataCombined.groupingsDowns[year] = res.groupingsDown;
                  delete results[i].groupingsDown;                  
                } else {
                  $scope.reportDataCombined.factMaps[year] = res.factMap;
                  $scope.reportDataCombined.groupingsDowns[year] = res.groupingsDown;
                }
              }

          var key = $scope.reportId + "~" + 
                  $scope.rptData.currentCountryType + "~" + 
                  $scope.rptData.currentMapType + "~" + 
                  $scope.rptData.currentExamType + "~" + 
                  $scope.rptData.combineExams + "~" + 
                  $scope.rptData.currentExamMonth + "~" + 
                  $scope.rptData.currentExamYear + "~" + 
                  $scope.rptData.currentStartExamYear + "~" + 
                  $scope.rptData.currentEndExamYear + "~" + 
                  $scope.rptData.includeUnPaid + "~" + 
                  $scope.rptData.yearToDate;

            $scope.rptData[key] = $scope.reportDataCombined;
            
            $scope.mainSpinner.stop();
            drawGraph(true, exportData);

            $rootScope.$apply(function() {
              $scope.rptData.isCache = true;
            });

            } catch(e) {
              console.log(e);
            }
          });

        } else if(defined(fnd,"name") && fnd.name == 'Exam Registrations By Country Year Over Year') {

          fnd = _.findWhere(metadata.reportMetadata.reportFilters, {column: "Exam_Attempt__c.RPT_Exam_Year__c"});
          if(defined(fnd,"value")) {

            var yearArray = fnd.value.split(',');
            var options = [];
            for(var i=0; i<yearArray.length; i++) {
              var obj = jQuery.extend(true, {}, metadata);
              fnd = _.findWhere(obj.reportMetadata.reportFilters, {column: "Exam_Attempt__c.RPT_Exam_Year__c"});
              if(defined(fnd,"value")) {
                fnd.value = yearArray[i].trim();
                options.push(obj);
              }
            }
          }

          $scope.reportDataCombined=null;
          async.map(options, execReport, function(err, results){
            try {
              for(var i=0; i<results.length; i++) {
                var res = results[i].result;
                var year = results[i].year;
                if($scope.reportDataCombined == null) {
                  $scope.reportDataCombined = res;
                  $scope.reportDataCombined.factMaps = {};
                  $scope.reportDataCombined.factMaps[year] = res.factMap;
                  delete results[i].factMap;

                  $scope.reportDataCombined.groupingsDowns = {};
                  $scope.reportDataCombined.groupingsDowns[year] = res.groupingsDown;
                  delete results[i].groupingsDown;                  
                } else {
                  $scope.reportDataCombined.factMaps[year] = res.factMap;
                  $scope.reportDataCombined.groupingsDowns[year] = res.groupingsDown;
                }
              }

            var key = $scope.reportId + "~" + 
                  $scope.rptData.currentCountryType + "~" + 
                  $scope.rptData.currentMapType + "~" + 
                  $scope.rptData.currentExamType + "~" + 
                  $scope.rptData.combineExams + "~" + 
                  $scope.rptData.currentExamMonth + "~" + 
                  $scope.rptData.currentExamYear + "~" + 
                  $scope.rptData.currentStartExamYear + "~" + 
                  $scope.rptData.currentEndExamYear + "~" + 
                  $scope.rptData.includeUnPaid + "~" + 
                  $scope.rptData.yearToDate;
            $scope.rptData[key] = $scope.reportDataCombined;
            $scope.mainSpinner.stop();

            drawGraph(true, exportData);
            $rootScope.$apply(function() {
              $scope.rptData.isCache = true;
            });


            } catch(e) {
              console.log(e);
            }
          });          


        } else {

          // execute report synchronously
          report.execute({
            metadata: metadata
          }, function(err, result) {
            if (err) {
              $scope.mainSpinner.stop();
              $('#myGlobalErrorModal p').html("There has been an unexpected error:" + err)
              $("#myGlobalErrorModal").modal();
              return console.error(err);
            }
            console.log(result.reportMetadata);
            console.log(result.factMap);
            console.log(result.factMap["T!T"]);
            console.log(result.factMap["T!T"].aggregates);

            var data = result;

            var key = $scope.reportId + "~" + 
                  $scope.rptData.currentCountryType + "~" + 
                  $scope.rptData.currentMapType + "~" + 
                  $scope.rptData.currentExamType + "~" + 
                  $scope.rptData.combineExams + "~" + 
                  $scope.rptData.currentExamMonth + "~" + 
                  $scope.rptData.currentExamYear + "~" + 
                  $scope.rptData.currentStartExamYear + "~" + 
                  $scope.rptData.currentEndExamYear + "~" + 
                  $scope.rptData.includeUnPaid + "~" + 
                  $scope.rptData.yearToDate;

            $scope.rptData[key] = data;
            $scope.mainSpinner.stop();

            drawGraph(true, exportData);
            $rootScope.$apply(function() {
              $scope.rptData.isCache = true;
            });

          });

        }

      });

    }


    function drawCountryTable(sdata) {

      $scope.myData = sdata;
      $scope.gridOptions1.columnDefs = $scope.fndRpt.columnDefs;
      $scope.gridOptions1.data = sdata;
      if($scope.rptData.currentCountryType == 'Exam Site') {
        var mapData = [];

        _.each(sdata, function(row) {                
          var idx = row.Country.indexOf(",");
           var country = row.Country;
          if(idx > -1)
            country = country.slice(0,idx);
          if(country == 'US')
            country = 'United States';
          if(country == 'UK')
            country = 'United Kingdom';

          var fnd = _.findWhere(mapData, {Country: country});
          if(fnd == null) {
            if($scope.rptData.currentMapType == 'Total') {
              mapData.push({Country: country, Total: row.Total});
            } else {
              mapData.push({Country: country, Total: row['%Diff']});
            }
          } else {
            if($scope.rptData.currentMapType == 'Total') {
              fnd.Total += row.Total;
            } else {
              fnd.Total += row['%Diff'];
            }
          }
        });
        $rootScope.$broadcast('drawMap', mapData);

      } else {

        if($scope.rptData.currentMapType == 'Total') {
          $rootScope.$broadcast('drawMap', sdata);  
        } else {
          var mapData = [];
          _.each(sdata, function(row) {
            mapData.push({Country: row.Country, Total: row['%Diff']});
          });
          $rootScope.$broadcast('drawMap', mapData);  
        }

      }      

    }


    function drawGraph(async, exportData) {

      if (!defined($scope, "rptData.currentReportType"))
        return;

      $scope.fndRpt = _.findWhere($scope.rptData.reportTypeList, {
        reportId: $scope.rptData.currentReportType
      });
      $scope.reportId = $scope.fndRpt.reportId;

      if ($scope.rptData.combineExams) {
        $scope.reportId = $scope.fndRpt.reportIdCombined;
      }
      if ($scope.rptData.currentCountryType == 'Exam Site') {
        $scope.reportId = $scope.fndRpt.reportSiteId;
      }


      //var rptId = $scope.rptData.currentReportType
      var key = $scope.reportId + "~" + 
                $scope.rptData.currentCountryType + "~" + 
                $scope.rptData.currentMapType + "~" + 
                $scope.rptData.currentExamType + "~" + 
                $scope.rptData.combineExams + "~" + 
                $scope.rptData.currentExamMonth + "~" + 
                $scope.rptData.currentExamYear + "~" + 
                $scope.rptData.currentStartExamYear + "~" + 
                $scope.rptData.currentEndExamYear + "~" + 
                $scope.rptData.includeUnPaid + "~" + 
                $scope.rptData.yearToDate;      

      if (!defined($scope.rptData[key])) {
        alert("Data not found! Please reload page and try again.");
        return;
      }


      var data = $scope.rptData[key];
      console.log(data);

      //"groupingsDown"
      if (!defined(data,"groupingsDowns")) {
        if(data.groupingsDown.groupings.length <= 0) {
          alert('No data found.');
          return;
        }
      } else {
        var found=false;
        for(var propertyName in data.groupingsDowns) {
          var group = data.groupingsDowns[propertyName];
          if(group.groupings.length > 0)
            found=true;
        }
        if(!found) {
          alert('No data found.');
          return;          
        }
      }

      //var fndRpt = _.findWhere($scope.rptData.reportTypeList, {reportId: $scope.reportId});
      if (!defined($scope.fndRpt)) {
        alert('Report not found!');
        return;
      }

      debugger;
      var combo = $scope.rptData.combineExams;
      if ($scope.fndRpt.reportType == 'table') {

        if(defined(data,"groupingsDowns")) {

          var allSData = {};
          var sdata = [];
          var colDefNumberDefaults = {
            type:'number',
            sortingAlgorithm: $scope.sortingAlgorithm
          }

          $scope.fndRpt.columnDefs = [];
          
          var emptyTotals = {};

          var fndExam = _.findWhere($scope.rptData.examFullTypeList, {value: $scope.rptData.currentExamType});
          var showTotals = ((parseInt($scope.rptData.currentEndExamYear) - parseInt($scope.rptData.currentStartExamYear)) || !combo);

          if(!combo && fndExam != null) {

            var first=true;            
            for(var propertyName in data.groupingsDowns) {
              if(parseInt(propertyName) < parseInt($scope.rptData.currentStartExamYear))
                continue;

              var parts = fndExam.value.split(',');
              for(var i=0; i<parts.length; i++) {
                var part = parts[i].trim();
                var yearTotalLable = propertyName + ' ' + part + ' Total';
                var yearDiffLable = propertyName  + ' ' + part + ' %Diff';
                emptyTotals[yearTotalLable] = 0;
                emptyTotals[yearDiffLable] = 0;
                if(first) {
                  first=false;
                  var obj = {
                    field: yearTotalLable,
                    sort: {
                      direction: uiGridConstants.DESC,
                      priority: 1
                    }
                  }
                  $scope.fndRpt.columnDefs.push(_.extend(obj,colDefNumberDefaults, {rank: propertyName + part + 'B'}));
                } else {
                  $scope.fndRpt.columnDefs.push(_.extend({field: yearTotalLable},colDefNumberDefaults, {rank: propertyName + part + 'B'}));
                }
                $scope.fndRpt.columnDefs.push(_.extend({field: yearDiffLable},colDefNumberDefaults, {rank: propertyName + part + 'A'}));
              }
            }

          } else {

            var fndExam = _.findWhere($scope.rptData.examFullTypeList, {value: $scope.rptData.currentExamType});

            for(var propertyName in data.groupingsDowns) {
              if(parseInt(propertyName) < parseInt($scope.rptData.currentStartExamYear))
                continue;
              var yearTotalLable = propertyName + ' ' + fndExam.name + ' Total';
              var yearDiffLable = propertyName + ' ' + fndExam.name + ' %Diff';
              emptyTotals[yearTotalLable] = 0;
              emptyTotals[yearDiffLable] = 0;
              $scope.fndRpt.columnDefs.push(_.extend({field: yearTotalLable, rank: propertyName + 'B'},colDefNumberDefaults));
              $scope.fndRpt.columnDefs.push(_.extend({field: yearDiffLable, rank: propertyName + 'A'},colDefNumberDefaults));
            }
          }
          $scope.fndRpt.columnDefs = _.sortBy($scope.fndRpt.columnDefs, function(row) { return row.rank })
          $scope.fndRpt.columnDefs = $scope.fndRpt.columnDefs.reverse();

          var obj = {
            sort: {
              direction: uiGridConstants.DESC,
              priority: 1
            }
          }
          $scope.fndRpt.columnDefs[1] = _.extend($scope.fndRpt.columnDefs[1], obj);


          if(showTotals) {
            $scope.fndRpt.columnDefs.push(_.extend({field: 'Total'},colDefNumberDefaults));
            $scope.fndRpt.columnDefs.push(_.extend({field: '%Diff'},colDefNumberDefaults));                
          }
          $scope.fndRpt.columnDefs.unshift({ field: 'Country' });

          var yearTotals = {};
          for(var year in data.groupingsDowns) {

            var groupDown = data.groupingsDowns[year];
            var allsd = allSData[year] = [];
            var showInfo = false;
            if(parseInt(year) >= parseInt($scope.rptData.currentStartExamYear)) {
              showInfo = true;                          
            }

            for (var i = 0; i < groupDown.groupings.length; i++) {
              var group = groupDown.groupings[i];
              
              var country = group.label;
              
              if (country == "-" || country == "&nbsp;" || country == "NULL") {
                country = 'Other';
              }
                
              yearTotals[country + '~' + year] = null;
              var yearTotal = null;
              if(!combo) {
                var parts = fndExam.value.split(',');
                for(var j=0; j<parts.length; j++) {

                  var part = parts[j].trim();
                  var yearTotalLable = year + ' ' + part + ' Total';
                  var yearDiffLable = year + ' ' + part + ' %Diff';
                  var key = country+part;

                  var subgroup = _.findWhere(group.groupings, {label: part});
                  if(!defined(subgroup,"key")) {
                    if(parseInt(year) >= parseInt($scope.rptData.currentStartExamYear)) {
                      var lastYear = parseInt(year)-1;
                      var fnd = _.findWhere(allSData[lastYear], {Country: key});
                      if(fnd != null) {
                        if(fnd.Total > 0)
                          obj[yearDiffLable] = -100;
                        else obj[yearDiffLable] = 0;
                        var allObj = {
                          Country: key,
                          Total: 0
                        }
                        yearTotal+=0;
                        allsd.push(allObj);                      
                      } else {
                        obj[yearDiffLable] = null;
                      }
                    }
                  } else {

                    //var subgroup = group.groupings[j];
                    var val = data.factMaps[year][subgroup.key + '!T'].aggregates[$scope.rptData.aggregatesIndex].value;
                    var allObj = {
                      Country: key,
                      Total: val
                    }
                    yearTotal+=val;
                    allsd.push(allObj);

                    if(showInfo) {
                      var obj = _.findWhere(sdata, {Country: country});
                      if(obj == null) {
                        obj = {
                          Country: country,
                          Total: val
                        };                
                        obj = _.extend(obj, emptyTotals);
                        obj[yearTotalLable] = val;
                        sdata.push(obj);
                      } else {
                        obj[yearTotalLable] = val;
                        obj.Total += val;
                      }

                      var lastYear = parseInt(year)-1;
                      var fnd = _.findWhere(allSData[lastYear], {Country: key});
                      if(fnd != null) {
                        obj[yearDiffLable] = Math.ceil(((val - fnd.Total)/val)*100);
                      } else {
                        obj[yearDiffLable] = null;
                      }
                    }
                  }
                }
                yearTotals[country + '~' + year] = yearTotal;

              } else {
                var fndExam = _.findWhere($scope.rptData.examFullTypeList, {value: $scope.rptData.currentExamType});
                var yearTotalLable = year + ' ' + fndExam.name + ' Total';
                var yearDiffLable = year + ' ' + fndExam.name + ' %Diff';

                if(!defined(data,"factMaps." + year + "." + group.key + '!T')) {
                  if(parseInt(year) >= parseInt($scope.rptData.currentStartExamYear)) {
                    var lastYear = parseInt(year)-1;
                    var fnd = _.findWhere(allSData[lastYear], {Country: country});
                    if(fnd != null) {
                      if(fnd.Total > 0)
                        obj[yearDiffLable] = -100;
                      else obj[yearDiffLable] = 0;
                      var allObj = {
                        Country: country,
                        Total: 0
                      }
                      yearTotal+=0;
                      allsd.push(allObj);                      
                    } else {
                      obj[yearDiffLable] = null;
                    }
                  }
                } else {

                  var val = data.factMaps[year][group.key + '!T'].aggregates[$scope.rptData.aggregatesIndex].value;
                  var allObj = {
                    Country: country,
                    Total: val
                  }
                  allsd.push(allObj);
                  yearTotal+=val;

                  if(showInfo) {
                    var obj = _.findWhere(sdata, {Country: country});
                    if(obj == null) {
                      obj = {
                        Country: country,
                        Total: val
                      };                
                      obj = _.extend(obj, emptyTotals);
                      obj[yearTotalLable] = val;
                      sdata.push(obj);
                    } else {
                      obj[yearTotalLable] = val;
                      obj.Total += val;
                    }

                    var lastYear = parseInt(year)-1;
                    var fnd = _.findWhere(allSData[lastYear], {Country: country});
                    if(fnd != null) {
                      obj[yearDiffLable] = Math.ceil(((val - fnd.Total)/val)*100);
                    } else {
                      obj[yearDiffLable] = null;
                    }
                  }                
                }
                yearTotals[country + '~' + year] = yearTotal;
              }
            }
          }
          // compute %diff total
          var countryNets = {};
          for(var totYearProp in yearTotals) {
            var spliArr = totYearProp.split('~');
            var country = spliArr[0];
            var totYear = spliArr[1];
            var lastYear = parseInt(totYear)-1;
            var tot = yearTotals[totYearProp];
            var lastTot = yearTotals[country + '~' + lastYear];
            if(lastTot != null) {
              if(defined(countryNets,country))
                countryNets[country] += Math.ceil(((tot - lastTot)/tot)*100);
               else countryNets[country] = Math.ceil(((tot - lastTot)/tot)*100);
            }          }
          for(var country in countryNets) {
            var fnd = _.findWhere(sdata, {Country: country});
            if(defined(fnd)) {
              fnd['%Diff'] = countryNets[country];
            }
          }          
        } else {

          var sdata = [];
          for (var i = 0; i < data.groupingsDown.groupings.length; i++) {
            var group = data.groupingsDown.groupings[i];
            var val = data.factMap[group.key + '!T'].aggregates[$scope.rptData.aggregatesIndex].value;
            var country = group.label;

            if (country == "-" || country == "&nbsp;" || country == "NULL") {
              country = 'Other';
            }

            var obj = {
              Country: country,
              Total: val
            }

            if (defined(group, "groupings.length")) {

              var types = _.pluck($scope.fndRpt.columnDefs, "field");
              types = _.reject(types, function(obj) {
                return (obj == 'Country' || obj == 'Total');
              });
              //var types = ['Attended','Deferred','No-Show'];

              for (var k = 0; k < types.length; k++) {
                var type = types[k];
                var fndGroup = _.findWhere(group.groupings, {
                  label: type
                });
                if (defined(fndGroup)) {
                  var g = fndGroup;
                  var v = data.factMap[g.key + '!T'].aggregates[$scope.rptData.aggregatesIndex].value;
                  obj[type] = v;
                } else {
                  obj[type] = 0;
                }
              }
            }
            sdata.push(obj);
          }
        }

        if (exportData) {
          var csv = JSON2CSV(sdata,true,true,$scope.fndRpt.columnDefs);
          var filename = 'export.csv';
          exportToCSV(csv,filename);
          return;

        } else {
          if ($scope.fndRpt.name == 'Exam Registrations By Country Year Over Year' && async) {
            $rootScope.$apply(function() {
              drawCountryTable(sdata);
            });
          } if($scope.fndRpt.name == 'Exam Registrations By Country Year Over Year' && !async) {
            drawCountryTable(sdata);
          } else {
            if (async) {
              $rootScope.$apply(function() {
                $scope.myData = sdata;
                $scope.gridOptions1.columnDefs = $scope.fndRpt.columnDefs;
                $scope.gridOptions1.data = sdata;
                $rootScope.$broadcast('drawMap', sdata);
              });
            } else {
              $scope.myData = sdata;
              $scope.gridOptions1.columnDefs = $scope.fndRpt.columnDefs;
              $scope.gridOptions1.data = sdata;
              $rootScope.$broadcast('drawMap', sdata);              
            }
          }

        }
      }

      // Setup X and Y Axis, line does not require stackLabels data...
      if ($scope.fndRpt.reportType == 'stackedline') {

        var sdata = [];
        var labels = [];
        var series = [];
        for(var year in data.groupingsDowns) {
          var groupings = data.groupingsDowns[year].groupings;
          for (var i = 0; i < groupings.length; i++) {
            for(j=0; j<groupings[i].groupings.length; j++) {
              var lab = groupings[i].groupings[j].label;
              var fnd = _.findWhere(series, {name: lab});
              if(!defined(fnd)) {
                var obj = {
                  year: year,
                  name: lab
                }
                series.push(obj);
              }
            }
            var l = _.pluck(groupings, "label");
            labels = _.union(labels, l);
          }
        }

        var uniqueNames = [];
        $.each(labels, function(i, el){
            if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
        });
        labels = _.sortBy(uniqueNames, function(obj){ 
          return moment(obj).unix();
        });
        // create labels by calendar
        var currDate = moment(labels[0]);
        var lastDate = moment(labels[labels.length-1]);
        var done = false;
        var newLables = [];
        while(!done) {
          var dt = currDate.format("M/D/YYYY");
          newLables.push(dt);
          if(currDate.diff(lastDate) == 0) {
            done = true;
          } else {
            currDate.add(1,'days');
          }
        }
        labels = newLables;

        var erpSeriesLength=0;
        var frmSeriesLength=0;
        var usedColor = [];

        _.each(series, function(s) {
          var examType = (s.name.toUpperCase().indexOf('FRM') > -1) ? 'frm' : 'erp';
          var key = s.name.replace(/[May]*[Nov]*[ ]*/,'');
          var fnd = _.findWhere(usedColor, {key: key})
          if(!defined(fnd)) {
            var obj = {
              key: key
            }
            usedColor.push(obj);

            if(examType == 'frm')
              frmSeriesLength++;
            else erpSeriesLength++;
          }         
        });

        var erpCount=0;
        var frmCount=0;
        for (var i = 0; i < series.length; i++) {
          var examType = (series[i].name.toUpperCase().indexOf('FRM') > -1) ? 'frm' : 'erp';
          var colors;
          var color;
          var counter;
          var lengthNum;
          if(examType == 'erp') {
            lengthNum = erpSeriesLength;
            colors = greenColors;
          } else {
            lengthNum = frmSeriesLength;
            colors = blueColors;
          }
          
          var key = series[i].name.replace(/[May]*[Nov]*[ ]*/,'');
          var fnd = _.findWhere(usedColor, {key: key})
          if(!defined(fnd,"color")) {
            if(examType == 'frm') {
              frmCount++;
              counter = frmCount;
            } else {
              erpCount++;
              counter = erpCount;
            }
            var inc = Math.floor(colors.length/lengthNum);
            var start = colors.length - (inc * lengthNum);
            var index = (counter * inc) + start;
            color = colors[index-1];
            fnd.color = color;
          } else {
            color = fnd.color;
          }
            
          var obj = {
            name: series[i].name,
            data: [],
            last: null,
            lineWidth: 4,
            marker: {
              radius: 4
            },
            year: series[i].year,
            color: color
          }
          sdata.push(obj);
        }

        $scope.deferred = [];

        // clear last
        _.each(sdata, function(sd) {
          if(defined(sd,"last"))
            sd.last=null;
        });

        _.each(data.groupingsDowns, function(gd) {
            _.each(gd.groupings, function(gdg) {
                _.each(gdg.groupings, function(g) {
                   g.used=null; 
                });
            });
        });


        // for each sdata
        for (var i = 0; i < sdata.length; i++) {
          var sd = sdata[i];
          var year = sd.year;
          var groupingsDown = data.groupingsDowns[year].groupings;

          // var grps = _.pluck(groupingsDown, 'groupings')
          // grps = _.flatten(grps);
          //var lastGrp = findIndexDeep(groupingsDown, 'groupings', 'label', sd.name);

          // for each label
          var lastFound = false;
          for(var j=0; j<labels.length; j++) {
            var label = labels[j];
            var fndGrouping = _.findWhere(groupingsDown, {label: label});
            if(defined(fndGrouping)) {
              var lastFndGRp = _.findIndex(fndGrouping.groupings, {label: sd.name});
              var fndGroupingByName = _.findWhere(fndGrouping.groupings, {label: sd.name});
              if(defined(fndGroupingByName)) {
                fndGroupingByName.used = true;
                var key = fndGroupingByName.key;
                var val = data.factMaps[year][key + '!T'].aggregates[$scope.rptData.aggregatesIndex].value;

                if ($scope.fndRpt.cumlative == true) {
                  if(sd.last != null)
                    val = sd.last + val;
                  sd.last = val;
                  sd.data.push(val);
                } else {
                  sd.data.push(val);
                }

              } else {
                if(lastFound == true)
                  continue;

                var fnd = findIndexDeep(groupingsDown, 'groupings', 'label', sd.name);
                if(fnd == false) {
                    lastFound == true;
                } else {                  
                  if(sd.last != null)
                    sd.data.push(sd.last);
                  else sd.data.push(null);
                }
              }
            } else {
              if(lastFound == true)
                continue;

              var fnd = findIndexDeep(groupingsDown, 'groupings', 'label', sd.name);
              if(fnd == false) {
                  lastFound == true;
              } else {
                if(sd.last != null)
                  sd.data.push(sd.last);
                else sd.data.push(null);                
              }
            }
          }

        }

        var displaylabels = [];
        for(var i=0; i<labels.length; i++) {
          var newLab = labels[i].replace('/2015','').replace('/2016','');
          displaylabels.push(newLab);
        }
        labels = displaylabels;

        if (exportData) {


          var expotData = [];
          var exportLabels = {};
          exportLabels['label'] = 'Date';
          for(var i=0; i<sdata.length; i++) {
            var lab = sdata[i].name;
            exportLabels[lab] = lab;
          }
          expotData.push(exportLabels);

          for(var i=0; i<labels.length; i++) {
            var lab = labels[i];
            var dataObj = {
              label: lab
            }
            for(var j=0; j<sdata.length; j++) {
              var sd = sdata[j];
              if(sd.data.length > i && sd.data[i] != null) {
                dataObj[sd.name] = sd.data[i];
              } else {
                dataObj[sd.name] = '';
              }
            }
            expotData.push(dataObj);
          }

          var csv = JSON2CSV(expotData,false,true);          
          var filename = 'export.csv';
          exportToCSV(csv,filename);
          return;

        } else {


          $('#container').highcharts({

            exporting: {
              sourceWidth: 1200,
              sourceHeight: 800,
              scale: 1
            },

            // Edit chart spacing
            chart: {
              spacingBottom: 15,
              spacingTop: 10,
              spacingLeft: 10,
              spacingRight: 10,

              // Explicitly tell the width and height of a chart
              width: null,
              height: 900,
            },

            title: {
              text: 'Registrations by Day'
            },

            subtitle: {
              text: ''
            },

            xAxis: {
              tickInterval: 7, // one week
              tickWidth: 0,
              gridLineWidth: 1,
              labels: {
                align: 'left',
                x: 3,
                y: -3,
                enabled: true
              },
              title: {
                  text: 'Days'
              },
              categories: labels
            },

            yAxis: [{ // left y axis
              title: {
                text: 'Registrations'
              },
              labels: {
                align: 'left',
                x: 3,
                y: 16,
                format: '{value:.,0f}'
              },
              showFirstLabel: false
            }, { // right y axis
              linkedTo: 0,
              gridLineWidth: 0,
              opposite: true,
              title: {
                text: null
              },
              labels: {
                align: 'right',
                x: -3,
                y: 16,
                format: '{value:.,0f}'
              },
              showFirstLabel: false
            }],

            legend: {
              align: 'left',
              verticalAlign: 'top',
              y: 20,
              floating: true,
              borderWidth: 0
            },

            tooltip: {
              shared: true,
              crosshairs: true
            },

            plotOptions: {
              series: {
                cursor: 'pointer',
                point: {
                  events: {
                    click: function(e) {
                      hs.htmlExpand(null, {
                        pageOrigin: {
                          x: e.pageX || e.clientX,
                          y: e.pageY || e.clientY
                        },
                        headingText: this.series.name,
                        maincontentText: this.series.data[this.x].category + ':<br/> ' +
                          this.y + ' Registrations',
                        width: 200
                      });
                    }
                  }
                },
                marker: {
                  lineWidth: 1
                }
              }
            },
            series: sdata
          });
        }
      }

      if ($scope.fndRpt.reportType == 'bar') {

        var labels = _.pluck(data.groupingsDown.groupings, "label");
        var sdata = {
          name: 'Bar',
          data: [],
          dataLabels: {
            enabled: true,
            color: '#FFFFFF',
            align: 'right',
            format: '{point.y:.1f}', // one decimal
            y: 10, // 10 pixels down from the top
            style: {
              fontSize: '13px',
              fontFamily: 'Verdana, sans-serif'
            }
          }
        };

        for (var i = 0; i < data.groupingsDown.groupings.length; i++) {
          var group = data.groupingsDown.groupings[i];
          var da = data.factMap[group.key + '!T'].aggregates[$scope.rptData.aggregatesIndex].value;

          var obj = [];
          obj.push(group.label);
          obj.push(da);

          sdata.data.push(obj);
        }

        var stuff = sdata.data;

        $('#container').highcharts({

          exporting: {
            sourceWidth: 1200,
            sourceHeight: 800,
            scale: 1
          },

          chart: {
            type: 'column'
          },
          title: {
            text: $scope.fndRpt.Name
          },
          subtitle: {
            text: ''
          },
          xAxis: {
            type: 'category',
            labels: {
              rotation: -45,
              style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
              }
            },
            title: {
              text: 'Year'
            }
          },
          yAxis: {
            min: 0,
            title: {
              text: 'Registrations'
            }
          },
          legend: {
            enabled: false
          },
          tooltip: {
            pointFormat: 'Registrations for a give year'
          },
          series: [{
            name: 'Population',
            data: stuff,
            dataLabels: {
              enabled: true,
              color: '#FFFFFF',
              align: 'right',
              format: '{point.y:.1f}', // one decimal
              y: 10, // 10 pixels down from the top
              style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
              }
            }
          }]
        });

      } // Bar

      if ($scope.fndRpt.reportType == 'stackedbar') {

        var labels = _.pluck(data.groupingsDown.groupings, "label");
        var sdata = [];

        for (var i = 0; i < data.groupingsDown.groupings.length; i++) {
          var group = data.groupingsDown.groupings[i];
          for (var j = 0; j < group.groupings.length; j++) {
            var g = group.groupings[j];
            var sd = _.findWhere(sdata, {
              name: g.label
            });
            if (sd == null) {
              var obj = {
                name: g.label,
                data: []
              }
              sdata.push(obj);
            }
          }
        }

        for (var i = 0; i < data.groupingsDown.groupings.length; i++) {
          var group = data.groupingsDown.groupings[i];
          //for(var j=0; j<group.groupings.length; j++) {
          //var g = group.groupings[j];
          for (var j = 0; j < sdata.length; j++) {
            var sd = sdata[j];
            var g = _.findWhere(group.groupings, {
              label: sd.name
            });

            if (g == null) {
              sd.data.push(0);
            } else {
              var da = data.factMap[g.key + '!T'].aggregates[$scope.rptData.aggregatesIndex].value;
              if (da == null) {
                sd.data.push(0);
              } else {
                sd.data.push(da);
              }
            }
          }
        }

        if (exportData) {
          var expData = [];
          var cols = _.pluck(sdata, "name");
          cols.unshift($scope.fndRpt.exportLabel);

          var obj = {};
          for (var j = 0; j < cols.length; j++) {
            var col = cols[j];
            obj[col] = col;
          }
          expData.push(obj);

          for (var i = 0; i < labels.length; i++) {
            var label = labels[i];
            var obj = {};
            for (var j = 0; j < cols.length; j++) {
              var col = cols[j];

              if (j == 0) {
                obj[col] = label;
              } else {
                obj[col] = sdata[j - 1].data[i];
              }
            }
            expData.push(obj);
          }

          var csv = JSON2CSV(expData,false,true);
          var filename = 'export.csv';
          exportToCSV(csv,filename);
          return;
        }

        var showSubTotals = false;
        if(sdata.length > 1)
          showSubTotals = true;


        var colors = [];
        _.each(sdata, function(sd) {
          var fnd = _.findWhere($scope.rptData.examFullTypeList, {label: sd.name});
          if(!defined(fnd)) {
            fnd = _.findWhere($scope.rptData.examFullTypeList, {name: sd.name});
          }
          if(!defined(fnd)) {
            fnd = _.findWhere($scope.rptData.examFullTypeList, {value: sd.name});
          }
          if(!defined(fnd)) {
            fnd = _.findWhere($scope.rptData.examRegType, {name: sd.name});
          }
          if(defined(fnd,'color')) {
            colors.push(fnd.color);
          } else {
            colors.push('#1CE7D8');
          }
        });

        for(var i=0; i<sdata.length; i++) {
          for(var j=0; j<sdata[i].data.length; j++) {
            if(sdata[i].data[j] == 0)
              sdata[i].data[j] = null;
          }
        }

        $('#container').highcharts({

          colors: colors,
          exporting: {
            sourceWidth: 1200,
            sourceHeight: 800,
            scale: 1
          },

          chart: {
            type: 'column'
          },
          title: {
            text: 'Exam Registrations Over Time'
          },
          xAxis: {
            categories: labels,
            title: {
              text: 'Exams'
            }
          },
          yAxis: {
            min: 0,
            title: {
              text: 'Exam Registrations'
            },
            stackLabels: {
              enabled: true,
              style: {
                fontWeight: 'bold',
                color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
              }
            }
          },
          legend: {
            align: 'right',
            x: -30,
            verticalAlign: 'top',
            y: 25,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
          },
          tooltip: {
            formatter: function() {
              return '<b>' + this.x + '</b><br/>' +
                this.series.name + ': ' + this.y + '<br/>' +
                'Total: ' + this.point.stackTotal;
            }
          },
          plotOptions: {
            column: {
              stacking: 'normal',
              dataLabels: {
                enabled: showSubTotals,
                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'black',
              }
            }
          },
          series: sdata
        });


      } // Stacked Bar



    }
    //}); -- Query Data
    drawGraph();

    $scope.export = function(expData) {

      var json = [{
        "company": "Company",
        "type": "Type",
        "total": "Total",
        "invoiceNumber": "Invoice #",
        "garpId": "GARP ID",
        "firstName": "First Name",
        "lastName": "Last Name",
        "county": "Country",
        "state": "State",
        "method": "Payment Method",
        "paidDate": "Paid Date",
        "payPalId": "PayPal Trans ID"
      }];
      for (var i = 0; i < $scope.prods.length; i++) {
        var prod = $scope.prods[i];
        var func = $scope.criteriaMatch();
        if (func(prod)) {
          json[0][prod.Product2.ProductCode + '~' + prod.Product2.GL_Code__c] = prod.Name + '-' + prod.Product2.ProductCode + ':' + prod.Product2.GL_Code__c;
        }
      }
      for (var i = 0; i < $scope.prods.length; i++) {
        var func = $scope.criteriaMatchShip();
        var prod = $scope.prods[i];
        if (func(prod)) {
          var prod = $scope.prods[i];
          json[0][prod.Product2.ProductCode + '~' + prod.Product2.GL_Code__c + "Shipping"] = prod.Name + '-' + prod.Product2.ProductCode + ':' + prod.Product2.GL_Code__c + "Shipping";
        }
      }
      json[0].endTotal = "Total";

      for (var j = 0; j < $scope.opps.length; j++) {
        var opp = $scope.opps[j];

        var func = $scope.filterMatch();
        if (func(opp)) {
          var obj = {
            "company": formatDefined(opp.Company__c),
            "type": formatDefined(opp.trans.ChargentSFA__Type__c),
            "total": formatAmountExport($scope.getRowTotal(opp)),
            "invoiceNumber": formatDefined(opp.Display_Invoice_Number__c),
            "garpId": formatDefined(opp.GARP_Member_ID__c),
            "firstName": formatDefined(opp.Member_First_Name__c),
            "lastName": formatDefined(opp.Member_Last_Name__c),
            "county": formatDefined(opp.Shipping_Country__c),
            "state": formatDefined(opp.Shipping_State__c),
            "method": formatDefined(opp.trans.ChargentSFA__Payment_Method__c),
            "paidDate": formatDefined(formatDate(opp.closeDate, "MM-DD-YYYY")),
            "payPalId": formatDefined(opp.trans.ChargentSFA__Gateway_ID__c)
          };

          for (var i = 0; i < $scope.prods.length; i++) {
            var prod = $scope.prods[i];
            var func = $scope.criteriaMatch();
            if (func(prod)) {
              obj[prod.Product2.ProductCode + '~' + prod.Product2.GL_Code__c] = formatAmountExport($scope.getProductAmount(opp, prod));
            }
          }
          for (var i = 0; i < $scope.prods.length; i++) {
            var func = $scope.criteriaMatchShip();
            var prod = $scope.prods[i];
            if (func(prod)) {
              var prod = $scope.prods[i];
              obj[prod.Product2.ProductCode + '~' + prod.Product2.GL_Code__c + "Shipping"] = formatAmountExport($scope.getProductAmountShipping(opp, prod));
            }
          }
          obj.endTotal = formatAmountExport($scope.getRowTotal(opp));


          json.push(obj);
        }
      }

      var csv = JSON2CSV(json,true,true);
      var filename = 'export.csv';
      exportToCSV(csv,filename);
    }

  }
]);