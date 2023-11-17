let startTime;
let activeDomain;
let domainTimes = {};

function getDomain(url) {
  try {
    const hostname = new URL(url).hostname;
    // Extract the domain. This will include subdomains.
    // Adjust as needed (e.g., removing 'www').
    return hostname;
  } catch (e) {
    console.error("Error parsing URL:", e);
    return null;
  }
}

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    console.log("trying to get tab data!");
    if (tab.url) {
      const domain = getDomain(tab.url);

      if (domain) {
        if (activeDomain && startTime) {
          const timeSpent = Date.now() - startTime;
          domainTimes[activeDomain] =
            (domainTimes[activeDomain] || 0) + timeSpent;
          chrome.storage.local.set({ domainTimes });
        }

        startTime = Date.now();
        activeDomain = domain;
      }
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Additional listener to handle URL changes in the same tab
  if (tab.active && changeInfo.url) {
    const domain = getDomain(changeInfo.url);

    if (domain && domain !== activeDomain) {
      if (activeDomain && startTime) {
        const timeSpent = Date.now() - startTime;
        domainTimes[activeDomain] =
          (domainTimes[activeDomain] || 0) + timeSpent;
        chrome.storage.local.set({ domainTimes });
      }

      startTime = Date.now();
      activeDomain = domain;
    }
  }
});
