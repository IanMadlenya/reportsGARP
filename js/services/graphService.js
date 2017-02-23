var reportsGARPServices = angular.module('reportsGARP.services')  //gets
reportsGARPServices.factory('graphService', [
  function(){

  	var graphService = {};


  	graphService.exportDataProcessing = function(sdata, labels, exportLabel) {
			var expData = [];
      var cols = _.pluck(sdata, "name");
      cols.unshift(exportLabel);

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
      return expData;
		}

		graphService.getColors = function(sdata) {
	    var colors = [];
	    var examFullTypeList = this.examFullTypeList;
	    var examRegType = this.examRegType;

	    _.each(sdata, function(sd) {
	      var fnd = _.findWhere(examFullTypeList, {label: sd.name});
	      if(!defined(fnd)) {
	        fnd = _.findWhere(examFullTypeList, {name: sd.name});
	      }
	      if(!defined(fnd)) {
	        fnd = _.findWhere(examFullTypeList, {value: sd.name});
	      }
	      if(!defined(fnd)) {
	        fnd = _.findWhere(examRegType, {name: sd.name});
	      }
	      if(defined(fnd,'color')) {
	        colors.push(fnd.color);
	      } else {
	        colors.push('#1CE7D8');
	      }
	    });
	    return colors;
    }		

		graphService.prepDataForGraphing = function(sdata) {
	    for(var i=0; i<sdata.length; i++) {
	      for(var j=0; j<sdata[i].data.length; j++) {
	        if(sdata[i].data[j] == 0)
	          sdata[i].data[j] = null;
	      }
	    }
	    return sdata;
	  }

	  graphService.sortData = function(sdata, sortRankFunc) {
      _.each(sdata, function(sd) {
        var rank = sortRankFunc(sd.name);
        sd.rank = rank;
      });
      return _.sortBy(sdata, function(row) { return row.rank })	  
    }

  	graphService.examFullTypeList = [{
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

    graphService.examMonthList = [{
      name: "May",
      value: "May"
    }, {
      name: "November",
      value: "Nov"
    }, {
      name: "Both",
      value: "May,Nov"
    }];

    graphService.examRegType = [
    {
      name: "Deferred In",
      color: '#EDC1B6'
    }, {
      name: "Deferred Out",
      color: '#BACECE'
    }, {
      name: "Deferred Out Pending",
      color: '#BACECE'
    }, {
      name: "Early Registration",
      color: '#DE6E6A'
    }, {
      name: "Late Registration",
      color: '#BDB76B'
    }, {
      name: "Standard Registration",
      color: '#D8BFD8'
    }];

    graphService.examYearAllTimeList = [];
    for (var i = 1997; i <= 2017; i++) {
      var obj = {
        name: i.toString(),
        value: i
      }
      graphService.examYearAllTimeList.push(obj);
    }

    graphService.examYearList = [];
    for (var i = 2010; i <= 2017; i++) {
      var obj = {
        name: i,
        value: i
      }
      graphService.examYearList.push(obj);
    }

    graphService.sortingAlgorithm = function(a, b) {

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
    return graphService;

}]);