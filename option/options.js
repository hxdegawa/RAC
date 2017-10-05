$(function(){
  
  $(window).scroll(function(){
    if($(this).scrollTop() >= 800){
      $(".landing-view").addClass("hide");
    };
  });
  
  $(".btn-start").click(function(){
    $("html,body").animate({ scrollTop: $(".desc-container").offset().top - 64});
  });
  
  $('li[class*="tab-"]').click(function(){
    resetAllWindow();
  });
  
  $(".tab-function").click(function(){
    $(".container-function").addClass("active");
  });
  
  $(".tab-installation").click(function(){
    $(".container-installation").addClass("active");
    $(".desc-container").addClass("active");
  });
  
  $(".tab-contact").click(function(){
//    $(".container-contact").addClass("active");
  });
  
  $(".tab-donation").click(function(){
//    $(".container-donation").addClass("active");
  });
  
  function resetAllWindow(){
    $('div[class*="container-"], .desc-container').removeClass("active");
  };
  
});