$(document).ready(function() {

  $(".review-content-wrapper").hide();
  $(".store-content-wrapper").hide();

  // Global Vars

  var hoverBorderColor = "#f26ae9";
  var baseBorderColor = "#e8e8e8";
  var selectedBorderColor = "#f26ae9";

  var lastScrollTop = 0;

  var phone = {
  
  };

  var damagedModel = {
    phone: {brand: 1},
    issues: {},
    components: {}
  };

  // Set Up Page

  $("#col-gold").hide()
  $("#cap-128").hide()

  function setViewHeight() {
    return $(".form-wrapper").height();
  }

  var offsetHeight = setViewHeight();
  var navHeight = $(".nav").height();
  var animationTime = 1000;

  setTimeout(function() {
    gotoQuestion(1);
  }, 1500)


  $(window).on('resize', function() {
    offsetHeight = setViewHeight();
  })




  // Navigation

  function gotoQuestion(questionNum) {

    if (offsetHeight < 486) {
      offsetHeight = 486;
    }

    var toOffset = (offsetHeight * questionNum) - navHeight;

    $("html body").animate({
      scrollTop: $('.form-wrapper').offset().top + toOffset
    }, animationTime);

    scrollTop = toOffset;

  }


  function rgb2hex(orig) {
    var rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)/i);
    return (rgb && rgb.length === 4) ? "#" +
      ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
      ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
      ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : orig;
  }


  // Show/Hide color/capacity choices based on model

  function setColorCap(model) {

    switch (model) {

      case 1:
        $("#col-gold").hide();
        $("#cap-128").hide();
        $("#cap-32").show();
        break;

      case 2:
        $("#col-gold").show();
        $("#cap-128").hide();
        break;

      case 3:
        $("#col-gold").show();
        $("#cap-32").hide();
        $("#cap-128").show();
        break;

      case 4:
        $("#cap-32").hide();
        $("#cap-128").show();
        break;

      default:
        break;

    }

    return;
  }


  function swapBgTextColor(node) {

    var initBgColor = node.css("background-color");
    var initTxtColor = node.css("color");
    node.css("background", initTxtColor);
    node.css("color", rgb2hex(initBgColor));
    node.css("border-color", baseBorderColor)

    return;
  }


  // handle unmarking as selected based on class

  function unmarkSelection(node) {

    if (node.hasClass('bg-trans')) {
      swapBgTextColor(node)
    }

    node.removeClass('selected');
    node.css("border-color", baseBorderColor);


  }


  // handle marking as selected based on class

  function markSelection(node) {


    if (node.hasClass('border-trans')) {

      if (node.hasClass('no-reset')) {
        return;


      }

      node.siblings('.selected').each(function(i, j) {
        unmarkSelection($(j));
      })

      node.css("border-color", selectedBorderColor)
      return;
    }


    if (node.hasClass('bg-trans')) {

      swapBgTextColor(node)

      if (node.hasClass('no-reset')) {
        return;
      }

      node.siblings('.selected').each(function(i, j) {
        unmarkSelection($(j));
      })

      return;
    }

    return;
  }





  // Border hover effect

  $(".form-optn").hover(function() {
    if ($(this).hasClass('selected')) {
      return;
    } else {
      $(this).css("border-color", hoverBorderColor);
      return;
    }
  }, function() {
    if ($(this).hasClass('selected')) {
      return;
    } else {
      $(this).css("border-color", baseBorderColor);
      return;
    }
  })

  function setDmgData(model, attr, val) {

    damagedModel[model][attr] = val;

    return;

  }


  // Grab data from form option & goto next question

  $(".form-optn").click(function() {


    var requiredSelections = parseInt($(this).parents(".form-content-wrapper").data("validation"));
    var nextSection = parseInt($(this).parents(".form-content-wrapper").data("section")) + 1;

    if ($(this).hasClass('selected')) {

      unmarkSelection($(this));
      $(this).removeClass('selected')
      
    } else {
      var model = $(this).data("model")
      var attr = $(this).data("attr")
      var val = $(this).data("val")
      
      markSelection($(this));
      setDmgData(model, attr, val);

      $(this).addClass('selected');
      
    }

    if (requiredSelections) {
      var selected = $(this).parents(".form-content-wrapper").find(".selected").length;
      if (selected === requiredSelections) {
        return gotoQuestion(nextSection);
      } else {
        return;
      }
    }

    return gotoQuestion(nextSection);
  })


  $(".owned-model").click(function() {
    setColorCap($(this).data('val'));
    return;
  })


  $(".back").click(function() {

    var requiredSelections = parseInt($(this).parents(".form-content-wrapper").data("validation"));
    var nextSection = parseInt($(this).parents(".form-content-wrapper").data("section")) - 1;

    return gotoQuestion(nextSection);

  })

  function validateData(dmgOrder) {
    return true;
  }


  $(".submit").click(function() {

    console.log(damagedModel);

    var valid = validateData(damagedModel);

    if (valid) {
      $.ajax({
        url: '/quote/submit',
        type: 'POST',
        data: JSON.stringify(damagedModel),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: true,
        success: function(msg) {
          setStore(msg.worth, msg.productMinPrice)
        },
        error: function(msg) {
          console.log(msg)
        }
      });
    }

  })



  function setReview() {

    var staticInfo = {

      model: {
        1: {
          name: "iPhone 5",
          img: {
            1: "iPhone_5_black.png",
            2: "iPhone_5_white.png"
          }
        },
        2: {
          name: "iPhone 5s",
          img: {
            1: "iPhone_5s_black.png",
            2: "iPhone_5s_white.png",
            3: "iPhone_5s_gold.png"
          }
        },
        3: {
          name: "iPhone 6",
          img: {
            1: "iPhone_6_black.png",
            2: "iPhone_6_white.png",
            3: "iPhone_6_gold.png"
          }
        },
        4: {
          name: "iPhone 6+",
          img: {
            1: "iPhone_6p_black.png",
            2: "iPhone_6p_white.png",
            3: "iPhone_6p_gold.png"
          }
        }
      },
      color: {
        1: "Black",
        2: "White",
        3: "Gold"
      },
      capacity: {
        1: "16GB",
        2: "32GB",
        3: "64GB",
        4: "128GB"
      },
      carrier: {
        1: "Verizon",
        2: "AT&T",
        3: "Sprint",
        4: "T-Mobile",
        100: "Unlocked",
        300: "Other",
        900: "Unknown"
      }
    }

    var dmgInfo = {
      pwr: "Does Not Turn On",
      canRestr: "Can't Restore With iTunes",
      noWifi: "Doesn't Have Wi-Fi Connectivity",
      noBlth: "Doesn't Have Bluetooth Connectivity",
      wtrDmg: "Has Water Damage",
      hasSvc: "Doesn't Get Network Service",
      iCldLk: "Has An Active iCloud Lock",
      clnESN: "Is Blocked From Your Carrier",
      opnd: "Has Been Opened Before",
      ftGlass: "Has Cracked Front Glass/LCD",
      bkGlass: "Has Cracked Back Glass",
      batt: "Has Poor Battery Life",
      lkBtn: "Has A Broken Lock Button",
      hmBtn: "Has A Broken Home Button",
      volBtn: "Has A Broken Volume Button",
      vbrSwch: "Has A Broken Vibrate Switch",
      chrgr: "Has A Broken Charging Port",
      hpJack: "Has A Broken Headphone Jack",
      spkr: "Has A Broken Bottom Speaker",
      earSpkr: "Has A Broken Ear Speaker",
      mic: "Has A Broken Microphone",
      bkCmra: "Has A Broken Back Camera",
      ftCmra: "Has A Broken Front Camera"
    }
  }

  function setStore(worth, priceList) {

    $(".owned-price-container").html("$" + worth.toString());

    return $(".store-content-wrapper").slideDown(200)

  }


})
