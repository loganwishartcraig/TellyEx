$(document).ready(function() {

  var order = {
    phone: {brand: 1},
    issues: {}
  }

  // var order = {
  //   phone: {
  //     capacity: 2,
  //     carrier: 3,
  //     color: 2,
  //     model: 2,
  //     brand: 1,
  //   },
  //   issues: {
  //     batt: 0,
  //     bkGlass: 1,
  //     ftGlass: 0,
  //     noBlth: 1,
  //     hasSvc: 0,
  //     hasWifi: 0,
  //     hpJack: 1,
  //     iCldLk: 1,
  //     mic: 1,
  //     opnd: 0,
  //     pwr: 0,
  //     wtrDmg: 1
  //   }
  // };
  // setReview();

  var hoverColor = "#f26ae9";
  var baseColor = "rgb(232, 232, 232)";


  $(".q-wrapper").hide()
  $(".store-wrapper").hide()

  setTimeout(function() {
    $(".intro-txt").fadeOut(500, function() {
      $(".q-wrapper.current").fadeIn(300)
    });
  }, 1500)


  $(".form-optn").hover(function() {

    if ($(this).hasClass('selected')) {
      return
    }
    $(this).css("border-style", "solid");
    $(this).css("border-color", hoverColor);

  }, function() {

    if ($(this).hasClass('selected')) {
      return
    }

    if ((order.phone[$(this).data("attr")] === $(this).data("val")) || (order.issues[$(this).data("attr")] === $(this).data('val'))) {
      return
    }
    $(this).css("border-style", "solid");
    $(this).css("border-color", baseColor);
  })


  $(".model").click(function() {

    getOrderVal($(this))
    markActive($(this))

    setColorCap($(this).data("val"));

    nextQuestion();

  })


  $(".quote-btn").click(function() {

    getOrderVal($(this))
    markActive($(this))

    nextQuestion();

  })




  $(".ans-btn").click(function() {

    getOrderVal($(this))
    markActive($(this))

    if ($(this).hasClass('ans-1')) {
      if ($(".ans-1.selected").length === 2) {
        nextQuestion()
      }
    }

    if ($(this).hasClass('ans-2')) {
      if ($(".ans-2.selected").length === 2) {
        nextQuestion()
      }
    }

    if ($(this).hasClass('ans-3')) {
      if ($(".ans-3.selected").length === 3) {

        if ((order.issues.hasSvc === 1) || (order.issues.hasSvc === 2)) {
          nextQuestion($("#esn"))
        } else {
          nextQuestion($("#opnd"))
        }

      }
    }

    if ($(this).hasClass('ans-4')) {
      if ($(".ans-4.selected").length === 3) {
        nextQuestion()
      }
    }

  })


  $(".dmg-btn").click(function() {

    getOrderVal($(this))
    markActive($(this))

  })


  $(".next").click(function() {

    setReview();
    nextQuestion();

  })


  $(".back").click(function() {

    prevQuestion($(this));

  })


  $(".submit").click(function() {

    $.ajax({
      url: '/quote/submit',
      type: 'POST',
      data: JSON.stringify(order),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      async: true,
      success: function(msg) {
          console.log(msg)
          loadStore(msg);
          nextQuestion();
      },
      error: function(msg) {
        $('.err-txt').html("Oops, something went wrong.<br> Please try submitting again.")
        console.log(msg)
      }
    });

  })

  function setColorCap(val) {

    switch (val) {

      case 1:
        $("#col-gold").hide()
        $("#cap-128").hide()
        $("#cap-32").show()
        break;

      case 2:
        $("#col-gold").show()
        $("#cap-128").hide()
        break;

      case 3:
        $("#col-gold").show()
        $("#cap-32").hide()
        $("#cap-128").show()
        break;

      case 4:
        $("#cap-32").hide()
        $("#cap-128").show()
        break;

      default:
        break;

    }

    return;

  }



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

    $(".review-model").html(staticInfo.model[order.phone.model].name)

    var imgURL = 'url(' + 'images/iPhones/' + staticInfo.model[order.phone.model].img[order.phone.color] + ')';
    $(".detail-block").css("background-image", imgURL)

    $(".review-color").html(staticInfo.color[order.phone.color] + "<br>")
    $(".review-capacity").html(staticInfo.capacity[order.phone.capacity] + "<br>")
    $(".review-carrier").html(staticInfo.carrier[order.phone.carrier])

    $('.review-block').empty()
    for (var key in dmgInfo) {
      if (dmgInfo.hasOwnProperty(key)) {
        if (order.issues[key] === 1) {
          $('.review-block').append('<li class=".review-item">' + dmgInfo[key] + '</li>')
        }
      }
    }

    return;

  }


  function getOrderVal(clickedVal) {

    if (clickedVal.hasClass('selected')) {
      return;
    }

    if (clickedVal.data("attr")) {
      if (clickedVal.hasClass('issue')) {
        return order.issues[clickedVal.data('attr')] = clickedVal.data('val');
      } else {
        order.phone[clickedVal.data("attr")] = clickedVal.data("val");
      }
    }

    return;

  }

  function markActive(clickedVal) {



    var resetType = "default"

    if (clickedVal.hasClass('border-only')) {
      resetType = "borderOnly"
    }

    if (clickedVal.hasClass('no-reset')) {
      resetType = "noReset"
    }


    var clickedSibs = clickedVal.siblings(".selected")

    if (resetType == "default") {

      if (clickedVal.hasClass('selected')) {
        return;
      }

      clickedSibs.css("border-color", baseColor);
      clickedSibs.css("border-style", 'dashed');
      clickedSibs.css("color", clickedSibs.css("background-color"))
      clickedSibs.css("background-color", "#fff")
      clickedSibs.removeClass('selected')

      clickedVal.css("border-color", "transparent");
      clickedVal.css("background-color", clickedVal.css("color"))
      clickedVal.css("color", "#fff")
      clickedVal.addClass('selected')

      return;

    }

    if (resetType == "borderOnly") {

      if (clickedVal.hasClass('selected')) {
        return;
      }

      clickedSibs.css("border-color", baseColor);
      clickedSibs.css("border-style", "dashed");
      clickedSibs.removeClass('selected');

      clickedVal.css("border-color", hoverColor);
      clickedVal.css("border-style", "solid");
      clickedVal.addClass('selected');

      return;

    }

    if (resetType == "noReset") {

      if (clickedVal.hasClass('selected')) {
        if (clickedVal.hasClass('issue')) {
          order.issue[clickedVal.data("attr")] = 0;
        } else {
          order.phone[clickedVal.data("attr")] = 0;
        }


        clickedVal.css("border-color", baseColor);
        clickedVal.css("border-style", 'dashed');
        clickedVal.css("color", clickedVal.css("background-color"))
        clickedVal.css("background-color", "#fff")
        clickedVal.removeClass('selected')
      } else {
        clickedVal.css("border-color", "transparent");
        clickedVal.css("background-color", clickedVal.css("color"))
        clickedVal.css("color", "#fff")
        clickedVal.addClass('selected')
      }

    }

    return;

  }


  function prevQuestion(toRemove) {

    if (toRemove.data("attr") != undefined) {
      if (order.issues[toRemove.data("attr")] != undefined) {
        delete order.issues[toRemove.data("attr")];
      } else if (order.phone[toRemove.data('attr')] != undefined) {
        delete order.phone[toRemove.data('attr')];
      }

      $.each(toRemove.siblings(".q-options").find(".form-optn"), function(i, v) {
        if ($(v).hasClass('selected')) {
          $(v).css("border-color", baseColor);
          $(v).css("color", $(v).css("background-color"))
          $(v).css("background-color", "#fff")
          $(v).removeClass('selected')
        } else {
          $(v).css("border-color", baseColor);
        }
      })


    }

    // if (order.issues[toRemove.data("attr")] != undefined) {
    //   delete order.issues[toRemove.data("attr")];
    // } else if (order.phone[toRemove.data('attr')] != undefined) {
    //   delete order.phone[toRemove.data('attr')];
    // } else {
    //   return;
    // }



    if ($('.visited').length >= 2) {
      $('.current').removeClass('visited')
    }

    $('.current').removeClass('current').fadeOut(300, function() {
      $(".visited").last().fadeIn(300).addClass('current');
    })

    console.log(order)

    return;

  }

  function nextQuestion(toGo) {

    var current = $('.current')
    toGo = toGo || current.next()



    current.removeClass('current').fadeOut(300, function() {
      toGo.fadeIn(300).addClass('current').addClass('visited');
    })

    console.log(order)

    return;

  }


  function loadStore(order) {

    $(".offer-price").html("$" + order.worth.toString())
    $(".model-1-price").html("$" + order.productMinPrice[1])
    $(".model-2-price").html("$" + order.productMinPrice[2])
    $(".model-3-price").html("$" + order.productMinPrice[3])
    $(".model-4-price").html("$" + order.productMinPrice[4])

    return;
  }


})
