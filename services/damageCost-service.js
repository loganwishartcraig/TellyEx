var damageCosts = require('../models/damageCosts').damageCost;

exports.findDamagePrice = function(obj, next) {

  console.log("trying to find price for")
  console.log(obj)

  var price = damageCosts.findOne({
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

          console.log(key)
          console.log(record.Issues[key])

          worth -= record.Issues[key];

        }
      }
      return next(null, worth);
    })

}


exports.findMinPrice = function(obj, next) {
  
}