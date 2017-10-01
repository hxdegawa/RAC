$(function(){
  
  if(location.href.indexOf('https://secure.nnn.ed.jp/') != -1){
    $("head").append('<link type="image/x-icon" rel="shortcut icon" href="' + chrome.extension.getURL("image/favicon.png") + '" />');
  };
  
  if(location.href.indexOf('https://secure.nnn.ed.jp/mypage/report/pc/movie/view?') != -1){
    
    let automator = true,
        movieDuration = 0;
    
    $("head").find("title").remove();
    $("head").append('<title>' + $("#breadcrumbs > ul > li").eq(2).text() + '</title>');
    
    $(window).on("message", function(e){
      
      if(e.originalEvent.data === "check"){
        if(typeof $("#nextMovie").attr("disabled") === "string"){
          $('.tokyo_thumbnail').get(0).contentWindow.postMessage('not_done', 'https://ww3.tokyo-shoseki.co.jp');
        }else{
          $('.tokyo_thumbnail').get(0).contentWindow.postMessage('already_done', 'https://ww3.tokyo-shoseki.co.jp');
        };
      }else if(typeof e.originalEvent.data === "object"){
        movieDuration = e.originalEvent.data.movieLength;
        setTimeout(function(){
          if(automator){
            if($("#nextMovie").length){
              $("#nextMovie").click();
              new Notification("Improve'N", {body: "次の動画に移動します", icon: chrome.extension.getURL("image/favicon.png")}).show();
            }else if($("#nextTest").length){
              $("#nextTest").click();
              new Notification("Improve'N", {body: "確認テストに移動します", icon: chrome.extension.getURL("image/favicon.png")}).show();
            };
          }else{
            $('.tokyo_thumbnail').get(0).contentWindow.postMessage('movie_stopped', 'https://ww3.tokyo-shoseki.co.jp');
            new Notification("Improve'N", {body: "自動再生が停止されました", icon: chrome.extension.getURL("image/favicon.png")}).show();
          };
        },movieDuration * 1000);
      }else if(typeof e.originalEvent.data === "boolean"){
        automator = e.originalEvent.data;
      }else if(e.originalEvent.data === "reading_error"){
        new Notification("Improve'N", {body: "未完了リストの読み取りに失敗しました ネットワーク状況を確認してください", icon: chrome.extension.getURL("image/favicon.png")}).show();
      };

    });
    
    $(function(){
      if(Notification.permission === 'default'){
        Notification.requestPermission();
      };
    });
    
  };
  
  if(location.href.indexOf('https://ww3.tokyo-shoseki.co.jp/api/dwango/requestContents.php?') != -1){
  
    let control = {
    fastForward: false,
     fastRewind: false,
          muted: false
  },
        volumeStatus = [
          {"status": "最大", "volume": 1, "icon": "volume_up"},
          {"status": "中間", "volume": 0.5, "icon": "volume_down"},
          {"status": "最小", "volume": 0.2, "icon": "volume_mute"}
        ],
        volumeIndex = 1,
        unFinishedTitle = [],
        unFinishedURL = [],
        controllerVisible = false,
        automated = true,
        toastShow,
        exhibition;

    $("body").append('<div class="movie-toast"><span></span></div><div id="movie-controller"></div><div class="undone-list-container"><h1>未完了レポート</h1><div class="undone-list-container-close"><i class="material-icons">close</i></div></div>');
    $("body").prepend('<div class="controller"><div class="controller-inner-container"><div class="progress-bar-container"><div class="progress-bar"></div></div><p><span class="movie-time"></span><span> / </span><span class="movie-duration"></span></p><div class="mute"><i class="material-icons icon-mute">volume_up</i></div></div></div>');
    $("head").prepend('<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />');
    $("#movie-controller").append('<div class="swich-controller swich-left"><i class="material-icons">chevron_left</i></div><div class="swich-controller control"><i class="material-icons">videogame_asset</i></div><div class="swich-controller master"><i class="material-icons">settings</i></div><div class="swich-controller volume"><i class="material-icons volume-icon">volume_up</i></div><div class="swich-controller swich-right"><i class="material-icons">chevron_right</i></div><br /><div class="swich-controller col5 rate-left"><i class="material-icons">fast_rewind</i></div><div class="swich-controller col5 automate"><i class="material-icons icon-automate">explore</i></div><div class="swich-controller col5 fullscreen"><i class="material-icons">fullscreen</i></div><div class="swich-controller col5 check-list"><i class="material-icons">list</i></div><a class="movie-download-link" target="_blank"><div class="swich-controller col5 download"><i class="material-icons">file_download</i></div></a><div class="swich-controller col5 rate-right"><i class="material-icons">fast_forward</i></div>');

    //  create list of undone report
  
    $(function(){

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
          window.parent.postMessage('reading_error', 'https://secure.nnn.ed.jp');
        }
      });
      
      window.parent.postMessage('check', 'https://secure.nnn.ed.jp');
      
    });
    
    //  setting of movie downloader

    $(".movie-download-link").attr({
      "title": "Download", "download": "Classroom.mp4", "href": document.getElementsByTagName("source")[0].src
    });
    
    //  click detection & functions for each buttons

    $(".control").click(function(){
      $(".controller").toggleClass("visible");
      controllerVisible = !controllerVisible;
      if($(".controller").hasClass("visible")){
        $(".controller").addClass("first-exhibition");
        window.clearTimeout(exhibition);
        exhibition = setTimeout(function(){$(".controller").removeClass("first-exhibition")},1500);
      }
    });
    
    $(".volume").click(function(){
        document.getElementsByTagName("video")[0].volume = volumeStatus[volumeIndex].volume;
        toast("音量を" + volumeStatus[volumeIndex].status + "に設定");
        $(".volume-icon").text(volumeStatus[volumeIndex].icon);
      if(volumeIndex !== 2){
        volumeIndex ++;
      }else{
        volumeIndex = 0;
      };
    });
    
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
        $(".icon-mute").text("volume_off");
      }else{
        document.getElementsByTagName("video")[0].muted = false;
        $(".icon-mute").text("volume_up");
      };
      toast("音声をミュート");
    });
    
    $(".automate").click(function(){
      $(".icon-automate").toggleClass("inactive");
      automated = !automated;
      window.parent.postMessage(automated, 'https://secure.nnn.ed.jp');
      if(automated){
        toast("自動化を解除");
      }else{
        toast("自動化を始動");
      }
    });

    $(".fullscreen").click(function(){
      document.getElementsByTagName("video")[0].webkitRequestFullscreen();
    });
    
    $(".check-list").click(function(){
      $(".undone-list-container").toggleClass("visible");
      toast("未完了リストを表示");
    });

    $(".undone-list-container-close").click(function(){
      $(".undone-list-container").removeClass("visible");
    });
    
    $(".progress-bar-container").click(function(e){
      $(".progress-bar").css("width", e.offsetX / 585 * 100 + "%");
      document.getElementsByTagName("video")[0].currentTime = document.getElementsByTagName("video")[0].duration * e.offsetX / 585;
      document.getElementsByTagName("video")[0].play();
    });
    
    //  time update for progress bar
    
    $("#video01").on("timeupdate", function(){
      $(".progress-bar").css("width", this.currentTime / this.duration * 100 + "%");
      $(".movie-time").text(Math.floor(this.currentTime / 60) + ":" + ("0" + Math.round(this.currentTime % 60)).slice(-2));
    });
    
    // checking movie duration 
    
    $("#video01").on("canplaythrough", function(){
      $(this).removeAttr("controls");
      $(".movie-duration").text((Math.floor(document.getElementsByTagName("video")[0].duration / 60)) + ":" + ("0" + Math.round(document.getElementsByTagName("video")[0].duration % 60)).slice(-2));
      window.parent.postMessage({"movieLength": this.duration}, 'https://secure.nnn.ed.jp');
    });
    
    $(window).on("message", function(e){
      if(e.originalEvent.data === "already_done"){
        toast("復習動画");
      }else if(e.originalEvent.data === "not_done"){
        toast("初視聴動画");
      }else if(e.originalEvent.data === "movie_stopped"){
        toast("自動進行停止");
      };
    });
    
    function toast(message){
      $(".movie-toast > span").text(message);
      $(".movie-toast").addClass("visible");
      if(controllerVisible){$(".movie-toast").addClass("dodge")};
      window.clearTimeout(toastShow);
      toastShow = setTimeout(function(){
        $(".movie-toast").removeClass("visible");
        $(".movie-toast").removeClass("dodge");
      }, 2000);
    };
    
  };
  
});