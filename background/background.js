chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.control == "open_option"){
    chrome.tabs.create({url: "option/options.html" });
  };
});