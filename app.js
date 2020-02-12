var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const soap = require('soap');
var bodyParser = require('body-parser');


//const json = require('json');
//var WSDL = soap.WSDL;

// WSDL.open('./konakart.wsdl',{},
//   function(err, wsdl) {
//     console.log(wsdl);
//   });
const url = 'http://vipul:8780/konakart/services/KKWebServiceEng?wsdl';

var app = express();

app.use(bodyParser.urlencoded({ extended: true })); 



var reqObj = {
  emailAddr: "vipul.bhojwani@comprotechnologies.com",
  password: "Vipul@123",
  custReg: null,
  basketItemArray: [{
    productId: 34,
    quantity: 2
  }],
  shippingModule: null,
  paymentModule: "CyberSourceSA",
  languageId: -1
}




var basket = {
  productId: 34,
  quantity: 2
}

var sessionId;



app.get('/User/Login', function (req, res, next) {

  soap.createClient(url, function (err, client) {

    var loginRequest = {
      emailAddr: req.query.emailAddr,
      password: req.query.password
    }

    

    client.KKWSEngIfService.KKWebServiceEng.login(loginRequest, function (err, result) {
      sessionId = result.loginReturn.$value;
      res.json({sessionId: sessionId});
    });
  })
});



app.post('/User/Basket', function (req, res, next) {

  var addToBasketRequest = {
    sessionId: req.query.sessionId,
    customerId: 0,
    item: basket
  }


  soap.createClient(url, function (err, client) {
    client.KKWSEngIfService.KKWebServiceEng.addToBasket(addToBasketRequest, function (err, result) {
      res.sendStatus(201)
    });
  });
});

app.get('/User/Basket', function (req, res, next) {

  var getBasketItemsPerCustomerRequest = {
    sessionId: req.query.sessionId,
    customerId: 0,
    languageId: -1
  }

  soap.createClient(url, function (err, client) {
    client.KKWSEngIfService.KKWebServiceEng.getBasketItemsPerCustomer(getBasketItemsPerCustomerRequest, function (err, result) {
      var basketResp = result.getBasketItemsPerCustomerReturn.getBasketItemsPerCustomerReturn;
      var basketObj = {};
      for (key in basketResp) {
        if (basketResp[key].$value !== undefined)
          basketObj[key] = basketResp[key].$value
      }

      res.send(basketObj);

    });
  });
});

app.post('/User/Order', function (req, res, next) {

  var createAndSaveOrderRequest = {
    emailAddr: 'vipul.bhojwani@comprotechnologies.com',
    password: 'Vipul@123',
    basketItemArray: [{
      productId: 34,
      quantity: 2
    }],
    paymentModule: "CyberSourceSA",
    languageId: -1
  }

  soap.createClient(url, function (err, client) {
    client.KKWSEngIfService.KKWebServiceEng.createAndSaveOrder(createAndSaveOrderRequest, function (err, result) {
      res.send(result.createAndSaveOrderReturn.paymentDetails);
    });
  });
});


var transform = function (obj) {
  
  // var canSkip = ['archivedOrders', 'availablePaymentGateways', 'availableShippingQuotes', 'orderShipments', 'shippingQuote',
  //                'statusTrail', 'vendorOrders', 'orderProducts'];

  var canSkip = ['opts'];
  
  
  var returnObj = {};
  for (key in obj) {

    if(canSkip.indexOf(key) == -1)
    {

    if (obj[key].$value !== undefined) {
      returnObj[key] = obj[key].$value
    }
    else if(key != 'attributes' && key!= '__proto__' && typeof obj[key] === 'object') {
      returnObj[key] = transform(obj[key])
    }
  }
  }

  return returnObj;

}

app.post('/User/Create/Order', function (req, res, next) {



  var getBasketItemsPerCustomerRequest = {
    sessionId: req.query.sessionId,
    customerId: 0,
    languageId: -1
  }



  soap.createClient(url, function (err, client) {
//    client.KKWSEngIfService.KKWebServiceEng.getBasketItemsPerCustomer(getBasketItemsPerCustomerRequest, function (err, result) {
      //res.send(result.getBasketItemsPerCustomerReturn.getBasketItemsPerCustomerReturn);


      var basketObjTransformed = [{
        "customerId": "34",
        "dateAdded": "2020-02-04T00:00:00.000Z",
        "encodedProduct": "29{5}10",
        "finalPriceExTax": "10.0000",
        "finalPriceIncTax": "10.0000",
        "id": "36",
        "productId": "29",
        "qtyResrvdForResId": "0",
        "quantity": "1",
        "quantityInStock": "0",
        "quantityReserved": "0",
        "reservationId": "-1",
        "useBasketPrice": "false",
        "wishListId": "0",
        "wishListItemId": "0"
      }]

      var createOrderRequest = {
        sessionId: req.body.sessionId,
     //   basketItemArray: [result.getBasketItemsPerCustomerReturn.getBasketItemsPerCustomerReturn],
        basketItemArray: basketObjTransformed,
        languageId: -1
      }



      soap.createClient(url, function (err, client) {
        client.KKWSEngIfService.KKWebServiceEng.createOrder(createOrderRequest, function (err, result) {

          // console.log('last request: ', client.lastRequest) // <-- here
          // console.log('last request: ', client.lastResponse) // <-- here


          var createOrderResp = result.createOrderReturn;

          delete createOrderResp.orderProducts.orderProducts.order.orderProducts;

          var orderObj = transform(createOrderResp);

          // var orderToSend = {
          //   "billingAddrFormatId": 1,
          //   "billingAddrId": 34,
          //   "customerAddrFormatId": 1,
          //   "customerAddrId": 34,
          //   "customerId": 34,
          //   "deliveryAddrFormatId": 1,
          //   "deliveryAddrId": 34,
          //   "numProducts": 1,
          //   "orderProducts": {
          //       "productId": 29,
          //       "quantity": 2,
          //       "qtyResrvdForResId": 2,
          //       "refundPoints": 0

          //   }
          // ,
          //   "status": 1,
          //   "pointsAwarded": 0,
          //   "pointsRedeemed": 0

          // }


          var orderToSend = {
           
            "orderProducts": {
              "id": 0,
                "productId": 34,
                "quantity": 2,
                "type": 5
               

            }
          ,
            "status": 1
           

          }

          orderObj.paymentMethod = "CyberSourceSA";

          orderObj.paymentModuleCode = "CyberSourceSA";

          //orderObj.orderToSend

          var saveOrderReq = {
            sessionId: req.body.sessionId,
            order: orderObj,//orderToSend,
            languageId: -1
          }


          var getOrderTotalsRequest = {
            order: orderObj,
            languageId: -1
          }


          // client.KKWSEngIfService.KKWebServiceEng.getOrderTotals(getOrderTotalsRequest, function (err, result) {

          //   var returnedOrder = result.getOrderTotalsReturn;
          //   var newOrderObj = transform(returnedOrder);
          //   saveOrderReq.order = newOrderObj;
            
          var a = saveOrderReq.order.orderProducts.orderProducts;
          delete saveOrderReq.order.orderProducts;
          saveOrderReq.order.orderProducts = a;
          // delete saveOrderReq.order.orderProducts.product.dateAdded;// = new Date();
          // delete saveOrderReq.order.orderProducts.product.dateAvailable;// = new Date();
         
          
          saveOrderReq.order.orderProducts.product.dateAdded = '2020-02-10T05:45:55Z';
          saveOrderReq.order.orderProducts.product.dateAvailable = '2020-02-10T05:45:55Z';

          saveOrderReq.order.locale = 'en_GB';
          client.KKWSEngIfService.KKWebServiceEng.getOrderTotals(getOrderTotalsRequest, function (err, result) {


            // console.log('last request: ', client.lastRequest) // <-- here
            // console.log('last request: ', client.lastResponse) // <-- here



            
            var orderObj = transform(createOrderResp);

            saveOrderReq.order.orderTotals = {
						id: 0,
						orderId: 0,
						promotionId: 0,
						title: 'Sub-Total',
						text: '$999.95',
						value: '999.9500',
						sortOrder: 1,
						className: 'ot_total'
            }

            saveOrderReq.order.statusTrail = {
            customerNotified: false,
            id: 0,
            orderId: 0,
            orderStatusId: 0,
            updatedById: 34
            }
  

            saveOrderReq.order.status = 4;

            
            saveOrderReq.order.statusText = 'Waiting for Payment';

            saveOrderReq.order.shippingMethod = 'Flat Rate (Shipping)';

            saveOrderReq.order.shippingModuleCode = 'flat';
            

          client.KKWSEngIfService.KKWebServiceEng.saveOrder(saveOrderReq, function (err, result) {


            console.log('last request: ', client.lastRequest) // <-- here
            console.log('last request: ', client.lastResponse) // <-- here

            

            res.json({orderId: result.saveOrderReturn.$value});

          });

       // });

          //res.send(result);
        });
      });

    });


    // });
  });






});





app.get('/User/Payment', function (req, res, next) {

  var getPaymentDetailsRequest = {
    sessionId: req.query.sessionId,
    moduleCode: 'CyberSourceSA',
    orderId: req.query.orderId,
    hostAndPort: "localhost:8080",
    languageId: -1
  }

  soap.createClient(url, function (err, client) {
    client.KKWSEngIfService.KKWebServiceEng.getPaymentDetails(getPaymentDetailsRequest, function (err, result) {
     
      console.log('last request: ', client.lastRequest) // <-- here
      console.log('last request: ', client.lastResponse) // <-- here

      var paymentObj = transform(result.getPaymentDetailsReturn);

     
      res.send(paymentObj);
    });
  });
});

app.get('/User/OrderData', function (req, res, next) {

  var getOrderWithOptionsRequest = {
    sessionId: req.query.sessionId,
    orderId: req.query.orderId,
    languageId: -1,
    options: {}
  }

  soap.createClient(url, function (err, client) {
    client.KKWSEngIfService.KKWebServiceEng.getOrderWithOptions(getOrderWithOptionsRequest, function (err, result) {
     
      console.log('last request: ', client.lastRequest) // <-- here
      console.log('last request: ', client.lastResponse) // <-- here


     
      res.send(result);
    });
  });
});



app.get('/Payment/Gateway', function (req, res, next) {

  var getPaymentGatewaysRequest = {
    order: {
      "id": 30,
      "currencyCode": 'USD'
    },
    languageId: -1
  }

  soap.createClient(url, function (err, client) {
    // client.KKWSEngIfService.KKWebServiceEng.getDefaultCurrency(function (err, result) {
    client.KKWSEngIfService.KKWebServiceEng.getPaymentGateways(getPaymentGatewaysRequest, function (err, result) {
      res.send(result);
    });
  });
});



app.listen(8080);


module.exports = app;
