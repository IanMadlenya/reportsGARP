var reportsGARPServices = angular.module('reportsGARP.services')  //gets

reportsGARPServices.factory('gridService', ['$rootScope','graphService','uiGridConstants','utilitiyService','graphService',
  function($rootScope, graphService, uiGridConstants, utilitiyService, graphService){

    var gridService = {};
    var util = utilitiyService;

    gridService.processData = function(data, columnDefs, aggregatesIndex) {

      var sdata = [];
      gridService.columnDefs = columnDefs;

      for (var i = 0; i < data.groupingsDown.groupings.length; i++) {
        var group = data.groupingsDown.groupings[i];
        var val = data.factMap[group.key + '!T'].aggregates[aggregatesIndex].value;
        var country = group.label;

        country = graphService.findOtherCountry(country);

        var obj = {
          Country: country,
          Total: val
        }

        var fnd = _.findWhere(sdata, {Country: country});

        if (util.defined(group, "groupings.length")) {

          var types = _.pluck(columnDefs, "field");
          types = _.reject(types, function(obj) {
            return (obj == 'Country' || obj == 'Total');
          });

          for (var k = 0; k < types.length; k++) {
            var type = types[k];
            var fndGroup = _.findWhere(group.groupings, {
              label: type
            });
            if (util.defined(fndGroup)) {
              var g = fndGroup;
              var v = data.factMap[g.key + '!T'].aggregates[aggregatesIndex].value;
              if(util.defined(fnd)) {
                fnd[type] += v;
                fnd.Total += v;
              }
              else obj[type] = v;

            } else {
              if(!util.defined(fnd))
                obj[type] = 0;
            }
          }
        }
        if(!util.defined(fnd))
          sdata.push(obj);
      }
      return sdata;
    }

    gridService.processAsyncData = function(data, rptData) {

      var currentExamType = rptData.currentExamType;
      var currentStartExamYear = rptData.currentStartExamYear;
      var currentEndExamYear = rptData.currentEndExamYear;
      var combo = rptData.combineExams;
      var aggregatesIndex = rptData.aggregatesIndex;

      var allSData = {};
      var allSDataParts = {};
      var sdata = [];
      var colDefNumberDefaults = {
        type:'number',
        cellFilter: 'numberToLocalFilter',
        sortingAlgorithm:graphService.sortingAlgorithm, 
        enableFiltering: false
      }

      var colDefPercentDefaults = {
        type:'number',
        cellFilter: 'numberToLocalFilter',
        sortingAlgorithm:graphService.sortingAlgorithm, 
        enableFiltering: false,
        cellTemplate : '<div style="padding:5px"><span>{{COL_FIELD}}</span><span>%</span></div>'
      }

      gridService.columnDefs = [];
      var emptyTotals = {};

      var fndExam = _.findWhere(graphService.examFullTypeList, {value: currentExamType});
      var showTotals = ((parseInt(currentEndExamYear) - parseInt(currentStartExamYear)) || !combo);
      var showAnnualGrowth = (parseInt(currentEndExamYear) - parseInt(currentStartExamYear));

      if(!combo && fndExam != null) {

        var first=true;            
        for(var year in data.groupingsDowns) {
          if(parseInt(year) < parseInt(currentStartExamYear))
            continue;

          var parts = fndExam.value.split(',');
          for(var i=0; i<parts.length; i++) {
            var part = parts[i].trim();
            var yearTotalLable = year + ' ' + part + ' Total';
            var yearDiffLable = year  + ' ' + part + ' %Growth';
            emptyTotals[yearTotalLable] = 0;
            emptyTotals[yearDiffLable] = 0;
            if(first) {
              first=false;
              var obj = {
                field: yearTotalLable,
                displayName: yearTotalLable,
                sort: {
                  direction: uiGridConstants.DESC,
                  priority: 1
                }, 
                enableFiltering: false
              }
              gridService.columnDefs.push(_.extend(obj,colDefNumberDefaults, {rank: graphService.computeSortRankReverse(year, yearTotalLable)}));
            } else {
              gridService.columnDefs.push(_.extend({field: yearTotalLable, displayName: yearTotalLable},colDefNumberDefaults, {rank: graphService.computeSortRankReverse(year, yearTotalLable)}));
            }
            gridService.columnDefs.push(_.extend({field: yearDiffLable, displayName: yearDiffLable},colDefPercentDefaults, {rank: graphService.computeSortRankReverse(year, yearDiffLable)}));
          }
        }

      } else {

        var fndExam = _.findWhere(graphService.examFullTypeList, {value: currentExamType});

        for(var propertyName in data.groupingsDowns) {
          if(parseInt(propertyName) < parseInt(currentStartExamYear))
            continue;
          var yearTotalLable = propertyName + ' ' + fndExam.name + ' Total';
          var yearDiffLable = propertyName + ' ' + fndExam.name + ' %Growth';
          emptyTotals[yearTotalLable] = 0;
          emptyTotals[yearDiffLable] = 0;

          var sortRank='A';
          if(fndExam.name.indexOf('Part 1') > -1 || fndExam.name.indexOf('Part I') > -1)
            sortRank='B'
          gridService.columnDefs.push(_.extend({field: yearTotalLable, displayName: yearTotalLable, rank: propertyName + 'B' + sortRank},colDefNumberDefaults));
          gridService.columnDefs.push(_.extend({field: yearDiffLable, displayName: yearDiffLable, rank: propertyName + 'A' + sortRank},colDefPercentDefaults));
        }
      }
      gridService.columnDefs = _.sortBy(gridService.columnDefs, function(row) { return row.rank })
      gridService.columnDefs = gridService.columnDefs.reverse();

      var obj = {
        sort: {
          direction: uiGridConstants.DESC,
          priority: 1
        }
      }
      gridService.columnDefs[1] = _.extend(gridService.columnDefs[1], obj);


      if(showTotals) {
        gridService.columnDefs.push(_.extend({field: 'Total'},colDefNumberDefaults));
        if(showAnnualGrowth)
          gridService.columnDefs.push(_.extend({field: '%Growth Annual'},colDefPercentDefaults));                
      }
      gridService.columnDefs.unshift({ field: 'Country' });

      var yearTotals = {};
      for(var year in data.groupingsDowns) {

        var groupDown = data.groupingsDowns[year];
        var allsd = allSData[year] = [];
        var allsdPart = allSDataParts[year] = [];
        var showInfo = false;
        if(parseInt(year) >= parseInt(currentStartExamYear)) {
          showInfo = true;                          
        }

        for (var i = 0; i < groupDown.groupings.length; i++) {
          var group = groupDown.groupings[i];
          
          var country = group.label;

          if(!util.defined(rptData,"currentCountryType") || rptData.currentCountryType != 'Exam Site')
            country = graphService.findOtherCountry(country);

          var found = util.addYearTotals(yearTotals, country, year, null);

          if(!combo) {
            var parts = fndExam.value.split(',');
            for(var j=0; j<parts.length; j++) {

              var part = parts[j].trim();
              var yearTotalLable = year + ' ' + part + ' Total';
              var yearDiffLable = year + ' ' + part + ' %Growth';
              var key = country+part;

              var subgroup = _.findWhere(group.groupings, {
                label: part
              });
              var val = 0;
              if (util.defined(subgroup, "key")) {
                var val = data.factMaps[year][subgroup.key + '!T'].aggregates[aggregatesIndex].value;
              }
              util.addTotal(allsd, 'Country', country, val);
              util.addTotal(allsdPart, 'Country', key, val);

              if (showInfo) {

                var sDataObj = graphService.addsData(sdata, country, val, emptyTotals, yearTotalLable);

                var lastYear = parseInt(year) - 1;
                var fnd = _.findWhere(allSDataParts[lastYear], {
                  Country: key
                });
                if (util.defined(subgroup, "key")) {

                  if (fnd != null) {
                    sDataObj[yearDiffLable] = util.calcPercentGrowth(fnd.Total, sDataObj[yearTotalLable]);
                  } else {
                    sDataObj[yearDiffLable] = null;
                  }

                } else {

                  if (fnd != null) {
                    if (fnd.Total > 0)
                      sDataObj[yearDiffLable] = -100;
                    else sDataObj[yearDiffLable] = 0;
                  } else {
                    sDataObj[yearDiffLable] = null;
                  }

                }
              }
            }
            var fnd = _.findWhere(allsd, {Country: country});
            if(util.defined(fnd))
              util.addYearTotals(yearTotals, country, year, fnd.Total);                
            
          } else {
            var fndExam = _.findWhere(graphService.examFullTypeList, {value: currentExamType});
            var yearTotalLable = year + ' ' + fndExam.name + ' Total';
            var yearDiffLable = year + ' ' + fndExam.name + ' %Growth';

            var val = 0;
            if(util.defined(data,"factMaps." + year + "." + group.key + '!T')) {
              val = data.factMaps[year][group.key + '!T'].aggregates[aggregatesIndex].value;
            }
            util.addTotal(allsd, 'Country', country, val);

            if(showInfo) {
              var sDataObj = graphService.addsData(sdata, country, val, emptyTotals, yearTotalLable);

              var lastYear = parseInt(year)-1;
              var fnd = _.findWhere(allSData[lastYear], {Country: country});

              if(util.defined(data,"factMaps." + year + "." + group.key + '!T')) {

                if(fnd != null) {
                  sDataObj[yearDiffLable] = util.calcPercentGrowth(fnd.Total, sDataObj[yearTotalLable]);
                } else {
                  sDataObj[yearDiffLable] = null;
                }    
              } else {
                if(fnd != null) {
                  if(fnd.Total > 0)
                    sDataObj[yearDiffLable] = -100;
                  else sDataObj[yearDiffLable] = 0;

                } else {
                  sDataObj[yearDiffLable] = null;
                }                
              }
            }
            var fnd = _.findWhere(allsd, {Country: country});
            if(util.defined(fnd))
              util.addYearTotals(yearTotals, country, year, fnd.Total);
          }
        }
      }
      // compute Annual % Growth 
      var startYear = parseInt(currentStartExamYear);
      var endYear = parseInt(currentEndExamYear);
      if(startYear == endYear) {
        for(var country in yearTotals) {
          var fnd = _.findWhere(sdata, {Country: country});
          if(util.defined(fnd)) {
            var prop = util.findGrowthProp(fnd);
            if(util.defined(prop))
              fnd['%Growth Annual'] = fnd[prop];
          }
        }     
      } else {
        var range = endYear - startYear;
        for(var country in yearTotals) {
          var startVal = 0;
          if(util.defined(yearTotals,country+"."+startYear)) {
            startVal=yearTotals[country][startYear];
          }
          var endValue = 0;
          if(util.defined(yearTotals,country+"."+endYear)) {
            endValue=yearTotals[country][endYear];
          }
          if(startVal != 0) {
            var agr = util.calcAnnualPercentGrowth(startVal, endValue, range);
            yearTotals[country].agr = agr;
          }
        }
        for(var country in yearTotals) {
          var fnd = _.findWhere(sdata, {Country: country});
          if(util.defined(fnd)) {
            fnd['%Growth Annual'] = yearTotals[country].agr;
          }
        }            
      }
      return sdata;
    }


    gridService.drawCountryTable = function(sdata, columnDefs, currentCountryType, currentMapType) {

      if(currentCountryType == 'Exam Site') {
        var mapData = [];

        _.each(sdata, function(row) {                

          var country = graphService.findOtherCountry(row.Country);

          var fnd = _.findWhere(mapData, {Country: country});
          if(fnd == null) {
            if(currentMapType == 'Total') {
              mapData.push({Country: country, Total: row.Total});
            } else {
              mapData.push({Country: country, Total: row['%Growth Annual']});
            }
          } else {
            if(currentMapType == 'Total') {
              fnd.Total += row.Total;
            } else {
              fnd.Total += row['%Growth Annual'];
            }
          }
        });
        $rootScope.$broadcast('drawMap', mapData, currentCountryType, currentMapType);

      } else {

        if(currentMapType == 'Total') {
          $rootScope.$broadcast('drawMap', sdata, currentCountryType, currentMapType);  
        } else {
          var mapData = [];
          _.each(sdata, function(row) {
            mapData.push({Country: row.Country, Total: row['%Growth Annual']});
          });
          $rootScope.$broadcast('drawMap', mapData, currentCountryType, currentMapType);  
        }

      }      

    }

    return gridService;

}]);