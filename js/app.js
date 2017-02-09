
    var spinnerOptions = {
      lines: 13, // The number of lines to draw
      length: 20, // The length of each line
      width: 10, // The line thickness
      radius: 30, // The radius of the inner circle
      corners: 0.5, // Corner roundness (0..1)
      rotate: 0, // The rotation offset
      direction: 1, // 1: clockwise, -1: counterclockwise
      color: '#000000', // #rgb or #rrggbb or array of colors
      speed: 1, // Rounds per second
      trail: 60, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      hwaccel: false, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: '10', // Top position relative to parent in px
      left: 'auto' // Left position relative to parent in px
    };

    // Dark to Light
    var BLUE1 = '#00A0DD';
    var BLUE2 = '#03B9FF';
    var BLUE3 = '#56EBD7';

    // Dark to Light
    var GREEN1 = '#15BCA5';
    var GREEN2 = '#29CEB7';
    var GREEN3 = '#5BD2FF';

    var defined = function(ref, strNames) {
        var name;
        
        if(ref === null || typeof ref === "undefined") {
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

    formatDate = function(epoch, format) {
      if(epoch !== null && typeof epoch !== "undefined") {
        //var mdate = moment.tz(epoch,'GMT');
        var mdate = moment(epoch);
        return mdate.format(format);
      } else {
        return "";
      }
    }
        
    formatAmountDisplay = function(amount) {
      if(!this.defined(amount)) {
        amount=0;
      }
      return parseFloat(Math.round(amount * 100) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function exportToCSV(data, filename) {
      var blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
      if (navigator.msSaveBlob) { // IE 10+
          navigator.msSaveBlob(blob, filename);
      } else {
          var link = document.createElement("a");
          if (link.download !== undefined) { // feature detection
              // Browsers that support HTML5 download attribute
              var url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute("download", filename);
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
          }
      }

    }
    
    function JSON2CSV(objArray, labels, quotes, colDefs) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    
        var str = '';
        var line = '';
    
        if (labels) {
            var head = array[0];
            if (quotes) {

                if(this.defined(colDefs)) {
                  _.each(colDefs, function(col) {
                    var value = col.field + "";
                    line += '"' + value.replace(/"/g, '""') + '",';
                  });
                } else {
                  for (var index in array[0]) {
                      var value = index + "";
                      line += '"' + value.replace(/"/g, '""') + '",';
                  }                  
                }

            } else {
              if(this.defined(colDefs)) {
                _.each(colDefs, function(col) {
                  line += array[0][col.field] + ',';
                });
              } else {
                for (var index in array[0]) {
                    line += index + ',';
                }                
              }
            }
    
            line = line.slice(0, -1);
            str += line + '\r\n';
        }
    
        for (var i = 0; i < array.length; i++) {
            var line = '';
    
            if (quotes) {
              if(this.defined(colDefs)) {
                _.each(colDefs, function(col) {
                  var value = array[i][col.field] + "";
                  value = value.replace('null', '');
                  line += '"' + value.replace(/"/g, '""') + '",';
                });                
              } else {
                for (var index in array[i]) {
                    var value = array[i][index] + "";
                    value = value.replace('null', '');
                    line += '"' + value.replace(/"/g, '""') + '",';
                }
              }
            } else {
              if(this.defined(colDefs)) {
                _.each(colDefs, function(col) {
                  var value = array[i][col.field];
                  value = value.replace('null', '');
                  line += value + ',';
                });                
              } else {
                for (var index in array[i]) {
                  var value = array[i][index];
                  value = value.replace('null', '');
                  line += value + ',';
                }                
              }
            }
    
            line = line.slice(0, -1);
            str += line + '\r\n';
        }
        return str;
        
    }
        
    
    //var myApp = angular.module('reportsGARP', ['reportsGARPControllers']);    

    var myApp = angular.module('reportsGARP', ['reportsGARPControllers','ui.router','ui.grid','mwl.calendar', 'ui.bootstrap']);

angular.module('ErrorCatcher', [])
    .factory('$exceptionHandler', ['$injector', function ($injector) {
        return function errorCatcherHandler(exception, cause) {
            console.error(exception.stack);
            var msg = '';
            var file = '';
            var method = '';
            if(defined(exception,"stack") && (!defined(exception,"message") || exception.message.length == 0 )) {

              var jsonMsgRegx =  /"message":"([^"]*)"/ig;
              var res = jsonMsgRegx.exec(exception.stack);
              if(defined(res,"length") && res.length > 0) {
                msg = res[1];
              }

              //"method":"getDefferedExam"
              var jsonMethodRegx =  /"method":"([^"]*)"/ig;
              res = jsonMethodRegx.exec(exception.stack);
              if(defined(res,"length") && res.length > 0) {
                method = res[1];
              }


            } else {
              msg = exception.message;

              //"method":"getDefferedExam"
              var jsonMethodRegx =  /"method":"([^"]*)"/ig;
              res = jsonMethodRegx.exec(msg);
              if(defined(res,"length") && res.length > 0) {
                method = res[1];
              }

            }

            var stackRegx = /sfdcApp\/([^:]*):/ig;
            var res = stackRegx.exec(exception.stack);
            if(defined(res,"length") && res.length > 0) {
              file = res[1];
            }

            //add the current state info to the message
            var state = $injector.get('$state');
            msg = state.current.name + ':' + msg;

            //sfdcService.logError(exception.stack, msg, file, method, function(err, data) {
            //});
            $('#myGlobalErrorModal p').html("There has been an unexpected error. Please logout and try again. If this error persists please contact support at memberservices@garp.com")
            $("#myGlobalErrorModal").modal();
        };
    }]);

    

    myApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    var startPath = 'daily';

    // For unmatched routes:
    if(defined(startPath)) {
      $urlRouterProvider.otherwise('/' + startPath);      
    }

    // Activate hashbang
    $locationProvider.hashPrefix('!');

    // states for my app
    $stateProvider
      .state('daily', {
        url: '/daily',
        templateUrl: envPath + "/partials/dailyAR.html",
        controller: 'mainCtrl'
      })
      .state('exams', {
        url: '/exams',
        templateUrl: envPath + "/partials/exams.html",
        controller: 'examsCtrl'
      })
      .state('map', {
        url: '/map',
        templateUrl: envPath + "/partials/map.html",
        controller: 'mapCtrl'
      })
      .state('deployCal', {
        url: '/deployCal',
        templateUrl: envPath + "/partials/deployCal.html",
        controller: 'deployCalCtrl'
      });
   

    });
    
    //var reportsGARPControllers = angular.module('reportsGARP', []);
    
    myApp.directive("emitWhen", function(){
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var params = scope.$eval(attrs.emitWhen),
                    event = params.event,
                    condition = params.condition;
                if(condition){
                    scope.$emit(event);
                }
            }
        }
    });
    
    myApp.controller('SFDCAppErrorCtrl', ['$scope', '$rootScope', '$state',
      function ($scope, $rootScope, $state) {

        $scope.$on("appError", function (event, msg, subject) {
            $('#myGlobalErrorModal').find('.modal-header').find('#subject').html(subject)
            $('#myGlobalErrorModal').find('.modal-body').find('#message').html(msg)
            $("#myGlobalErrorModal").modal();
        });

        $scope.$on("leaveSite", function (event, siteURL) {
          $scope.siteURL = siteURL;
          $("#myGlobalLeaveSiteModal").modal();
        });

        $scope.leaveSite = function() {
          document.location = $scope.siteURL;
        }

      }
    ]);