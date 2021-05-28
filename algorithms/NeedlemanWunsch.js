class NeedlemanWunsch {
  constructor(seqA, seqB, match, mismatch, gap) {
    this.seqA = "i" + seqA;
    this.seqB = "j" + seqB;
    this.match = match;
    this.mismatch = mismatch;
    this.gap = gap;
    this.matrix = Array(this.seqA.length)
      .fill(null)
      .map(() => Array(this.seqB.length));
    this.alignments = [];
    // this.fillMatrix();
    // this.traceBack();
  }
  calculateMax(i, j) {
    if (i === 0 && j === 0) {
      return 0;
    }
    if (i === 0 && j !== 0) {
      return this.matrix[i][j - 1] + this.gap;
    }
    if (i !== 0 && j === 0) {
      return this.matrix[i - 1][j] + this.gap;
    }
    const gapL = this.matrix[i][j - 1] + this.gap;
    const gapU = this.matrix[i - 1][j] + this.gap;
    const diag =
      this.seqA[i] === this.seqB[j]
        ? this.matrix[i - 1][j - 1] + this.match
        : this.matrix[i - 1][j - 1] + this.mismatch;
    const max = Math.max(gapL, gapU, diag);
    return max;
  }

  fillMatrix() {
    for (let i = 0; i < this.seqA.length; i++) {
      for (let j = 0; j < this.seqB.length; j++) {
        this.matrix[i][j] = this.calculateMax(i, j);
      }
    }
  }

  traceBack(
    i = this.seqA.length - 1,
    j = this.seqB.length - 1,
    alignment = { A: "", B: "" }
  ) {
    if (i === 0 && j === 0) {
      alignment.A = alignment.A.split("").reverse().join("");
      alignment.B = alignment.B.split("").reverse().join("");
      this.alignments.push(alignment);
      return;
    } else {
      if (
        i > 0 &&
        j > 0 &&
        this.matrix[i - 1][j - 1] + this.match === this.matrix[i][j] &&
        this.seqA[i] === this.seqB[j]
      ) {
        const newAlignment = { ...alignment };
        newAlignment.A += this.seqA[i];
        newAlignment.B += this.seqB[j];
        this.traceBack(i - 1, j - 1, newAlignment);
      } else if (
        i > 0 &&
        j > 0 &&
        this.matrix[i - 1][j - 1] + this.mismatch === this.matrix[i][j]
      ) {
        const newAlignment = { ...alignment };
        newAlignment.A += this.seqA[i];
        newAlignment.B += this.seqB[j];
        this.traceBack(i - 1, j - 1, newAlignment);
      }
      if (j > 0 && this.matrix[i][j - 1] + this.gap === this.matrix[i][j]) {
        const newAlignment = { ...alignment };
        newAlignment.A += "-";
        newAlignment.B += this.seqB[j];
        this.traceBack(i, j - 1, newAlignment);
      }
      if (i > 0 && this.matrix[i - 1][j] + this.gap === this.matrix[i][j]) {
        const newAlignment = { ...alignment };
        newAlignment.A += this.seqA[i];
        newAlignment.B += "-";
        this.traceBack(i - 1, j, newAlignment);
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

  solve() {
    this.alignments = [];
    this.fillMatrix();
    this.traceBack();
  }
}

const needlemanWunsch = new NeedlemanWunsch("ACGTTGACCTGTAACCTC", "ACCTTGTCCTCTTTGCCC", 2, -1, -1);
needlemanWunsch.solve();
// // console.log(needlemanWunsch.matrix);
// console.log(needlemanWunsch.alignments);
// // needlemanWunsch.getDisplayMatrix();
// console.log(needlemanWunsch.getDisplayMatrix());
