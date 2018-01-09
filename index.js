function commentToStrings( inputFunc ) {
  return inputFunc.toString().match(/\/\*([^]*)\*\//)[1];
}

function getUrlVars( targetLocation ) {
    var vars = [], hash;
    if (targetLocation === undefined) {
      var locationHref = window.location.href;
    }else{
      var locationHref = window[targetLocation].location.href
    }
    var hashes = locationHref.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

$(function(){

  if(location.href.indexOf('https://secure.nnn.ed.jp/') != -1){

    $("head").append('<link type="image/x-icon" rel="shortcut icon" href="' + chrome.extension.getURL("image/favicon.png") + '" />');
    $("#header > .contents > h1 > a").css("background-image", "url(" + chrome.extension.getURL("image/school_logo.svg") + ")");
    $("#contents").prepend('<div class="status-checker"><h2>Loading...</h2></div>');

    $(window).scroll(function(e){
      if($(window).scrollTop() > 74){
        $(".status-checker").addClass("aligned");
      }else{
        $(".status-checker").removeClass("aligned");
      }
    })

    $.ajax({
      type: 'GET',
      url: "https://secure.nnn.ed.jp/mypage/report/pc/list/index",
      dataType: 'html',
      success: function(data) {
        var result = $($.parseHTML(data));
        var maximumPercentage = result.eq(9).find(".comp > a").length + result.eq(9).find(".normal > a").length;
        var compPercentage = ((result.eq(9).find(".comp > a").length / maximumPercentage) * 100).toFixed(0);

        $(".status-checker > h2").text(compPercentage + "% 完了");

      }, error:function(e) {
        console.log(e);
      }
    });

  };

  if(location.href.indexOf('https://secure.nnn.ed.jp/mypage/report/pc/movie/view?') != -1){

    let automator = (true /*getUrlVars()['rac_auto'] === 'true'*/) ? true : false,
        isFlighted = false,
        movieDuration = 0;

    $("head").find("title").remove();
    $("head").append(`<title>${$("#breadcrumbs > ul > li").eq(2).text()}</title>`);
    $("head").prepend(`<style>@font-face{font-family: "HiraginoSans";src: url("'${chrome.extension.getURL("font/hiragino_sans.ttc")}'");}</style><link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />`);
    $("#movie > h1").after(commentToStrings(()=>{/*
      <div class="help container-items">
        <i class="material-icons">help_outline</i>
      </div>
      <div class="info container-items">
        <i class="material-icons">info_outline</i>
      </div>
      <div class="clipboard container-items">
        <i class="material-icons">link</i>
      </div>
      <textarea class="clipboard-input" />
    */}));
    $("#chapterProgress > h1").after('<div class="flight container-items"><i class="material-icons">flight_takeoff</i></div>');
    $("#chapterProgress > table").after(`<div class="chat-frame"><iframe style="width:100%;height:100%;" scrolling="no" frameborder="0" allowtransparency="true" hspace="0" vspace="0" marginheight="0" marginwidth="0" src="https://www.wireclub.com/chat-rooms/NhsRac${getUrlVars()['chapterId']}/embed"></iframe></div>`);

    /*
    $("#movie_view_").val("前の動画");
    $("#nextMovie").val("次の動画");
    $("#nextTest").val("確認テスト");
    */

    $(".section > p").remove();

    // request notification permission

      if(Notification.permission === 'default'){
        Notification.requestPermission();
      };

    $(".clipboard").click(function(){
      $(".clipboard-input").eq(0).val(window.location.href);
      $(".clipboard-input").eq(0).select();
      document.execCommand('copy');
      $('.tokyo_thumbnail').get(0).contentWindow.postMessage({"toast": "URLをコピー"}, 'https://ww3.tokyo-shoseki.co.jp');
    });

    $(".info").click(function(){
      $('.tokyo_thumbnail').get(0).contentWindow.postMessage($(".section > p").eq(1).text().replace(/\n/g, "").replace(/"/g, "").replace(/，/g, "、").split("・").splice(1, $(".section > p").eq(1).text().split("・").length), 'https://ww3.tokyo-shoseki.co.jp');
    });

    $(".help").click(function(){
      chrome.runtime.sendMessage({control: "open_option"}, function(response) {});
    });

    $(".flight").click(function(){
      isFlighted = !isFlighted;
      $("#chapterProgress > table").toggleClass("onBoard");
      $("#chapterProgress").toggleClass("onBoard")
      $(".chat-frame").toggleClass("onBoard");

      if(isFlighted){
        $(".flight > i").eq(0).text("flight_land");
      }else{
        $(".flight > i").eq(0).text("flight_takeoff");

      };
    });

    $("memo").click(function(){

    });

    $(window).on("message", function(e){

      if ( automator ) {
        $('#movie_view').children('fieldset').children('p.button-right').children('input').attr('data-dw-href', $('#movie_view').children('fieldset').children('p.button-right').children('input').attr('data-dw-href').replace('&rac_auto=true', ''));
        $('#movie_view').children('fieldset').children('p.button-right').children('input').attr('data-dw-href', `${$('#movie_view').children('fieldset').children('p.button-right').children('input').attr('data-dw-href')}&rac_auto=true`);
      }else{
        $('#movie_view').children('fieldset').children('p.button-right').children('input').attr('data-dw-href', $('#movie_view').children('fieldset').children('p.button-right').children('input').attr('data-dw-href').replace('&rac_auto=true', ''));
      }

      if(e.originalEvent.data === "check"){
        if(typeof $("#nextMovie").attr("disabled") === "string"){
          $(".button-right").css("pointer-events", "none");
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
          muted: false,
         paused: false
    },
        volumeStatus = [
          {"status": "最大", "volume": 1, "icon": "volume_up"},
          {"status": "中間", "volume": 0.5, "icon": "volume_down"},
          {"status": "最小", "volume": 0.2, "icon": "volume_mute"}
        ],
        unFinishedTitle = [],
        unFinishedURL = [],
        movieLength = 0,
        volumeIndex = 1,
        controllerVisible = false,
        automated = (true /*getUrlVars('top')['rac_auto'] == 'true'*/) ? true : false,
        toastShow,
        exhibition,
        keyCode,
        keyName;

    $("body").append(commentToStrings(()=>{/*
      <div class="movie-toast">
        <span>
        </span>
      </div>
      <div id="movie-controller">
      </div>
      <div class="undone-list-container movie-cover">
        <h1>未完了レポート</h1>
        <div class="undone-list-container-close">
          <i class="material-icons">close</i>
        </div>
      </div>
      <div class="info-list-container movie-cover">
        <h1>単元目的</h1>
        <div class="info-list-container-close">
          <i class="material-icons">close</i>
        </div>
      </div>
    */}));

    $("body").prepend(commentToStrings(()=>{/*
      <div class="controller">
        <div class="controller-inner-container">
          <div class="progress-bar-container">
            <div class="progress-bar">
            </div>
          </div>
          <p>
            <span class="movie-time">
            </span>
            <span> / </span>
            <span class="movie-duration">
            </span>
          </p>
          <div class="pause">
            <i class="material-icons icon-pause">pause</i>
          </div>
          <div class="mute">
            <i class="material-icons icon-mute">volume_up</i>
          </div>
        </div>
      </div>
    */}));

    $("head").prepend('<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />');

    $("#movie-controller").append(commentToStrings(()=>{/*
      <div class="swich-controller swich-left">
        <i class="material-icons">chevron_left</i>
      </div>
      <div class="swich-controller control">
        <i class="material-icons">videogame_asset</i>
      </div>
      <div class="swich-controller master">
        <i class="material-icons">settings</i>
      </div>
      <div class="swich-controller volume">
        <i class="material-icons volume-icon">volume_up</i>
      </div>
      <div class="swich-controller swich-right">
        <i class="material-icons">chevron_right</i>
      </div>
      <br />
      <div class="swich-controller col5 rate-left">
        <i class="material-icons">fast_rewind</i>
      </div>
      <div class="swich-controller col5 automate">
        <i class="material-icons icon-automate">explore</i>
      </div>
      <div class="swich-controller col5 fullscreen">
        <i class="material-icons">fullscreen</i>
      </div>
      <div class="swich-controller col5 check-list">
        <i class="material-icons">list</i>
      </div>
      <a class="movie-download-link" target="_blank">
        <div class="swich-controller col5 download">
          <i class="material-icons">file_download</i>
        </div>
      </a>
      <div class="swich-controller col5 rate-right">
        <i class="material-icons">fast_forward</i>
      </div>
    */}));

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
          console.log(e);
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
        toast("音声をミュート");
      }else{
        document.getElementsByTagName("video")[0].muted = false;
        $(".icon-mute").text("volume_up");
        toast("ミュートを解除");
      };
    });

    $(".pause").click(function(){
      control.paused = !control.paused;
      if(control.paused){
        document.getElementsByTagName("video")[0].pause();
        $(".icon-pause").text("play_arrow");
        toast("動画を停止");
      }else{
        document.getElementsByTagName("video")[0].play();
        $(".icon-pause").text("pause");
        toast("動画を再開");
      };
    });

    $(".automate").click(function(){
      $(".icon-automate").toggleClass("inactive");
      automated = !automated;
      window.parent.postMessage(automated, 'https://secure.nnn.ed.jp');
      if(automated){
        toast("自動化を始動");
      }else{
        toast("自動化を解除");
      }
    });

    $(".fullscreen").click(function(){
      document.getElementsByTagName("video")[0].webkitRequestFullscreen();
    });

    $(".check-list").click(function(){
      $(".info-list-container").removeClass("visible");
      $(".undone-list-container").toggleClass("visible");
      $(".controller").removeClass("first-exhibition");
      $(".controller").removeClass("visible");
      toast("未完了リストを表示");
    });

    $(".undone-list-container-close").click(function(){
      $(".undone-list-container").removeClass("visible");
    });

    $(".info-list-container-close").click(function(){
      $(".info-list-container").removeClass("visible");
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
        automated = false;
        $(".control, .swich-right, .swich-left, .fullscreen, .automate, .rate-right, .rate-left").remove();
        toast("初視聴動画");
      }else if(e.originalEvent.data === "movie_stopped"){
        toast("自動進行停止");
      }else if(typeof e.originalEvent.data === "object" && e.originalEvent.data.toast){
        toast(e.originalEvent.data.toast);
      }else if(typeof e.originalEvent.data === "object"){
        if(e.originalEvent.data.length > 0){
          if($(".info-list-container").find("p").length < 1){
            for(var i = 0; i < e.originalEvent.data.length; i++){
              $(".info-list-container").append('<p>' + e.originalEvent.data[i] + '</p><hr />');
            }
          }
        }else{
          if($(".info-list-container").find("h2").length < 1){
            $(".info-list-container").append('<h2 class="no-list-available">この単元に目標は設定されていません。</h2>');
          }
        }

        $(".undone-list-container").removeClass("visible");
        $(".info-list-container").toggleClass("visible");
        controllerVisible = false;
        $(".controller").removeClass("first-exhibition");
        $(".controller").removeClass("visible");
        toast("本単元の授業目的");
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

    $(window).keyup(function(keyEvt){
      keyCode = keyEvt.which;
      keyName = String.fromCharCode(keyCode);
      switch(keyName){
        case "F":
          $(".swich-controller.col5.fullscreen").click();
        break;
        case "S":
          $(".swich-controller.swich-right").click();
        break;
        case "B":
          $(".swich-controller.swich-left").click();
        break;
        case "D":
          $(".swich-controller.col5.download").click();
        break;
        case "L":
          $(".swich-controller.col5.check-list").click();
        break;
        case "V":
          $(".swich-controller.volume").click();
        break;
        case "C":
          $(".swich-controller.control").click();
        break;
        case "A":
          $(".swich-controller.col5.automate").click();
        break;
        case "2" || "２":
          $(".swich-controller.col5.rate-right").click();
        break;
        case "5" || "５":
          $(".swich-controller.col5.rate-left").click();
        break;
        case "M":
          $(".mute").click();
        break;
        case " " || "　":
          $('.material-icons.icon-pause').click();
        break;
      }
    });

  };

//  $(window).ready(function(){
//
//    $("body").append('<div class="display-cover"></div><div class="concealer-input-box"><h2>URLを挿入</h2><input type="text" class="concealer-input" /></div>');
//
//    chrome.storage.local.get("concealerImage", function(imageLink) {
//
//      if(imageLink.concealerImage.indexOf("http") >= 0){
//
//        $(".display-cover").eq(0).css("background-image", "url(" + imageLink.concealerImage + ")");
//        $(".concealer-input").eq(0).val(imageLink.concealerImage);
//
//      }else{
//
//        $(".display-cover").eq(0).css("background-image", "url(" + chrome.extension.getURL("image/no_image.svg") + ")");
//
//      };
//    });
//
//
//    $(window).keydown(function(e){
//
//      if(e.keyCode === 219){
//
//        if(event.shiftKey){
//
//          chrome.storage.local.set({"concealerImage": $(".concealer-input").eq(0).val()}, function(){});
//          $(".display-cover").eq(0).css("background-image", "url(" + $(".concealer-input").eq(0).val() + ")");
//
//        }else{
//
//          $(".display-cover").eq(0).toggleClass("toggled");
//          $(".concealer-input-box").eq(0).removeClass("visible");
//
//        };
//      };
//
//      if(e.keyCode === 221){
//        $(".concealer-input-box").eq(0).toggleClass("visible");
//      };
//
//    });
//
//  });

});
