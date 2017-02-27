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
          // May 2010 FRM Part I
          var group = _.findWhere(reportData.groupingsDown.groupings, {label: exam});
          _.each(sdata, function(part) {
            // Deferred In
            var fnd = _.findWhere(group.groupings, {label: part.name});
          	var obj = {
          		y: 0,
          		myData : 0
          	}            
            if(defined(fnd)) {
            	var da = reportData.factMap[fnd.key + '!T'].aggregates[aggregatesIndex].value;
            	if (da != null) {
            		obj.y = da;
            	}
            }
            part.data.push(obj);
          });
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

  Highcharts.setOptions({
    lang: {
      thousandsSep: ','
    }
  });

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
				qTotals: sortedData,
				enabled: true,
				style: {
					color: (Highcharts.theme && Highcharts.theme.textColor) || 'black',
					textOutline: false
				},
				y: -20,
	      formatter: function() {
	      	var total = this.total;
	      	if(this.x > 0) {
	      		var lastTotal = 0;
	      		var x = this.x;
	      		_.each(this.options.qTotals, function(dat) {
	      			lastTotal+=dat.data[x-1].y;
	      		});
	      		var growth = ((total - lastTotal)/lastTotal)*100;
	      		var multiplier = Math.pow(10, 1 || 0);
        		var perc = Math.round(growth * multiplier) / multiplier;
        		if(perc < 0) {
        			total = total.toLocaleString() + '<br><span style="color:red"> ('+ perc.toLocaleString() + '%)</span>';
        		} else {
        			total = total.toLocaleString() + '<br> ('+ perc.toLocaleString() + '%)';	
        		}
	      		
	      	}
	        return  total;
	      }
			}
		},
		legend: {
			align: 'right',
			x: -30,
			verticalAlign: 'top',
			y: 20,
			floating: true,
			backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
			borderColor: '#CCC',
			borderWidth: 1,
			textOutline: false
		},
		tooltip: {
			formatter: function() {
	  		var part = (this.y/this.total)*100;
	  		var multiplier = Math.pow(10, 1 || 0);
	  		var perc = Math.round(part * multiplier) / multiplier;
				return '<b>' + this.x.toLocaleString() + '</b><br/>' +
				this.series.name + ': ' + this.y.toLocaleString() + ' (' + perc.toLocaleString() + '%)<br/>' +
				'Total: ' + this.point.stackTotal;
			}
		},
		plotOptions: {
			column: {
				stacking: 'normal',
				dataLabels: {
					enabled: showSubTotals,
					style: {
						color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'black',
						textOutline: false
					},
					formatter: function() {
						if(this.y > 0 && this.y != this.total)
	        		return this.y.toLocaleString()
	        	else return null;
	      	}
				}
			}
		},
		series: sortedData
	});
}


return stackedBarService;

}]);