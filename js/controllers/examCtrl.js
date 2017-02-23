reportsGARPControllers.controller('examsCtrl', ['$scope', '$rootScope', '$timeout', '$stateParams', 'uiGridConstants','$window','stackedBarService','graphService','utilitiyService','gridService','stackedLineService',
  function($scope, $rootScope, $timeout, $stateParams, uiGridConstants, $window, stackedBarService, graphService, utilitiyService, gridService, stackedLineService) {

    $scope.envPath = envPath;
    $scope.mapData = Highcharts.geojson(Highcharts.maps['custom/world']);
    var util = utilitiyService;

    Highcharts.setOptions({
      lang: {
        thousandsSep: ','
      }
    });
    $scope.gridOptions1 = {
      enableSorting: true,
      enableFiltering: true,
      filterOptions: {
        filterColumn: "Country",
      },
      data: null
    };

    var height = $window.innerHeight - 200;
    $scope.heightStyle = {height: height.toString() + 'px'};

    // In your controller
    var w = angular.element($window);
    $scope.$watch(
      function () {
        var height = $window.innerHeight - 200;
        $scope.heightStyle = {height: height.toString() + 'px'};
        return $window.innerHeight;
      },
      function (value) {
        $scope.windowHeight = value;
      },
      true
    );
    w.bind('resize', function(){
      $scope.$apply();
    });

    $scope.err = {};
    $scope.rptData = {};
    $scope.rptData.showDesc = false;
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
        sortingAlgorithm:graphService.sortingAlgorithm, 
        enableFiltering: false,
        type:'number',
        cellFilter: 'numberToLocalFilter'        
      }, {
        name: 'Paid',
        field: 'Closed',
        sort: {
          direction: uiGridConstants.DESC,
          priority: 2
        },
        sortingAlgorithm:graphService.sortingAlgorithm, 
        enableFiltering: false,
        type:'number',
        cellFilter: 'numberToLocalFilter'
      }, {
        name: 'Cancelled',
        field: 'Closed Lost',
        sort: {
          direction: uiGridConstants.DESC,
          priority: 3
        },
        sortingAlgorithm:graphService.sortingAlgorithm, 
        enableFiltering: false,
        type:'number',
        cellFilter: 'numberToLocalFilter'
      }, {
        name: 'Unpiad',
        field: 'New Lead',
        sort: {
          direction: uiGridConstants.DESC,
          priority: 4
        },
        sortingAlgorithm:graphService.sortingAlgorithm, 
        enableFiltering: false,
        type:'number',
        cellFilter: 'numberToLocalFilter'
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
        sortingAlgorithm:graphService.sortingAlgorithm, 
        enableFiltering: false
      }, {
        field: 'Closed',
        sort: {
          direction: uiGridConstants.DESC,
          priority: 2
        },
        sortingAlgorithm:graphService.sortingAlgorithm, 
        enableFiltering: false
      }, {
        field: 'Closed Lost',
        sort: {
          direction: uiGridConstants.DESC,
          priority: 3
        },
        sortingAlgorithm:graphService.sortingAlgorithm, 
        enableFiltering: false
      }, {
        field: 'New Lead',
        sort: {
          direction: uiGridConstants.DESC,
          priority: 4
        },
        sortingAlgorithm:graphService.sortingAlgorithm, 
        enableFiltering: false
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
        sortingAlgorithm:graphService.sortingAlgorithm,
        type:'number',
        cellFilter: 'numberToLocalFilter'
      }, {
        field: 'Will Attend',
        sort: {
          direction: uiGridConstants.DESC,
          priority: 2
        },
        sortingAlgorithm:graphService.sortingAlgorithm,
        type:'number',
        cellFilter: 'numberToLocalFilter'
      }, {
        field: 'Deferred',
        sort: {
          direction: uiGridConstants.DESC,
          priority: 3
        },
        sortingAlgorithm:graphService.sortingAlgorithm,
        type:'number',
        cellFilter: 'numberToLocalFilter'
      }, {
        field: 'Attended',
        sort: {
          direction: uiGridConstants.DESC,
          priority: 2
        },
        sortingAlgorithm:graphService.sortingAlgorithm,
        type:'number',
        cellFilter: 'numberToLocalFilter'
      }, {
        field: 'No-Show',
        sort: {
          direction: uiGridConstants.DESC,
          priority: 4
        },
        sortingAlgorithm:graphService.sortingAlgorithm,
        type:'number',
        cellFilter: 'numberToLocalFilter'
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
      xaxisLabel: 'Days',
      yaxisLabel: 'Exam Registrations',
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
        erp : [util.GREEN1, util.GREEN2, util.GREEN3],
        frm : [util.BLUE1,  util.BLUE2,  util.BLUE3 ]
      }
    }, {
      name: "Exam Registrations By Type By Year",
      description: "Bar graph of exam registrations by year. Broken out by Type (Deferred In, Deferred Out, Early, Late, Standard). Choose an Exam Type and Month. Choose 'Combine Exams' to combine FRM or ERP Exam Part I and II. Choose 'Include Unpaid' to see all Registrations versus just paid for ones.",
      reportId: "00O40000004LY8z",
      reportIdCombined: "00O40000004LUNW",
      reportType: 'stackedbar',
      exportLabel: 'Date',
      xaxisLabel: 'Exams',
      yaxisLabel: 'Exam Registrations',
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
      exportLabel: 'Exam Year',
      xaxisLabel: 'Exam Year',
      yaxisLabel: 'Exam Registrations',
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
      exportLabel: 'Exam Year',
      xaxisLabel: 'Exam Year',
      yaxisLabel: 'Exam Registrations',      
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
      reportId: "00O40000004La5J",
      reportIdCombined: "00O40000004Tu9g",
      reportType: 'stackedbar',
      exportLabel: 'Exam Year',
      xaxisLabel: 'Exam Year',
      yaxisLabel: 'Exam Registrations',      
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

    $scope.rptData.examFullTypeList = graphService.examFullTypeList;
    $scope.rptData.examMonthList = graphService.examMonthList;
    $scope.rptData.examRegType = graphService.examRegType;
    $scope.rptData.examYearAllTimeList = graphService.examYearAllTimeList;
    $scope.rptData.examYearList = graphService.examYearList;

    $scope.isCombined = function(reportId) {
      var fnd = _.findWhere($scope.rptData.reportTypeList, {reportId: reportId});
      if(util.defined(fnd,'reportIdCombined'))
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

      if (util.defined($scope.rptData[key])) {
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
      setIsCache($scope);
    }

    $scope.selectOptions = function() {
      var fndRpt = _.findWhere($scope.rptData.reportTypeList, {
        reportId: $scope.rptData.currentReportType
      });      
      if(fndRpt.hasSite && $scope.rptData.currentCountryType == 'Exam Site')
        $scope.rptData.currentMapType = 'Total';
      setIsCache($scope);
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

      setIsCache($scope);
      
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
      if (util.defined($scope, "rptData.currentReportType")) {

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

        if (util.defined($scope.rptData[key]) && $scope.rptData.forceReload == false) {
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
        if(util.defined(fnd,"value")) {
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

        if (util.defined(meta, "reportMetadata.reportFilters.length")) {
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
          $scope.mainSpinner = new Spinner(util.spinnerOptions).spin(obj[0]);
        }

        var fnd = _.findWhere($scope.rptData.reportTypeList, {reportId: $scope.rptData.currentReportType})
        if(util.defined(fnd,"name") && fnd.name == 'Exam Registrations By Day Of Year') {

          fnd = _.findWhere(metadata.reportMetadata.reportFilters, {column: "Exam_Attempt__c.RPT_Exam_Year__c"});
          if(util.defined(fnd,"value")) {

            var yearArray = fnd.value.split(',');
            var options = [];
            for(var i=0; i<yearArray.length; i++) {

              var obj = jQuery.extend(true, {}, metadata);
              fnd = _.findWhere(obj.reportMetadata.reportFilters, {column: "Exam_Attempt__c.RPT_Exam_Year__c"});
              if(util.defined(fnd,"value")) {
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

        } else if(util.defined(fnd,"name") && fnd.name == 'Exam Registrations By Country Year Over Year') {

          fnd = _.findWhere(metadata.reportMetadata.reportFilters, {column: "Exam_Attempt__c.RPT_Exam_Year__c"});
          if(util.defined(fnd,"value")) {

            var yearArray = fnd.value.split(',');
            var options = [];
            for(var i=0; i<yearArray.length; i++) {
              var obj = jQuery.extend(true, {}, metadata);
              fnd = _.findWhere(obj.reportMetadata.reportFilters, {column: "Exam_Attempt__c.RPT_Exam_Year__c"});
              if(util.defined(fnd,"value")) {
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

    function drawGraph(async, exportData) {

      if (!util.defined($scope, "rptData.currentReportType"))
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

      if (!util.defined($scope.rptData[key])) {
        alert("Data not found! Please reload page and try again.");
        return;
      }


      var data = $scope.rptData[key];
      console.log(data);

      //"groupingsDown"
      if (!util.defined(data,"groupingsDowns")) {
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
      if (!util.defined($scope.fndRpt)) {
        alert('Report not found!');
        return;
      }

      debugger;
      if ($scope.fndRpt.reportType == 'table') {

        if(util.defined(data,"groupingsDowns")) {

          var sdata = gridService.processAsyncData(data, $scope.rptData.currentExamType, $scope.rptData.currentStartExamYear, $scope.rptData.currentEndExamYear, $scope.rptData.combineExams, $scope.rptData.aggregatesIndex);

        } else {

          var sdata = gridService.processData(data, $scope.fndRpt.columnDefs, $scope.rptData.aggregatesIndex);

        }

        if (exportData) {
          var csv = util.JSON2CSV(sdata,true,true,$scope.fndRpt.columnDefs);
          var filename = 'export.csv';
          util.exportToCSV(csv,filename);
          return;

        } else {

          if ($scope.fndRpt.name == 'Exam Registrations By Country Year Over Year' && async) {
            $rootScope.$apply(function() {
              $scope.myData = sdata;
              $scope.gridOptions1.columnDefs = gridService.columnDefs;
              $scope.gridOptions1.data = sdata;
              gridService.drawCountryTable(sdata, gridService.columnDefs, $scope.rptData.currentCountryType, $scope.rptData.currentMapType);
            });
          } else if($scope.fndRpt.name == 'Exam Registrations By Country Year Over Year' && !async) {
            $scope.myData = sdata;
            $scope.gridOptions1.columnDefs = gridService.columnDefs;
            $scope.gridOptions1.data = sdata;
            gridService.drawCountryTable(sdata, gridService.columnDefs, $scope.rptData.currentCountryType, $scope.rptData.currentMapType);
          } else {
            if (async) {
              $rootScope.$apply(function() {
                $scope.myData = sdata;
                $scope.gridOptions1.columnDefs = gridService.columnDefs;
                $scope.gridOptions1.data = sdata;
                $rootScope.$broadcast('drawMap', sdata);
              });
            } else {
              $scope.myData = sdata;
              $scope.gridOptions1.columnDefs = gridService.columnDefs;
              $scope.gridOptions1.data = sdata;
              $rootScope.$broadcast('drawMap', sdata);              
            }
          }

        }
      }

      // Setup X and Y Axis, line does not require stackLabels data...
      if ($scope.fndRpt.reportType == 'stackedline') {

        var retData = stackedLineService.processData(data, $scope.fndRpt.cumlative, $scope.rptData.aggregatesIndex);
        var sdata = retData.sdata;
        var labels = retData.labels;

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

          var csv = util.JSON2CSV(expotData,false,true);          
          var filename = 'export.csv';
          util.exportToCSV(csv,filename);
          return;

        } else {


          sdata = _.sortBy(sdata, function(row) { 
            return graphService.computeSortRankReverse(row.year, row.name);
          })
          sdata =sdata.reverse();

          stackedLineService.drawGraph(sdata, $scope.fndRpt.name, labels, $scope.fndRpt.xaxisLabel, $scope.fndRpt.yaxisLabel);

        }
      }

      if ($scope.fndRpt.reportType == 'stackedbar') {

        debugger;

        var returnData = stackedBarService.processData(data, $scope.rptData.aggregatesIndex);
        var labels = returnData.labels;
        var sdata = returnData.sdata;

        if (exportData) {
          var expData = graphService.exportDataProcessing(sdata, labels, $scope.fndRpt.exportLabel);
          var csv = util.JSON2CSV(expData,false,true);
          var filename = 'export.csv';
          util.exportToCSV(csv,filename);
          return;
        }

        var showSubTotals = false;
        if(sdata.length > 1)
          showSubTotals = true;

        var colors = graphService.getColors(sdata);
        sdata = graphService.prepDataForGraphing(sdata);
        var sortedData = graphService.sortData(sdata, stackedBarService.computeBarSortRank);

        var reportName = $scope.fndRpt.name;
        if($scope.rptData.yearToDate)
          reportName+= ' - Year To Date';

        stackedBarService.drawGraph(sortedData, colors, labels, reportName, $scope.fndRpt.xaxisLabel, $scope.fndRpt.yaxisLabel, showSubTotals);      

      } // Stacked Bar
    }
    //}); -- Query Data
    //drawGraph();
  }
]);