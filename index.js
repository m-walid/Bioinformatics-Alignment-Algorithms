const matrixElm = document.querySelector(".matrix");
const seqAElm = document.querySelector("#seq-a");
const seqBElm = document.querySelector("#seq-b");
const needleSmithInputsElm = document.querySelector(".needle-smith__inputs");
const matchElm = document.querySelector("#match");
const misMatchElm = document.querySelector("#mismatch");
const gapElm = document.querySelector("#gap");
const dotMatrixInputsElm = document.querySelector(".dot-matrix__inputs");
const wSizeElm = document.querySelector("#w-size");
const stepElm = document.querySelector("#step");
const threshElm = document.querySelector("#thresh");

const alignmentsElm = document.querySelector(".alignments-section");
const solveBtnElm = document.querySelector("#solve-btn");
const algorithmsListElm = document.querySelector(".algorithms");

const algorithms = {
  needlemanWunsch: "Needleman-Wunsch",
  smithWaterman: "Smith-Waterman",
  dotMatrixWindow: "Dot Plot Matrix With Window",
};

let currAlgorithm = algorithms.needlemanWunsch;

const fillMatrixElm = (matrix) => {
  for (let i = 0; i < matrix.length; i++) {
    const rowElm = document.createElement("tr");
    if (i === 0) rowElm.className = "highlight";
    for (let j = 0; j < matrix[0].length; j++) {
      const cellElm = document.createElement("td");
      if (j === 0) cellElm.className = "highlight";
      if (matrix[i][j] === true) {
        cellElm.innerText = "•";
      } else if (matrix[i][j] === undefined) {
        cellElm.innerText = "";
      } else {
        cellElm.innerText = matrix[i][j];
      }
      rowElm.appendChild(cellElm);
    }
    matrixElm.appendChild(rowElm);
  }
};

const switchAlgorithm = (e) => {
  const elm = e.target;
  algorithmsListElm
    .querySelectorAll("li")
    .forEach((elm) => elm.classList.remove("active"));
  if (elm.innerText === algorithms.needlemanWunsch) {
    elm.classList.add("active");
    needleSmithInputsElm.style.display = "block";
    dotMatrixInputsElm.style.display = "none";
    currAlgorithm = algorithms.needlemanWunsch;
  } else if (elm.innerText === algorithms.smithWaterman) {
    elm.classList.add("active");
    needleSmithInputsElm.style.display = "block";
    dotMatrixInputsElm.style.display = "none";
    currAlgorithm = algorithms.smithWaterman;
  } else if (elm.innerText === algorithms.dotMatrixWindow) {
    elm.classList.add("active");
    needleSmithInputsElm.style.display = "none";
    dotMatrixInputsElm.style.display = "block";
    alignmentsElm.style.display = "none";
    currAlgorithm = algorithms.dotMatrixWindow;
  }
};

const solve = () => {
  matrixElm.innerHTML = "";
  alignmentsElm.innerHTML = "<h2>Alignments</h2>";
  let matrix;
  let inputs;
  let alignments;
  switch (currAlgorithm) {
    case algorithms.needlemanWunsch:
      inputs = getNeedleOrSmithInputsValues();
      const needlemanWunsch = new NeedlemanWunsch(...inputs);
      needlemanWunsch.solve();
      matrix = needlemanWunsch.getDisplayMatrix();
      alignments = needlemanWunsch.alignments;
      displayAlignments(alignments);
      break;
    case algorithms.smithWaterman:
      inputs = getNeedleOrSmithInputsValues();
      const smithWaterman = new SmithWaterman(...inputs);
      smithWaterman.solve();
      matrix = smithWaterman.getDisplayMatrix();
      alignments = smithWaterman.alignments;
      displayAlignments(alignments);
      break;
    case algorithms.dotMatrixWindow:
      inputs = getDotMatrixInputsValues();
      const dotMatrixWindow = new DotMatrixWindow(...inputs);
      dotMatrixWindow.solve();
      matrix = dotMatrixWindow.getDisplayMatrix();
      break;
    default:
      break;
  }
  fillMatrixElm(matrix);
};

const getNeedleOrSmithInputsValues = () => {
  return [
    seqAElm.value.trim(),
    seqBElm.value.trim(),
    parseInt(matchElm.value),
    parseInt(misMatchElm.value),
    parseInt(gapElm.value),
  ];
};
const getDotMatrixInputsValues = () => {
  return [
    seqAElm.value.trim(),
    seqBElm.value.trim(),
    parseInt(wSizeElm.value),
    parseInt(stepElm.value),
    parseInt(threshElm.value),
  ];
};

const displayAlignments = (alignments) => {
  alignmentsElm.style.display = "block";
  const alignmentscontainerElm = document.createElement("div");
  alignmentscontainerElm.className = "alignments";
  alignments.forEach((alignment) => {
    const alignmentElm = document.createElement("div");
    alignmentElm.className = "alignment";
    let seqA = "";
    let seqB = "";
    alignment.A.split("").forEach((letter) => {
      seqA += `<div>${letter}</div>`;
    });
    alignment.B.split("").forEach((letter) => {
      seqB += `<div>${letter}</div>`;
    });
    alignmentElm.innerHTML = `
    <div class="seq"><span>A: </span>${seqA}</div>
    <div class="seq"><span>B: </span>${seqB}</div>
      `;
    alignmentscontainerElm.appendChild(alignmentElm);
  });
  alignmentsElm.appendChild(alignmentscontainerElm);
};

solveBtnElm.addEventListener("click", solve);
algorithmsListElm.addEventListener("click", switchAlgorithm);
