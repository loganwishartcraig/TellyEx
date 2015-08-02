var damageCosts = require('../models/damageCosts').damageCost;

var GLOBAL_MODELS = [1, 2, 3, 4];

exports.findDamagePrice = function(obj, next) {

  var minPriceList = {
    1: 50,
    2: 70,
    3: 100,
    4: 120
  }


  console.log("trying to find phones worth...")

  damageCosts.findOne({
      Brand: obj.phone.brand,
      Model: obj.phone.model,
      Capacity: obj.phone.capacity,
      Carrier: obj.phone.carrier
    },
    function(err, record) {
      if (err) return next(err);

      var worth = record.PriceUsed;

      for (var key in obj.issues) {
        if (obj.issues.hasOwnProperty(key)) {

          worth -= record.Issues[key];

        }
      }

      if (worth < minPriceList[obj.phone.model]) {
        worth = minPriceList[obj.phone.model];
      }

      return next(null, worth);
    })

}


exports.findProductMinPrices = function(next) {

  var modelList = GLOBAL_MODELS;
  var priceList = {};

  for (var i = 0; i < modelList.length; i++) {
    damageCosts.find({
        Brand: 1,
        Model: modelList[i]
      },
      'Model PriceNew',
      function(err, result) {
        if (err) return next(err)

        var minPrice = 0;

        for (var j = 0; j < result.length; j++) {
          if (j === 0) minPrice = result[j].PriceNew

          if (result[j].PriceNew < minPrice) minPrice = result[j].PriceNew
        }

        priceList[result[0].Model] = minPrice;

        if (i === Object.keys(priceList).length) {
          return next(null, priceList)
        }

      })
  }
  
}
