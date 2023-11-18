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

  function loadEvent() {
    return new Promise((resolve) => {
      chrome.storage.local.get(["browsingHistory"], (result) => {
        console.log(result);
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
      var newText = document.createTextNode('This is a new paragraph.');

      const child = `<style>
      /* Include Tailwind styles within the shadow DOM */
      @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
      @import url('/dist/styles.css');
    
      .edit-container {
        @apply flex items-center space-x-2;
      }
    
      input {
        @apply px-2 py-1 border;
      }
    </style>
    <div class="page-component">
      <p class="text-gray-600">${event.title}</p>
      <div class="flex space-x-4 items-center mt-4 edit-container">
        <img class="w-16 h-16 border" id="imageSource" src="${event.icon}">
        <canvas class="w-16 h-16 border"></canvas>
        <input class="w-24 px-2 py-1 border" style="display: none;">
        <button class="bg-blue-500 text-white px-4 py-2 rounded">
          <i class="fas fa-pen"></i> Edit
        </button>
        <button class="bg-red-500 text-white px-4 py-2 rounded">
          <i class="fas fa-ban"></i> Block
        </button>
      </div>
    </div>`
      summary.insertAdjacentHTML('beforeend', child);
    });
  });

  loadEvent();
});