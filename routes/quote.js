var express = require('express');
var router = express.Router();

var braintree = require("braintree");

var damageCostServ = require('../services/damageCost-service.js')

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: 'x2xx3489j3txf2ch',
  publicKey: 'kg8wq43q9qfn3kqw',
  privateKey: '93e0f9f617e168978f51c854d03e0f58'
});

function calcWorth(order, next) {

  damageCostServ.findDamagePrice(order, function(err, worth) {
    if (err) return next(err);

    console.log(worth)
    return next(null, worth);

  })

}


function getPhonePriceList(next) {

  console.log("getting product prices...")

  damageCostServ.findProductMinPrices(function(err, priceList) {
    if (err) return next(err)

    console.log(priceList);
    next(null, priceList)
  })

}


function cleanOrder(obj) {


  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (obj[key] === 0) {
        delete obj[key]
      }
    }
  }

  return obj;

}

router.post("/payment-methods", function (req, res) {
  var nonce = req.body.payment_method_nonce;
  // Use payment method nonce here
});


router.get('/test', function(req, res, next) {

  gateway.customer.create({
    firstName: "Jen",
    lastName: "Smith",
    company: "Braintree",
    email: "jen@example.com",
    phone: "312.555.1234",
    fax: "614.555.5678",
    website: "www.example.com"
  }, function(err, result) {
    if (result.success) {
      gateway.clientToken.generate({customerId: result.customer.id}, function(err, response) {
        res.send("OK\n" + response.clientToken);
      });
    } else {
      console.error("braintree Create customer" + result.success)
    }

  });


  
})

router.get('/', function(req, res, next) {
  res.render('quote')
})


router.post('/submit', function(req, res, next) {

  var query = {
    phone: req.body.phone,
    issues: req.body.issues,
    components: req.body.components
  }

  calcWorth(query, function(err, price) {
    if (err) return res.send(400);

    var priceList = getPhonePriceList(function(err, priceList) {
      if (err) return res.send(400);

      res.send({
        worth: price,
        productMinPrice: priceList
      });
    })


  });



})



module.exports = router;
