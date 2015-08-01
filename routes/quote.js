var express = require('express');
var router = express.Router();

var priceListServ = require('../services/priceList-service.js')
var damageCostServ = require('../services/damageCost-service.js')


function calcWorth(order, next) {

  console.log("hit calcPrices");

  damageCostServ.findDamagePrice(order, function(err, worth) {
    if (err) return next(err);

    console.log(worth)
    return next(null, worth);

  })

}

function clenseIssues(obj) {

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

  console.log(req.body)

  var issues = clenseIssues(req.body.issues);
  var query = {phone: req.body.phone,
               issues: issues}
  console.log(query)

  calcWorth(query, function(err, price){
    if (err) return res.send(400);
    res.send({
    worth: price
    });
  });


  
})



module.exports = router;
