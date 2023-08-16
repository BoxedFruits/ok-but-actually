//Currently not changing when link changes. 
//content script not getting ran when the page is first loaded. have to refresh for some reason
// it is because the page is not fully loaded?

// once content script is loaded, it wont add the event listener again for some reason

import ReactDOM from "react-dom/client";
import "./summary.css";
console.log("content script loaded", document.readyState);

window.addEventListener("load", function load(event) {
  // window.removeEventListener("load", load, false);
  const jobTitleElm = document.querySelector(".display-flex.justify-space-between.flex-wrap")
  createSummaryContainer(jobTitleElm, parseYearsOfExperience())
}, { once: true });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => { //this might create be a race condition with onMessage vs page load 
  // console.log(message, " from chrome runtime")
  // console.log(document.readyState)
  const summaryContainer = document.querySelector(".summary-container")
  if (summaryContainer) {
    summaryContainer.remove()
  }

  const jobTitleElm = document.querySelector(".display-flex.justify-space-between.flex-wrap")
  createSummaryContainer(jobTitleElm, parseYearsOfExperience())
})

const parseYearsOfExperience = () => {
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

  return yearsOfExperience[0]
}

const createSummaryContainer = (jobTitleElm: Element | null, yearsOfExperience: number) => {
  const getYoe = () => {
    if (yearsOfExperience !== undefined) {
      return <div className="badge">Minimum of {yearsOfExperience} years of experience</div>
    } else {
      return <div className="badge">Couldn't retrieve minimum years of experience</div>
    }
  }
  const root = document.createElement("div");
  root.className = "summary-container";

  jobTitleElm?.insertAdjacentElement("afterend", root)

  ReactDOM.createRoot(root).render(
    getYoe()
  )
}
