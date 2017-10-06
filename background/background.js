chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.control == "open_option"){
    chrome.tabs.create({url: "option/options.html" });
  };
  
  if (request.control == "request_user"){
    chrome.identity.getProfileUserInfo(function(userInfo) {
     /* Use userInfo.email, or better (for privacy) userInfo.id
        They will be empty if user is not signed in in Chrome */
      sendResponse({email: userInfo.email, id: userInfo.id});
    });
    return true;
  }
});