var componenets = {
  ftGlass: null,
  housing: null,
  batt: null,
  volBtn: 0,
  lkBtn: 0,
  hmBtn: 0,
  vbrSwch: 0,
  bkCmra: 0,
  ftCmra: 0,
  spkr: 0,
  earSpkr: 0,
  hpJack: 0,
  mic: 0,
  chrgr: 0
};


function handleSelection(store, node) {

  var nodeArrtribue = node.data("attr");
  var nodeValue = node.data("val");

  if (node.hasClass("selected")) {

    node.removeClass("selected");
    if (node.hasClass("default-no")) {
      store[nodeArrtribue] = 0;
      return;
    }

    store[nodeArrtribue] = null;
    return;

  } else {

    if (!(node.hasClass('multi-select'))) node.siblings().removeClass("selected");
    node.addClass("selected");

    if (nodeArrtribue === undefined) {
      return;
    }
    store[nodeArrtribue] = nodeValue;
  }

  return;

}


function validateComponents(componenets, next) {
  console.log("validating");
  var valid = true;
  var invalidProperties = [];

  for (var key in componenets) {
    if (componenets.hasOwnProperty(key)) {
      if ((componenets[key] === null) || ((componenets[key] !== 1) && (componenets[key] !== 0))) {

        valid = false;
        invalidProperties.push(key);
      }
    }
  }
  if (valid) {
    console.log("validated");
    next(null);
  } else {
    next(invalidProperties);
  }

}


function setValidationError(missed) {
  console.log(missed);

  var errString = "";
  var errMessages = {
    ftGlass: "Please let us know if the screen is damaged",
    housing: "Please let us know if the housing is bent",
    batt: "Please tell us about your battery"
  };

  for (var i = 0; i < missed.length; i++) {
    errString += errMessages[missed[i]] + ".<br>";
  }

  $(".err-text").html(errString);

  return;

}

function setPrevSelections(store, prevObj) {

  for (var key in prevObj) {
    if (prevObj.hasOwnProperty(key)) {

      if (prevObj[key] === null) {
        store[key] = null;
        continue;
      }

      store[key] = prevObj[key];
      var dataAttr = "[data-attr=" + key + "]";
      var dataVal = "[data-val=" + prevObj[key] + "]";

      $(dataAttr + dataVal).addClass("selected");
    }
  }

}



$(document).ready(function() {

  if (sessionStorage.getItem('componenets')) {
    console.log("getting prev values");
    setPrevSelections(componenets, JSON.parse(sessionStorage.getItem('componenets')));
  }


  $(".form-option").click(function() {
    handleSelection(componenets, $(this));
    sessionStorage.setItem('componenets', JSON.stringify(componenets));
    console.log(componenets);
  });


  $(".next-btn").click(function() {
    
    validateComponents(componenets, function(err) {
      if (err) return setValidationError(err);

      $(".err-text").html("");
      console.log(componenets);
      $.ajax({
        url: '/quote/step3',
        type: 'POST',
        data: JSON.stringify(componenets),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: true,
        success: function(res) {
          sessionStorage.setItem('componenets', JSON.stringify(componenets));
          window.location = res.url;
        },
        error: function(res) {
          $(".err-text").html("Something doesn't add up. Please refresh the page.");
          sessionStorage.setItem('componenets', null);
        }
      });
    });
  });


});