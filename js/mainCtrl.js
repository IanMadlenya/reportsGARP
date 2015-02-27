'use strict';

/* Controllers */
var reportsGARPControllers = angular.module('reportsGARPControllers', []);

reportsGARPControllers.controller('mainCtrl', ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {
}]);


reportsGARPControllers.controller('filterCtrl', ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {

  //$scope.showMore = false;
  $scope.show = true;
  $scope.filterMore = false;

  var td = moment().format("M/D/YYYY")
  var yd = moment().add(-1, 'days').format("M/D/YYYY");

  $scope.userFormVars = {
    startDate: yd,
    endDate: td,
    garp: false,
    gra: false,
    credit: false,
    charge: false,
    prods: []
  }

  $scope.$on('fetchProds', function(event, prods) {
    $scope.userFormVars.prods = jQuery.extend(true, {}, prods);
  });

  $scope.filter = function() {
    $rootScope.$broadcast('filter', $scope.userFormVars);
  }
  $scope.refresh = function() {
    $rootScope.$broadcast('refresh', $scope.userFormVars);
  }
  $scope.showMore = function() {
    $scope.filterMore = !$scope.filterMore;
  }
  $scope.download = function() {
    $rootScope.$broadcast('download', $scope.userFormVars);
  }

}]);

reportsGARPControllers.controller('dataCtrl', ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {

  var SHIP = 'SHIP';        
  $scope.shippingProductId = null;
  $scope.envPath = envPath;

  var td = moment().format("M/D/YYYY")
  var yd = moment().add(-1, 'days').format("M/D/YYYY");

  $scope.formVars = {
    startDate: yd,
    endDate: td,
    garp: false,
    gra: false,
    credit: false,
    charge: false,    
    prods: []
  }
  //$scope.spinner=null;
  //$timeout(function () {
  //  var obj = $('#spin')
  //  $scope.spinner = new Spinner(spinnerOptions).spin(obj[0]);
  //}, 300);

  function doneAddingToDom() {
    if(defined($scope,"spinner"))
      $scope.spinner.stop();    
  }
  function startSpinner() {
    var selector = '#spin';
    var obj = $(selector)
    if(defined(obj,"length") && obj.length > 0) {
      $scope.spinner = new Spinner(spinnerOptions).spin(obj[0]);
    }   
  }
  $scope.$on('allRendered', doneAddingToDom);


  $scope.$on('filter', function(event, params) {
    $scope.formVars = jQuery.extend(true, {}, params);
  });
  $scope.$on('refresh', function(event, params) {
    $scope.formVars = jQuery.extend(true, {}, params);
    init();
  });
  $scope.$on('download', function(event, params) {
    $scope.formVars = jQuery.extend(true, {}, params);
    $scope.export();
  });

  function init() {

    $timeout(function () {
      startSpinner();
    },300);

    console.log('Init');

    reportsGARPServices.getProducts(function(err, data) {

      $scope.prods = data.result;
      if($scope.formVars.prods.length == 0) {
        for(var i=0; i<$scope.prods.length; i++) {
          var obj = {
            id: $scope.prods[i].Id,
            name: $scope.prods[i].Name,
            checked: false
          }
          $scope.formVars.prods.push(obj);

          if($scope.prods[i].Product2.ProductCode == SHIP)
            $scope.shippingProductId = $scope.prods[i].Id
        }
      }

      $scope.totals = [];
      $scope.total = 0;

      var sdt = moment.tz($scope.formVars.startDate,'America/New_York').unix();
      var edt = moment.tz($scope.formVars.endDate,'America/New_York').unix();


      //reportsGARPServices.getTransactions(sdt, edt, function(err, data) {

        //$scope.transactions = data.result;

        reportsGARPServices.getRefunds(sdt, edt, function(err, data) {

          $scope.refundData = data.result;

          reportsGARPServices.getOpplines(sdt, edt, function(err, data) {
              

              console.log('Init - doneGet');

              if(defined(data,"result.opps"))
                $scope.opps = data.result.opps;
              if(defined(data,"result.trans"))
                $scope.transactions = data.result.trans;

              if(defined($scope,"opps.length")) {
                var oppLines = [];
                for(var i=0; i<$scope.opps.length; i++) {
                  var opp = $scope.opps[i];

                  if(defined(opp,"Display_Invoice_Number__c"))
                    opp.invoiceNumber = opp.Display_Invoice_Number__c;

                  if(defined(opp,"CloseDate"))
                    opp.closeDate = opp.CloseDate;

                  if(defined(opp,"Amount"))
                    opp.amount = opp.Amount;

                }

                for(var i=0; i<$scope.refundData.refunds.length; i++) {
                  var refund = $scope.refundData.refunds[i];
                  var opp = _.findWhere($scope.refundData.opps, {Id: refund.Opportunity__c});
                  var prod = _.findWhere($scope.prods, {Product2Id: refund.Product__c});
                  var trans = _.findWhere($scope.refundData.trans, {Id: refund.Payment_Transaction__c});
                  var fnd = null;

                  if(!defined(opp) || !defined(prod) || !defined(trans))
                    continue;

                  if(defined(trans,"ChargentSFA__Tokenization__c")) {
                    fnd = _.findWhere($scope.opps, {isRefund: true, transId: trans.ChargentSFA__Tokenization__c})
                  } else {
                    var trans = {};
                    trans.ChargentSFA__Tokenization__c = null;
                  }
                    
                  if(defined(fnd)) {
                    fnd.amount += refund.Refund_amount__c;
                    fnd.refunds.push(refund);
                  } else {
                    var obj = {
                      isRefund: true,
                      refunds: [refund],
                      opp: opp,
                      trans: trans,
                      transId: trans.ChargentSFA__Tokenization__c,
                      closeDate: refund.CreatedDate,
                      amount: refund.Refund_amount__c
                    }
                    $scope.opps.push(obj);
                  }
                }
              }

              $rootScope.$apply(function(){
                $scope.opps = _.sortBy($scope.opps, function(obj){ return obj.closeDate; });
                if(defined($scope,"prods.length")) {
                  $scope.prods = _.sortBy($scope.prods, function(obj){ return obj.Name; });
                  $rootScope.$broadcast('fetchProds', $scope.formVars.prods);
                }                  
              });
          });
        });
      //});
    });
  }
  init();

  $scope.displayId = function(opp) {
    if(defined(opp,"isRefund") && opp.isRefund) {
      return opp.opp.Display_Invoice_Number__c;
    } else {
      return opp.Display_Invoice_Number__c;
    }
  }

  $scope.displayOpp = function(opp, prop) {
    if(defined(opp,"isRefund") && opp.isRefund) {
      if(defined(opp,'opp.'+prop))
      return opp.opp[prop];
    } else {
      return opp[prop];
    }
  }

  $scope.getTransaction = function(opp,prop) {
    
    if(defined(opp,"isRefund") && opp.isRefund) {
      if(prop == "ChargentSFA__Type__c")
        return 'Credit';
      if(defined(opp,'trans.'+prop))
        return opp.refunds[0].Payment_Transaction__r.ChargentSFA__Tokenization__c;
      else return null;
    } else {
      var fnd=_.findWhere($scope.transactions, {ChargentSFA__Opportunity__c: opp.Id})    
      if(defined(fnd,prop))
          return fnd[prop];
      else return null;
    }
  }


  $scope.getOppTotals = function() {

    if(!defined($scope,"opps.length"))
      return 0;

    var total=0;
    for(var j=0; j<$scope.opps.length; j++) {  
      var opp = $scope.opps[j];    
      var func = $scope.filterMatch();
      if(func(opp)) {
        if(defined(opp,"amount") && typeof opp.amount == "number")
          if(defined(opp,"isRefund") && opp.isRefund)
            total-=opp.amount;
          else total+=opp.amount;
      }
    }
    return total;
  }

  $scope.getProdTotals = function(prodId) {

    if(!defined($scope,"opps.length"))
      return 0;

    var total=0;
    for(var j=0; j<$scope.opps.length; j++) {  
      var opp = $scope.opps[j];    
      var func = $scope.filterMatch();
      if(func(opp)) {
        var prod=_.findWhere($scope.prods, {Id: prodId})
        var func = $scope.criteriaMatch();
        if(defined(prod) && func(prod)) {
          total+=$scope.getProductAmount(opp, prodId);
        }        
      }
    }
    return total;
  }


  $scope.getProductAmountShipping = function(opp, prodId) {

    if(!defined(opp,"OpportunityLineItems.length"))
      return 0;

    if(defined(opp,"isRefund") && opp.opp) {
       return 0;
    }

    var match = _.findWhere(opp.OpportunityLineItems, {PricebookEntryId: prodId});

    if(opp.Display_Invoice_Number__c == 'W381601') {
      console.log('hu');
    }

    var match = _.findWhere(opp.OpportunityLineItems, {PricebookEntryId: prodId});
    if(!defined(match))
      return 0;

    var fndProd=_.findWhere($scope.prods, {Id: prodId})

    var totalWeight = 0;
    var shippingCost = 0;
    var bought=false;
    for(var j=0; j<opp.OpportunityLineItems.length; j++) {
      var oppLine = opp.OpportunityLineItems[j];
      var fnd=_.findWhere($scope.prods, {Id: oppLine.PricebookEntryId})
      if(defined(fnd,"Product2.Weight__c") && fnd.Product2.Weight__c > 0)
        totalWeight+=fnd.Product2.Weight__c;

      if(oppLine.PricebookEntryId == $scope.shippingProductId) {
        shippingCost = oppLine.TotalPrice;
      }

      if(oppLine.PricebookEntryId == prodId)
        bought=true
    }        
    if(defined(fndProd,"Product2.Weight__c") && fndProd.Product2.Weight__c > 0 && shippingCost && totalWeight && bought) {
      var percent = fndProd.Product2.Weight__c / totalWeight;
      return shippingCost * percent;
    }
    return 0;
  }

  $scope.getProductAmount = function(opp, prodId) {

    if(defined(opp,"isRefund") && opp.isRefund) {
      
      var prod = _.findWhere($scope.prods, {Id: prodId});
      if(defined(prod)) {
        var match = _.findWhere(opp.refunds, {Product__c: prod.Product2Id});
        if(defined(match,"Refund_amount__c"))
          return -1 * match.Refund_amount__c;        
      }
      return 0;
    }

    var match = _.findWhere(opp.OpportunityLineItems, {PricebookEntryId: prodId});
    if(defined(match))
      return match.TotalPrice;
    else return 0;
  }

  $scope.formatAmountDisplay = function(str) {
    return formatAmountDisplay(str);
  }

  $scope.formatDate = function(strDate,format) {
    if(defined(strDate))
      return formatDate(strDate, format);
    else return '';
  }

  $scope.getTotal = function(PricebookEntryId) {
    var match = _.findWhere($scope.totals, {id: PricebookEntryId});
    if(defined(match))
      return match.total;
    else return 0;
  }

  $scope.getRowTotal = function(opp) {
    if(defined(opp,"isRefund") && opp.isRefund) {
      return opp.amount * -1;
    } else if(defined(opp)) {
      return opp.amount;
    } else {
      return 0;
    }
  }

  $scope.export = function() {

    var json = [{"invoiceNumber":"Invoice #","closeDate":"Close Date","amount":"Amount"}];
    for(var i=0; i<$scope.prods.length; i++) {  
      var prod = $scope.prods[i];
      var func = $scope.criteriaMatch();
      if(func(prod)) {
        json[0][prod.Product2.ProductCode+'~'+prod.Product2.GL_Code__c] = prod.Name;        
      }
    }
    for(var i=0; i<$scope.prods.length; i++) {  
      var func = $scope.criteriaMatchShip();
      var prod = $scope.prods[i];
      if(func(prod)) {
        var prod = $scope.prods[i];
        json[0][prod.Product2.ProductCode+'~'+prod.Product2.GL_Code__c+"Shipping"] = prod.Name + "Shipping";        
      }
    }

    for(var j=0; j<$scope.opps.length; j++) {  
      var opp = $scope.opps[j];

      var func = $scope.filterMatch();
      if(func(opp)) {
        var obj = {"invoiceNumber":$scope.displayId(opp),"closeDate":formatDate(opp.closeDate, "MM-DD-YYYY"),"amount":formatAmountDisplay(opp.amount)};
        for(var i=0; i<$scope.prods.length; i++) {  
          var prod = $scope.prods[i];
          var func = $scope.criteriaMatch();
          if(func(prod)) {
           obj[prod.Product2.ProductCode+'~'+prod.Product2.GL_Code__c] = $scope.getProductAmount(opp, prod.Id);
          }
        }
        for(var i=0; i<$scope.prods.length; i++) {  
          var func = $scope.criteriaMatchShip();
          var prod = $scope.prods[i];
          if(func(prod)) {
            var prod = $scope.prods[i];
            obj[prod.Product2.ProductCode+'~'+prod.Product2.GL_Code__c+"Shipping"] = $scope.getProductAmountShipping(opp, prod.Id);        
          }
        }
        json.push(obj);
      }
    }

    var csv = JSON2CSV(json);
    var fileName = 'data'
    var uri = 'data:text/csv;charset=utf-8,' + escape(csv);
    var link = document.createElement("a");    
    link.href = uri
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    //window.open("data:text/csv;charset=utf-8," + escape(csv))
  }


  $scope.criteriaMatchShip = function(value) {
    return function( item ) {   

      var fnd=_.findWhere($scope.prods, {Id: item.Id})

      if(defined(fnd,"Product2.Weight__c") && fnd.Product2.Weight__c > 0) {
        return 1;
      } else {
        return 0;
      }
    }
  }


  $scope.filterMatch = function(value) {
    return function( item ) {   

      if(defined(item.isRefund)) {

        if(item.opp.Company__c == 'GRA' && $scope.formVars.garp==true && $scope.formVars.gra==false)
          return 0;
        if(item.opp.Company__c == 'GARP' && $scope.formVars.gra==true && $scope.formVars.garp==false)
          return 0;
        if($scope.formVars.charge==true && $scope.formVars.credit==false)
          return 0;


      } else {

        if(item.Company__c == 'GRA' && $scope.formVars.garp==true && $scope.formVars.gra==false)
          return 0;
        if(item.Company__c == 'GARP' && $scope.formVars.gra==true && $scope.formVars.garp==false)
          return 0;
        if(item.ChargentSFA__Type__c == 'Credit' && $scope.formVars.charge==true && $scope.formVars.credit==false)
          return 0;
        if(item.ChargentSFA__Type__c != 'Credit' && $scope.formVars.credit==true && $scope.formVars.charge==false)
          return 0;

      }


      return 1;
    }
  }


  $scope.criteriaMatch = function(value) {
    return function( item ) {   

      var fnd=_.findWhere($scope.prods, {Id: item.Id})
      if(defined(fnd,"Product2.ProductCode") && fnd.Product2.ProductCode==SHIP)
        return 0;


      //if($scope.getTotal(item.Id) > 0) {
        var checked = _.where($scope.formVars.prods, {checked:true});

        if(item.Product2.Company__c == 'GRA' && $scope.formVars.garp==true && $scope.formVars.gra==false)
          return 0;

        if(item.Product2.Company__c == 'GARP' && $scope.formVars.gra==true && $scope.formVars.garp==false)
          return 0;

        if(defined(checked) && checked.length > 0) {
          var fnd = _.findWhere(checked, {id: item.Id});
          if(defined(fnd))
            return 1;
          else return 0;
        } else {
          return 1;  
        }
        
      //}
      //else return 0;
    }
  }
        
}]);