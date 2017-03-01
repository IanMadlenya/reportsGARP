reportsGARPControllers.controller('mapCtrl', ['$scope', '$rootScope', '$timeout', 'utilitiyService', 
function($scope, $rootScope, $timeout, utilitiyService) {
  $scope.envPath = envPath;

  //$.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=world-population.json&callback=?', function (data) {

  $scope.mapData = Highcharts.geojson(Highcharts.maps['custom/world']);
  Highcharts.setOptions({
    lang: {
      thousandsSep: ','
    }
  });
  var util = utilitiyService;

  $rootScope.$on('drawMap', function(event, sdata, currentCountryType, currentMapType) {

    //var mapData = Highcharts.geojson(Highcharts.maps['custom/world']);

    var data = [];

    for (var i = 0; i < sdata.length; i++) {

      var fnd = _.findWhere($scope.mapData, {
        name: sdata[i].Country
      })

      if (defined(fnd) && sdata[i].Total > 0) {
        var obj = {
          code: fnd.properties['iso-a2'],
          name: sdata[i].Country,
          value: sdata[i].Total
        }
        data.push(obj);
      } else {
        console.log('Not Found: ' + sdata[i].Country);
      }
    }

    // Correct UK to GB in data
    $.each(data, function() {
      if (this.code === 'UK') {
        this.code = 'GB';
      }
    });
    
    var heading = 'Total Registrations By Country';
    if(util.defined(currentMapType) && currentMapType != 'Total') {
      heading = '% Growth Registrations By Country';
    }
      
    $('#containerMap').highcharts('Map', {

      lang: {
          thousandsSep: ','
      },

      chart: {
        borderWidth: 1
      },

      title: {
        text: heading
      },

      legend: {
        layout: 'horizontal',
        borderWidth: 0,
        backgroundColor: 'rgba(255,255,255,0.85)',
        floating: true,
        verticalAlign: 'top',
        y: 25
      },

      mapNavigation: {
        enabled: true
      },

      colorAxis: {
        min: 1,
        type: 'logarithmic',
        minColor: '#EEEEFF',
        maxColor: '#000022',
        stops: [
          [0, '#EFEFFF'],
          [0.67, '#4444FF'],
          [1, '#000022']
        ]
      },

      series: [{
        animation: {
          duration: 1000
        },
        data: data,
        mapData: $scope.mapData,
        joinBy: ['iso-a2', 'code'],
        dataLabels: {
          enabled: true,
          color: 'white',
          format: '{point.code}'
        },
        name: heading,
        tooltip: {
          pointFormat: '{point.name}: {point.value}'
        }
      }]
    });

  });
}]);