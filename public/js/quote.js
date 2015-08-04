$(document).ready(function() {


  // Global Vars

  var hoverBorderColor = "#f26ae9";
  var baseBorderColor = "#e8e8e8";
  var selectedBorderColor = "#f26ae9";

  var lastScrollTop = 0;

  var damagedPhone = {};

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

    node.css("border-color", baseBorderColor);
    node.removeClass('selected');
    delete damagedPhone[node.data("attr")];

  }


  // handle marking as selected based on class

  function markSelection(node) {


    if (node.hasClass('border-trans')) {

      if (node.hasClass('no-reset')) {
        node.addClass('selected');
        damagedPhone[node.data("attr")] = node.data("val");
        return;
      }

      node.siblings('.selected').each(function(i, j) {
        unmarkSelection($(j));
      })

      node.css("border-color", selectedBorderColor)
      node.addClass('selected');
      return;
    }


    if (node.hasClass('bg-trans')) {
      
      swapBgTextColor(node)

      if (node.hasClass('no-reset')) {
        node.addClass('selected');
        damagedPhone[node.data("attr")] = node.data("val");
        return;
      }

      node.siblings('.selected').each(function(i, j) {
        unmarkSelection($(j));
      })

      node.addClass('selected');
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



  // Grab data from form option & goto next question

  $(".form-optn").click(function() {

    console.log(damagedPhone)

    var requiredSelections = parseInt($(this).parents(".form-content-wrapper").data("validation"));
    var nextSection = parseInt($(this).parents(".form-content-wrapper").data("section")) + 1;

    if ($(this).hasClass('selected')) {

      unmarkSelection($(this));



    } else {

      markSelection($(this));



    }

    if (requiredSelections) {
      var selected = $(this).parents(".form-content-wrapper").find(".selected").length;
      if (selected === requiredSelections) {
        return //gotoQuestion(nextSection);
      } else {
        return;
      }
    }

    return //gotoQuestion(nextSection);
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


})
