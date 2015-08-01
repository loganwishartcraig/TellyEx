var priceList = require('../models/priceList').priceList;


exports.findInitialPrice = function(obj, type, next) {

  var type = type || 'used';
  
  if (type = 'used') {
    var price = priceList.findOne({
      Brand: obj.brand,
      Model: obj.model,
      Capacity: obj.capacity,
      Carrier: obj.carrier
    }, 
    'PriceUsed', 
    function(err, record) {
      if (err) return next(err);
      return next(null, record.PriceUsed);
    })
  }

}

exports.findDamagePrice = function(obj, next) {

  var dmgCost = damageCosts.findOne({
    
  })


  next(null);

}


exports.ENTER_BP = function(item, next) {
  
  console.log("entering item...")

  var newPrice = new priceList({
    Brand: item.phone.brand,
    Model: item.phone.model,
    Capacity: item.phone.capacity,
    Carrier: item.phone.carrier,
    PriceNew: item.phone.usedPrice,
    PriceUsed: item.phone.newPrice,
    Issues: {
      pwr: item.issues.pwr,
      wtrDmg: item.issues.wtrDmg,
      iCldLk: item.issues.iCldLk,
      clnESN: item.issues.clnESN,
      hasSvc: item.issues.hasSvc,
      canRestr: item.issues.canRestr,
      noWifi: item.issues.noWifi,
      noBlth: item.issues.noBlth,
      prwLoop: item.issues.prwLoop,
      noAudio: item.issues.noAudio,
      opnd: item.issues.opnd,
      ftGlass: item.issues.ftGlass,
      bkGlass: item.issues.bkGlass,
      volBtn: item.issues.volBtn,
      lkBtn: item.issues.lkBtn,
      hmBtn: item.issues.hmBtn,
      vbrSwch: item.issues.vbrSwch,
      bkCmra: item.issues.bkCmra,
      ftCmra: item.issues.ftCmra,
      spkr: item.issues.spkr,
      earSpkr: item.issues.earSpkr,
      hpJack: item.issues.hpJack,
      mic: item.issues.mic,
      chrgr: item.issues.chrgr,
      batt: item.issues.batt,
    }
  })

  newPrice.save(function(err) {
    if (err) {
      return next(err, null);
    }
    return next(null, "done!");
  })

  // next(null)

}