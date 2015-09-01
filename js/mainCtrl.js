'use strict';

function defined (ref, strNames) {
  var name;

  if(typeof ref === "undefined" || ref === null) {
    return false;
  }

  if(strNames !== null && typeof strNames !== "undefined") {
    var arrNames = strNames.split('.');
    while (name = arrNames.shift()) {        
        if (ref[name] === null || typeof ref[name] === "undefined") return false;
        ref = ref[name];
    } 
  }
  return true;
}

var spinnerOptions = {
              lines: 13, // The number of lines to draw
              length: 20, // The length of each line
              width: 10, // The line thickness
              radius: 30, // The radius of the inner circle
              corners: 0.5, // Corner roundness (0..1)
              rotate: 0, // The rotation offset
              direction: 1, // 1: clockwise, -1: counterclockwise
              color: '#8b8989', // #rgb or #rrggbb or array of colors
              speed: 1, // Rounds per second
              trail: 60, // Afterglow percentage
              shadow: false, // Whether to render a shadow
              hwaccel: false, // Whether to use hardware acceleration
              className: 'spinner', // The CSS class to assign to the spinner
              zIndex: 2e9, // The z-index (defaults to 2000000000)
              top: '10', // Top position relative to parent in px
              left: 'auto' // Left position relative to parent in px
            };

/* Controllers */
var reportsGARPControllers = angular.module('reportsGARPControllers', []);

reportsGARPControllers.controller('mainCtrl', ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {
  $scope.envPath = envPath;
}]);


reportsGARPControllers.controller('examsCtrl', ['$scope', '$rootScope', '$timeout','$stateParams', 
function ($scope, $rootScope, $timeout, $stateParams) {
  $scope.envPath = envPath;

  $scope.examDatesMay = [
    {
      datetext: '12/1/2009',
      key:'May 2010',
      done: false
    },{
      datetext: '12/1/2010',
      key:'May 2011',
      done: false
    },{
      datetext: '12/1/2011',
      key:'May 2012',
      done: false
    },{
      datetext: '12/1/2012',
      key:'May 2013',
      done: false
    },{
      datetext: '12/1/2013',
      key:'May 2014',
      done: false
    },{
      datetext: '12/1/2014',
      key:'May 2015',
      done: false
    }
  ]

  $scope.examDatesNov = [
    {
      datetext: '12/1/2010',
      key:'Nov 2010',
      done: false
    },{
      datetext: '11/19/2011',
      key:'Nov 2011',
      done: false
    },{
      datetext: '11/17/2012',
      key:'Nov 2012',
      done: false
    },{
      datetext: '11/16/2013',
      key:'Nov 2010',
      done: false
    },{
      datetext: '11/15/2014',
      key:'Nov 2014',
      done: false
    },{
      datetext: '11/21/2015',
      key:'Nov 2015',
      done: false
    }
  ]

  if(defined(localStorage,"rptData"))
    $scope.rptData = JSON.parse(localStorage.rptData);


  $scope.rptData = {
    disableExamYear:false,  
    disableExamMonth:false,
    disableExamType:false,
    includeUnPaid:false,  
    allOrders : 'New Lead,Closed Won,Closed, Closed Lost',
    paidOrders : 'Closed Won, Closed',
    currentReportType: null,
    currentExamType: null,
    currentExamMonth: null,
    currentExamYear: null
  }

  $scope.rptData.reportTypeList = [
      {
        name: "Exam Registrations By Country",
        reportId: "00O400000048zEv",
        reportType: 'table',
        cumlative: false
      },
      {
        name: "Exam Attendance By Country",
        reportId: "00O400000048zF0",
        reportType: 'table',
        cumlative: false
      },
      {
        name: "Exam Registrations By Day Of Year",
        reportId: "00O4000000492wq",
        reportType: 'stackedline',
        cumlative: true
      },
      {
        name: "Exam Registrations By Type By Year",
        reportId: "00O400000048zVS",
        reportType: 'stackedbar',
        cumlative: false
      },
      {
        name: "ERP Exam Registrations By Year",
        reportId: "00O400000048zUA",
        reportType: 'stackedbar',
        cumlative: false
      },
      {
        name: "FRM Exam Registrations By Year",
        reportId: "00O400000048zVN",
        reportType: 'stackedbar',
        cumlative: false
      }
    ];

  $scope.rptData.examTypeList = [
      {
        name: "ERP",
        value: "ERP"
      },
      {
        name: "FRM I",
        value: "FRM Part 1"
      },
      {
        name: "FRM II",
        value: "FRM Part 2"
      },
      {
        name: "FRM Both",
        value: "FRM Part 1,FRM Part 2"
      },
      {
        name: "All",
        value: "FRM Part 1,FRM Part 2,ERP"
      }
    ];



    $scope.rptData.examMonthList = [
      {
        name: "May",
        value: "May"
      },
      {
        name: "November",
        value: "Nov"
      },
      {
        name: "Both",
        value: "May,Nov"
      }
    ];

    $scope.rptData.examYearList=[];
    for(var i=2010; i<=2015; i++) {
      var obj = {
        name: i,
        value: i
      }
      $scope.rptData.examYearList.push(obj);
    }

    $scope.selectType = function() {
      if($scope.rptData.currentRptId == 'Exam Registrations By Day Of Year' || $scope.rptData.currentRptId == 'Exam Registrations By Type By Year') {
        $scope.rptData.disableExamYear=true;
      } else if($scope.rptData.currentRptId == 'ERP Exam Registrations By Year' || $scope.rptData.currentRptId == 'FRM Exam Registrations By Year') {
        $scope.rptData.disableExamYear=true;
        $scope.rptData.disableExamMonth=true;
        $scope.rptData.disableExamType=true;
      } else  {
        $scope.rptData.disableExamYear=false;
        $scope.rptData.disableExamMonth=false;
        $scope.rptData.disableExamType=false;
      }
      localStorage.examsData = JSON.stringify($scope.rptData);
    }

  var conn = jsForceConn;
  var reportId = '00O400000048eLH';
  var displayType = 'stackedbar';
  $scope.cumlative = false;
  if($stateParams.reportId != null && $stateParams.reportId != '') {
    reportId=$stateParams.reportId;
  }
  if($stateParams.displayType != null && $stateParams.displayType != '') {
    displayType=$stateParams.displayType;
  }

  if($stateParams.cumlative != null && $stateParams.cumlative != '') {
    $scope.cumlative=$stateParams.cumlative;
  }

  $scope.refresh=function() {
    if(defined($scope,"rptData.currentReportType")) {
      var key = $scope.rptData.currentReportType + "~" + $scope.rptData.currentExamType + "~" + $scope.rptData.currentExamMonth + "~" + $scope.rptData.currentExamYear;
      if(defined($scope.rptData[key])) {
        drawGraph();    
      } else {
        loadData();
      }
    } else {
      // Error
      alert('Please select report paramteters.');
    }
    
  }


  function loadData() {

    var report = conn.analytics.report($scope.rptData.currentReportType);

    var oppStages = $scope.rptData.paidOrders;
    if($scope.rptData.includeUnPaid) {
      oppStages = $scope.rptData.allOrders;
    }

    var srtDate = '2014-12-01';
    if($scope.rptData.currentExamMonth == 'Nov')
      var srtDate = '2015-05-01'

    var metadata = { 
      reportMetadata : {
        reportFilters : [{
          column: 'Exam_Attempt__c.RPT_Exam_Description__c',
          operator: 'contains',
          value: $scope.rptData.currentExamMonth
        },{
          column: 'Exam_Attempt__c.Section__c',
          operator: 'contains',
          value: $scope.rptData.currentExamType          
        },{
          column: 'Exam_Attempt__c.Opportunity_StageName__c',
          operator: 'equals',
          value: oppStages         
        },{
          column: 'Exam_Attempt__c.RPT_Purchase_Day_Of_Year__c',
          operator: 'greaterThan',
          value: srtDate         
        },{
          column: 'Exam_Attempt__c.RPT_Exam_Year__c',
          operator: 'equals',
          value: '2010,2011,2012,2013,2014,2015'
        }
        ]
      }
    };

    var selector = '#mainspin';
    var obj = $(selector)
    $scope.mainSpinner;  
    if(obj !== null && typeof obj !== "undefined" && obj.length !== null && typeof obj.length !== "undefined") {
      $scope.mainSpinner = new Spinner(spinnerOptions ).spin(obj[0]);
    }   


    // execute report synchronously
    report.execute({ metadata : metadata },function(err, result) {
      if (err) { 
        $scope.mainSpinner.stop();
        return console.error(err); 
      }
      console.log(result.reportMetadata);
      console.log(result.factMap);
      console.log(result.factMap["T!T"]);
      console.log(result.factMap["T!T"].aggregates);

      var data = result;
      debugger;

      var key = $scope.rptData.currentReportType + "~" + $scope.rptData.currentExamType + "~" + $scope.rptData.currentExamMonth + "~" + $scope.rptData.currentExamYear;
      $scope.rptData[key] = data;
      localStorage.rptData = JSON.stringify($scope.rptData);

       $scope.mainSpinner.stop();

      drawGraph();
    });

  }

  function drawGraph() {

    if(!defined($scope,"rptData.currentReportType"))
      return;

    if(!defined($scope,"rptData.currentReportType"))
      return;

    var rptId = $scope.rptData.currentReportType
    var key = $scope.rptData.currentReportType + "~" + $scope.rptData.currentExamType + "~" + $scope.rptData.currentExamMonth + "~" + $scope.rptData.currentExamYear;
    if(!defined($scope.rptData[key]))
      return;

    var data = $scope.rptData[key];
    console.log(data);
    
    //"groupingsDown"
    if(data.groupingsDown.groupings.length <= 0) {
      return;
    }

    var fndRpt = _.findWhere($scope.rptData.reportTypeList, {reportId: rptId});
    if(!defined(fndRpt)) {
      alert('Report not found!');
      return;
    }  

    // Setup X and Y Axis, line does not require stackLabels data...
    if(fndRpt.reportType == 'stackedline') {

      var series =[];
      for(var i=0; i<data.groupingsDown.groupings.length; i++) {
        var s = _.pluck(data.groupingsDown.groupings[i].groupings, "label");
        var series = _.union(series, s);
      }

      var sdata = [];      
      var  labels = [];    
      for(var i=0; i<series.length; i++) {
        var obj = {
          name: series[i],
          data: [],
          last: null,
          lineWidth: 4,
          marker: {
              radius: 4
          }          
        }
        sdata.push(obj);
      }
        
      $scope.deferred = [];
      
      for(var i=0; i<data.groupingsDown.groupings.length; i++) {
        var group = data.groupingsDown.groupings[i];
        var lastObj = {};
        var ldate = group.label;
        labels.push(ldate);


        for(var j=0; j<series.length; j++) {

          var fnd = _.findWhere(group.groupings, {value: series[j]});
          if(!defined(fnd)) {
            var sd = _.findWhere(sdata, {name: series[j]});
            var val = 0;

            if(fndRpt.cumlative == true) {
              if(sd.last != null)
                val = sd.last + val;
              sd.last = val;
              sd.data.push(val);  
            } else {
              sd.data.push(val);  
            }            
          } else {
            var g = fnd;
            var ldate = g.label;
            var val = data.factMap[g.key+'!T'].aggregates[0].value;
            var gname = g.label;
            var sd = _.findWhere(sdata, {name: g.label});

            if(fndRpt.cumlative == true) {
              if(sd.last != null)
                val = sd.last + val;
              sd.last = val;
            }
            //sd.data.push(val);

            // Store Derrered
            var defObj = {
              name: gname,  // May 2013 ERP
              data: null
            }

            // First Registration for a given group
            var firstTime = false;
            var fnd = _.findWhere($scope.deferred, {name: gname});
            if(fnd != null) {
              defObj = fnd;
            } else {
              $scope.deferred.push(defObj);
              firstTime=true;
            }
            
            $scope.lastGroup = defObj;

            for(var x=0; x<g.groupings.length; x++) {
            //_.each(g.groupings, function(gg) {
              var gg = g.groupings[x];

              var ldate = gg.label;
              var ggval = data.factMap[gg.key+'!T'].aggregates[0].value;
              var ggname = gg.label;
              //var sd = _.findWhere(sdata, {name: gg.label});
              
              if(ggname != null && ggname == 'Deferred') {
                if($scope.lastGroup.data == null)
                  $scope.lastGroup.data = 1;
                else $scope.lastGroup.data++;
              }
            }

            // Push Data to graph
            sd.data.push(val);

          }
        }
      }

      // $scope.sdata = sdata;
      // $scope.labels = labels;

      // _.each(sdata, function(sd) {
      //   var fndDef = _.findWhere($scope.deferred, {name: sd.name});
      //   var defTot = fndDef.data;
      //   var sdData = sd.data;

      //   for(var i=0; i<sd.data.length; i++) {
      //     var val = sdData[i];
      //     sdData[i] = val + defTot;                  
      //   }
      // });

      // _.each($scope.examDatesMay, function(ed) {
      //     $scope.lastEd = ed;
      //     _.each(sdata, function(sd) {
      //       var fndDef = _.findWhere($scope.deferred, {name: sd.name});
      //       if(fndDef != null) {
      //         $scope.fndIdx=0;
      //         $scope.fndNew=false;
      //         _.find(labels, function(lab) {
      //             if(lab != '-') {
      //               var mLDate = moment(lab);
      //               var mFndDat = moment($scope.lastEd.datetext).year('2014');
      //               var mFndDat1 = moment($scope.lastEd.datetext).year('2015');
      //               if(mLDate.diff(mFndDat, 'days') == 0 || mLDate.diff(mFndDat1, 'days') == 0) {
      //                 return true;
      //               }
      //               if((mLDate.year() == '2014' && mLDate.diff(mFndDat, 'days') > 0) || 
      //                  (mLDate.year() == '2015' && mLDate.diff(mFndDat1, 'days') > 0)){
      //                 $scope.fndNew=true;
      //                 return true;
      //               }
      //             }
      //             $scope.fndIdx++;
      //             return false;
      //         });
      //       }
      //       if($scope.fndNew) {
      //         $scope.labels.splice($scope.fndIdx, 0, fndDef.data);
      //         sd.data.splice($scope.fndIdx, 0, fndDef.data);
      //       } else {
      //         if($scope.cumlative) {
      //           for(var z=0; z<=sd.data.length; z++) {
      //             if(z >= $scope.fndIdx)
      //               sd.data[z] = sd.data[z] + fndDef.data;                  
      //           }
      //         } else {
      //           sd.data[$scope.fndIdx] = sd.data[$scope.fndIdx] + fndDef.data;  
      //         }
      //       }
      //     });
      //   });

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
              categories: labels
          },

          yAxis: [{ // left y axis
              title: {
                  text: null
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
                          click: function (e) {
                              hs.htmlExpand(null, {
                                  pageOrigin: {
                                      x: e.pageX || e.clientX,
                                      y: e.pageY || e.clientY
                                  },
                                  headingText: this.series.name,
                                  maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', this.x) + ':<br/> ' +
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



    if(fndRpt.reportType == 'stackedbar') {

      var  labels = _.pluck(data.groupingsDown.groupings, "label");    
        var first = data.groupingsDown.groupings[0]
        var  series = _.pluck(first.groupings, "label");
        var sdata = [];
        
        for(var i=0; i<series.length; i++) {
          var obj = {
            name: series[i],
            data: []
          }
          sdata.push(obj);
        }
          
        
        for(var i=0; i<data.groupingsDown.groupings.length; i++) {
          var group = data.groupingsDown.groupings[i];
          for(var j=0; j<group.groupings.length; j++) {
            var g = group.groupings[j];
            
            var sd = _.findWhere(sdata, {name: g.label});
            var da = data.factMap[g.key+'!T'].aggregates[0].value;
            
            sd.data.push(da);
          
          }
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
          formatter: function () {
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

}]);



reportsGARPControllers.controller('filterCtrl', ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {

  //$scope.showMore = false;
  $scope.show = true;
  $scope.filterMore = false;

  var td = moment().add(-1, 'days').format("M/D/YYYY");
  var yd = moment().add(-1, 'days').format("M/D/YYYY");

  $scope.userFormVars = {
    startDate: yd,
    endDate: td,
    garp: false,
    gra: false,
    nj: false,
    refund: false,
    charge: false,
    pm_creditcard: true,
    pm_creditcardbyfax: true,
    pm_wire: false,
    pm_check: false,
    prods: []
  }

  $scope.$on('fetchProds', function(event, prods) {
    $scope.userFormVars.prods = jQuery.extend(true, {}, prods);
  });

  $scope.filter = function() {
    $rootScope.$broadcast('filter', $scope.userFormVars);
  }
  $scope.refresh = function() {
    $rootScope.$broadcast('refresh', $scope.userFormVars);
  }
  $scope.showMore = function() {
    $scope.filterMore = !$scope.filterMore;
  }
  $scope.download = function() {
    $rootScope.$broadcast('download', $scope.userFormVars);
  }

}]);

reportsGARPControllers.controller('dataCtrl', ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {

  var SHIP = 'SHIP';        

  var mergeProds = [
    {
      glCodes: [
        '4001'
      ],
      company: 'GARP',
      prodCodes : [
        'FRM1E',
        'FRM1S',
        'FRM1L'
      ],
      mergedCode : 'FRMIMAY',
      mergedGL : '4001MERGE',
      mergedName : 'FRM Exam Part I - May',
      sort: 18,
      weight: 0
    },
    {
      glCodes: [
        '4002'
      ],
      company: 'GARP',
      prodCodes : [
        'FRM1E',
        'FRM1S',
        'FRM1L'
      ],
      mergedCode : 'FRMINOV',
      mergedGL : '4002MERGE',
      mergedName : 'FRM Exam Part I - Nov',
      sort: 19,
      weight: 0
    },

    {
      glCodes: [
        '4001'
      ],
      company: 'GARP',
      prodCodes : [
        'FRM2E',
        'FRM2S',
        'FRM2L'
      ],
      mergedCode : 'FRMIIMAY',
      mergedGL : '4001MERGE',
      mergedName : 'FRM Exam Part II - May',
      sort: 18,
      weight: 0
    },
    {
      glCodes: [
        '4002'
      ],
      company: 'GARP',
      prodCodes : [
        'FRM2E',
        'FRM2S',
        'FRM2L'
      ],
      mergedCode : 'FRMIINOV',
      mergedGL : '4002MERGE',
      mergedName : 'FRM Exam Part II - Nov',
      sort: 19,
      weight: 0
    },


    {
      glCodes: [
        '4001'
      ],
      company: 'GRA',
      prodCodes : [
        'ENCE',
        'ENCS',
        'ENCL',
      ],
      mergedCode : 'ENCMAY',
      mergedGL : '4001MERGE',
      mergedName : 'ERP Exam - May',
      sort: 9,
      weight: 0
    },
    {
      glCodes: [
        '4002'
      ],
      company: 'GRA',
      prodCodes : [
        'ENCE',
        'ENCS',
        'ENCL',
      ],
      mergedCode : 'ENCNOV',
      mergedGL : '4002MERGE',
      mergedName : 'ERP Exam - Nov',
      sort: 10,
      weight: 0
    }

  ];

  $scope.shippingProductId = null;
  $scope.envPath = envPath;

  var td = moment().add(-1, 'days').format("M/D/YYYY");
  var yd = moment().add(-1, 'days').format("M/D/YYYY");

  $scope.formVars = {
  startDate: yd,
    endDate: td,
    garp: false,
    gra: false,
    nj: false,
    refund: false,
    charge: false,
    pm_creditcard: true,
    pm_creditcardbyfax: true,
    pm_wire: false,
    pm_check: false,
    prods: []
  }
  //$scope.spinner=null;
  //$timeout(function () {
  //  var obj = $('#spin')
  //  $scope.spinner = new Spinner(spinnerOptions).spin(obj[0]);
  //}, 300);

  function doneAddingToDom() {
    if(defined($scope,"spinner"))
      $scope.spinner.stop();    
  }
  function startSpinner() {
    var selector = '#spin';
    var obj = $(selector)
    if(defined(obj,"length") && obj.length > 0) {
      $scope.spinner = new Spinner(spinnerOptions).spin(obj[0]);
    }   
  }
  $scope.$on('allRendered', doneAddingToDom);


  $scope.$on('filter', function(event, params) {
    $scope.formVars = jQuery.extend(true, {}, params);
  });
  $scope.$on('refresh', function(event, params) {
    $scope.formVars = jQuery.extend(true, {}, params);
    init();
  });
  $scope.$on('download', function(event, params) {
    $scope.formVars = jQuery.extend(true, {}, params);
    $scope.export();
  });


  function init() {

    $timeout(function () {
      startSpinner();
    },300);

    console.log('Init');
    $scope.err = '';

    var hostName = window.location.hostname;
    if(hostName.indexOf("c.cs16.visual.force.com") > -1) {
      // Build
      var priceBookId = '01sf00000008rTn';
    } else {
      // Prod
      var priceBookId = '01s40000000VV15';
    }


    reportsGARPServices.getProducts(priceBookId, function(err, data) {

      $scope.prods = data.result;
      $scope.origProds = data.result;
      $scope.prodsFinal = [];
      $scope.formVars.prods = [];
      if($scope.formVars.prods.length == 0) {
        for(var i=0; i<$scope.prods.length; i++) {
          var prod = $scope.prods[i];

          if(defined(prod,"Product2.IsActive") && defined(prod,"Pricebook2.IsActive") &&
             defined(prod,"Pricebook2.IsActive") && prod.Pricebook2.IsActive == true && 
             defined(prod,"Product2.IsActive") && prod.Product2.IsActive == true && defined(prod,"Product2.RPT_Sort_Order__c")) {

            var found=false;

            for(var k=0; k<mergeProds.length; k++) {
              var idxgl = _.indexOf(mergeProds[k].glCodes, prod.Product2.GL_Code__c);  
              var idxpc = _.indexOf(mergeProds[k].prodCodes, prod.Product2.ProductCode);  
              if(idxgl > -1 && idxpc > -1) {              
                found=true;
                break;
              }
            }

            // if(prod.Product2.GL_Code__c == FRM1_GLCODE && 
            //    (prod.Product2.ProductCode == FRM1EARLY || prod.Product2.ProductCode == FRM1STANDARD ||
            //    prod.Product2.ProductCode == FRM1LATE)) {
            //   continue;
            // }

            if(found)
              continue;

            var obj = {
              id: prod.Id,
              name: prod.Name,
              checked: false
            }
            $scope.formVars.prods.push(obj);

            if(prod.Product2.ProductCode == SHIP)
              $scope.shippingProductId = prod.Product2.Id

            $scope.prodsFinal.push(prod);
          }
        }
      }

      // var prodObj = {
      //   Id: FRM1_CODE_MERGED+':'+FRM1_GLCODE_MERGED,
      //   Name: FRM1_NAME_MERGED,
      //   Product2Id: FRM1_CODE_MERGED+':'+FRM1_GLCODE_MERGED,
      //   Product2: {
      //     Id: FRM1_CODE_MERGED+':'+FRM1_GLCODE_MERGED,
      //     Company__c: "GARP",
      //     GL_Code__c: FRM1_GLCODE_MERGED,
      //     ProductCode: FRM1_CODE_MERGED,
      //     Weight__c: 1
      //   }
      // }

      for(var i=0; i<mergeProds.length; i++) {
        var mp = mergeProds[i];

        var prodObj = {
          Id: mp.mergedCode+':'+mp.mergedGL,
          Name: mp.mergedName,
          Product2Id: mp.mergedCode+':'+mp.mergedGL,
          Product2: {
            Id: mp.mergedCode+':'+mp.mergedGL,
            Company__c: mp.company,
            GL_Code__c: mp.mergedGL,
            ProductCode: mp.mergedCode,
            RPT_Sort_Order__c: mp.sort,
            Weight__c: mp.weight
          }
        }

        $scope.prodsFinal.push(prodObj);
      }

      $scope.prods = $scope.prodsFinal;

      $scope.totals = [];
      $scope.opps = [];
      $scope.total = 0;

      //var sdt = moment.tz($scope.formVars.startDate + ' 00:00:01','America/Los_Angeles').add(+3,'hours').unix();
      //var edt = moment.tz($scope.formVars.endDate + ' 23:59:59','America/Los_Angeles').add(+3,'hours').unix();
      var sdt = moment.tz($scope.formVars.startDate + ' 00:00:01','America/Los_Angeles').unix();
      var edt = moment.tz($scope.formVars.endDate + ' 23:59:59','America/Los_Angeles').unix();

      reportsGARPServices.getReportDataTrans(sdt, edt, $scope.formVars.garp, $scope.formVars.gra, $scope.formVars.nj, function(err, data) {

        if(data.event.status == false) {
          if(defined($scope,"spinner"))
            $scope.spinner.stop();          
          $rootScope.$apply(function(){
            $scope.err = data.event.message;
          });
          return;
        }

        if(defined(data,"result.trans"))
          $scope.transactions = data.result.trans;

        reportsGARPServices.getReportDataOpp(sdt, edt, $scope.formVars.garp, $scope.formVars.gra, $scope.formVars.nj, function(err, data) {

          if(data.event.status == false) {
            if(defined($scope,"spinner"))
              $scope.spinner.stop();          
            $rootScope.$apply(function(){
              $scope.err = data.event.message;
            });
            return;
          }

          if(defined(data,"result.opps")) {
            $scope.oppsData = data.result.opps;
            for(var t=0; t<$scope.oppsData.length; t++) {
              var opp = $scope.oppsData[t];
              for(var z=0; z<opp.OpportunityLineItems.length; z++) {
                var li = opp.OpportunityLineItems[z];

                var found=false;
                for(var k=0; k<mergeProds.length; k++) {
                  var idxgl = _.indexOf(mergeProds[k].glCodes, li.PricebookEntry.Product2.GL_Code__c);  
                  var idxpc = _.indexOf(mergeProds[k].prodCodes, li.PricebookEntry.ProductCode);  
                  if(idxgl > -1 && idxpc > -1) {              
                    found=true;
                    break;
                  }
                }

                if(found) {
                  li.PricebookEntry.Id = mergeProds[k].mergedCode+':'+mergeProds[k].mergedGL;
                  li.PricebookEntry.Product2.Id = mergeProds[k].mergedCode+':'+mergeProds[k].mergedGL;
                  li.PricebookEntryId = mergeProds[k].mergedCode+':'+mergeProds[k].mergedGL;                  
                }


                // if(li.PricebookEntry.Product2.GL_Code__c == FRM1_GLCODE && 
                //   (li.PricebookEntry.ProductCode == FRM1EARLY || li.PricebookEntry.ProductCode == FRM1STANDARD || li.PricebookEntry.ProductCode == FRM1LATE)) {
                  
                //     li.PricebookEntry.Id = FRM1_CODE_MERGED+':'+FRM1_GLCODE_MERGED;
                //     li.PricebookEntry.Product2.Id = FRM1_CODE_MERGED+':'+FRM1_GLCODE_MERGED;
                //     li.PricebookEntryId = FRM1_CODE_MERGED+':'+FRM1_GLCODE_MERGED;
                // }
              }
            }
          }
            

          reportsGARPServices.getReportDataRefunds(sdt, edt, $scope.formVars.garp, $scope.formVars.gra, $scope.formVars.nj, function(err, data) {

            if(data.event.status == false) {
              if(defined($scope,"spinner"))
                $scope.spinner.stop();          
              $rootScope.$apply(function(){
                $scope.err = data.event.message;
              });
              return;
            }

            if(defined(data,"result.refunds")) {
              $scope.refunds = data.result.refunds;
              for(var t=0; t<$scope.refunds.length; t++) {
                var rfnd = $scope.refunds[t];
                var fndRfnd = _.findWhere($scope.origProds, {Product2Id: rfnd.Product__c});

                if(defined(fndRfnd)) {

                  var found=false;
                  for(var k=0; k<mergeProds.length; k++) {
                    var idxgl = _.indexOf(mergeProds[k].glCodes, fndRfnd.Product2.GL_Code__c);  
                    var idxpc = _.indexOf(mergeProds[k].prodCodes, fndRfnd.Product2.ProductCode);  
                    if(idxgl > -1 && idxpc > -1) {              
                      found=true;
                      break;
                    }
                  }

                  if(found) {                    
                    rfnd.Product__c = mergeProds[k].mergedCode+':'+mergeProds[k].mergedGL;
                  }
                }

                // if(defined(fnd) && fnd.Product2.GL_Code__c == FRM1_GLCODE && 
                //   (fnd.Product2.ProductCode == FRM1EARLY || fnd.Product2.ProductCode == FRM1STANDARD || fnd.Product2.ProductCode == FRM1LATE)) {
                //   rfnd.Product__c = FRM1_CODE_MERGED+':'+FRM1_GLCODE_MERGED;
                // }

              }
            }
              

            for(var i=0; i<$scope.transactions.length; i++) {
              var trans = $scope.transactions[i];

              if(trans.ChargentSFA__Response_Status__c != 'Approved')
                continue;

              var findopp = _.findWhere($scope.oppsData, {Id: trans.ChargentSFA__Opportunity__c});
              var opp = jQuery.extend(true, {}, findopp);

              if(!defined(opp))
                continue;

              var found=false;
              var total=0;
              if(defined(opp,"OpportunityLineItems.length")) {                  
                for(var j=0; j<opp.OpportunityLineItems.length; j++) {
                  var oppLine = opp.OpportunityLineItems[j];
                  var fnd=_.findWhere($scope.prods, {Id: oppLine.PricebookEntryId})
                  if(defined(fnd)) {
                    found=true;
                    var match = _.findWhere($scope.totals, {id: oppLine.PricebookEntryId});
                    total+=oppLine.TotalPrice;
                    if(defined(match)) {
                      match.total += oppLine.TotalPrice;
                    } else {
                      var obj = {
                        id: oppLine.PricebookEntryId,
                        total: oppLine.TotalPrice
                      }
                      $scope.totals.push(obj);
                    }
                  }
                }
              }

              if(opp.Display_Invoice_Number__c == 'W969866')
                console.log('hi');

              obj = opp;
              obj.isRefund=false;
              obj.refunds=null;
              obj.trans=trans;
              obj.transId=trans.Id;
              obj.amount = opp.Amount;
              obj.closeDate = opp.CloseDate;
              if(defined(trans,"ChargentSFA__Gateway_Date__c"))
                obj.closeDate = trans.ChargentSFA__Gateway_Date__c;

              if(trans.ChargentSFA__Type__c == 'Charge') {

                if(defined(trans,"ChargentSFA__Amount__c"))
                  obj.amount = trans.ChargentSFA__Amount__c;

                $scope.opps.push(obj);

              } else if(trans.ChargentSFA__Type__c == 'Refund' || trans.ChargentSFA__Type__c == 'Credit') {

                var refunds = _.where($scope.refunds, {Opportunity__c: opp.Id});
                if(defined(refunds)) {
                  obj.isRefund=true;
                  obj.refunds = refunds;

                  if(defined(trans,"ChargentSFA__Amount__c")) {
                    if(trans.ChargentSFA__Amount__c >= 0)
                      obj.amount = trans.ChargentSFA__Amount__c * -1;
                    else obj.amount = trans.ChargentSFA__Amount__c;
                  }
                    

                  if(defined(trans,"ChargentSFA__Gateway_Response__c")) {
                    var patt = /PNREF=([^&]*)/i
                    var x = patt.exec(trans.ChargentSFA__Gateway_Response__c);
                    if(defined(x,"length") && x.length > 1) {
                      obj.trans.ChargentSFA__Gateway_ID__c = x[1];
                    }
                  }

                  $scope.opps.push(obj);
                }

              }
            }
            if(defined($scope,"spinner"))
              $scope.spinner.stop();
            $rootScope.$apply(function(){
              $scope.opps = _.sortBy($scope.opps, function(obj){ return obj.closeDate; });
              if(defined($scope,"prods.length")) {
                $scope.prods = _.sortBy($scope.prods, function(obj){ return obj.Product2.RPT_Sort_Order__c; });
                $rootScope.$broadcast('fetchProds', $scope.formVars.prods);
              }                  
            });
          });
        });
      });
    });
  }
  //init();

  $scope.sortItems = function(fieldName) {
    $scope.opps = _.sortBy($scope.opps, function(obj){ return obj[fieldName]; });
  }

  $scope.getOppTotals = function() {

    if(!defined($scope,"opps.length"))
      return 0;

    var total=0;
    for(var j=0; j<$scope.opps.length; j++) {  
      var opp = $scope.opps[j];    
      var func = $scope.filterMatch();
      if(func(opp)) {
        if(defined(opp,"amount") && typeof opp.amount == "number")
          if(defined(opp,"isRefund") && opp.isRefund) {
            if(opp.amount >= 0)
              total+=(opp.amount * -1);
            else total+=opp.amount;

          } else {
            total+=opp.amount;
          }
      }
    }
    return total;
  }

  $scope.getProdTotals = function(prodId) {

    if(!defined($scope,"opps.length"))
      return 0;

    var total=0;
    for(var j=0; j<$scope.opps.length; j++) {  
      var opp = $scope.opps[j];    
      var func = $scope.filterMatch();
      if(func(opp)) {
        var prod=_.findWhere($scope.prods, {Id: prodId})
        var func = $scope.criteriaMatch();
        if(defined(prod) && func(prod)) {
          total+=$scope.getProductAmount(opp, prod);
        }        
      }
    }
    return total;
  }


  $scope.getProductAmountShipping = function(opp, prod) {

    var prodId = prod.Id
    if(!defined(opp,"OpportunityLineItems.length"))
      return 0;

    if(opp.Display_Invoice_Number__c == 'W383088') {
      console.log('hu');
    }

    var found = false;
    var foundRefundShipping = false;
    if(opp.isRefund) {
      var refunds = opp.refunds;
      for(var j=0; j<refunds.length; j++) {
        var refund = refunds[j];
        if(refund.Product__c == prod.Product2.Id) {
          found=true;
        }        
        if(refund.Product_Code__c == SHIP) {
          foundRefundShipping=true;
        }
      }      
       
    } else {

      //var match = _.findWhere(opp.OpportunityLineItems, {PricebookEntry.product2.Id: Product2.Id});
      //var fndProd=_.findWhere($scope.prods, {Id: prodId})
      var found=false;
      for(var j=0; j<opp.OpportunityLineItems.length; j++) {
        var oppLine = opp.OpportunityLineItems[j];
        if(oppLine.PricebookEntry.Product2.Id == prod.Product2.Id) {
          found=true;
          break;
        }
      }

    }

    if(!found && !foundRefundShipping)
      return 0;

    var fndProd=prod;

    var totalWeight = 0;
    var shippingCost = 0;
    var boughtShipping=false;
    for(var j=0; j<opp.OpportunityLineItems.length; j++) {
      var oppLine = opp.OpportunityLineItems[j];
      var fnd=_.findWhere($scope.prods, {Id: oppLine.PricebookEntryId})
      if(defined(fnd,"Product2.Weight__c") && fnd.Product2.Weight__c > 0)
        totalWeight+=fnd.Product2.Weight__c;

      if(oppLine.PricebookEntry.Product2.Id == $scope.shippingProductId) {
        shippingCost = oppLine.TotalPrice;
      }

      if(oppLine.PricebookEntry.Product2.Id == prod.Product2.Id)
        boughtShipping=true
    }        
    if(defined(fndProd,"Product2.Weight__c") && fndProd.Product2.Weight__c > 0 && shippingCost > 0 && totalWeight > 0 && boughtShipping == true) {
      var percent = fndProd.Product2.Weight__c / totalWeight;

      if(opp.isRefund) {
        if(foundRefundShipping) {
          return shippingCost * percent * -1;
        } else {
          return 0;
        }
      } else {
        return shippingCost * percent;
      }
        
      
    }
    return 0;

  }

  $scope.getProductAmount = function(opp, prod) {

    var prodId = prod.Id;
    if(defined(opp,"isRefund") && opp.isRefund) {
      
      var prod = _.findWhere($scope.prods, {Id: prodId});
      if(defined(prod)) {
        var match = _.findWhere(opp.refunds, {Product__c: prod.Product2Id});
        if(defined(match,"Refund_amount__c")) {
          if(match.Refund_amount__c >= 0)
            return -1 * match.Refund_amount__c;        
          else return match.Refund_amount__c; 
        }
      }
      return 0;
    }

    var match = _.findWhere(opp.OpportunityLineItems, {PricebookEntryId: prodId});
    if(defined(match))
      return match.TotalPrice;
    else return 0;
  }

  function formatAmountExport(amount) {
    if(!defined(amount)) {
      amount=0;
    }
    return parseFloat(Math.round(amount * 100) / 100).toFixed(2).toString();
  }

  function formatDefined(obj) {
    if(defined(obj))
      return obj;
    else return '';
  }

  $scope.formatAmountDisplay = function(str) {
    return formatAmountDisplay(str);
  }

  $scope.formatDate = function(strDate,format) {
    if(defined(strDate))
      return formatDate(strDate, format);
    else return '';
  }

  $scope.getTotal = function(PricebookEntryId) {
    var match = _.findWhere($scope.totals, {id: PricebookEntryId});
    if(defined(match))
      return match.total;
    else return 0;
  }

  $scope.getRowTotal = function(opp) {
    if(defined(opp,"isRefund") && opp.isRefund) {
      if(opp.amount >= 0)
        return opp.amount * -1;
      else return opp.amount;
    } else if(defined(opp)) {
      return opp.amount;
    } else {
      return 0;
    }
  }

  $scope.export = function() {

    var json = [{"invoiceNumber":"Invoice #","garpId":"GARP ID","firstName":"First Name","lastName":"Last Name","county":"Country","state":"State","payPalId":"PayPal Trans ID",
                  "type":"Type","method":"Payment Method","company":"Company","paidDate":"Paid Date","total":"Total"}];
    for(var i=0; i<$scope.prods.length; i++) {  
      var prod = $scope.prods[i];
      var func = $scope.criteriaMatch();
      if(func(prod)) {
        json[0][prod.Product2.ProductCode+'~'+prod.Product2.GL_Code__c] = prod.Name + '-' + prod.Product2.ProductCode+':'+prod.Product2.GL_Code__c;        
      }
    }
    for(var i=0; i<$scope.prods.length; i++) {  
      var func = $scope.criteriaMatchShip();
      var prod = $scope.prods[i];
      if(func(prod)) {
        var prod = $scope.prods[i];
        json[0][prod.Product2.ProductCode+'~'+prod.Product2.GL_Code__c+"Shipping"] = prod.Name + '-' + prod.Product2.ProductCode+':'+prod.Product2.GL_Code__c + "Shipping";        
      }
    }
    json[0].endTotal="Total";

    for(var j=0; j<$scope.opps.length; j++) {  
      var opp = $scope.opps[j];

      var func = $scope.filterMatch();
      if(func(opp)) {
        var obj = {
          "invoiceNumber":formatDefined(opp.Display_Invoice_Number__c),
          "garpId":formatDefined(opp.GARP_Member_ID__c),
          "firstName":formatDefined(opp.Member_First_Name__c),
          "lastName":formatDefined(opp.Member_Last_Name__c),
          "county":formatDefined(opp.Shipping_Country__c),
          "state":formatDefined(opp.Shipping_State__c),
          "payPalId":formatDefined(opp.trans.ChargentSFA__Gateway_ID__c),
          "type":formatDefined(opp.trans.ChargentSFA__Type__c),
          "method":formatDefined(opp.trans.ChargentSFA__Payment_Method__c),
          "company":formatDefined(opp.Company__c),
          "paidDate":formatDefined(formatDate(opp.closeDate, "MM-DD-YYYY")),
          "total":formatAmountExport($scope.getRowTotal(opp))
        };

        for(var i=0; i<$scope.prods.length; i++) {  
          var prod = $scope.prods[i];
          var func = $scope.criteriaMatch();
          if(func(prod)) {
           obj[prod.Product2.ProductCode+'~'+prod.Product2.GL_Code__c] = formatAmountExport($scope.getProductAmount(opp, prod));
          }
        }
        for(var i=0; i<$scope.prods.length; i++) {  
          var func = $scope.criteriaMatchShip();
          var prod = $scope.prods[i];
          if(func(prod)) {
            var prod = $scope.prods[i];
            obj[prod.Product2.ProductCode+'~'+prod.Product2.GL_Code__c+"Shipping"] = formatAmountExport($scope.getProductAmountShipping(opp, prod));
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


  $scope.criteriaMatchShip = function(value) {
    return function( item ) {   

      var fnd=_.findWhere($scope.prods, {Id: item.Id})

      if(defined(fnd,"Product2.Weight__c") && fnd.Product2.Weight__c > 0) {
        return 1;
      } else {
        return 0;
      }
    }
  }


  $scope.criteriaMatch = function(value) {
    return function( item ) {   


      var fnd=_.findWhere($scope.prods, {Id: item.Id})

      if(defined(fnd,"Product2")) {
        if(fnd.Product2.ProductCode==SHIP)
          return 0;
        else return 1;
      } else {
        return 0;
      }

    }
  }
        

  $scope.filterMatch = function(value) {
    return function( item ) {   

      if(!defined(item,"amount") || item.amount == 0)
        return false;

      var match = false;
      if($scope.formVars.garp==false && $scope.formVars.gra==false)
        match=true;
      else if($scope.formVars.garp==true && defined(item,"Company__c") && item.Company__c == 'GARP')
         match=true;
      else if($scope.formVars.gra==true && defined(item,"Company__c") && item.Company__c == 'GRA')
         match=true;
    
      if(match == false)
        return match;

      match = false
      if($scope.formVars.nj==false)
        match=true;
      if($scope.formVars.nj==true && defined(item,"Shipping_State__c") && defined(item,"Shipping_Country__c") &&
              (item.Shipping_Country__c == 'US' || item.Shipping_Country__c == 'United States' || item.Shipping_Country__c == 'United States of America') &&
              (item.Shipping_State__c == 'NJ' || item.Shipping_State__c == 'New Jersey') )
         match=true;     

      if(match == false)
        return match;          

      match = false
      if($scope.formVars.refund==false && $scope.formVars.charge==false)
        match=true;
      else if($scope.formVars.refund==true && defined(item,"trans.ChargentSFA__Type__c") && item.trans.ChargentSFA__Type__c == 'Refund')
         match=true;
      else if($scope.formVars.charge==true && defined(item,"trans.ChargentSFA__Type__c") && item.trans.ChargentSFA__Type__c == 'Charge')
         match=true;

      if(match == false)
        return match;


      match = false;
      if($scope.formVars.pm_creditcard==false && $scope.formVars.pm_creditcardbyfax==false &&
          $scope.formVars.pm_wire==false && $scope.formVars.pm_check==false)
        match=true;
      else if($scope.formVars.pm_creditcard==true && defined(item,"trans.ChargentSFA__Payment_Method__c") && item.trans.ChargentSFA__Payment_Method__c == 'Credit Card')
         match=true;
      else if($scope.formVars.pm_creditcardbyfax==true && defined(item,"trans.ChargentSFA__Payment_Method__c") && item.trans.ChargentSFA__Payment_Method__c == 'Credit Card by Fax')
         match=true;
      else if($scope.formVars.pm_wire==true && defined(item,"trans.ChargentSFA__Payment_Method__c") && item.trans.ChargentSFA__Payment_Method__c == 'Wire Transfer')
         match=true;
      else if($scope.formVars.pm_check==true && defined(item,"trans.ChargentSFA__Payment_Method__c") && item.trans.ChargentSFA__Payment_Method__c == 'Check')
         match=true;

      return match;
    }
  }


}]);