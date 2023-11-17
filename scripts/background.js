let startTime;
let activeDomain;
let domainTimes = {};

function getDomain(url) {
  try {
    const hostname = new URL(url).hostname;
    return hostname;
  } catch (e) {
    console.error("Error parsing URL:", e);
    return null;
  }
}

function updateTimeSpent() {
  if (activeDomain && startTime) {
    const timeSpent = Date.now() - startTime;
    domainTimes[activeDomain] = (domainTimes[activeDomain] || 0) + timeSpent;

    chrome.storage.local.set({ domainTimes }, function () {
      console.log(
        `Time updated for ${activeDomain}: ${domainTimes[activeDomain]}`
      );
    });
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
  startTime = undefined;
  activeDomain = undefined;
});
