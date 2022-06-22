let color = '#3aa757';
let selectedText;

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

chrome.action.onClicked.addListener((tab) => {
  console.log("user clicked the icon and obtained tabID: " + tab.id );
  chrome.storage.sync.get('clipText', function(result) {
    console.log('Value on clicking currently is ' + result.clipText);
  });
  console.log(this.selectedText);
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    func: contentScriptFunc,
    args: ['action'],
  });
});

function contentScriptFunc(name) {
  console.log("Printing : " + this.selectedText);
  chrome.storage.sync.get('clipText', function(result) {
    console.log('Value in content script currently is ' + result.clipText);
  });
  // alert(`"${selectedText}" selected`);
}

chrome.commands.onCommand.addListener(function (command, tab) {

    console.log("Running command " + command + " on tab " + tab.id);
    chrome.scripting.executeScript(
    {
      target: {tabId: tab.id, allFrames: true},
      func: getSelectionText,
    },
    (injectionResults) => {
        console.log("Obtained injection Results " + injectionResults );
        // selectedText = injectionResults;
      for (const frameResult of injectionResults){
        console.log('Frame Title: ' + frameResult.result);
        chrome.storage.sync.set({'clipText': frameResult.result}, function() {
          console.log('Value is set');
        });
        chrome.storage.sync.get('clipText', function(result) {
          console.log('Value currently is ' + result.clipText);
        });
    }
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
//  https://stackovergflow.com/a/5379408
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
    this.selectedText = text;
    // console.log
    return text;
}

