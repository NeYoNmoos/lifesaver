let startTime;
let activeDomain;
let browsingHistory = {};

function getDomain(url) {
  try {
    const hostname = new URL(url).hostname;
    return hostname;
  } catch (e) {
    console.error("Error parsing URL:", e);
    return null;
  }
}

function getCurrentDate() {
  return new Date().toISOString().split("T")[0]; // Gets the current date in YYYY-MM-DD format
}

function updateTimeSpent() {
  if (activeDomain && startTime) {
    const endTime = Date.now();
    const timeSpent = endTime - startTime;
    const currentDate = getCurrentDate();

    if (!browsingHistory[currentDate]) {
      browsingHistory[currentDate] = {};
    }

    if (!browsingHistory[currentDate][activeDomain]) {
      browsingHistory[currentDate][activeDomain] = [];
    }

    browsingHistory[currentDate][activeDomain].push({
      start: new Date(startTime).toISOString(),
      end: new Date(endTime).toISOString(),
      duration: timeSpent,
    });

    chrome.storage.local.set({ browsingHistory }, function () {
      console.log(
        `Browsing history updated for ${activeDomain} on ${currentDate}`
      );
    });

    startTime = undefined; // Reset startTime for the next session
  }
}

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url) {
      const domain = getDomain(tab.url);
      if (domain) {
        updateTimeSpent(); // Update time spent on the previous domain
        startTime = Date.now();
        activeDomain = domain;
      }
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.url) {
    const domain = getDomain(changeInfo.url);
    if (domain && domain !== activeDomain) {
      updateTimeSpent(); // Update time spent on the previous domain
      startTime = Date.now();
      activeDomain = domain;
    }
  }
});

chrome.tabs.onRemoved.addListener(() => {
  updateTimeSpent(); // Update time when a tab is closed
  activeDomain = undefined;
});
