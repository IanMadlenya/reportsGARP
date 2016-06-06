reportsGARPControllers.controller('deployCalCtrl', ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {
	$scope.envPath = envPath;
	$scope.calendarView = 'month';
	$scope.calendarDay = null;
	$scope.calendarUpdate = false;

	$scope.vm = {};
	$scope.vm.filter = 'all';
	
    $scope.convertEpochFromEasternToLocalTime = function(epoch) {
        if(epoch !== null && typeof epoch !== "undefined") {

        var mdate = moment.tz(epoch, 'America/New_York');
        var formattedDateString = mdate.format('YYYY-MM-DD HH:mm:ss');      //returns in format 2013-02-08 09:30:26
        mdate = moment(formattedDateString);   //Parsing a string will create a date in the current time-zone
        var localEpoch = mdate.unix() * 1000;  //convert seconds to milliseconds
        return localEpoch;

      } else {
        return "";
      }
    }


    var m = moment('June 15, 2016 12:00:00').unix();

	$scope.vm.events = [
      {
        title: 'Bob',
        type: 'success',
		starts_at: new Date($scope.convertEpochFromEasternToLocalTime(m)),
        ends_at: new Date($scope.convertEpochFromEasternToLocalTime(m))
      }


	  // {
	  //   title: 'My event title', // The title of the event
	  //   type: 'info', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
	  //   startsAt: new Date(2016,4,1,1), // A javascript date object for when the event starts
	  //   //endsAt: new Date(2014,8,26,15), // Optional - a javascript date object for when the event ends
	  //   editable: false, // If edit-event-html is set and this field is explicitly set to false then dont make it editable.
	  //   deletable: false, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
	  //   draggable: false, //Allow an event to be dragged and dropped
	  //   resizable: true, //Allow an event to be resizable
	  //   incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
	  //   //recursOn: 'year', // If set the event will recur on the given period. Valid values are year or month
	  //   cssClass: 'a-css-class-name', //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
	  //   allDay: false // set to true to display the event as an all day event on the day view
	  // }
	];	

	Date.prototype.stdTimezoneOffset = function() {
	    var jan = new Date(this.getFullYear(), 0, 1);
	    var jul = new Date(this.getFullYear(), 6, 1);
	    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
	}

	Date.prototype.dst = function() {
	    return this.getTimezoneOffset() < this.stdTimezoneOffset();
	}

	var today = new Date();
	$scope.dls = 4;
	if (today.dst()) { 
		$scope.dls = 5;
	}


	function loadEvents(newDate, view) {

        var currentYear = moment(newDate).year();
        var currentMonth = moment(newDate).month();

		reportsGARPServices.getDeploymentData(currentMonth+1, currentYear, function(err, data) {	

			$rootScope.$apply(function(){
				$scope.vm.events=[];
				for(var i=0; i<data.result.length; i++) {
					var d = new Date(data.result[i].Target_Deployment_Date__c + ($scope.dls*60*60*1000));
					var res = data.result[i];

					var type = 'evt-normal-email';
					if(res.Type__c == 'Email' && res.Email_Recipient_Size__c == 'Large')
						type = 'evt-large-email';
					if(res.Type__c == 'Email' && (!defined(res,"Email_Recipient_Size__c") || res.Email_Recipient_Size__c != 'Large'))
						type = 'evt-normal-email';
					else if(res.Type__c == 'Website')
						type = 'evt-website';
					else if(res.Type__c == 'User Portal')
						type = 'evt-user-portal';
					else if(res.Type__c == 'Salesforce Tool')
						type = 'evt-salesforce-tool';
					else if(res.Type__c == 'Marketing Asset')
						type = 'evt-marketing-asset';

					var obj = {
				        title: res.Name,
				        type: type,
						starts_at: d,
				        ends_at:  d,
				        sfdc: res,
				        orgType: type
					}
					$scope.vm.events.push(obj);
				}
				if(view==null)
					$scope.vm.calendarView = 'month';
				else $scope.vm.calendarView = view;

				$scope.calendarDay = newDate;
			});
	    });
	}
	var dt = new Date();
	loadEvents(dt,null);

	$scope.setView = function(view) {
		$scope.vm.calendarView = view;
	}

	$scope.setFilter = function(view) {
		if(view == 'email') {
			for(var i=0; i<$scope.vm.events.length; i++) {
				var ev = $scope.vm.events[i];
				if(ev.sfdc.Type__c != 'Email') {
					ev.type = 'hide';
				} else {
					if(ev.sfdc.Email_Recipient_Size__c == 'Large') {
						ev.type = 'danger';
					} else {
						ev.type = 'info';
					}
				}
			}
		} else {
			for(var i=0; i<$scope.vm.events.length; i++) {
				var ev = $scope.vm.events[i];
				if(ev.type != 'Email') {
					ev.cssClass = '';
				}
				ev.type = ev.orgType;
			}			
		}
		$scope.vm.filter = view;
	}


	$scope.getCalendarTitle = function() {

		switch($scope.vm.calendarView) {
			case 'year':
				return moment($scope.calendarDay).year();

			case 'month':
				return moment($scope.calendarDay).format("MMMM, YYYY");

			case 'week':
				return moment($scope.calendarDay).format("MMMM, YYYY");

			case 'day':
				return moment($scope.calendarDay).format("MMMM D, YYYY");
		}
	}

	$scope.nextCalendar = function(inc) {

		if(inc == null) {
			$scope.calendarDay = new Date();
			return;
		}

		var newDate;
		switch($scope.vm.calendarView) {
			case 'year':
				newDate = moment($scope.calendarDay).add(inc, 'year').toDate();
				break;

			case 'month':
				newDate = moment($scope.calendarDay).add(inc, 'month').toDate();
				break;

			case 'week':
				newDate = moment($scope.calendarDay).add(inc, 'week').toDate();
				break;

			case 'day':
				newDate = moment($scope.calendarDay).add(inc, 'day').toDate();
				break;
		}
		loadEvents(newDate, null);

	}

	debugger;
}]);
