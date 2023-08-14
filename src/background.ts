//TODO: need to tell content script that to reload if the url changes
//Should only execute stuff in the proper websites
console.log("======background script running======")

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  const [currTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  if (changeInfo.status === "complete" && currTab?.url?.startsWith("https://www.linkedin.com/jobs/collections")) {
    console.log("tab where the current thing was changed")
    console.log(currTab.url)
    //make the content script reload
    try { //TODO: retry to send a message if it fails. Can happen on slow connections
      const response = await chrome.tabs.sendMessage(tabId, { message: "reload" });
      console.log(response)
    } catch (e) {
      console.log("error", e)
    }
  }
})