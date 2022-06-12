let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});

chrome.runtime.onInstalled.addListener((reason) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    console.log("This works");
    checkCommandShortcuts();
  }
});

// chrome.commands.onCommand.addListener((command) => {
//   console.log(`Command "${command}" triggered`);
// });

function getText() {
    console.log("Executing callback"); 
    return '(' + getSelectionText.toString() + ')()';
}

function getTitle() {
  console.log("Executing gettitle"); 
  return document.title;
}

chrome.commands.onCommand.addListener(function (command) {

    console.log("Running command " + command);
    chrome.scripting.executeScript(
    {
      target: {tabId: getTabId(), allFrames: true},
      func: getTitle,
    },
    (injectionResults) => {
        console.log("Obtained injection Results " + injectionResults );
      for (const frameResult of injectionResults)
        console.log('Frame Title: ' + frameResult.result);
    });

 // console.log("Workds");
 //    // if (command == "get-selected-text") {
 //    chrome.scripting.executeScript({
 //            //We should inject into all frames, because the user could have made their
 //            // selection within any frame, or in multiple frames.
 //            target: {
 //              // allFrames: true,
 //              tabId: getTabId(), allFrames: true
 //            },
 //            func: getTitle,
 //        }, 
 //        function (results) {
 //            console.log("Exceuting main callback with " + results);
 //            for (const frameResult of results)
 //                console.log('Frame Title: ' + frameResult.result);
 //            // selectedText = results.reduce(function (sum, value) {
 //                //This checks all the results from the different frames to get the one
 //                //  which actually had a selection.
 //                // if (value) {
 //                //     if (sum) {
 //                //         //You will need to decide how you want to handle it when the user
 //                //         //  has things selected in more than one frame. This case is
 //                //         //  definitely possible (easy to demonstrate).
 //                //         console.log('Selections have been made in multiple frames:');
 //                //         console.log('Had:', sum, '::  found additional:', value);
 //                //     }
 //                //     // Currently, we just discard what was obtained first (which will be
 //                //     // the main frame).  You may want to concatenate the strings, but
 //                //     // then you need to determine which comes first.  Reasonably, that
 //                //     // means determining where the iframe is located on the page with
 //                //     // respect to any other selection the user has made.  You may want
 //                //     // to just inform the user that they need to make only one
 //                //     // selection.
 //                //     return value;
 //                // }
 //                // return sum;
 //            });
 //        console.log('selectedText:', selectedText);
        }
    );
    // }
// });

//The following code to get the selection is from an answer to "Get the
//  Highlighted/Selected text" on Stack Overflow, available at:
//  https://stackoverflow.com/a/5379408
//  The answer is copyright 2011-2017 by Tim Down and Makyen. It is
//  licensed under CC BY-SA 3.0, available at
//  https://creativecommons.org/licenses/by-sa/3.0/
function getSelectionText() {
    var text = "";
    var activeEl = document.activeElement;
    var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
    if (
        (activeElTagName == "textarea") || (activeElTagName == "input" &&
        /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
        (typeof activeEl.selectionStart == "number")
    ) {
        text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
    } else if (window.getSelection) {
        text = window.getSelection().toString();
    }
    return text;
}

function getTabId() {
    let queryOptions = { active: true, lastFocusedWindow: true };
      let [tab] = await chrome.tabs.query(queryOptions);
      console.log("tab is " + tab);
  return tab;

  // chrome.tabs.query({currentWindow: true, active: true}, function(tabs) { 
  //   console.log("fetching failure " + tabs);
  //    // + tabs[0].id );
  //   return tabs[0].id;}
    // );
  // chrome.tabs.getCurrent(callback: function (tab) { return tab.id; });
}