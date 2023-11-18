document.addEventListener('DOMContentLoaded', function() {

  const summary = document.getElementById('summary');

  var openTabButton = document.getElementById("openTabButton");
  openTabButton.addEventListener("click", function () {
    openDetailPage();
  });

  function openDetailPage() {
    console.log("should open page");
    chrome.tabs.create({ url: chrome.runtime.getURL("./pages/homepage.html") });
  }

  function processEvents(browsingHistory) {
    let events = [];
    for (const [date, domains] of Object.entries(browsingHistory)) {
      for (const [domain, sessions] of Object.entries(domains)) {
        sessions.forEach((session) => {
          events.push({
            title: domain,
            start: session.start,
            end: session.end,
            icon: session.favicon
            // Additional properties if needed
          });
        });
      }
    }
    return events;
  }
/*
  function loadEvent() {
    chrome.storage.local.get(["browsingHistory"], (result) => {
      if (result.browsingHistory) {
        var events = processEvents(result.browsingHistory);
        events = events.sort((a, b) => b.duration - a.duration);
        events = events.slice(0, 3);

        events.forEach((event) => {
          summary.appendChild(new WebpageTimer());
        });
      }
    });
  }*/
/*
  function loadEvent() {
    return new Promise((resolve) => {
      chrome.storage.local.get(["browsingHistory"], (result) => {
        if (result.browsingHistory) {
          var events = processEvents(result.browsingHistory);
          events = events.sort((a, b) => b.duration - a.duration);
          events = events.slice(0, 3);
  
          resolve(events);
        }
      });
    });
  }
  
  loadEvent().then((events) => {
    events.forEach((event) => {
      console.log(event)
      summary.appendChild(new WebpageTimer());
    });
  });

  loadEvent();*/
});