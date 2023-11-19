class CalendarComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.initCalendar();
  }

  initCalendar() {
    // Load FullCalendar CSS
    // const styleLink = document.createElement("link");
    // styleLink.href = chrome.runtime.getURL("../packages/fullcalender/dist/");
    // styleLink.rel = "stylesheet";
    // this.shadowRoot.appendChild(styleLink);

    // Create a container for the calendar
    const calendarEl = document.createElement("div");
    this.shadowRoot.appendChild(calendarEl);

    // Load FullCalendar JavaScript
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL(
      "/packages/fullcalender/dist/index.global.js"
    );
    script.onload = () => {
      // Initialize FullCalendar
      this.calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "timeGridWeek",
        slotDuration: "00:05:00", // Each slot will represent 15 minutes
        slotLabelInterval: "01:00",
        eventDidMount: function (info) {
          // Using the title attribute for the tooltip
          let tooltip =
            info.event.extendedProps.description || info.event.title;
          info.el.setAttribute("title", tooltip);
        },
      });

      this.calendar.render();
      this.loadEvents();
    };
    this.shadowRoot.appendChild(script);
  }

  loadEvents() {
    chrome.storage.local.get(["browsingHistory"], (result) => {
      if (result.browsingHistory) {
        const events = this.processEvents(result.browsingHistory);
        events.forEach((event) => this.calendar.addEvent(event));
      }
    });
  }

  processEvents(browsingHistory) {
    let events = [];
    for (const [date, domains] of Object.entries(browsingHistory)) {
      for (const [domain, sessions] of Object.entries(domains)) {
        sessions.forEach((session) => {
          events.push({
            title: domain,
            start: session.start,
            end: session.end,
            // Additional properties if needed
          });
        });
      }
    }
    return events;
  }
}

customElements.define("calendar-component", CalendarComponent);
