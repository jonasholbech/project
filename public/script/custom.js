function observeHeader() {
  const el = document.querySelector(".main-header");
  if (!el) return;
  const observer = new IntersectionObserver(
    ([e]) => e.target.classList.toggle("is-pinned", e.intersectionRatio < 1),
    { threshold: 1 }
  );
  observer.observe(el);
}
observeHeader();

/* const heading = document.querySelector("h1");
heading.addEventListener("click", () => {
  const span = heading.querySelector("span");
  span.classList.toggle("toggled");
}); */

const sections = document.querySelectorAll("section");
const classReg = /(\.[a-z])/gi;

sections.forEach((section, i) => {
  const styleTag = section.querySelector(".editor > style");
  const _tA = section.querySelector(".editor > textarea");
  const exerciseKey = `${i + 1}`;
  const boxKey = `box-${i + 1}`;
  let boxes = 0;
  let startingCSS = _tA.innerHTML;

  const parent = section.querySelector(".container");
  // const resetBtns = section.querySelectorAll(".reset");
  const reset = section.querySelector(".reset");
  const plus = section.querySelector(".plus");
  const minus = section.querySelector(".minus");

  // resetBtns.forEach((reset) => {
  reset.addEventListener("click", promptUI);
  // });

  function promptUI() {
    if (_tA.value === "") {
      resetUI();
    } else if (
      window.confirm(`Do you really want to reset exercise ${exerciseKey}?`)
    ) {
      resetUI();
    }
  }

  function resetUI() {
    if (localStorage.getItem(exerciseKey) || _tA.value === "") {
      localStorage.removeItem(exerciseKey);
      styleTag.innerHTML = null;
      _tA.value = startingCSS;
      _tA.focus(); /* ensure that the UI updates */
      reset.disabled = true;
      init();
    } else {
      reset.disabled = false;
    }
  }

  function prefix(str) {
    return str.replaceAll(
      classReg,
      (match) => `[data-exercise-key="${exerciseKey}"] ${match}`
    );
  }

  function addButtonListeners() {
    if (!plus && !minus) return;

    if (localStorage.getItem(boxKey)) {
      boxes = localStorage.getItem(boxKey);
      minus.disabled = boxes > 0 ? false : true;
    } else {
      minus.disabled = boxes > 0 ? false : true;
    }

    plus.addEventListener("click", (e) => {
      addBox();

      boxes++;

      minus.disabled = false;

      boxCount();
    });

    minus.addEventListener("click", (e) => {
      removeBox();

      minus.disabled = parent.children.length <= 1 ? true : false;

      if (boxes === 0) return;
      boxes--;

      boxCount();
    });
  }

  addButtonListeners();

  function addBox() {
    const count = parent.children.length;
    const box = document.createElement("div");
    box.className = `box box-${count + 1}`;
    box.setAttribute("contenteditable", true);
    parent.appendChild(box);
  }

  function addClasses() {
    [...parent.children].forEach((b, i) => {
      b.className = `box box-${i + 1}`;
    });
  }

  function removeBox() {
    if (parent.children.length - 1) {
      const last = parent.lastElementChild;
      parent.removeChild(last);
    }
  }

  function boxCount() {
    if (boxes < 0) return;
    localStorage.setItem(boxKey, boxes);
  }

  addClasses();

  const init = () => {
    // const parentClass =
    //   "exercise-" + section.querySelector("article>div").className;
    // const parentDataset = `${i + 1}`;
    section.dataset.exerciseKey = `${i + 1}`;

    styleTag.innerHTML = prefix(_tA.value);

    if (localStorage.getItem(exerciseKey)) {
      _tA.value = localStorage.getItem(exerciseKey);
      styleTag.innerHTML = prefix(_tA.value);
    }

    if (
      localStorage.getItem("7") ||
      localStorage.getItem("8") ||
      localStorage.getItem("9")
    ) {
      document.documentElement.dataset.extra = "true";
    }

    if (localStorage.getItem(boxKey)) {
      boxes = localStorage.getItem(boxKey);
      for (let i = 0; i < boxes; i++) {
        addBox(i);
      }
    }

    if (_tA.value !== startingCSS) {
      reset.disabled = false;
    } else {
      reset.disabled = true;
    }

    _tA.addEventListener("input", (e) => {
      styleTag.innerHTML = prefix(e.target.value);
      localStorage.setItem(exerciseKey, _tA.value);

      if (_tA.value === "") {
        localStorage.removeItem(exerciseKey);
      }

      if (_tA.value !== startingCSS) {
        reset.disabled = false;
      } else {
        reset.disabled = true;
      }
    });
  };

  init();
});

// const downloadBtn = document.querySelector("#download");

// downloadBtn.addEventListener("click", (_) => {
//   const array = [];

//   let keys = Object.keys(localStorage);
//   for (let key of keys) {
//     array.push(`Exercise ${key}:\n${localStorage.getItem(key)}`);
//   }
//   const copy = [...array].filter((el) => !el.includes("box")).join("\n\n");
//   download("exercises.txt", copy);
// });

// function download(filename, text) {
//   const element = document.createElement("a");
//   element.setAttribute(
//     "href",
//     "data:text/plain;charset=utf-8," + encodeURIComponent(text)
//   );
//   element.setAttribute("download", filename);

//   element.style.display = "none";
//   document.body.appendChild(element);

//   element.click();

//   document.body.removeChild(element);
// }

const keySequence = [];
let konamiString = "";
const konamiCode = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

document.addEventListener("keyup", function (e) {
  keySequence.push(e.key);
  keySequence.splice(
    -konamiCode.length - 1,
    keySequence.length - konamiCode.length
  );
  konamiString = konamiCode.join("");

  if (
    keySequence.join("").includes(konamiString) &&
    !document.documentElement.dataset.extra
  ) {
    document.documentElement.dataset.extra = "true";

    document
      .querySelector("section[data-exercise-key='7']")
      .scrollIntoView({ behavior: "smooth" });
  }
});
