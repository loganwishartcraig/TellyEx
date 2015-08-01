var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var damageSchema = new Schema({
  Brand: Number,
  Model: Number,
  Capacity: Number,
  Carrier: Number,
  PriceNew: Number,
  PriceUsed: Number,
  Issues: {
    pwr: Number,
    wtrDmg: Number,
    iCldLk: Number,
    clnESN: Number,
    hasSvc: Number,
    canRestr: Number,
    noWifi: Number,
    noBlth: Number,
    prwLoop: Number,
    noAudio: Number,
    opnd: Number,
    ftGlass: Number,
    bkGlass: Number,
    volBtn: Number,
    lkBtn: Number,
    hmBtn: Number,
    vbrSwch: Number,
    bkCmra: Number,
    ftCmra: Number,
    spkr: Number,
    earSpkr: Number,
    hpJack: Number,
    mic: Number,
    chrgr: Number,
    batt: Number
  }
})

var damageCost = mongoose.model('DamageCost', damageSchema);

function ENTER_ITEMS(item, next) {
  
  console.log("entering item...")

  var newPrice = new damageCost({
    Brand: item.brand,
    Model: item.model,
    Capacity: item.capacity,
    Carrier: item.carrier,
    PriceNew: item.usedPrice,
    PriceUsed: item.newPrice,
    Issues: {
      pwr: item.pwr,
      wtrDmg: item.wtrDmg,
      iCldLk: item.iCldLk,
      clnESN: item.clnESN,
      hasSvc: item.hasSvc,
      canRestr: item.canRestr,
      noWifi: item.noWifi,
      noBlth: item.noBlth,
      prwLoop: item.prwLoop,
      noAudio: item.noAudio,
      opnd: item.opnd,
      ftGlass: item.ftGlass,
      bkGlass: item.bkGlass,
      volBtn: item.volBtn,
      lkBtn: item.lkBtn,
      hmBtn: item.hmBtn,
      vbrSwch: item.vbrSwch,
      bkCmra: item.bkCmra,
      ftCmra: item.ftCmra,
      spkr: item.spkr,
      earSpkr: item.earSpkr,
      hpJack: item.hpJack,
      mic: item.mic,
      chrgr: item.chrgr,
      batt: item.batt,
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



// for (var i in BASE_PRICES) {
//   ENTER_ITEMS(BASE_PRICES[i], function(err, res) {
//     if (err) return console.error(err);
//     console.log(res)
//   })
// }




var damageCost = mongoose.model('DamageCost', damageSchema);


module.exports = {damageCost: damageCost}