//Currently not changing when link changes. 
//content script not getting ran when the page is first loaded. have to refresh for some reason
// it is because the page is not fully loaded?

// once content script is loaded, it wont add the event listener again for some reason

console.log("content script loaded", document.readyState);

window.addEventListener("load", function load(event) {
  console.log("All resources finished loading!");
  console.log(document.readyState)

  // window.removeEventListener("load", load, false);
  const regex = /(\d+)(?:\s*-\s*(\d+))?\s*\+?\s*years?/g;
  //@ts-ignore For linkedIn, it will always be there
  const text = document.querySelector(".jobs-description-content__text").innerText
  console.log(text)
  const matches = [...text.matchAll(regex)];
  const yearsOfExperience = matches.map(match => {
    const rangeMin = match[1];
    const rangeMax = match[2];

    if (rangeMax !== undefined) {
      return Math.min(Number(rangeMin), Number(rangeMax));
    } else {
      return Number(rangeMin);
    }
  });

  console.log(yearsOfExperience);
}, {once: true});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => { //this might create be a race condition with onMessage vs page load 
  console.log(message, " from chrome runtime")
  console.log(document.readyState)
  const regex = /(\d+)(?:\s*-\s*(\d+))?\s*\+?\s*years?/g;
  //@ts-ignore For linkedIn, it will always be there
  const text = document.querySelector(".jobs-description-content__text").innerText
  console.log(text)
  const matches = [...text.matchAll(regex)];
  const yearsOfExperience = matches.map(match => {
    const rangeMin = match[1];
    const rangeMax = match[2];

    if (rangeMax !== undefined) {
      return Math.min(Number(rangeMin), Number(rangeMax));
    } else {
      return Number(rangeMin);
    }
  });
  console.log(yearsOfExperience);
  sendResponse(`yuh ${text === "About the job"}`)
})
