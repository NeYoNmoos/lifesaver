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
    <div class="page-component">
      <p class="text-gray-600">${events[indexEvent].title}</p>
      <div class="flex space-x-4 items-center mt-4 edit-container">
        <img class="w-16 h-16 border" id="imageSource" src="${events[indexEvent].icon}">
        <div class="chart-container">
          <canvas id="${"myChart" + indexEvent}"></canvas>
        </div>
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
      drawGraph("myChart" + indexEvent,'h',10,20);
    }
  });

  const chartJS = document.createElement('script');
  chartJS.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.3.2/dist/chart.min.js';
  
  function drawGraph(chartID, timeformat, timeleft, timeonline){
    chartJS.onload = () => {
      const branches_canvas = document.getElementById(chartID);

      const branches = new Chart(branches_canvas, {
          type: 'bar',
          data: {
              labels: [''],
              datasets: [{
                  label: 'Time Spent',
                  data: [timeonline],
                  backgroundColor:[ 
                      '#ca2e2e',
                  ],
                  hoverOffset: 0
              },
              {
                  label: 'Time Left',
                  data: [timeleft],
                  backgroundColor: [
                      '#d16f6f',
                  ],
              }],
          },
          options: {
              indexAxis: 'y',
              plugins: {
                  legend: {
                      display: false // Hide the legend
                  },
                  tooltip: {
                      callbacks: {
                          label: function(context) {
                              let label = context.dataset.label || '';
                              if (label) {
                                  label += ': ';
                              }
                              if (context.parsed.y !== null) {
                                  label += context.parsed.x + timeformat;
                              }
                              return label;
                          },
                          footer: function(tooltipItems, data) {
                              let sum = 0;
                              tooltipItems.forEach(function(tooltipItem) {
                                  sum += tooltipItem.parsed.x; // Access 'y' value directly for the 'y' axis
                              });
                              return 'Total: ' + sum + ' ' + timeformat;
                          }
                      }
                  },
              },
              scales: {
                  x: {
                      display: true,
                      stacked: true
                  },
                  y: {
                      display: false,
                      stacked: true
                  }
              },
          }
      });
  };
  }

  loadEvent();
});