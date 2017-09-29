$(function(){
  
  if(location.href.indexOf('https://ww3.tokyo-shoseki.co.jp/api/dwango/requestContents.php?') != -1){
  
    let control = {
    fastForward: false,
     fastRewind: false,
          muted: false
  },
      unFinishedTitle = [],
      unFinishedURL = [],
      toastShow; 

    $("body").append('<div class="movie-toast"><span>おせちんこ</span></div><div id="movie-controller"></div><div class="undone-list-container"><h1>未完了レポート</h1><div class="undone-list-container-close"><i class="material-icons">close</i></div></div>');
    $("head").prepend('<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />');
    $("#movie-controller").append('<div class="swich-controller swich-left"><i class="material-icons">chevron_left</i></div><div class="swich-controller master"><i class="material-icons">settings</i></div><div class="swich-controller swich-right"><i class="material-icons">chevron_right</i></div><br /><div class="swich-controller col5 rate-left"><i class="material-icons">fast_rewind</i></div><div class="swich-controller col5 mute"><i class="material-icons">volume_mute</i></div><div class="swich-controller col5 fullscreen"><i class="material-icons">fullscreen</i></div><div class="swich-controller col5 check-list"><i class="material-icons">list</i></div><a class="movie-download-link" target="_blank"><div class="swich-controller col5 download"><i class="material-icons">file_download</i></div></a><div class="swich-controller col5 rate-right"><i class="material-icons">fast_forward</i></div>');

    //  create list of undone report
  
    $(function(){

      $("body").append('');
      
      $.ajax({
        type: 'GET',
        url: "https://secure.nnn.ed.jp/mypage/report/pc/list/index",
        dataType: 'html',
        success: function(data) {
          var result = $($.parseHTML(data));
          for(var i = 0; i < result.eq(9).find(".normal > a").length; i++){unFinishedTitle.push(result.eq(9).find(".normal > a")[i].text)};
          for(var i = 0; i < result.eq(9).find(".normal > a").length; i++){unFinishedURL.push("https://secure.nnn.ed.jp" + result.eq(9).find(".normal > a").eq(i).attr("href"))};
          for(var i = 0; i < result.eq(9).find(".normal > a").length; i++){
            $(".undone-list-container").append('<p class="undone-list"><a target="_blank" href="' + unFinishedURL[i] + '">' + unFinishedTitle[i] + '</a></p><hr />');
          };
        }, error:function(e) {
          console.log(e);
        }
      });
      
      $(".undone-list-container-close").click(function(){
        $(".undone-list-container").removeClass("visible");
      });
      
    });
    
    $(".movie-download-link").attr({"title": "Download", "download": "Classroom.mp4", "href": document.getElementsByTagName("source")[0].src});

    $(".swich-right").click(function(){
      document.getElementsByTagName("video")[0].currentTime += 10;
      toast("10秒先送り");
    });

    $(".swich-left").click(function(){
      document.getElementsByTagName("video")[0].currentTime -= 10;
      toast("10秒巻き戻します。");
    });

    $(".rate-right").click(function(){
      control.fastForward = !control.fastForward;
      control.fastRewind = false;
      if(control.fastForward){
        document.getElementsByTagName("video")[0].playbackRate = 2;
      }else{
        document.getElementsByTagName("video")[0].playbackRate = 1;
      };
      toast("2倍速で再生");
    });

    $(".rate-left").click(function(){
      control.fastRewind = !control.fastRewind;
      control.fastForward = false;
      if(control.fastRewind){
        document.getElementsByTagName("video")[0].playbackRate = 0.5;
      }else{
        document.getElementsByTagName("video")[0].playbackRate = 1;
      };
      toast("0.5倍速で再生");
    });

    $(".master").click(function(){
      $("#movie-controller").toggleClass("advanced");
      toast("全機能を表示");
    });

    $(".mute").click(function(){
      control.muted = !control.muted;
      if(control.muted){
        document.getElementsByTagName("video")[0].muted = true;
      }else{
        document.getElementsByTagName("video")[0].muted = false;
      };
      toast("音声をミュート");
    });

    $(".fullscreen").click(function(){
      document.getElementsByTagName("video")[0].webkitRequestFullscreen();
    });
    
    $(".check-list").click(function(){
      $(".undone-list-container").toggleClass("visible");
      toast("未完了リストを表示");
    });

    $("#video01").on("timeupdate", function(){

    });
    
    function toast(message){
      $(".movie-toast > span").text(message);
      $(".movie-toast").addClass("visible");
      window.clearTimeout(toastShow);
      toastShow = setTimeout(function(){
        $(".movie-toast").removeClass("visible");
      }, 2000);
    };
    
  };
});