var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("index");
});

router.get('/about', function(req, res, next) {
  res.render('about')
})

router.get('/what', function(req, res, next) {
  res.render('what')
})


router.get('/contact', function(req, res, next) {
  res.render('contact')
})

router.get('/store', function(req, res, next) {
  res.render('store')
})



module.exports = router;
