angular.module('reportsGARP.services', []); //instantiates
var reportsGARPServices = angular.module('reportsGARP.services') //gets

reportsGARPServices.factory('utilitiyService', [
 function(){

		var utilitiyService = {};

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


    utilitiyService.JSON2CSV = function(objArray, labels, quotes, colDefs) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    
        var str = '';
        var line = '';
    
        if (labels) {
            var head = array[0];
            if (quotes) {

                if(this.defined(colDefs)) {
                  _.each(colDefs, function(col) {
                    var value = col.field + "";
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