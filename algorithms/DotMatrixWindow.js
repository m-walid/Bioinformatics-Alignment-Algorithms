class DotMatrixWindow {
  constructor(seqA, seqB, windowSize, step, threshold) {
    this.seqA = seqA;
    this.seqB = seqB;
    this.windowSize = windowSize;
    this.halfWindow = Math.floor(this.windowSize / 2);
    this.step = step;
    this.threshold = threshold;
    this.matrix = Array(this.seqA.length)
      .fill(null)
      .map(() => Array(this.seqB.length));
  }
  solve() {
    for (
      let i = 0;
      i + this.windowSize - 1 < this.seqA.length;
      i += this.step
    ) {
      for (
        let j = 0;
        j + this.windowSize - 1 < this.seqB.length;
        j += this.step
      ) {
        let matches = 0;
        for (let k = 0; k < this.windowSize; k++) {
          if (this.seqA[i + k] === this.seqB[j + k]) {
            matches++;
          }
        }
        if (matches >= this.threshold) {
          this.matrix[i + this.halfWindow][j + this.halfWindow] = true;
        }
      }
    }
  }

  getDisplayMatrix() {
    const seqA = this.seqA.split("");
    const seqB = this.seqB.split("");
    seqB.unshift(" ");
    const displayMatrix = [...this.matrix];
    displayMatrix.unshift([...seqB]);
    for (let i = 0; i < seqA.length; i++) {
      displayMatrix[i + 1].unshift(seqA[i]);
    }
    return displayMatrix;
  }
}

// const dotMatrixWindow = new DotMatrixWindow(
//   "ACGTTGACCTGTAACCTC",
//   "ACCTTGTCCTCTTTGCCC",
//   9,
//   3,
//   4
// );
// dotMatrixWindow.solve();
// console.log(dotMatrixWindow.matrix);
