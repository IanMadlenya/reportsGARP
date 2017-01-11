reportsGARPControllers.controller('mapCtrl', ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {
  $scope.envPath = envPath;

  //$.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=world-population.json&callback=?', function (data) {

  $rootScope.$on('drawMap', function(event, sdata) {

    var mapData = Highcharts.geojson(Highcharts.maps['custom/world']);

    var data = [];

    for (var i = 0; i < sdata.length; i++) {

      var fnd = _.findWhere(mapData, {
        name: sdata[i].Country
      })

      if (defined(fnd)) {
        var obj = {
          code: fnd.properties['iso-a2'],
          z: sdata[i].Total,
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

    $scope.rptData = {};
    $scope.rptData.disableExamYear = false;
    $scope.rptData.disableExamMonth = false;
    $scope.rptData.disableExamType = false;
    $scope.rptData.includeUnPaid = false;
    $scope.rptData.combineExams = false;
    $scope.rptData.combineParts = false;
    $scope.rptData.allOrders = "New Lead,Closed Won,Closed, Closed Lost";
    $scope.rptData.paidOrders = "Closed Won, Closed";
    $scope.rptData.currentReportType = null;
    $scope.rptData.currentExamType = null;
    $scope.rptData.currentExamMonth = null;
    $scope.rptData.currentExamYear = null;
    $scope.rptData.currentStartExamYear = null;
    $scope.rptData.currentEndExamYear = null;
    $scope.rptData.aggregatesIndex = 0;


    $scope.rptData.reportTypeList = [{
      name: "Exam Registrations By Country",
      description: "Table and Map of where people registered for exams. Choose an Exam Type, Month and Year. Choose 'Include Unpaid' to see all Registrations versus just paid for ones.",
      reportId: "00O4000000494UK",
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
      hasYearToDate: false,
      hasExamType: true,
      hasExamMonth: true,
      hasExamYear: true,
      hasExamYearRange: false,
      hasExport: true
    }, {
      name: "Exam Attendance By Country",
      description: "Table and Map of where people registered for exams. Broken out by Exam Attendance (Atteneded, Deferred, No-Show). Choose an Exam Type, Month and Year. Choose 'Include Unpaid' to see all Registrations versus just paid for ones.",
      reportId: "00O40000004PW0X",
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
        field: 'Attended',
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
        field: 'No-Show',
        sort: {
          direction: uiGridConstants.DESC,
          priority: 4
        },
        sortingAlgorithm: $scope.sortingAlgorithm
      }],
      hasYearToDate: false,
      hasExamType: true,
      hasExamMonth: true,
      hasExamYear: true,
      hasExamYearRange: false,
      hasExport: false
    }, {
      name: "Exam Registrations By Day Of Year",
      description: "Cumulative line graph of what time of year people register for the Exam. Choose an Exam Type and Month. Choose 'Combine Exams' to combine FRM or ERP Exam Part I and II. Choose 'Include Unpaid' to see all Registrations versus just paid for ones.",
      reportId: "00O40000004To1R",
      reportIdCombined: "00O40000004Tl7H",
      reportType: 'stackedline',
      cumlative: true,
      applyFilters: true,
      hasYearToDate: false,
      hasExamType: true,
      hasExamMonth: true,
      hasExamYear: false,
      hasExamYearRange: true,
      hasExport: false
    }, {
      name: "Exam Registrations By Type By Year",
      description: "Bar graph of exam registrations by year. Broken out by Type (Deferred In, Deferred Out, Early, Late, Standard). Choose an Exam Type and Month. Choose 'Combine Exams' to combine FRM or ERP Exam Part I and II. Choose 'Include Unpaid' to see all Registrations versus just paid for ones.",
      reportId: "00O4000000493cI",
      reportIdCombined: "00O40000004HEPs",
      reportType: 'stackedbar',
      cumlative: false,
      applyFilters: true,
      hasYearToDate: true,
      hasExamType: true,
      hasExamMonth: true,
      hasExamYear: false,
      hasExamYearRange: true,
      hasExport: true
    }, {
      name: "ERP Exam Registrations By Year",
      description: "Bar graph of ERP exam registrations by year. Broken out by Exam (ERP, ERP Part I and ERP Part II). Choose 'Include Unpaid' to see all Registrations versus just paid for ones.",
      reportId: "00O4000000493iL",
      reportType: 'stackedbar',
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
      reportId: "00O40000004TobU",
      reportType: 'stackedbar',
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
      reportId: "00O40000004PErn",
      reportIdCombined: "00O40000004PEu8",
      reportType: 'stackedbar',
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
      value: "ERP, ERP Exam Part I, ERP Exam Part II"
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
      value: "FRM Part 1,FRM Part 2,ERP, ERP Exam Part I, ERP Exam Part II"
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
    }

    $scope.selectType = function() {
      var fndRpt = _.findWhere($scope.rptData.reportTypeList, {
        reportId: $scope.rptData.currentReportType
      });
      $scope.fndRpt = fndRpt;
      $scope.rptData.aggregatesIndex = 0;

      $scope.rptData.currentExamYear = null;
      $scope.rptData.currentExamMonth = null;
      $scope.rptData.currentExamType = null;
      $scope.rptData.yearToDate = null;


      // if (fndRpt.name == 'Exam Registrations By Day Of Year' || fndRpt.name == 'Exam Registrations By Type By Year') {
      //   $scope.rptData.disableExamYear = true;
      //   $scope.rptData.currentExamYear = null;

      //   $scope.rptData.disableExamMonth = false;
      //   $scope.rptData.disableExamType = false;
      // } else if (fndRpt.name == 'ERP Exam Registrations By Year' || fndRpt.name == 'FRM Exam Registrations By Year') {
      //   $scope.rptData.disableExamYear = true;
      //   $scope.rptData.currentExamYear = null;

      //   $scope.rptData.disableExamMonth = true;
      //   $scope.rptData.currentExamMonth = null;

      //   $scope.rptData.disableExamType = true;
      //   $scope.rptData.currentExamType = null;

      // } else if (fndRpt.name == 'Exam Registrations By Year All Time') {
      //   $scope.rptData.disableExamYear = true;
      //   $scope.rptData.disableExamType = false;
      //   $scope.rptData.disableExamMonth = true;
      //   $scope.rptData.currentExamYear = null;
      //   $scope.rptData.currentExamMonth = null;
      // } else {
      //   $scope.rptData.disableExamYear = false;
      //   $scope.rptData.disableExamMonth = false;
      //   $scope.rptData.disableExamType = false;
      // }
      //localStorage.examsData = JSON.stringify($scope.rptData);

      if (fndRpt.name == 'Exam Registrations By Year All Time' && $scope.rptData.includeUnPaid) {
        $scope.rptData.aggregatesIndex = 0;
      } else if (fndRpt.name == 'Exam Registrations By Year All Time' && !$scope.rptData.includeUnPaid) {
        $scope.rptData.aggregatesIndex = 1;
      }
      
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
      if (defined($scope, "rptData.currentReportType")) {

        $scope.fndRpt = _.findWhere($scope.rptData.reportTypeList, {
          reportId: $scope.rptData.currentReportType
        });
        $scope.reportId = $scope.fndRpt.reportId;

        if ($scope.rptData.combineExams || $scope.rptData.combineParts) {
          $scope.reportId = $scope.fndRpt.reportIdCombined;
        }

        var key = $scope.reportId + "~" + $scope.rptData.currentExamType + "~" + $scope.rptData.currentExamMonth + "~" + $scope.rptData.currentExamYear;
        if (reload)
          $scope.rptData[key] = null;
        if (defined($scope.rptData[key])) {
          drawGraph(false);
        } else {
          loadData(exportData);
        }
      } else {
        // Error
        alert('Please select report paramteters.');
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

      if ($scope.rptData.combineExams || $scope.rptData.combineParts) {
        $scope.reportId = $scope.fndRpt.reportIdCombined;
      }

      var report = conn.analytics.report($scope.reportId);

      conn.analytics.report($scope.reportId).describe(function(err, meta) {
        if (err) {
          $('#myGlobalErrorModal p').html("There has been an unexpected error:" + err)
          $("#myGlobalErrorModal").modal();
          alert('There has been an error please refresh your browser window and try again.');
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
                rf.value = oppStages;
                break;

              case 'Exam_Attempt__c.Exam_Type__c':
                if ($scope.rptData.currentExamYear != null && $scope.fndRpt.hasExamYear)
                  rf.value = $scope.rptData.currentExamYear;
                else rf.value = '2010,2011,2012,2013,2014,2015,2016,2017';
                break;

              case 'Exam_Stat__c.Exam_Type__c':
                if ($scope.fndRpt.applyFilters && $scope.fndRpt.hasExamType) {
                  if ($scope.rptData.currentExamType != null && $scope.rptData.currentExamType.indexOf('ERP') > -1 && $scope.rptData.currentExamType.indexOf('FRM') == -1)
                    rf.value = 'ERP';
                  else if ($scope.rptData.currentExamType != null && $scope.rptData.currentExamType.indexOf('ERP') == -1 && $scope.rptData.currentExamType.indexOf('FRM') > -1)
                    rf.value = 'FRM';
                  else rf.value = 'FRM,ERP'
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
                  rf.value = '1/1/3030';  
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

        debugger;

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
                fnd.value = yearArray[i];
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

            var key = $scope.reportId + "~" + $scope.rptData.currentExamType + "~" + $scope.rptData.currentExamMonth + "~" + $scope.rptData.currentExamYear;
            $scope.rptData[key] = $scope.reportDataCombined;
            $scope.mainSpinner.stop();

            drawGraph(true, exportData);


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

            var key = $scope.reportId + "~" + $scope.rptData.currentExamType + "~" + $scope.rptData.currentExamMonth + "~" + $scope.rptData.currentExamYear;
            $scope.rptData[key] = data;
            //localStorage.rptData = JSON.stringify($scope.rptData);

            $scope.mainSpinner.stop();

            drawGraph(true, exportData);
          });

        }

      });

    }

    function drawGraph(async, exportData) {

      if (!defined($scope, "rptData.currentReportType"))
        return;

      if (!defined($scope, "rptData.currentReportType"))
        return;

      $scope.fndRpt = _.findWhere($scope.rptData.reportTypeList, {
        reportId: $scope.rptData.currentReportType
      });
      $scope.reportId = $scope.fndRpt.reportId;

      if ($scope.rptData.combineExams || $scope.rptData.combineParts) {
        $scope.reportId = $scope.fndRpt.reportIdCombined;
      }


      //var rptId = $scope.rptData.currentReportType
      var key = $scope.reportId + "~" + $scope.rptData.currentExamType + "~" + $scope.rptData.currentExamMonth + "~" + $scope.rptData.currentExamYear;
      if (!defined($scope.rptData[key])) {
        alert("Data not found! Please reload page and try again.");
        return;
      }


      var data = $scope.rptData[key];
      console.log(data);

      //"groupingsDown"
      if (data.groupingsDown.groupings.length <= 0) {
        return;
      }

      //var fndRpt = _.findWhere($scope.rptData.reportTypeList, {reportId: $scope.reportId});
      if (!defined($scope.fndRpt)) {
        alert('Report not found!');
        return;
      }


      if ($scope.fndRpt.reportType == 'table') {

        var sdata = [];
        for (var i = 0; i < data.groupingsDown.groupings.length; i++) {
          var group = data.groupingsDown.groupings[i];
          var val = data.factMap[group.key + '!T'].aggregates[$scope.rptData.aggregatesIndex].value;

          if (group.label == "-" || group.label == "&nbsp;")
            continue;
          var obj = {
            Country: group.label,
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

        if (exportData) {
          var csv = JSON2CSV(sdata);
          var fileName = 'data'
          var uri = 'data:text/csv;charset=utf-8,' + escape(csv);
          var link = document.createElement("a");
          link.href = uri
            //link.style = "visibility:hidden"; Causing exception in Chrome - SR 6/15/2015
          link.download = fileName + ".csv";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          return;

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

      // Setup X and Y Axis, line does not require stackLabels data...
      if ($scope.fndRpt.reportType == 'stackedline') {

        var sdata = [];
        var labels = [];
        var series = [];
        for(var propertyName in data.groupingsDowns) {
          var groupings = data.groupingsDowns[propertyName].groupings;
          for (var i = 0; i < groupings.length; i++) {
            for(j=0; j<groupings[i].groupings.length; j++) {
              var lab = groupings[i].groupings[j].label;
              var fnd = _.findWhere(series, {name: lab});
              if(!defined(fnd)) {
                var obj = {
                  year: propertyName,
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


        for (var i = 0; i < series.length; i++) {
          var obj = {
            name: series[i].name,
            data: [],
            last: null,
            lineWidth: 4,
            marker: {
              radius: 4
            },
            year: series[i].year
          }
          sdata.push(obj);
        }

        $scope.deferred = [];

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

        $('#container').highcharts({

          // data: {
          //     csv: csv
          // },

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
                text: 'Days from Registration Open'
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
          cols.unshift("label");

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

          var csv = JSON2CSV(expData);
          var fileName = 'data'
          var uri = 'data:text/csv;charset=utf-8,' + escape(csv);
          var link = document.createElement("a");
          link.href = uri
            //link.style = "visibility:hidden"; Causing exception in Chrome - SR 6/15/2015
          link.download = fileName + ".csv";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          return;
        }

        $('#container').highcharts({
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
                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
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
                enabled: true,
                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                style: {
                  textShadow: '0 0 3px black'
                }
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

      var csv = JSON2CSV(json);
      var fileName = 'data'
      var uri = 'data:text/csv;charset=utf-8,' + escape(csv);
      var link = document.createElement("a");
      link.href = uri
        //link.style = "visibility:hidden"; Causing exception in Chrome - SR 6/15/2015
      link.download = fileName + ".csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      //window.open("data:text/csv;charset=utf-8," + escape(csv))
    }

  }
]);