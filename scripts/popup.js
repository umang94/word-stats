// Initialize button with user's preferred color
// let changeColor = document.getElementById("changeColor");
let p = document.getElementById("clippedContent");
let selectedText;
chrome.storage.sync.get("clipText", function(result) {
  console.log('Value currently in popup js is ' + result.clipText);
  p.innerHTML = result.clipText;
  document.getElementById("clippedContentStats").innerHTML = wordCount(result.clipText);
});
// chrome.storage.sync.get("color", ({ color }) => {
//   console.log("Changing color : " + color)
//   changeColor.style.backgroundColor = color;
// });

// When the button is clicked, inject setPageBackgroundColor into current page
// changeColor.addEventListener("click", async () => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   chrome.storage.sync.get("clipText", function(result) {
//     console.log('Value currently in popup js is ' + result);
//     console.log(result);
//     selectedText = result.key;
//   });
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: setPageBackgroundColor,
//   });
// });

// The body of this function will be executed as a content script inside the
// current page
// function setPageBackgroundColor() {
//   chrome.storage.sync.get("color", ({ color }) => {
//     document.body.style.backgroundColor = color;
//   });
// }

function wordCount(str) { 
  return str.split(" ").length;
}