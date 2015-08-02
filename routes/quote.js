var express = require('express');
var router = express.Router();

var priceListServ = require('../services/priceList-service.js')
var damageCostServ = require('../services/damageCost-service.js')


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




router.get('/', function(req, res, next) {
  res.render('quote')
})


router.post('/submit', function(req, res, next) {

  var issues = cleanOrder(req.body.issues);
  var query = {phone: req.body.phone,
               issues: issues}

  calcWorth(query, function(err, price){
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
