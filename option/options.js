$(function(){
  
  $(window).on("resize", function(){
    checkWidth();
  });
  
  $(window).scroll(function(){
    if($(this).scrollTop() >= $(window).height()){
      $(".landing-view").addClass("hide");
    };
  });
  
  $(".btn-start").click(function(){
    $("html,body").animate({scrollTop: $(".desc-container").offset().top - 64});
  });
  
  $(".logo-image").click(function(){
    $(".landing-view").removeClass("hide");
    console.log($(window).height());
    $("html,body").scrollTop($(window).height() - 1);
    $("html,body").animate({scrollTop: $("body").offset().top});
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
    $(".container-contact").addClass("active");
  });
  
  $(".tab-donation").click(function(){
    $(".container-donation").addClass("active");
  });
  
  function checkWidth(){
    if($(window).width() < 800){
      $(".following-step-1 p").eq(0).text("Prepare your computer.");
      $(".following-step-2 p").eq(0).text("Go to [CHROME EXTENSION LINK].");
      $(".following-step-3 p").eq(0).text('Click "Add to chrome".');
      $(".following-step-4 p").eq(0).text("Reload your chrome.");
      $(".following-step-5 p").eq(0).text("Finish!");
    }
  }
  
  function resetAllWindow(){
    $('div[class*="container-"], .desc-container').removeClass("active");
  };
  
  checkWidth();
  
});