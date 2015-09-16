$(document).ready(function() {

  $(".black-bar-content-wrapper").hide();
  $(".black-arrow-container").hide();

  $(".blue-bar-img").click(function() {

    var toShow = $(this).data("show");
    var searchQuery = ".black-bar-content-wrapper#" + toShow;
    
    var showContent = function() {
      $(".placeholder-text").slideUp(100, function() {
        $(searchQuery).slideToggle(200);
      $(searchQuery).addClass("active");
      $(".black-arrow-container").attr("id", toShow);
      $(".black-arrow-container").slideDown(200);
      });
      
    };



    if ($(searchQuery) === undefined) {
      return;
    }

    if ($(searchQuery).hasClass("active")) {
      $(searchQuery).slideToggle(200).removeClass("active");
      $(".black-arrow-container").slideUp(200, function() {
        $(".placeholder-text").slideDown(100);
      });

      return;
    }

    if ($(".black-bar-content-wrapper.active").length !== 0) {
      $(".black-bar-content-wrapper.active").removeClass("active").slideToggle(200);
      showContent();
    } else {
      showContent();
    }
    
    return;

  });

});