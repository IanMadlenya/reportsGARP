var reportsGARPServices = angular.module('reportsGARP.services')  //gets
reportsGARPServices.factory('stackedLineService', ['utilitiyService',
  function(utilitiyService){

    var stackedLineService = {};
    var util = utilitiyService;

    stackedLineService.processData = function(data,cumlative,aggregatesIndex) {

      var sdata = [];
      var labels = [];
      var series = [];
      for(var year in data.groupingsDowns) {
        var groupings = data.groupingsDowns[year].groupings;
        for (var i = 0; i < groupings.length; i++) {
          for(j=0; j<groupings[i].groupings.length; j++) {
            var lab = groupings[i].groupings[j].label;
            var fnd = _.findWhere(series, {name: lab});
            if(!util.defined(fnd)) {
              var obj = {
                year: year,
                name: lab
              }
              series.push(obj);
            }
          }
          var l = _.pluck(groupings, "label");
          labels = _.union(labels, l);
        }
      }

      var uniqueNames = [];
      $.each(labels, function(i, el){
          if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
      });
      labels = _.sortBy(uniqueNames, function(obj){ 
        return moment(obj).unix();
      });
      // create labels by calendar
      var currDate = moment(labels[0]);
      var lastDate = moment(labels[labels.length-1]);
      var done = false;
      var newLables = [];
      while(!done) {
        var dt = currDate.format("M/D/YYYY");
        newLables.push(dt);
        if(currDate.diff(lastDate) == 0) {
          done = true;
        } else {
          currDate.add(1,'days');
        }
      }
      labels = newLables;

      var erpSeriesLength=0;
      var frmSeriesLength=0;
      var usedColor = [];

      _.each(series, function(s) {
        var examType = (s.name.toUpperCase().indexOf('FRM') > -1) ? 'frm' : 'erp';
        var key = s.name.replace(/(May|Nov|Part 1|Part 2|Part II|Part I|\s)/g,'');
        var fnd = _.findWhere(usedColor, {key: key})
        if(!util.defined(fnd)) {
          var obj = {
            key: key
          }
          usedColor.push(obj);

          if(examType == 'frm')
            frmSeriesLength++;
          else erpSeriesLength++;
        }         
      });

      var erpCount=0;
      var frmCount=0;
      for (var i = 0; i < series.length; i++) {
        var examType = (series[i].name.toUpperCase().indexOf('FRM') > -1) ? 'frm' : 'erp';
        var colors;
        var color;
        var counter;
        var lengthNum;
        if(examType == 'erp') {
          lengthNum = erpSeriesLength;
          colors = util.greenColors;
        } else {
          lengthNum = frmSeriesLength;
          colors = util.blueColors;
        }
        
        var key = series[i].name.replace(/(May|Nov|Part 1|Part 2|Part II|Part I|\s)/g,'');
        var fnd = _.findWhere(usedColor, {key: key})
        if(!util.defined(fnd,"color")) {
          if(examType == 'frm') {
            frmCount++;
            counter = frmCount;
          } else {
            erpCount++;
            counter = erpCount;
          }
          var inc = Math.floor(colors.length/lengthNum);
          var start = colors.length - (inc * lengthNum);
          var index = (counter * inc) + start;
          color = colors[index-1];
          fnd.color = color;
        } else {
          color = fnd.color;
        }
          
        var obj = {
          name: series[i].name,
          data: [],
          last: null,
          lineWidth: 4,
          marker: {
            radius: 4
          },
          year: series[i].year,
          color: color
        }
        sdata.push(obj);
      }

      // clear last
      _.each(sdata, function(sd) {
        if(util.defined(sd,"last"))
          sd.last=null;
      });

      _.each(data.groupingsDowns, function(gd) {
          _.each(gd.groupings, function(gdg) {
              _.each(gdg.groupings, function(g) {
                 g.used=null; 
              });
          });
      });


      // for each sdata
      for (var i = 0; i < sdata.length; i++) {
        var sd = sdata[i];
        var year = sd.year;
        var groupingsDown = data.groupingsDowns[year].groupings;

        // var grps = _.pluck(groupingsDown, 'groupings')
        // grps = _.flatten(grps);
        //var lastGrp = findIndexDeep(groupingsDown, 'groupings', 'label', sd.name);

        // for each label
        var lastFound = false;
        for(var j=0; j<labels.length; j++) {
          var label = labels[j];
          var fndGrouping = _.findWhere(groupingsDown, {label: label});
          if(util.defined(fndGrouping)) {
            var lastFndGRp = _.findIndex(fndGrouping.groupings, {label: sd.name});
            var fndGroupingByName = _.findWhere(fndGrouping.groupings, {label: sd.name});
            if(util.defined(fndGroupingByName)) {
              fndGroupingByName.used = true;
              var key = fndGroupingByName.key;
              var val = data.factMaps[year][key + '!T'].aggregates[aggregatesIndex].value;

              if (cumlative == true) {
                if(sd.last != null)
                  val = sd.last + val;
                sd.last = val;
                sd.data.push(val);
              } else {
                sd.data.push(val);
              }

            } else {
              if(lastFound == true)
                continue;

              var fnd = util.findIndexDeep(groupingsDown, 'groupings', 'label', sd.name);
              if(fnd == false) {
                  lastFound == true;
              } else {                  
                if(sd.last != null)
                  sd.data.push(sd.last);
                else sd.data.push(null);
              }
            }
          } else {
            if(lastFound == true)
              continue;

            var fnd = util.findIndexDeep(groupingsDown, 'groupings', 'label', sd.name);
            if(fnd == false) {
                lastFound == true;
            } else {
              if(sd.last != null)
                sd.data.push(sd.last);
              else sd.data.push(null);                
            }
          }
        }
      }

      var retObj = {
        sdata: sdata,
        labels: labels
      }
      return retObj;

    }

    stackedLineService.drawGraph = function(sdata, name, labels, xaxisLabel, yaxisLabel) {

      $('#container').highcharts({

        exporting: {
          sourceWidth: 1200,
          sourceHeight: 800,
          scale: 1
        },

        // Edit chart spacing
        chart: {
          spacingBottom: 15,
          spacingTop: 10,
          spacingLeft: 10,
          spacingRight: 10,

          // Explicitly tell the width and height of a chart
          //width: null,
          //height: 900,
        },

        title: {
          text: name
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
          title: {
              text: xaxisLabel
          },
          categories: labels
        },

        yAxis: [{ // left y axis
          title: {
            text: yaxisLabel
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
          crosshairs: true,
          seriesData: sdata,
          formatter: function(info, index) {
            var tip = "";
            tip += this.x + '<br>';
            for(var i=0; i<this.points.length; i++) {
              var point = this.points[i];
              tip += '<tspan style="fill:' + point.color + '" x="8" dy="15">●</tspan> <span>'+ point.series.name +' : <b>'+ point.y.toLocaleString() + '</b>';
              var seriesData = _.findWhere(info.options.seriesData, {name: point.series.name});
              if(seriesData != null && point.point.index > 0) {
                var lastPoint = seriesData.data[point.point.index-1];
                var growth = ((point.y - lastPoint)/lastPoint)*100;
                var multiplier = Math.pow(10, 1 || 0);
                var perc = Math.round(growth * multiplier) / multiplier;
                if(perc < 0) {
                  tip += ' <span color:red>(' + perc.toLocaleString() + '%)</span>';
                } else {
                  tip += ' (' + perc.toLocaleString() + '%)';
                }
                
              }              
              tip +='<span><br>';
            }
            return tip;                  
          }
        },
        plotOptions: {
          series: {
            cursor: 'pointer',
            point: {
              events: {
                click: function(e) {
                  hs.htmlExpand(null, {
                    pageOrigin: {
                      x: e.pageX || e.clientX,
                      y: e.pageY || e.clientY
                    },
                    headingText: this.series.name,
                    maincontentText: this.series.data[this.x].category + ':<br/> ' +
                      this.y + ' Registrations',
                    width: 200
                  });
                }
              }
            },
            marker: {
              enabled: false,
              lineWidth: 1
            }
          }
        },
        series: sdata
      });
    }

    return stackedLineService;
}]);
