'use strict';

/* Controllers */
var reportsGARPControllers = angular.module('reportsGARPControllers', []);

reportsGARPControllers.controller('mainCtrl', ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {
  $scope.envPath = envPath;
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
    $scope.userFormVars.prods = prods;
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

reportsGARPControllers.controller('dataCtrl', ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout, utilitiyService) {

  var SHIP = 'SHIP';     
  var TAX = 'SLSTX';   

var mergeProds = [
      {
      glCodes: [
        '4030'
      ],
      company: 'GARP',
      prodCodes : [
        'FRMC1',
        'FRMC2'
      ],
      mergedCode : 'FRMC',
      mergedGL : '4030MERGE',
      mergedName : 'FRM Practice Exams',
      sort: 25,
      weight: 0
    },
      {
      glCodes: [
        '4030'
      ],
      company: 'GRA',
      prodCodes : [
        'ENCC1',
        'ENCC2'
      ],
      mergedCode : 'ENCC',
      mergedGL : '4030MERGE',
      mergedName : 'ERP Practice Exams',
      sort: 49,
      weight: 0
    },
      {
      glCodes: [
        '4000'
      ],
      company: 'GRA',
      prodCodes : [
        'CBRNM',
        'CBR',
        'CBR2A'
      ],
      mergedCode : 'ICBRR',
      mergedGL : '4000MERGE',
      mergedName : 'ICBRR Exam',
      sort: 35,
      weight: 4
    },
    {
      glCodes: [
        '4000'
      ],
      company: 'GRA',
      prodCodes : [
        'FCBR',
        'FBRNM'
      ],
      mergedCode : 'FFR',
      mergedGL : '4000MERGE',
      mergedName : 'FFR Exam',
      sort: 37,
      weight: 1
    },    

    {
      glCodes: [
        '4001'
      ],
      company: 'GARP',
      prodCodes : [
        'FRM1E',
        'FRM1S',
        'FRM1L'
      ],
      mergedCode : 'FRMIMAY',
      mergedGL : '4001MERGE',
      mergedName : 'FRM Exam Part I - May',
      sort: 5,
      weight: 0
    },
    {
      glCodes: [
        '4002'
      ],
      company: 'GARP',
      prodCodes : [
        'FRM1E',
        'FRM1S',
        'FRM1L'
      ],
      mergedCode : 'FRMINOV',
      mergedGL : '4002MERGE',
      mergedName : 'FRM Exam Part I - Nov',
      sort: 7,
      weight: 0
    },

    {
      glCodes: [
        '4001'
      ],
      company: 'GARP',
      prodCodes : [
        'FRM2E',
        'FRM2S',
        'FRM2L'
      ],
      mergedCode : 'FRMIIMAY',
      mergedGL : '4001MERGE',
      mergedName : 'FRM Exam Part II - May',
      sort: 6,
      weight: 0
    },
    {
      glCodes: [
        '4002'
      ],
      company: 'GARP',
      prodCodes : [
        'FRM2E',
        'FRM2S',
        'FRM2L'
      ],
      mergedCode : 'FRMIINOV',
      mergedGL : '4002MERGE',
      mergedName : 'FRM Exam Part II - Nov',
      sort: 8,
      weight: 0
    },
    
    {
      glCodes: [
        '4001'
      ],
      company: 'GARP',
      prodCodes : [
        'ENC1E',
        'ENC1S',
        'ENC1L'
      ],
      mergedCode : 'ERPIMAY',
      mergedGL : '4001MERGE',
      mergedName : 'ERP Exam Part I - May',
      sort: 39,
      weight: 0
    },
    {
      glCodes: [
        '4002'
      ],
      company: 'GARP',
      prodCodes : [
        'ENC1E',
        'ENC1S',
        'ENC1L'
      ],
      mergedCode : 'ERPINOV',
      mergedGL : '4002MERGE',
      mergedName : 'ERP Exam Part I - Nov',
      sort: 41,
      weight: 0
    },
    {
      glCodes: [
        '4001'
      ],
      company: 'GARP',
      prodCodes : [
        'ENC2E',
        'ENC2S',
        'ENC2L'
      ],
      mergedCode : 'ERPIIMAY',
      mergedGL : '4001MERGE',
      mergedName : 'ERP Exam Part II - May',
      sort: 40,
      weight: 0
    },
    {
      glCodes: [
        '4002'
      ],
      company: 'GARP',
      prodCodes : [
        'ENC2E',
        'ENC2S',
        'ENC2L'
      ],
      mergedCode : 'ERPIINOV',
      mergedGL : '4002MERGE',
      mergedName : 'ERP Exam Part II - Nov',
      sort: 42,
      weight: 0
    }
  ];
  
  $scope.shippingProductId = null;
  $scope.envPath = envPath;
  $scope.util = utilitiyService;

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
    $scope.formVars = params;
  });
  $scope.$on('refresh', function(event, params) {
    $scope.formVars = params;
    init(false);
  });
  $scope.$on('download', function(event, params) {
    $scope.formVars = params;
    $scope.export();
  });

  function getProducts(refresh) {

    reportsGARPServices.getProducts(priceBookId, function(err, data) {

      $scope.prods = data.result;
      $scope.origProds = data.result;
      $scope.prodsFinal = [];
      $scope.formVars.prods = [];
      if($scope.formVars.prods.length == 0) {
        for(var i=0; i<$scope.prods.length; i++) {
          var prod = $scope.prods[i];

          if(defined(prod,"Product2.IsActive") && defined(prod,"Pricebook2.IsActive") &&
             defined(prod,"Pricebook2.IsActive") && prod.Pricebook2.IsActive == true && 
             defined(prod,"Product2.IsActive") && prod.Product2.IsActive == true && defined(prod,"Product2.RPT_Sort_Order__c")) {

            var found=false;

            for(var k=0; k<mergeProds.length; k++) {
              var idxgl = _.indexOf(mergeProds[k].glCodes, prod.Product2.GL_Code__c);  
              var idxpc = _.indexOf(mergeProds[k].prodCodes, prod.Product2.ProductCode);  
              if(idxgl > -1 && idxpc > -1) {              
                found=true;
                break;
              }
            }

            // if(prod.Product2.GL_Code__c == FRM1_GLCODE && 
            //    (prod.Product2.ProductCode == FRM1EARLY || prod.Product2.ProductCode == FRM1STANDARD ||
            //    prod.Product2.ProductCode == FRM1LATE)) {
            //   continue;
            // }

            if(found)
              continue;

            var obj = {
              id: prod.Id,
              name: prod.Name,
              checked: false
            }
            $scope.formVars.prods.push(obj);

            if(prod.Product2.ProductCode == SHIP)
              $scope.shippingProductId = prod.Product2.Id

            $scope.prodsFinal.push(prod);
          }
        }
      }

      // var prodObj = {
      //   Id: FRM1_CODE_MERGED+':'+FRM1_GLCODE_MERGED,
      //   Name: FRM1_NAME_MERGED,
      //   Product2Id: FRM1_CODE_MERGED+':'+FRM1_GLCODE_MERGED,
      //   Product2: {
      //     Id: FRM1_CODE_MERGED+':'+FRM1_GLCODE_MERGED,
      //     Company__c: "GARP",
      //     GL_Code__c: FRM1_GLCODE_MERGED,
      //     ProductCode: FRM1_CODE_MERGED,
      //     Weight__c: 1
      //   }
      // }

      for(var i=0; i<mergeProds.length; i++) {
        var mp = mergeProds[i];

        var prodObj = {
          Id: mp.mergedCode+':'+mp.mergedGL,
          Name: mp.mergedName,
          Product2Id: mp.mergedCode+':'+mp.mergedGL,
          Product2: {
            Id: mp.mergedCode+':'+mp.mergedGL,
            Company__c: mp.company,
            GL_Code__c: mp.mergedGL,
            ProductCode: mp.mergedCode,
            RPT_Sort_Order__c: mp.sort,
            Weight__c: mp.weight
          }
        }

        $scope.prodsFinal.push(prodObj);
        var obj = {
          id: prodObj.Id,
          name: prodObj.Name,
          checked: false
        }        
        $scope.formVars.prods.push(obj);

      }

      $scope.prods = $scope.prodsFinal;
      if(refresh) {
        $scope.prods = _.sortBy($scope.prods, function(obj){ return obj.Product2.RPT_Sort_Order__c; });
        $rootScope.$broadcast('fetchProds', $scope.formVars.prods);        
      }

    });
  }

  function init(refresh) {

    $timeout(function () {
      startSpinner();
    },300);

    console.log('Init');
    $scope.err = '';

    if(refresh)
      getProducts(false);

    $scope.totals = [];
    $scope.opps = [];
    $scope.total = 0;

    //var sdt = moment.tz($scope.formVars.startDate + ' 00:00:01','America/Los_Angeles').add(+3,'hours').unix();
    //var edt = moment.tz($scope.formVars.endDate + ' 23:59:59','America/Los_Angeles').add(+3,'hours').unix();
    var sdt = moment.tz($scope.formVars.startDate + ' 00:00:01','America/Los_Angeles').unix();
    var edt = moment.tz($scope.formVars.endDate + ' 23:59:59','America/Los_Angeles').unix();

    $scope.filterProdIds = [];
    var cnt=0;
    for(var i=0; i<$scope.formVars.prods.length; i++) {
      var fProd = $scope.formVars.prods[i];
      if(fProd.checked == true) {
        $scope.filterProdIds.push(fProd.id);
        cnt++;
      }        
    }
    if(cnt == 0)
      $scope.filterProdIds=null;

    reportsGARPServices.getReportDataTransFilters(sdt, edt, $scope.formVars.garp, $scope.formVars.gra, $scope.formVars.nj, $scope.filterProdIds, function(err, data) {

      if(data.event.status == false) {
        if(defined($scope,"spinner"))
          $scope.spinner.stop();          
        $rootScope.$apply(function(){
          $scope.err = data.event.message;
        });
        return;
      }

      if(defined(data,"result.trans"))
        $scope.transactions = data.result.trans;

      reportsGARPServices.getReportDataOppFilters(sdt, edt, $scope.formVars.garp, $scope.formVars.gra, $scope.formVars.nj, $scope.filterProdIds, function(err, data) {

        if(data.event.status == false) {
          if(defined($scope,"spinner"))
            $scope.spinner.stop();          
          $rootScope.$apply(function(){
            $scope.err = data.event.message;
          });
          return;
        }

        if(defined(data,"result.opps")) {
          $scope.oppsData = data.result.opps;
          for(var t=0; t<$scope.oppsData.length; t++) {
            var opp = $scope.oppsData[t];
            if(defined(opp,"OpportunityLineItems.length")) {
              for(var z=0; z<opp.OpportunityLineItems.length; z++) {
                var li = opp.OpportunityLineItems[z];

                var found=false;
                for(var k=0; k<mergeProds.length; k++) {
                  var idxgl = _.indexOf(mergeProds[k].glCodes, li.PricebookEntry.Product2.GL_Code__c);  
                  var idxpc = _.indexOf(mergeProds[k].prodCodes, li.PricebookEntry.ProductCode);  
                  if(idxgl > -1 && idxpc > -1) {              
                    found=true;
                    break;
                  }
                }

                if(found) {
                  li.PricebookEntry.Id = mergeProds[k].mergedCode+':'+mergeProds[k].mergedGL;
                  li.PricebookEntry.Product2.Id = mergeProds[k].mergedCode+':'+mergeProds[k].mergedGL;
                  li.PricebookEntryId = mergeProds[k].mergedCode+':'+mergeProds[k].mergedGL;                  
                }


                // if(li.PricebookEntry.Product2.GL_Code__c == FRM1_GLCODE && 
                //   (li.PricebookEntry.ProductCode == FRM1EARLY || li.PricebookEntry.ProductCode == FRM1STANDARD || li.PricebookEntry.ProductCode == FRM1LATE)) {
                  
                //     li.PricebookEntry.Id = FRM1_CODE_MERGED+':'+FRM1_GLCODE_MERGED;
                //     li.PricebookEntry.Product2.Id = FRM1_CODE_MERGED+':'+FRM1_GLCODE_MERGED;
                //     li.PricebookEntryId = FRM1_CODE_MERGED+':'+FRM1_GLCODE_MERGED;
                // }
              }
            }
          }
        }
          

        reportsGARPServices.getReportDataRefundsFilters(sdt, edt, $scope.formVars.garp, $scope.formVars.gra, $scope.formVars.nj, $scope.filterProdIds, function(err, data) {

          if(data.event.status == false) {
            if(defined($scope,"spinner"))
              $scope.spinner.stop();          
            $rootScope.$apply(function(){
              $scope.err = data.event.message;
            });
            return;
          }

          if(defined(data,"result.refunds")) {
            $scope.refunds = data.result.refunds;
            for(var t=0; t<$scope.refunds.length; t++) {
              var rfnd = $scope.refunds[t];
              var fndRfnd = _.findWhere($scope.origProds, {Product2Id: rfnd.Product__c});

              if(defined(fndRfnd)) {

                var found=false;
                for(var k=0; k<mergeProds.length; k++) {
                  var idxgl = _.indexOf(mergeProds[k].glCodes, fndRfnd.Product2.GL_Code__c);  
                  var idxpc = _.indexOf(mergeProds[k].prodCodes, fndRfnd.Product2.ProductCode);  
                  if(idxgl > -1 && idxpc > -1) {              
                    found=true;
                    break;
                  }
                }

                if(found) {                    
                  rfnd.Product__c = mergeProds[k].mergedCode+':'+mergeProds[k].mergedGL;
                }
              }

              // if(defined(fnd) && fnd.Product2.GL_Code__c == FRM1_GLCODE && 
              //   (fnd.Product2.ProductCode == FRM1EARLY || fnd.Product2.ProductCode == FRM1STANDARD || fnd.Product2.ProductCode == FRM1LATE)) {
              //   rfnd.Product__c = FRM1_CODE_MERGED+':'+FRM1_GLCODE_MERGED;
              // }

            }
          }
            

          for(var i=0; i<$scope.transactions.length; i++) {
            var trans = $scope.transactions[i];

            if(trans.ChargentSFA__Response_Status__c != 'Approved')
              continue;

            var findopp = _.findWhere($scope.oppsData, {Id: trans.ChargentSFA__Opportunity__c});
            var opp = jQuery.extend(true, {}, findopp);

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

            } else if(trans.ChargentSFA__Type__c == 'Refund' || trans.ChargentSFA__Type__c == 'Credit') {

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
              $scope.prods = _.sortBy($scope.prods, function(obj){ return obj.Product2.RPT_Sort_Order__c; });
              $rootScope.$broadcast('fetchProds', $scope.formVars.prods);
            }                  
          });
        });
      });
    });
  }

  //init();
  var hostName = window.location.hostname;
  if(hostName.indexOf("c.cs16.visual.force.com") > -1) {
    // Build
    var priceBookId = '01sf00000008rTn';
  } else {
    // Prod
    var priceBookId = '01s40000000VV15';
  }
  getProducts(true);  

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

  $scope.getProdTotalsTax = function(prodId) {

    if(!defined($scope,"opps.length"))
      return 0;

    var total=0;
    for(var j=0; j<$scope.opps.length; j++) {  
      var opp = $scope.opps[j];    
      var func = $scope.filterMatch();
      if(func(opp)) {
        var prod=_.findWhere($scope.prods, {Id: prodId})
        var func = $scope.criteriaMatchTax();
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
      var foundCnt=0;
      for(var j=0; j<opp.OpportunityLineItems.length; j++) {
        var oppLine = opp.OpportunityLineItems[j];
        if(oppLine.PricebookEntry.Product2.Id == prod.Product2.Id) {
          foundCnt++;
        }
      }

    }

    if(foundCnt==0 && !foundRefundShipping)
      return 0;

    var fndProd=prod;

    var totalWeight = 0;
    var shippingCost = 0;
    var boughtShipping=false;
    for(var j=0; j<opp.OpportunityLineItems.length; j++) {
      var oppLine = opp.OpportunityLineItems[j];
      var fnd=_.findWhere($scope.prods, {Id: oppLine.PricebookEntryId})
      if(defined(fnd,"Product2.Weight__c") && fnd.Product2.Weight__c > 0)
        totalWeight+=fnd.Product2.Weight__c;

      if(oppLine.PricebookEntry.Product2.Id == $scope.shippingProductId) {
        shippingCost = oppLine.TotalPrice;
      }

      //if(oppLine.PricebookEntry.Product2.Id == prod.Product2.Id)
      if(oppLine.PricebookEntry.ProductCode == "SHIP")
        boughtShipping=true
    }        
    if(defined(fndProd,"Product2.Weight__c") && fndProd.Product2.Weight__c > 0 && shippingCost > 0 && totalWeight > 0 && boughtShipping == true) {
      var percent = fndProd.Product2.Weight__c / totalWeight;

      if(opp.isRefund) {
        if(found && foundRefundShipping) {
          return shippingCost * percent * -1;
        } else {
          return 0;
        }
      } else {
        return (shippingCost * foundCnt) * percent;
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

    //var match = _.findWhere(opp.OpportunityLineItems, {PricebookEntryId: prodId});
    var matches = _.where(opp.OpportunityLineItems, {PricebookEntryId: prodId});
    if(defined(matches,"length") && matches.length > 0) {
      var totAmt = 0;
      for(var i=0; i<matches.length; i++) {
        var match = matches[i];
        if(defined(match,"TotalPrice"))
          totAmt+=match.TotalPrice;
      }
      return totAmt;
    }
    else return 0;
  }

  
  function formatAmountExport(amount) {
    if(!defined(amount)) {
      amount=0;
    }
    return parseFloat(Math.round(amount * 100) / 100).toFixed(2).toString();
  }


  function getValueIfDefinedEmpty(ref, strNames) {
    var name;

    if(typeof ref === "undefined" || ref === null) {
      return '';
    }

    if(strNames !== null && typeof strNames !== "undefined") {
      var arrNames = strNames.split('.');
      while (name = arrNames.shift()) {
        if (ref[name] === null || typeof ref[name] === "undefined") return '';
        ref = ref[name];
      }
    }
    return '"' + ref + '"';
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

    var json = [{"company":"Company","type":"Type","total":"Total","invoiceNumber":"Invoice #","garpId":"GARP ID","firstName":"First Name","lastName":"Last Name","county":"Country","state":"State","examSite":"Exam Site","method":"Payment Method","paidDate":"Paid Date","payPalId":"PayPal Trans ID"}];
    for(var i=0; i<$scope.prods.length; i++) {  
      var prod = $scope.prods[i];
      var func = $scope.criteriaMatch();
      if(func(prod)) {
        json[0][prod.Product2.ProductCode+'~'+prod.Product2.GL_Code__c] = prod.Name + '-' + prod.Product2.ProductCode+':'+prod.Product2.GL_Code__c;        
      }
    }
    for(var i=0; i<$scope.prods.length; i++) {  
      var func = $scope.criteriaMatchShip();
      var prod = $scope.prods[i];
      if(func(prod)) {
        var prod = $scope.prods[i];
        json[0][prod.Product2.ProductCode+'~'+prod.Product2.GL_Code__c+"Shipping"] = prod.Name + '-' + prod.Product2.ProductCode+':'+prod.Product2.GL_Code__c + "Shipping";        
      }
    }
    for(var i=0; i<$scope.prods.length; i++) {  
      var prod = $scope.prods[i];
      var func = $scope.criteriaMatchTax();
      if(func(prod)) {
        json[0][prod.Product2.ProductCode+'~'+prod.Product2.GL_Code__c] = prod.Name + '-' + prod.Product2.ProductCode+':'+prod.Product2.GL_Code__c;        
      }
    }
    json[0].endTotal="Total";

    for(var j=0; j<$scope.opps.length; j++) {  
      var opp = $scope.opps[j];

      var func = $scope.filterMatch();
      if(func(opp)) {

        var obj = {
          "company":getValueIfDefinedEmpty(opp,"Company__c"),
          "type":getValueIfDefinedEmpty(opp,"trans.ChargentSFA__Type__c"),
          "total":getValueIfDefinedEmpty($scope.getRowTotal(opp)),
          "invoiceNumber":getValueIfDefinedEmpty(opp,"Display_Invoice_Number__c"),
          "garpId":getValueIfDefinedEmpty(opp,"GARP_Member_ID__c"),
          "firstName":getValueIfDefinedEmpty(opp,"Member_First_Name__c"),
          "lastName":getValueIfDefinedEmpty(opp,"Member_Last_Name__c"),
          "county":getValueIfDefinedEmpty(opp,"Shipping_Country__c"),
          "state":getValueIfDefinedEmpty(opp,"Shipping_State__c"),
          "examSite":getValueIfDefinedEmpty(opp,"Deferred_Exam_Registration__r.Exam_Site__r.Site__r.Name"),
          "method":getValueIfDefinedEmpty(opp,"trans.ChargentSFA__Payment_Method__c"),
          "paidDate":getValueIfDefinedEmpty(util.formatDate(opp.closeDate, "MM-DD-YYYY")),
          "payPalId":getValueIfDefinedEmpty(opp,"trans.ChargentSFA__Gateway_ID__c")
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
        for(var i=0; i<$scope.prods.length; i++) {  
          var prod = $scope.prods[i];
          var func = $scope.criteriaMatchTax();
          if(func(prod)) {
           obj[prod.Product2.ProductCode+'~'+prod.Product2.GL_Code__c] = formatAmountExport($scope.getProductAmount(opp, prod));
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

      var found = false;
      var cnt=0;
      for(var propertyName in $scope.formVars.prods) { 
        var fProd = $scope.formVars.prods[propertyName];
        if(item.Id == fProd.id && fProd.checked == false) {
          found=true;
        }
        if(fProd.checked == true)
          cnt++;
      }
      if(cnt > 0 && found)
        return 0;

      if(defined(fnd,"Product2.Weight__c") && fnd.Product2.Weight__c > 0) {
        return 1;
      } else {
        return 0;
      }
    }
  }


  $scope.criteriaMatch = function(value) {
    return function( item ) {   

      var found = false;
      var cnt=0;
      for(var propertyName in $scope.formVars.prods) { 
        var fProd = $scope.formVars.prods[propertyName];
        if(item.Id == fProd.id && fProd.checked == false) {
          found=true;
        }
        if(fProd.checked == true)
          cnt++;
      }
      if(cnt > 0 && found)
        return 0;


      var fnd=_.findWhere($scope.prods, {Id: item.Id})

      if(defined(fnd,"Product2")) {
        if(fnd.Product2.ProductCode==SHIP || fnd.Product2.ProductCode==TAX)
          return 0;
        else return 1;
      } else {
        return 0;
      }

    }
  }

  $scope.criteriaMatchTax = function(value) {
    return function( item ) {   

      var found = false;
      var cnt=0;
      for(var propertyName in $scope.formVars.prods) { 
        var fProd = $scope.formVars.prods[propertyName];
        if(item.Id == fProd.id && fProd.checked == false) {
          found=true;
        }
        if(fProd.checked == true)
          cnt++;
      }
      if(cnt > 0 && found)
        return 0;


      var fnd=_.findWhere($scope.prods, {Id: item.Id})

      if(defined(fnd,"Product2")) {
        if(fnd.Product2.ProductCode==TAX)
          return 1;
        else return 0;
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