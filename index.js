let globalCurrentTime = 0,
    hasChanged = false;
    

$(function(){ 
  console.log("Replacer loaded!");
  $("#moviePlayer").append('<div id="movie-controller"></div>');
  $("#movie-controller").append('<div  class="swich-controller swich-left">＜</div><div class="swich-controller">操作</div><div class="swich-controller swich-right">＞</div>');
  
  $(".swich-right").click(function(){
    
  });
  
  $(".swich-left").click(function(){
    
  });
  
  $("#video01").on("timeupdate", function(){
    if(hasChanged){
      hasChanged = false;
      this.currentTime = globalCurrentTime;
      console.log("Time changed" + this.currentTime, globalCurrentTime);
    }else{
      globalCurrentTime = this.currentTime;
      console.log("Time matched" + this.currentTime, globalCurrentTime);
    }
  });
});