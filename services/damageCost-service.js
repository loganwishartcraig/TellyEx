var damageCosts = require('../models/damageCosts').damageCost;

var GLOBAL_MODELS = [1, 2, 3, 4];

exports.findDamagePrice = function(obj, next) {

  var minPriceList = {
    1: 30,
    2: 50,
    3: 85,
    4: 100
  }

  console.log(obj.phone)

  console.log("trying to find phones worth...")

  var searchString = "Phone.Brand"

  damageCosts.find({"Phone.Brand": 1}).
    where("Phone.Model").equals(obj.phone.model).
    where("Phone.Capacity").equals(obj.phone.capacity).
    where("Phone.Carrier").equals(obj.phone.carrier).
    exec(function(err, record) {
      console.log("executed")
      console.log(record[0])
      var worth = record[0].Phone.PriceUsed;

      for (var key in obj.issues) {
        if (obj.issues.hasOwnProperty(key)) {

          worth -= record[0].Issues[key];

        }
      }

      for (var key in obj.components) {
        if (obj.issues.hasOwnProperty(key)) {

          worth -= record[0].Components[key];

        }
      }

      if (worth < minPriceList[obj.phone.model]) {
        worth = minPriceList[obj.phone.model];
      }

      return next(null, worth);

    })  

}


exports.findProductMinPrices = function(next) {

  var modelList = [1, 2, 3, 4];
  var priceList = {};

  for (var i = 0; i < modelList.length; i++) {
    damageCosts.find({"Phone.Brand" :1}).
      where("Phone.Model").equals(modelList[i]).
      exec(function(err, record) {
        if (err) return next(err)

        var minPrice = 0;

        for (var j = 0; j < record.length; j++) {
          if (j === 0) minPrice = record[j].Phone.PriceNew

          if (record[j].Phone.PriceNew < minPrice) minPrice = record[j].Phone.PriceNew
        }

        priceList[record[0].Phone.Model] = minPrice;

        if (i === Object.keys(priceList).length) {
          return next(null, priceList)
        }

    })
  }
  
}
