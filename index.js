$(function(){
  
  let control = {
    fastForward: false,
    fastRewind: false,
    muted: false
  };
  
  console.log("Replacer loaded!");
  $("head").prepend('<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />');
  $("body").append('<div id="movie-controller"></div>');
  $("#movie-controller").append('<div class="swich-controller swich-left"><i class="material-icons">chevron_left</i></div><div class="swich-controller master"><i class="material-icons">settings</i></div><div class="swich-controller swich-right"><i class="material-icons">chevron_right</i></div><br /><div class="swich-controller col5 rate-left"><i class="material-icons">fast_rewind</i></div><div class="swich-controller col5 mute"><i class="material-icons">volume_mute</i></div><div class="swich-controller col5 fullscreen"><i class="material-icons">fullscreen</i></div><a class="movie-download-link" target="_blank"><div class="swich-controller col5 download"><i class="material-icons">file_download</i></div></a><div class="swich-controller col5 rate-right"><i class="material-icons">fast_forward</i></div>');
  
  $(".movie-download-link").attr({"title": "Download", "download": "Classroom.mp4", "href": document.getElementsByTagName("source")[0].src});
  
  $(".swich-right").click(function(){
    document.getElementsByTagName("video")[0].currentTime += 10;
  });
  
  $(".swich-left").click(function(){
    document.getElementsByTagName("video")[0].currentTime -= 10;
  });
  
  $(".master").click(function(){
    $("#movie-controller").toggleClass("advanced");
  });
  
  $(".rate-right").click(function(){
    control.fastForward = !control.fastForward;
    if(control.fastForward){
      document.getElementsByTagName("video")[0].playbackRate = 2;
    }else{
      document.getElementsByTagName("video")[0].playbackRate = 1;
    }
  });
  
  $(".rate-left").click(function(){
    control.fastRewind = !control.fastRewind;
    if(control.fastRewind){
      document.getElementsByTagName("video")[0].playbackRate = 0.5;
    }else{
      document.getElementsByTagName("video")[0].playbackRate = 1;
    }
  });
  
  $(".mute").click(function(){
    control.muted = !control.muted;
    if(control.muted){
      document.getElementsByTagName("video")[0].muted = true;
    }else{
      document.getElementsByTagName("video")[0].muted = false;
    }
  });
  
  $(".fullscreen").click(function(){
    document.getElementsByTagName("video")[0].webkitRequestFullscreen();
  });
   
  $("#video01").on("timeupdate", function(){
    
  });
});