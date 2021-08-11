let exercises = [];
export default function init() {
  setup();
}

function setup() {
  exercises = document.querySelectorAll("section[data-suggested-solution]");
  exercises.forEach((ex) => {
    const textarea = ex.querySelector("textarea");
    textarea.dataset.strokeCount = 0;
    textarea.addEventListener("input", inputEvent);
    inputEvent({ target: textarea });
  });
}
function trim(str) {
  return str.trim();
}
function removeWS(str) {
  return str.replace(/\s/g, "");
}
function inputEvent(e) {
  const textarea = e.target;
  const exEl = textarea.closest("section[data-suggested-solution]");
  const visualResponse = exEl.querySelector(".valid");
  const suggestedSolution = exEl.dataset.suggestedSolution;
  const studentSolution = textarea.value;
  const container = exEl.querySelector(".container");
  const requirements = exEl.dataset.requirements;

  textarea.dataset.strokeCount = Number(textarea.dataset.strokeCount) + 1;
  visualResponse.classList.add("hidden");
  verifySolution();
  function verifySolution() {
    const computedStyles = window.getComputedStyle(container);

    //perfect match
    if (trim(suggestedSolution) === trim(studentSolution)) {
      console.log("valid");
      visualResponse.classList.remove("hidden");
    }
    if (removeWS(suggestedSolution) === removeWS(studentSolution)) {
      console.log("valid, but messy");
    }
    if (textarea.dataset.strokeCount > 100) {
      console.log("do you want the solution?");
    }
    const diff = stringSimilarity.compareTwoStrings(
      suggestedSolution,
      studentSolution
    );
    if (diff > 0.9) {
      console.log("looking great!", diff);
    }
    const subReqs = requirements.split("\n").filter((el) => el != "");
    subReqs.forEach((rule) => {
      const [prop, value] = rule.split(":");
      console.log(
        prop,
        value,
        computedStyles.getPropertyValue(trim(prop)) === trim(value),
        computedStyles.getPropertyValue(trim(prop))
      );
    });

    const suggestedSplitted = suggestedSolution
      .split("\n")
      .filter((i) => i != "");
    const suggestedCleaned = suggestedSplitted.map((i) => removeWS(i));

    const studentSplitted = studentSolution.split("\n").filter((i) => i != "");
    const studentCleaned = studentSplitted.map((i) => removeWS(i));

    suggestedCleaned.sort();
    studentCleaned.sort();
    console.log(suggestedCleaned, studentCleaned);
    const sortedDiff = stringSimilarity.compareTwoStrings(
      suggestedCleaned.join("\n"),
      studentCleaned.join("\n")
    );
    console.log(sortedDiff);
    if (sortedDiff === 1) {
      visualResponse.classList.remove("hidden");
    }
  }
}
