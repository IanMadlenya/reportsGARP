
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
    
    function JSON2CSV(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    
        var str = '';
        var line = '';
    
        if ($("#labels").is(':checked')) {
            var head = array[0];
            if ($("#quote").is(':checked')) {
                for (var index in array[0]) {
                    var value = index + "";
                    line += '"' + value.replace(/"/g, '""') + '",';
                }
            } else {
                for (var index in array[0]) {
                    line += index + ',';
                }
            }
    
            line = line.slice(0, -1);
            str += line + '\r\n';
        }
    
        for (var i = 0; i < array.length; i++) {
            var line = '';
    
            if ($("#quote").is(':checked')) {
                for (var index in array[i]) {
                    var value = array[i][index] + "";
                    line += '"' + value.replace(/"/g, '""') + '",';
                }
            } else {
                for (var index in array[i]) {
                    line += array[i][index] + ',';
                }
            }
    
            line = line.slice(0, -1);
            str += line + '\r\n';
        }
        return str;
        
    }
        
    
    //var myApp = angular.module('reportsGARP', ['reportsGARPControllers']);    

    var myApp = angular.module('reportsGARP', ['reportsGARPControllers','ui.router','ui.grid']);

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
    