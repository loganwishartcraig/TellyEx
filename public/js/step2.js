var issues = {

  pwr: null,
  iCldLk: null,
  wtrDmg: null,
  canRestr: null,
  noWifi: null,
  opnd: null

};

function handleSelection(store, node) {

  var nodeArrtribue = node.data("attr");
  var nodeValue = node.data("val");

  if (node.hasClass("selected")) {

    node.removeClass("selected");
    store[nodeArrtribue] = null;

  } else {

    node.siblings().removeClass("selected");
    node.addClass("selected");

    if (nodeArrtribue === undefined) {
      return;
    }
    store[nodeArrtribue] = nodeValue;
  }

  return;

}

function validateIssues(issues, next) {
console.log("validating");
  var valid = true;
  var invalidProperties = [];

  for (var key in issues) {
    if (issues.hasOwnProperty(key)) {
      if ((issues[key] === null) || ((issues[key] !== 1) && (issues[key] !== 0))) {
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
    pwr: "Please indicate if the phone turns on",
    iCldLk: "Please indicate if the phones locked to an iCloud account",
    wtrDmg: "Please indicate if the phones been affected by water",
    canRestr: "Please indicate if the phone can restore through iTunes",
    noWifi: "Please indicate if the phone can connect to wi-fi networks",
    opnd: "Please indicate if the phones been repaired before"
  };



  missed.forEach(function(item, index) {
    errString += errMessages[item] + "<br>";
  });

  $(".err-text").html(errString);

  return;

}

function setPrevSelections(prevObj) {

  for (var key in prevObj) {
    if (prevObj.hasOwnProperty(key)) {

      if (prevObj[key] === null) {
        issues[key] = null;
        continue;
      }

      issues[key] = prevObj[key];
      var dataAttr = "[data-attr=" + key + "]";
      var dataVal = "[data-val=" + prevObj[key] + "]";

      $(dataAttr + dataVal).addClass("selected");
    }
  }

}


$(document).ready(function() {

  if (sessionStorage.getItem('issues')) {
    console.log("getting prev values");
    setPrevSelections(JSON.parse(sessionStorage.getItem('issues')));
  }

  $(".form-option").click(function() {
    handleSelection(issues, $(this));
    sessionStorage.setItem('issues', JSON.stringify(issues));
    console.log(issues);
  });

  $(".next-btn").click(function() {
    
    validateIssues(issues, function(err) {
      if (err) return setValidationError(err);

      $(".err-text").html("");
      console.log(issues);
      $.ajax({
        url: '/quote/step2',
        type: 'POST',
        data: JSON.stringify(issues),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: true,
        success: function(res) {
          sessionStorage.setItem('issues', JSON.stringify(issues));
          window.location = res.url;
        },
        error: function(res) {
          $(".err-text").html("Something doesn't add up. Please refresh the page.");
          sessionStorage.setItem('issues', null);
        }
      });
    });
  });

});