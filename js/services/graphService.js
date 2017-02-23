var reportsGARPServices = angular.module('reportsGARP.services')  //gets
reportsGARPServices.factory('graphService', ['utilitiyService',
  function(utilitiyService){

  	var graphService = {};
    graphService.mapData = Highcharts.geojson(Highcharts.maps['custom/world']);
    var util = utilitiyService;


    graphService.addsData = function(sdata, country, val, emptyTotals, yearTotalLable) {
      var obj = _.findWhere(sdata, {
        Country: country
      });
      if (obj == null) {
        obj = {
        Country: country,
        Total: val
        };
        obj = _.extend(obj, emptyTotals);
        obj[yearTotalLable] = val;
        sdata.push(obj);
      } else {
        obj[yearTotalLable] += val;
        obj.Total += val;
      }
      return obj;
    }

    graphService.findOtherCountry = function(country) {

      if (country == "-" || country == "&nbsp;" || country == "NULL") {
        country = 'Other';
        return country;
      }

      if(country.length == 2) {
        var fnd = util.findDeep(this.mapData, "properties", "iso-a2", country);
        if(defined(fnd)) {
          country = fnd.name;
        } else {
          var acron = country.split('').join('.') + '.';
          var fnd = util.findDeep(this.mapData, "properties", "country-abbrev", acron);
          if(defined(fnd))
            country = fnd.name;            
        }
      }
      if(country.length == 3) {
        var fnd = util.findDeep(this.mapData, "properties", "iso-a3", country);
        if(defined(fnd)) {
          country = fnd.name;
        } else {
          var acron = country.split('').join('.') + '.';
          var fnd = util.findDeep(this.mapData, "properties", "country-abbrev", acron);  
          if(defined(fnd))
            country = fnd.name;            
        }              
      }
      return country;
    }

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

    graphService.computeSortRankReverse = function(year, label) {
      var sortRank=year;

      if(label.toLowerCase().indexOf('erp') > -1) {
        sortRank+='A';
      } else {
        sortRank+='B';
      }

      if(label.toLowerCase().indexOf('part 2') > -1 || label.toLowerCase().indexOf('part ii') > -1) {
        sortRank+='A'
      } else if(label.toLowerCase().indexOf('part 1') > -1 || label.toLowerCase().indexOf('part i') > -1) {
        sortRank+='B'
      } else {
        sortRank+='C'
      }

      if(label.toLowerCase().indexOf('nov') > -1) {
        sortRank+='A';
      } else {
        sortRank+='B';
      }

      if(label.toLowerCase().indexOf('total') > -1) {
        sortRank+='B';
      } else {
        sortRank+='A';
      }

      if(label.toLowerCase().indexOf('early') > -1) {
        sortRank+='G';
      } else if(label.toLowerCase().indexOf('standard') > -1) {
        sortRank+='F';
      } else if(label.toLowerCase().indexOf('late') > -1) {
        sortRank+='E';
      } else if(label.toLowerCase().indexOf('deferred in') > -1) {
        sortRank+='D';
      } else if(label.toLowerCase().indexOf('deferred out pending') > -1) {
        sortRank+='B';
      } else if(label.toLowerCase().indexOf('deferred out') > -1) {
        sortRank+='C';
      } else {
        sortRank+='A';
      }

      return sortRank;
    }

    graphService.computeSortRank = function(label) {
      var sortRank='';

      if(label.toLowerCase().indexOf('erp') > -1) {
        sortRank+='A';
      } else {
        sortRank+='B';
      }

      if(label.toLowerCase().indexOf('part 2') > -1 || label.toLowerCase().indexOf('part ii') > -1) {
        sortRank+='C'
      } else if(label.toLowerCase().indexOf('part 1') > -1 || label.toLowerCase().indexOf('part i') > -1) {
        sortRank+='B'
      } else {
        sortRank+='A'
      }

      if(label.toLowerCase().indexOf('nov') > -1) {
        sortRank+='B';
      } else {
        sortRank+='A';
      }

      if(label.toLowerCase().indexOf('total') > -1) {
        sortRank+='A';
      } else {
        sortRank+='B';
      }

      if(label.toLowerCase().indexOf('early') > -1) {
        sortRank+='A';
      } else if(label.toLowerCase().indexOf('standard') > -1) {
        sortRank+='B';
      } else if(label.toLowerCase().indexOf('late') > -1) {
        sortRank+='C';
      } else if(label.toLowerCase().indexOf('deferred in') > -1) {
        sortRank+='D';
      } else if(label.toLowerCase().indexOf('deferred out pending') > -1) {
        sortRank+='F';
      } else if(label.toLowerCase().indexOf('deferred out') > -1) {
        sortRank+='E';
      } else {
        sortRank+='G';
      }

      return sortRank;
    }    



  	graphService.examFullTypeList = [{
      name: "ERP",
      value: "ERP",
      type: "ERP",
      number: "Full",
      label: "ERP Exam Part Full",
      color: util.GREEN1
    }, {
      name: "ERP I",
      value: "ERP Exam Part I",
      type: "ERP",
      number: "I",
      label: "ERP Exam Part I",
      color: util.GREEN2
    }, {
      name: "ERP II",
      value: "ERP Exam Part II",
      type: "ERP",
      number: "II",
      label: "ERP Exam Part II",
      color: util.GREEN3       
    }, {
      name: "ERP All",
      value: "ERP, ERP Exam Part I, ERP Exam Part II",
      type: "ERP",
      number: "Full,I,II",
      color: util.GREEN1          
    }, {
      name: "FRM",
      value: "FRM",
      type: "FRM",
      number: "Full",
      label: "FRM Exam Part Full",
      color: util.BLUE1
    }, {
      name: "FRM I",
      value: "FRM Part 1",
      type: "FRM",
      number: "I",
      label: "FRM Exam Part I",
      color: util.BLUE2
    }, {
      name: "FRM II",
      value: "FRM Part 2",
      type: "FRM",
      number: "II",
      label: "FRM Exam Part II",
      color: util.BLUE3
    }, {
      name: "FRM All",
      value: "FRM Part 1,FRM Part 2",
      type: "FRM",
      number: "Full,I,II",
      color: util.BLUE1
    }, {
      name: "All",
      value: "FRM Part 1,FRM Part 2,ERP, ERP Exam Part I, ERP Exam Part II",
      type: "FRM,ERP",
      number: "Full,I,II",
      color: util.BLUE1
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