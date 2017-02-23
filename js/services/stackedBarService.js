var reportsGARPServices = angular.module('reportsGARP.services')  //gets

reportsGARPServices.factory('stackedBarService', [
  function(){

  	var stackedBarService = {
      searchType: null,
      searchText: null,
      industries: null
    };

    stackedBarService.processData = function(reportData, aggregatesIndex) {

	    var sdata = [];
	    var labels = [];

	    var returnObj = {
	    	labels: labels,
	    	sdata: sdata
	    }

	    _.each(reportData.groupingsDown.groupings, function(level1) {
	      var value = getValueZero(reportData.factMap[level1.key + '!T'].aggregates[aggregatesIndex].value);
	      var dataObj = {
	        name: level1.label,
	        data: [],
	        total: value
	      }
	      sdata.push(dataObj);
	      if(defined(level1,"groupings")) {
	        _.each(level1.groupings, function(level2) {
	          var value = getValueZero(reportData.factMap[level2.key + '!T'].aggregates[aggregatesIndex].value);
	          dataObj.data.push(value);
	          addDistinct(labels, level2.label);
	        });
	      }
	    });
	    return returnObj;
    }


    stackedBarService.computeBarSortRank = function(label) {
      var sortRank='';

      if(label.toLowerCase().indexOf('erp') > -1) {
        sortRank+='A';
      } else {
        sortRank+='B';
      }

      if(label.toLowerCase().indexOf('full') > -1 ) {
           sortRank+='A'
      } else if(label.toLowerCase().indexOf('part 2') > -1 || label.toLowerCase().indexOf('part ii') > -1) {
        sortRank+='B'
      } else if(label.toLowerCase().indexOf('part 1') > -1 || label.toLowerCase().indexOf('part i') > -1) {
        sortRank+='C'
      } else {
        sortRank+='D'
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

      if(label.toLowerCase().indexOf('deferred out') > -1) {
        sortRank+='A';
      } else if(label.toLowerCase().indexOf('late') > -1) {
        sortRank+='B';
      } else if(label.toLowerCase().indexOf('standard') > -1) {
        sortRank+='C';
      } else if(label.toLowerCase().indexOf('early') > -1) {
        sortRank+='D';
      } else if(label.toLowerCase().indexOf('deferred in') > -1) {
        sortRank+='E';
      } else {
        sortRank+='F';
      }

      return sortRank;
    }    


    stackedBarService.drawGraph = function(sortedData, colors, labels, reportName, xaxisLabel, yaxisLabel, showSubTotals) {
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
	        align: 'left',
	        x: 30,
	        text: reportName
	      },
	      xAxis: {
	        categories: labels,
	        title: {
	          text: xaxisLabel
	        }
	      },
	      yAxis: {
	        min: 0,
	        title: {
	          text: yaxisLabel
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
	        y: 0,
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
	      series: sortedData
	    });
    }


    return stackedBarService;

}]);