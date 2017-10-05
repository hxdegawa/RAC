$(function(){
  $(".btn-start").click(function(){
    $("html,body").animate({ scrollTop: $(".desc-container").offset().top - 64});
  });
});