'use strict';

/* Controllers */
var reportsGARPControllers = angular.module('reportsGARPControllers', []);

reportsGARPControllers.controller('mainCtrl', ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {
}]);


reportsGARPControllers.controller('filterCtrl', ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {

  //$scope.showMore = false;
  $scope.show = true;
  $scope.filterMore = false;

  var td = moment().add(-1, 'days').format("M/D/YYYY");
  var yd = moment().add(-1, 'days').format("M/D/YYYY");

  $scope.userFormVars = {
    startDate: yd,
    endDate: td,
    garp: false,
    gra: false,
    refund: false,
    charge: false,
    pm_creditcard: true,
    pm_creditcardbyfax: true,
    pm_wire: false,
    pm_check: false,
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

  var td = moment().add(-1, 'days').format("M/D/YYYY");
  var yd = moment().add(-1, 'days').format("M/D/YYYY");

  $scope.formVars = {
  startDate: yd,
    endDate: td,
    garp: false,
    gra: false,
    refund: false,
    charge: false,
    pm_creditcard: true,
    pm_creditcardbyfax: true,
    pm_wire: false,
    pm_check: false,
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

    var priceBookId = '01s40000000VV15';
    reportsGARPServices.getProducts(priceBookId, function(err, data) {

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
      $scope.opps = [];
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
                var opps = data.result.opps;
              if(defined(data,"result.trans"))
                $scope.transactions = data.result.trans;

              if(defined(opps,"length")) {
                var oppLines = [];

                for(var i=0; i<opps.length; i++) {
                  var opp = opps[i];

                  if(defined(opp,"Display_Invoice_Number__c"))
                    opp.invoiceNumber = opp.Display_Invoice_Number__c;

                  if(defined(opp,"CloseDate"))
                    opp.closeDate = opp.CloseDate;

                  if(defined(opp,"Amount"))
                    opp.amount = opp.Amount;

                  var found=false;
                  var total=0;
                  if(defined(opp,"OpportunityLineItems.length")) {                  
                    for(var j=0; j<opp.OpportunityLineItems.length; j++) {
                      var oppLine = opp.OpportunityLineItems[j];
                      var fnd=_.findWhere($scope.prods, {Id: oppLine.PricebookEntryId})
                      if(defined(fnd)) {
                        found=true;
                        var match = _.findWhere($scope.totals, {id: oppLine.PricebookEntryId});
                        total+=oppLine.TotalPrice;
                        if(defined(match)) {
                          match.total += oppLine.TotalPrice;
                        } else {
                          var obj = {
                            id: oppLine.PricebookEntryId,
                            total: oppLine.TotalPrice
                          }
                          $scope.totals.push(obj);
                        }
                      }
                    }
                  }
                  if(found && total > 0) {
                    var trans = _.findWhere($scope.transactions, {ChargentSFA__Opportunity__c: opp.Id});
                    if(defined(trans)) {
                      opp.trans=trans;
                      opp.transId=trans.Id;                 
                      $scope.opps.push(opp);
                    }
                    
                  }
                }

                for(var i=0; i<$scope.refundData.refunds.length; i++) {
                  var refund = $scope.refundData.refunds[i];
                  var opp = _.findWhere($scope.refundData.opps, {Id: refund.Opportunity__c});
                  var prod = _.findWhere($scope.prods, {Product2Id: refund.Product__c});
                  var trans = _.findWhere($scope.refundData.trans, {ChargentSFA__Type__c: 'Refund', ChargentSFA__Opportunity__c: refund.Opportunity__c});
                  var fnd = null;

                  if(!defined(opp) || !defined(prod) || !defined(trans))
                    continue;

                  if(defined(trans)) {
                    fnd = _.findWhere($scope.opps, {isRefund: true, transId: trans.Id})
                  } else {
                    //var trans = {};
                    //trans.ChargentSFA__Tokenization__c = null;
                    continue;
                  }
                    
                  if(defined(fnd)) {
                    fnd.amount += refund.Refund_amount__c;
                    fnd.refunds.push(refund);
                  } else {

                    obj = opp;
                    obj.isRefund=true;
                    obj.refunds=[refund];
                    obj.trans=trans;
                    obj.transId=trans.Id;
                    obj.closeDate=refund.CreatedDate;
                    obj.amount=refund.Refund_amount__c;

                    $scope.opps.push(obj);
                  }
                }
              }
              $scope.spinner.stop();
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

  $scope.sortItems = function(fieldName) {
    $scope.opps = _.sortBy($scope.opps, function(obj){ return obj[fieldName]; });
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

    var json = [{"invoiceNumber":"Invoice #","garpId":"GARP ID","county":"Country","state":"State","payPalId":"PayPal Trans ID",
                  "type":"Type","method":"Payment Method","company":"Company","paidDate":"Paid Date","total":"Total"}];
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
    json[0].endTotal="Total";

    for(var j=0; j<$scope.opps.length; j++) {  
      var opp = $scope.opps[j];

      var func = $scope.filterMatch();
      if(func(opp)) {
        var obj = {
          "invoiceNumber":opp.Display_Invoice_Number__c,
          "garpId":opp.GARP_Member_ID__c,
          "county":opp.Shipping_Country__c,
          "state":opp.Shipping_State__c,
          "payPalId":opp.trans.ChargentSFA__Gateway_ID__c,
          "type":opp.trans.ChargentSFA__Type__c,
          "method":opp.trans.ChargentSFA__Payment_Method__c,
          "company":opp.Company__c,
          "paidDate":formatDate(opp.closeDate, "MM-DD-YYYY"),
          "total":formatAmountDisplay(opp.amount)
        };

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
        obj.endTotal = formatAmountDisplay(opp.amount);


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

      if(!defined(item,"amount") || item.amount == 0)
        return false;

      var match = false;
      if($scope.formVars.garp==false && $scope.formVars.gra==false)
        match=true;
      else if($scope.formVars.garp==true && defined(item,"Company__c") && item.Company__c == 'GARP')
         match=true;
      else if($scope.formVars.gra==true && defined(item,"Company__c") && item.Company__c == 'GRA')
         match=true;

      if(match == false)
        return match;

      match = false
      if($scope.formVars.refund==false && $scope.formVars.charge==false)
        match=true;
      else if($scope.formVars.refund==true && defined(item,"trans.ChargentSFA__Type__c") && item.trans.ChargentSFA__Type__c == 'Refund')
         match=true;
      else if($scope.formVars.charge==true && defined(item,"trans.ChargentSFA__Type__c") && item.trans.ChargentSFA__Type__c == 'Charge')
         match=true;

      if(match == false)
        return match;


      match = false;
      if($scope.formVars.pm_creditcard==false && $scope.formVars.pm_creditcardbyfax==false &&
          $scope.formVars.pm_wire==false && $scope.formVars.pm_check==false)
        match=true;
      else if($scope.formVars.pm_creditcard==true && defined(item,"trans.ChargentSFA__Payment_Method__c") && item.trans.ChargentSFA__Payment_Method__c == 'Credit Card')
         match=true;
      else if($scope.formVars.pm_creditcardbyfax==true && defined(item,"trans.ChargentSFA__Payment_Method__c") && item.trans.ChargentSFA__Payment_Method__c == 'Credit Card by Fax')
         match=true;
      else if($scope.formVars.pm_wire==true && defined(item,"trans.ChargentSFA__Payment_Method__c") && item.trans.ChargentSFA__Payment_Method__c == 'Wire Transfer')
         match=true;
      else if($scope.formVars.pm_check==true && defined(item,"trans.ChargentSFA__Payment_Method__c") && item.trans.ChargentSFA__Payment_Method__c == 'Check')
         match=true;

      return match;
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