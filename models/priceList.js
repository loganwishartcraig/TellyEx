var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var priceSchema = new Schema({
  Brand: Number,
  Model: Number,
  Capacity: Number,
  Carrier: Number,
  PriceNew: Number,
  PriceUsed: Number
})

var priceList = mongoose.model('PriceList', priceSchema);


module.exports = {priceList: priceList}