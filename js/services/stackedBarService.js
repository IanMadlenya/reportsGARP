var reportsGARPServices = angular.module('reportsGARP.services')  //gets

reportsGARPServices.factory('stackedBarService', ['utilitiyService',
	function(utilitiyService){

		var stackedBarService = {};
		var util = utilitiyService;

		stackedBarService.processData = function(reportData, aggregatesIndex, reportName) {

			var sdata = [];
			var labels = [];

			var returnObj = {
				labels: labels,
				sdata: sdata
			}

			_.each(reportData.groupingsDown.groupings, function(level1) {
				var value = util.getValueZero(reportData.factMap[level1.key + '!T'].aggregates[aggregatesIndex].value);
				var dataObj = {
					name: level1.label,
					data: [],
					total: value
				}
				sdata.push(dataObj);
				if(defined(level1,"groupings")) {
					_.each(level1.groupings, function(level2) {
						var value = util.getValueZero(reportData.factMap[level2.key + '!T'].aggregates[aggregatesIndex].value);
						dataObj.data.push(value);
						util.addDistinct(labels, level2.label);
					});
				}
			});
			return returnObj;
		}


		stackedBarService.processDataInverted = function(reportData, aggregatesIndex, reportName) {

			var sdata = [];
			var labels = _.pluck(reportData.groupingsDown.groupings, "label");

			var computeBarSortRank = this.computeBarSortRank;
			if(reportName == 'Exam Registrations By Type By Year') {
				var labels = _.sortBy(labels, function(row, computeBarSortRank) { 
					return this(row) 
				}, computeBarSortRank.bind());
			} else {
				var labels = _.sortBy(labels, function(row, computeBarSortRank) { 
					return this(row) 
				}, computeBarSortRank.bind())
			}
			var sdata = [];

			_.each(labels, function(exam) {
				var group = _.findWhere(reportData.groupingsDown.groupings, {label: exam});
				if(defined(group,"groupings")) {
					_.each(group.groupings, function(part) {
						var sd = _.findWhere(sdata, {
							name: part.label
						});
						if (sd == null) {
							var obj = {
								name: part.label,
								data: []
							}
							sdata.push(obj);
						}
					})
				}
			});

			_.each(labels, function(exam) {
        var group = _.findWhere(reportData.groupingsDown.groupings, {label: exam});
        var lastSmall = false;
        var yOffSet = 0;
        for(var i=0; i<sdata.length; i++) {
        	var part = sdata[i];
          var fnd = _.findWhere(group.groupings, {label: part.name});
					var obj = {
          	y: 0
          }          
          if(defined(fnd)) {
          	var da = reportData.factMap[fnd.key + '!T'].aggregates[aggregatesIndex].value;
          	if (da != null) {
          		obj.y = da;
	          	if(da < 1000) {
	          		if(lastSmall)
	          			yOffSet-=5;
	          		//obj.dataLabels = { x: 32, y: yOffSet } -- Try to move to right if small - off for now
	          		lastSmall = true;
	          	} else {
	          		lastSmall = false;
	          	}
          	}
          }
          part.data.push(obj);
        }
      });


	    // _.each(reportData.groupingsDown.groupings, function(level1) {
	    //   var value = util.getValueZero(reportData.factMap[level1.key + '!T'].aggregates[aggregatesIndex].value);
	    //   var dataObj = {
	    //     name: level1.label,
	    //     data: [],
	    //     total: value
	    //   }
	    //   sdata.push(dataObj);
	    //   if(defined(level1,"groupings")) {
	    //     _.each(level1.groupings, function(level2) {
	    //       var value = util.getValueZero(reportData.factMap[level2.key + '!T'].aggregates[aggregatesIndex].value);
	    //       dataObj.data.push(value);
	    //       util.addDistinct(labels, level2.label);
	    //     });
	    //   }
	    // });
var returnObj = {
	labels: labels,
	sdata: sdata
}
return returnObj;
}


stackedBarService.computeBarSortRank = function(label) {
	var sortRank='';
	var match = label.match(/(1997|1998|1999|2000|2001|2002|2003|2004|2005|2006|2007|2008|2009|2010|2011|2012|2013|2014|2015|2016|2017)/g);
	if(util.defined(match,"length") && match.length > 0) {
		sortRank = match[0];
	}
	
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

	var m = label.match(/(2009|2010|2011|2012|2013|2014|2015|2016|2017|2018|2019|2020)/);
	if(m) {
		sortRank = m[0] + sortRank;
	}

	return sortRank;
}    


stackedBarService.drawGraph = function(sortedData, colors, labels, reportName, fndRpt, showSubTotals) {


	var xaxisLabel = fndRpt.xaxisLabel; 
	var yaxisLabel = fndRpt.yaxisLabel;
	
	Highcharts.setOptions({
		lang: {
			thousandsSep: ','
		}
	});

	var options = {
		colors: colors,
		exporting: {
			sourceWidth: 1200,
			sourceHeight: 800,
			scale: 1
		},
		chart: {
			type: 'column',
			marginTop:70
		},
		title: {
			align: 'left',
			x: 30,
			text: reportName,
			y: 10
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
				seriesData: sortedData,
				enabled: true,
				style: {
					color: (Highcharts.theme && Highcharts.theme.textColor) || 'black',
					textOutline: false
				}
			}
		},
		legend: {
			align: 'left',
			x: 30,
			verticalAlign: 'top',
			floating: true,
			backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
			borderColor: '#CCC',
			borderWidth: 1,
			textOutline: false,
			y: 20
		},
		tooltip: {
		},
		plotOptions: {
			column: {
				stacking: 'normal',
				dataLabels: {
					allowOverlap: false, // TO allow small subtotal - off for now
					enabled: showSubTotals,
					style: {
						color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'black',
						textOutline: false
					},
				}
			}
		},
		series: sortedData
	};

	if(util.defined(fndRpt,"totalFormatter")) {
		options.yAxis.stackLabels.formatter = fndRpt.totalFormatter;
	}
	if(util.defined(fndRpt,"totalFormatterYOffset")) {
		options.yAxis.stackLabels.y = fndRpt.totalFormatterYOffset;
	}
	if(util.defined(fndRpt,"toolTipFormatter")) {
		options.tooltip.formatter = fndRpt.toolTipFormatter;
	}
	if(util.defined(fndRpt,"subTotalFormatter")) {
		options.plotOptions.column.dataLabels.formatter = fndRpt.subTotalFormatter;
	}

	$('#container').highcharts(options);
}


return stackedBarService;

}]);