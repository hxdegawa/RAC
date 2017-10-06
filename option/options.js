let toastTimeout,
    userEmail,
    userId;

$(function(){
  
  chrome.runtime.sendMessage({control: "request_user"}, function(response) {
    userEmail = response.email;
    userId = response.id;
  });
  
  $(window).on("resize", function(){
    checkWidth();
  });
  
  $(window).scroll(function(){
    if($(this).scrollTop() >= $(window).height()){
      $(".landing-view").addClass("hide");
      $(".desc-container").removeClass("disabled");
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
    $(".desc-container").addClass("disabled");
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
  
  $(".mail-form-submit").click(function(){
    if($(".name").val().length > 0 && $(".mail").val().length > 0 && $(".opinion").val().length > 0){

      $(".mail-form").children().addClass("submitted");
      $(".mail-form").append('<img class="form-submitted-icon-border" src="../image/check_border.svg" alt="" /><img class="form-submitted-icon" src="../image/check.svg" alt="" />');
      setTimeout(function(){$(".form-submitted-icon").addClass("active")}, 1500);
      toast("submitted")
      mailSubmit();
      
      
    }else{
      toast("please fill all");
    }
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
  
  function mailSubmit(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://maker.ifttt.com/trigger/mail_submit/with/key/chZq40Tri-7F73obbMC_IK?value1="+$(".name").val()+"&value2="+userEmail + " " + userId +"&value3="+$(".opinion").val());
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
  }
  
  function toast(string){
    
    $(".toast").text(string);
    
    if($(".toast").hasClass("visible")){
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(function(){
        $(".toast").removeClass("visible");
      }, 2000);
    }else{
      $(".toast").addClass("visible");
      toastTimeout = setTimeout(function(){
        $(".toast").removeClass("visible");
      }, 2000);
    };
    
  }
  
  checkWidth();
  
});