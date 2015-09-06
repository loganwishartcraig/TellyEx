var phone = {
  model: null,
  color: null,
  capacity: null,
  carrier: null
};

function handleSelection(node) {

  if (node.hasClass("selected")) {

    node.removeClass("selected");
    if (phone[node.data("attr")]) phone[node.data("attr")] = null;

  } else {

    node.siblings().removeClass("selected");
    node.addClass("selected");

    if (node.data("attr") === undefined) {
      return;
    }
    phone[node.data("attr")] = node.data("val");
  }

  return;

}

function markActive(node) {
  if (node.hasClass("active")) {
    node.removeClass("active");
    return;
  }
  node.addClass("active");
  return;
}

function validatePhone(phone, next) {

  var valid = true;

  var validValues = {model: [1, 2, 3, 4],
                     color: [1, 2, 3],
                     capacity: [1, 2, 3],
                     carrier: [1, 2, 3, 4, 5, 100, 300, 900]};

  var invalidProperties = [];

  for (var key in phone) {
    if (phone.hasOwnProperty(key)) {
      if ((phone[key] === null) || (validValues[key].indexOf(phone[key]) === -1)) {
        valid = false;
        invalidProperties.push(key);
      }
    }
  }
  
  if (valid) {
    next(null);
  } else {
    next(invalidProperties);
  }

}

function setValidationError(missed) {

  var errString = "";

  for (var i = 0; i < missed.length; i++) {
    errString += "Please select a " + missed[i] + ".<br>";
  }

  $(".err-text").html(errString);

  return;

}

function setPrevSelections(prevObj) {

  for (var key in prevObj) {
    if (prevObj.hasOwnProperty(key)) {

      if (prevObj[key] === null) {
        phone[key] = null;
        continue;
      }

      phone[key] = prevObj[key];
      var dataAttr = "[data-attr=" + key + "]";
      var dataVal = "[data-val=" + prevObj[key] + "]";

      $(dataAttr + dataVal).addClass("selected");

      if (key === 'carrier') {
        setCarrerSelection($(dataAttr + dataVal));
      }
    }
  }

}

function setCarrerSelection(node) {
  if (node.hasClass("selected")) {
      $(".q-carrier-selection-default").html(node.html());
      $(".q-carrier-selection-default").css("color", "#202020");
  } else {
    $(".q-carrier-selection-default").html("Select Carrier...");
    $(".q-carrier-selection-default").css("color", "#ABABAB");
  }

  return;
}

$(document).ready(function() {


  if (sessionStorage.getItem('phone')) {
    setPrevSelections(JSON.parse(sessionStorage.getItem('phone')));
  }

  $(".form-option").click(function() {
    handleSelection($(this));
    sessionStorage.setItem('phone', JSON.stringify(phone));
    console.log(phone);
  });

  $(".q-carrier-options").click(function() {
    markActive($(this));
    if ($(this).hasClass('active')) {
      $(".q-carrier-arrow").fadeOut(100);
    } else {
      $(".q-carrier-arrow").fadeIn(100);
    }
  });
  
  $(".q-carrier").click(function() {
    handleSelection($(this));
    setCarrerSelection($(this));
    sessionStorage.setItem('phone', JSON.stringify(phone));
    console.log(phone);
  });
  

  $(".next-btn").click(function() {
    
    validatePhone(phone, function(err) {
      if (err) return setValidationError(err); 

      $(".err-text").html("");
      console.log(phone);
      $.ajax({
        url: '/quote/step1',
        type: 'POST',
        data: JSON.stringify(phone),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: true,
        success: function(res) {
          sessionStorage.setItem('phone', JSON.stringify(phone));
          window.location = res.url;
        },
        error: function(res) {
          $(".err-text").html("Something doesn't add up. Please refresh the page.");
          sessionStorage.setItem('phone', null);
        }
      });
    });
  });

});