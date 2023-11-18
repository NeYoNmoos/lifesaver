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

  async function addTime(browsingHistory) {
    const today = new Date().toISOString().split('T')[0];
  
    // Get browsingTime from Chrome local storage
    let browsingTime = await new Promise((resolve, reject) => {
      chrome.storage.local.get(["browsingTime"], function (result) {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result.browsingTime);
        }
      });
    });
  
    // Check if browsingTime exists and initialize if not
    if (!browsingTime) {
      browsingTime = {};
      console.log("browsingTime initialized");
      // Save initialized browsingTime to Chrome local storage
      chrome.storage.local.set({ "browsingTime": browsingTime });
    }
  
    // Check if browsingTime for today exists and initialize if not
    if (!browsingTime[today]) {
      browsingTime[today] = {};
      console.log(`browsingTime for ${today} initialized`);
      // Save initialized browsingTime for today to Chrome local storage
      
    }
    
    for (const url in browsingHistory[today]) {
      duration = 'duration';
      time = 0;
      if(!browsingTime[today][url]){
        browsingTime[today][url] = {};
      }
      console.log(url);
      for (const visit of browsingHistory[today][url]) {
        const duration = visit['duration'];
        time += duration;
    }
      time = time/1000;//ms to seconds
      time = time/60;//seconds to minutes
      console.log(time);

      browsingTime[today][url]['time']=time;
    
      // You can perform other operations with the URLs here if needed
    }
    
    chrome.storage.local.set({ "browsingTime": browsingTime });
    }
  