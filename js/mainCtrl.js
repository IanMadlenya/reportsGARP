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
    nj: false,
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
    nj: false,
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

    var hostName = window.location.hostname;
    if(hostName.indexOf("c.cs16.visual.force.com") > -1) {
      // Build
      var priceBookId = '01sf00000008rTn';
    } else {
      // Prod
      var priceBookId = '01s40000000VV15';
    }


    reportsGARPServices.getProducts(priceBookId, function(err, data) {

      $scope.prods = data.result;
      if($scope.formVars.prods.length == 0) {
        for(var i=0; i<$scope.prods.length; i++) {

          //if(defined($scope.prods[i],"Product2.IsActive") && defined($scope.prods[i],"pricebook2.IsActive")) {
          //if(defined($scope.prods[i],"pricebook2.IsActive") && $scope.prods[i].pricebook2.IsActive == true && 
          //  defined($scope.prods[i],"Product2.IsActive") && $scope.prods[i].Product2.IsActive == true) {

            var obj = {
              id: $scope.prods[i].Id,
              name: $scope.prods[i].Name,
              checked: false
            }
            $scope.formVars.prods.push(obj);

            if($scope.prods[i].Product2.ProductCode == SHIP)
              $scope.shippingProductId = $scope.prods[i].Product2.Id
         // }
        }
      }

      $scope.totals = [];
      $scope.opps = [];
      $scope.total = 0;

      //var sdt = moment.tz($scope.formVars.startDate + ' 00:00:01','America/Los_Angeles').add(+3,'hours').unix();
      //var edt = moment.tz($scope.formVars.endDate + ' 23:59:59','America/Los_Angeles').add(+3,'hours').unix();
      var sdt = moment.tz($scope.formVars.startDate + ' 00:00:01','America/Los_Angeles').unix();
      var edt = moment.tz($scope.formVars.endDate + ' 23:59:59','America/Los_Angeles').unix();

      reportsGARPServices.getReportData(sdt, edt, $scope.formVars.garp, $scope.formVars.gra, $scope.formVars.nj, function(err, data) {

        if(defined(data,"result.opps"))
          $scope.oppsData = data.result.opps;

        if(defined(data,"result.trans"))
          $scope.transactions = data.result.trans;

        if(defined(data,"result.refunds"))
          $scope.refunds = data.result.refunds;

        for(var i=0; i<$scope.transactions.length; i++) {
          var trans = $scope.transactions[i];

          if(trans.ChargentSFA__Response_Status__c != 'Approved')
            continue;

          var opp = _.findWhere($scope.oppsData, {Id: trans.ChargentSFA__Opportunity__c});

          if(!defined(opp))
            continue;

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

          if(opp.Display_Invoice_Number__c == 'W969866')
            console.log('hi');

          obj = opp;
          obj.isRefund=false;
          obj.refunds=null;
          obj.trans=trans;
          obj.transId=trans.Id;
          obj.amount = opp.Amount;
          obj.closeDate = opp.CloseDate;
          if(defined(trans,"ChargentSFA__Gateway_Date__c"))
            obj.closeDate = trans.ChargentSFA__Gateway_Date__c;

          if(trans.ChargentSFA__Type__c == 'Charge') {

            if(defined(trans,"ChargentSFA__Amount__c"))
              obj.amount = trans.ChargentSFA__Amount__c;

            $scope.opps.push(obj);

          } if(trans.ChargentSFA__Type__c == 'Refund' || trans.ChargentSFA__Type__c == 'Credit') {

            var refunds = _.where($scope.refunds, {Opportunity__c: opp.Id});
            if(defined(refunds)) {
              obj.isRefund=true;
              obj.refunds = refunds;

              if(defined(trans,"ChargentSFA__Amount__c")) {
                if(trans.ChargentSFA__Amount__c >= 0)
                  obj.amount = trans.ChargentSFA__Amount__c * -1;
                else obj.amount = trans.ChargentSFA__Amount__c;
              }
                

              if(defined(trans,"ChargentSFA__Gateway_Response__c")) {
                var patt = /PNREF=([^&]*)/i
                var x = patt.exec(trans.ChargentSFA__Gateway_Response__c);
                if(defined(x,"length") && x.length > 1) {
                  obj.trans.ChargentSFA__Gateway_ID__c = x[1];
                }
              }

              $scope.opps.push(obj);
            }

          }
        }
        if(defined($scope,"spinner"))
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
          if(defined(opp,"isRefund") && opp.isRefund) {
            if(opp.amount >= 0)
              total+=(opp.amount * -1);
            else total+=opp.amount;

          } else {
            total+=opp.amount;
          }
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
          total+=$scope.getProductAmount(opp, prod);
        }        
      }
    }
    return total;
  }


  $scope.getProductAmountShipping = function(opp, prod) {

    var prodId = prod.Id
    if(!defined(opp,"OpportunityLineItems.length"))
      return 0;

    if(opp.Display_Invoice_Number__c == 'W383088') {
      console.log('hu');
    }

    var found = false;
    var foundRefundShipping = false;
    if(opp.isRefund) {
      var refunds = opp.refunds;
      for(var j=0; j<refunds.length; j++) {
        var refund = refunds[j];
        if(refund.Product__c == prod.Product2.Id) {
          found=true;
        }        
        if(refund.Product_Code__c == SHIP) {
          foundRefundShipping=true;
        }
      }      
       
    } else {

      //var match = _.findWhere(opp.OpportunityLineItems, {PricebookEntry.product2.Id: Product2.Id});
      //var fndProd=_.findWhere($scope.prods, {Id: prodId})
      var found=false;
      for(var j=0; j<opp.OpportunityLineItems.length; j++) {
        var oppLine = opp.OpportunityLineItems[j];
        if(oppLine.PricebookEntry.Product2.Id == prod.Product2.Id) {
          found=true;
          break;
        }
      }

    }

    if(!found)
      return 0;

    var fndProd=prod;

    var totalWeight = 0;
    var shippingCost = 0;
    var bought=false;
    for(var j=0; j<opp.OpportunityLineItems.length; j++) {
      var oppLine = opp.OpportunityLineItems[j];
      var fnd=_.findWhere($scope.prods, {Id: oppLine.PricebookEntryId})
      if(defined(fnd,"Product2.Weight__c") && fnd.Product2.Weight__c > 0)
        totalWeight+=fnd.Product2.Weight__c;

      if(oppLine.PricebookEntry.Product2.Id == $scope.shippingProductId) {
        shippingCost = oppLine.TotalPrice;
      }

      if(oppLine.PricebookEntry.Product2.Id == prod.Product2.Id)
        bought=true
    }        
    if(defined(fndProd,"Product2.Weight__c") && fndProd.Product2.Weight__c > 0 && shippingCost && totalWeight && bought) {
      var percent = fndProd.Product2.Weight__c / totalWeight;

      if(opp.isRefund) {
        if(foundRefundShipping) {
          return shippingCost * percent * -1;
        } else {
          return 0;
        }
      } else {
        return shippingCost * percent;
      }
        
      
    }
    return 0;

  }

  $scope.getProductAmount = function(opp, prod) {

    var prodId = prod.Id;
    if(defined(opp,"isRefund") && opp.isRefund) {
      
      var prod = _.findWhere($scope.prods, {Id: prodId});
      if(defined(prod)) {
        var match = _.findWhere(opp.refunds, {Product__c: prod.Product2Id});
        if(defined(match,"Refund_amount__c")) {
          if(match.Refund_amount__c >= 0)
            return -1 * match.Refund_amount__c;        
          else return match.Refund_amount__c; 
        }
      }
      return 0;
    }

    var match = _.findWhere(opp.OpportunityLineItems, {PricebookEntryId: prodId});
    if(defined(match))
      return match.TotalPrice;
    else return 0;
  }

  function formatAmountExport(amount) {
    if(!defined(amount)) {
      amount=0;
    }
    return parseFloat(Math.round(amount * 100) / 100).toFixed(2).toString();
  }

  function formatDefined(obj) {
    if(defined(obj))
      return obj;
    else return '';
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
      if(opp.amount >= 0)
        return opp.amount * -1;
      else return opp.amount;
    } else if(defined(opp)) {
      return opp.amount;
    } else {
      return 0;
    }
  }

  $scope.export = function() {

    var json = [{"invoiceNumber":"Invoice #","garpId":"GARP ID","firstName":"First Name","lastName":"Last Name","county":"Country","state":"State","payPalId":"PayPal Trans ID",
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
          "invoiceNumber":formatDefined(opp.Display_Invoice_Number__c),
          "garpId":formatDefined(opp.GARP_Member_ID__c),
          "firstName":formatDefined(opp.Member_First_Name__c),
          "lastName":formatDefined(opp.Member_Last_Name__c),
          "county":formatDefined(opp.Shipping_Country__c),
          "state":formatDefined(opp.Shipping_State__c),
          "payPalId":formatDefined(opp.trans.ChargentSFA__Gateway_ID__c),
          "type":formatDefined(opp.trans.ChargentSFA__Type__c),
          "method":formatDefined(opp.trans.ChargentSFA__Payment_Method__c),
          "company":formatDefined(opp.Company__c),
          "paidDate":formatDefined(formatDate(opp.closeDate, "MM-DD-YYYY")),
          "total":formatAmountExport($scope.getRowTotal(opp))
        };

        for(var i=0; i<$scope.prods.length; i++) {  
          var prod = $scope.prods[i];
          var func = $scope.criteriaMatch();
          if(func(prod)) {
           obj[prod.Product2.ProductCode+'~'+prod.Product2.GL_Code__c] = formatAmountExport($scope.getProductAmount(opp, prod));
          }
        }
        for(var i=0; i<$scope.prods.length; i++) {  
          var func = $scope.criteriaMatchShip();
          var prod = $scope.prods[i];
          if(func(prod)) {
            var prod = $scope.prods[i];
            obj[prod.Product2.ProductCode+'~'+prod.Product2.GL_Code__c+"Shipping"] = formatAmountExport($scope.getProductAmountShipping(opp, prod));
          }
        }
        obj.endTotal = formatAmountExport($scope.getRowTotal(opp));


        json.push(obj);
      }
    }

    var csv = JSON2CSV(json);
    var fileName = 'data'
    var uri = 'data:text/csv;charset=utf-8,' + escape(csv);
    var link = document.createElement("a");    
    link.href = uri
    //link.style = "visibility:hidden"; Causing exception in Chrome - SR 6/15/2015
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


  $scope.criteriaMatch = function(value) {
    return function( item ) {   


      var fnd=_.findWhere($scope.prods, {Id: item.Id})

      if(defined(fnd,"Product2")) {
        if(fnd.Product2.ProductCode==SHIP)
          return 0;
        else return 1;
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
      if($scope.formVars.nj==false)
        match=true;
      if($scope.formVars.nj==true && defined(item,"Shipping_State__c") && defined(item,"Shipping_Country__c") &&
              (item.Shipping_Country__c == 'US' || item.Shipping_Country__c == 'United States' || item.Shipping_Country__c == 'United States of America') &&
              (item.Shipping_State__c == 'NJ' || item.Shipping_State__c == 'New Jersey') )
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


}]);