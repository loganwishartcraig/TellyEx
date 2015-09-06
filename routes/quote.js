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


function validatePhone(obj, next) {

  var validValues = {model: [1, 2, 3, 4],
                     color: [1, 2, 3],
                     capacity: [1, 2, 3],
                     carrier: [1, 2, 3, 4, 5, 100, 300, 900]}

  console.log(obj)

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      try {
        var toCheck = parseInt(obj[key])
        if (!(validValues[key].indexOf(toCheck) > -1)) {
          return next(true);
        }
      } catch(err) {
        return next(true);
      }
      
    }
  }

  return next(null)

}

function validateIssues(obj, next) {

  console.log(obj)

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      try {
        var toCheck = parseInt(obj[key])
        if ((toCheck !== 1) && (toCheck !== 0)) {
          return next(true);
        }
      } catch(err) {
        return next(true);
      }
      
    }
  }

  return next(null)

}

function validateComponents(obj, next) {

  console.log(obj)
  next(null)

}


router.post("/payment-methods", function (req, res) {
  var nonce = req.body.payment_method_nonce;
  // Use payment method nonce here
});


router.get('/braintree-test', function(req, res, next) {

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
  res.render('step1')
})

router.get('/step1', function(req, res, next) {
  res.render('step1')
})

router.post('/step1', function(req, res, next) {
  validatePhone(req.body, function(err) {

    if (err) return res.sendStatus(400)
    res.send({url: "http://localhost:3000/quote/step2"})

  })
  
})

router.get('/step2', function(req, res, next) {
  res.render('step2')
})

router.post('/step2', function(req, res, next) {
  validateIssues(req.body, function(err) {

    if (err) return res.sendStatus(400)
    res.send({url: "http://localhost:3000/quote/step3"})

  })
  
})


router.get('/step3', function(req, res, next) {
  res.render('step3')
})


router.post('/step3', function(req, res, next) {
  validateComponents(req.body, function(err) {

    if (err) return res.sendStatus(400)

    res.send({url: "http://localhost:3000/"})

  })
  
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
