function defined(ref, strNames) {
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

var myApp = angular.module('reportsGARP', ['reportsGARPControllers','reportsGARP.services','ui.router','ui.grid','mwl.calendar', 'ui.bootstrap']);

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
    if(typeof startRoute !== 'undefined')
      startPath = startRoute;

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


myApp.filter('numberToLocalFilter', function () {
  return function (value) {
    return value.toLocaleString();
  };
})