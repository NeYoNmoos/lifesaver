document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.local.get(["domainTimes"], function (result) {
    if (result.domainTimes) {
      updateDisplay(result.domainTimes);
    } else {
      document.getElementById("timeSpent").textContent = "No data available.";
    }
  });
});

function updateDisplay(domainTimes) {
  const container = document.getElementById("timeSpent");
  container.innerHTML = ""; // Clear existing content

  for (const [domain, time] of Object.entries(domainTimes)) {
    const timeInMinutes = (time / 60000).toFixed(2); // Convert time from ms to minutes
    const element = document.createElement("div");
    element.textContent = `${domain}: ${timeInMinutes} minutes`;
    container.appendChild(element);
  }
}
