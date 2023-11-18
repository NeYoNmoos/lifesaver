document.addEventListener("DOMContentLoaded", function () {
  loadEvents();
  var openTabButton = document.getElementById("openTabButton");
  openTabButton.addEventListener("click", function () {
    openDetailPage();
  });
});

function openDetailPage() {
  console.log("should open page");
  chrome.tabs.create({ url: chrome.runtime.getURL("./pages/summary.html") });
}

function loadEvents() {
  chrome.storage.local.get(["browsingHistory"], (result) => {
    if (result.browsingHistory) {
      addTime(result.browsingHistory)  
    }
  });
}

function addTime(browsingHistory){
  const today = new Date().toISOString().split('T')[0];
  const browsingTime = chrome.storage.local.get(["browsingTime"]);
  console.log(browsingTime);
  if(!browsingTime[today]){
    browsingTime 
  }
  
  if (browsingHistory[today]) {
  
    for(const url in browsingHistory[today]){
      console.log(url.length);
    }

  }
}