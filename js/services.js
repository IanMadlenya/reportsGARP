angular.module('reportsGARP.services', []); //instantiates
var reportsGARPServices = angular.module('reportsGARP.services') //gets

reportsGARPServices.factory('utilitiyService', [
 function(){

		var utilitiyService = {};

    utilitiyService.spinnerOptions = {
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

    // Dark to Light
    utilitiyService.BLUE1 = '#ccf1ff';
    utilitiyService.BLUE2 = '#4dccff';
    utilitiyService.BLUE3 = '#00a0dd';

    utilitiyService.blueColors = [
      '#e6f8ff',
      '#ccf1ff',
      '#b3e9ff',
      '#99e2ff',
      '#80dbff',
      '#66d4ff',
      '#4dccff',
      '#33c5ff',
      '#1abeff',
      '#00b7ff',
      '#00a4e6',
      '#00a0dd',
      '#0092cc',
      '#0080b3',
      '#006e99',
      '#005b80',
      '#004966',
      '#00374d'
    ];

    utilitiyService.greenColors = [
      '#eafbf9',
      '#d4f7f2',
      '#bff2ec',
      '#aaeee5',
      '#95eadf',
      '#7fe6d8',
      '#6ae2d2',
      '#55ddcb',
      '#3fd9c5',
      '#2ad5be',
      '#29ceb7',
      '#26c0ab',
      '#22aa98',
      '#1d9585',
      '#198072',
      '#156a5f',
      '#11554c',
      '#0d4039'
    ]


    // Dark to Light
    utilitiyService.GREEN1 = '#95eadf';
    utilitiyService.GREEN2 = '#3fd9c5';
    utilitiyService.GREEN3 = '#22aa98';    

    utilitiyService.defined = function(ref, strNames) {
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

    utilitiyService.addYearTotals = function(totals, country, year, value) {
      var found = false;
      if(!defined(totals,country)) {
        totals[country] = {};
        totals[country][year] = value;
      } else {
        if(defined(totals,country + '.' + year)) {
          found = true;
          if(value != null)
            totals[country][year] = value;
        }
        else totals[country][year] = value;
      }
      return found;
    }

    utilitiyService.calcPercentGrowth = function(startVal, endVal) {
      var val = null;
      if(startVal != 0)
        val = this.round(((endVal - startVal)/startVal)*100,1);
      return val;
      //return val.toString() + '%';
    }

    utilitiyService.calcAnnualPercentGrowth = function(startVal, endVal, range) {
      var val = null;
      if(startVal != 0 && range != 0)
        val = this.round((Math.pow((endVal/startVal), (1/range)) - 1) * 100,1);
      return val;
      //return val.toString() + '%';
    }

    utilitiyService.addDistinct = function(array, value) {
      var fnd = _.indexOf(array, value);
      if(fnd == -1)
        array.push(value);
    }

    utilitiyService.getValueZero = function(value) {
      if(defined(value))
        return value;
      else return 0;
    }

    utilitiyService.formatDate = function(epoch, format) {
      if(epoch !== null && typeof epoch !== "undefined") {
        //var mdate = moment.tz(epoch,'GMT');
        var mdate = moment(epoch);
        return mdate.format(format);
      } else {
        return "";
      }
    }
        
    utilitiyService.formatAmountDisplay = function(amount) {
      if(!this.defined(amount)) {
        amount=0;
      }
      return parseFloat(Math.round(amount * 100) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    utilitiyService.findInArray = function(dataArray, findProp1, findValue) {
      if(defined(dataArray,"length")) {
        for(var i=0; i<dataArray.length; i++) {
          var dat = dataArray[i];
          if(defined(dat,findProp1) && dat[findProp1] == findValue) {
            return dat;       
          }
        }
      }
      return null;
    }

    utilitiyService.addTotal = function(arrayObj, prop, key, value) {
      var fnd = this.findInArray(arrayObj, prop, key);
      if(!defined(fnd)) {
        var obj = {};
        obj[prop] = key;
        obj.Total = value;
        arrayObj.push(obj);
      } else {
        fnd.Total += value;
      }
    }

    utilitiyService.findDeep = function(dataArray, findProp1, findProp2, findValue) {
      if(defined(dataArray,"length")) {
        for(var i=0; i<dataArray.length; i++) {
          var dat = dataArray[i];
          if(defined(dat,findProp1+'.'+findProp2)) {
            if(dat[findProp1][findProp2] == findValue)
              return dat[findProp1];       
          }
        }
      }
      return null;
    }



    utilitiyService.round = function(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }


    utilitiyService.exportToCSV = function(data, filename) {
      var blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
      if (navigator.msSaveBlob) { // IE 10+
          navigator.msSaveBlob(blob, filename);
      } else {
          var link = document.createElement("a");
          if (link.download !== undefined) { // feature detection
              // Browsers that support HTML5 download attribute
              var url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute("download", filename);
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
          }
      }
    }
    
    utilitiyService.findGrowthProp = function(obj) {
      for(var propertyName in obj) {
        if(propertyName.indexOf('%') > -1)
          return propertyName;
      }
      return null;
    }


    utilitiyService.findIndexDeep = function(arry, subProp, prop, value) {
      for (var i = 0; i < arry.length; i++) {
        var obj = arry[i];
        if(defined(obj,subProp)) {
          for(var j=0; j < obj[subProp].length; j++) {
            var subObj = obj[subProp][j];
            if(subObj[prop] == value && !defined(subObj,"used"))
              return true;
          }          
        }
      }
      return false;
    }

    utilitiyService.JSON2CSV = function(objArray, labels, quotes, colDefs, reportName) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    
        var str = '';
        var line = '';
    
        if(this.defined(reportName)) {
          str += reportName + '\r\n';
        }

        if (labels) {
            var head = array[0];
            if (quotes) {
                if(this.defined(colDefs)) {
                  _.each(colDefs, function(col) {
                    var value = col.field + "";
                    if(this.defined(col,"name"))
                      var value = col.name + "";
                    line += '"' + value.replace(/"/g, '""') + '",';
                  });
                } else {
                  for (var index in array[0]) {
                      var value = index + "";
                      line += '"' + value.replace(/"/g, '""') + '",';
                  }                  
                }

            } else {
              if(this.defined(colDefs)) {
                _.each(colDefs, function(col) {
                  line += array[0][col.field] + ',';
                });
              } else {
                for (var index in array[0]) {
                    line += index + ',';
                }                
              }
            }
    
            line = line.slice(0, -1);
            str += line + '\r\n';
        }
    
        for (var i = 0; i < array.length; i++) {
            var line = '';
    
            if (quotes) {
              if(this.defined(colDefs)) {
                _.each(colDefs, function(col) {
                  var value = array[i][col.field] + "";
                  value = value.replace('null', '');
                  line += '"' + value.replace(/"/g, '""') + '",';
                });                
              } else {
                for (var index in array[i]) {
                    var value = array[i][index] + "";
                    value = value.replace('null', '');
                    line += '"' + value.replace(/"/g, '""') + '",';
                }
              }
            } else {
              if(this.defined(colDefs)) {
                _.each(colDefs, function(col) {
                  var value = array[i][col.field];
                  value = value.replace('null', '');
                  line += value + ',';
                });                
              } else {
                for (var index in array[i]) {
                  var value = array[i][index];
                  value = value.replace('null', '');
                  line += value + ',';
                }                
              }
            }
    
            line = line.slice(0, -1);
            str += line + '\r\n';
        }
        return str;
        
    }


		return utilitiyService;

}]);	