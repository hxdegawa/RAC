chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  
  if(request.control == "open_option"){
    chrome.tabs.create({url: "option/options.html" });
  };
  
  if(request.control == "request_user"){
    chrome.identity.getProfileUserInfo(function(userInfo) {
      sendResponse({email: userInfo.email, id: userInfo.id});
    });
    return true;
  };
  
});