$(document).ready(function() {
  $('.fqa-qck-container > a').hover(function() {

    $(this).css('color', '#fcfcfc')
    $(this).css('background-color', "#678ba9")

  }, function() {
    $(this).css('color', '#678ba9')
    $(this).css('background-color', "#f9f9f9")

  })

  function hideQuestions() {
    $('.fqa-q').each(function(i, e) {
      if ($(e).is(":visible")) {
        $(e).slideUp(500)
      }
    })
  }

  function scrollToAnchor(id) {
    var aTag = $(id);
    $('html,body').animate({
      scrollTop: aTag.offset().top
    }, 300);
  }

  $('.fqa-qck-container > a').click(function(e) {

    e.preventDefault()

    var id = $(this).attr('href');
    var sel = '.fqa-q' + id;

    if ($(id).is(":visible")) {
      console.log("hit")
      $(sel).slideUp(500)
      return;
    }

    hideQuestions()

    $(".fqa-instruct").slideUp(500)
    $(sel).slideDown(500, function() {
      //scrollToAnchor(id)
    })
    

  })

});
