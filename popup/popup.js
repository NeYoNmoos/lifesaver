document.addEventListener("DOMContentLoaded", function () {
  var openTabButton = document.getElementById("openTabButton");
  openTabButton.addEventListener("click", function () {
    openDetailPage();
  });
});

function openDetailPage() {
  console.log("should open page");
  chrome.tabs.create({ url: chrome.runtime.getURL("./pages/homepage.html") });
}
