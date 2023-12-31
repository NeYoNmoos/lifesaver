document.addEventListener('DOMContentLoaded', function() {
  loadEvents();

  const summary = document.getElementById('summary');

  var openTabButton = document.getElementById("openTabButton");
  openTabButton.addEventListener("click", function () {
    openDetailPage();
  });

  function openDetailPage() {
    console.log("should open page");
    chrome.tabs.create({ url: chrome.runtime.getURL("./pages/homepage.html") });
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

  function subtractTime(timeString1, timeString2) {
    const date1 = new Date(timeString1);
    const date2 = new Date(timeString2);

    // Calculate the time difference in milliseconds
    const timeDifference = date1 - date2;

    // Convert the time difference to hours and minutes
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    console.log(hours);

    const formattedResult = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    return formattedResult;
  }
  
  loadEvent().then((events) => {
    for(let indexEvent = 0; indexEvent < events.length; indexEvent++){
      console.log(events[indexEvent])
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
    <div class="page-component mb-6">
          <p class="text-2xl text-text">${events[indexEvent].title}</p>
          <div class="flex space-x-4 items-center mt-4 edit-container">
            <img class="w-16 h-16 border" id="imageSource" src="${events[indexEvent].icon}">
            <div class="chart-container">
              <table class="text-base">
                <tr>
                  <td class="px-2 py-1">timeonline</td>
                  <td class="px-2 py-1">${subtractTime(events[indexEvent].end, events[indexEvent].start)}</td>
                </tr>
                <tr>
                  <td class="px-2 py-1">limit</td>
                  <td class="px-2 py-1">24h</td>
                </tr>
              </table>
              <input class="w-32 text-center px-1 mx-1 py-2 text-base border" style="display: none;">
            </div>
            <button class="bg-blue-500 text-white text-base px-4 py-2 rounded">
              <i class="fas fa-pen"></i> Edit
            </button>
            <button class="bg-red-500 text-white text-base px-4 py-2 rounded">
              <i class="fas fa-ban"></i> Block
            </button>
          </div>
        </div>`
      summary.insertAdjacentHTML('beforeend', child);
    }
  });
});