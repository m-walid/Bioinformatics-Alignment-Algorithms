class SmithWaterman {
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
    this.maxCells = [{ score: 0, pos: { i: 0, j: 0 } }];
  }
  calculateMax(i, j) {
    if (i === 0 || j === 0) {
      return 0;
    }
    const gapL = this.matrix[i][j - 1] + this.gap;
    const gapU = this.matrix[i - 1][j] + this.gap;
    const diag =
      this.seqA[i] === this.seqB[j]
        ? this.matrix[i - 1][j - 1] + this.match
        : this.matrix[i - 1][j - 1] + this.mismatch;
    const max = Math.max(gapL, gapU, diag, 0);
    return max;
  }

  fillMatrix() {
    for (let i = 0; i < this.seqA.length; i++) {
      for (let j = 0; j < this.seqB.length; j++) {
        this.matrix[i][j] = this.calculateMax(i, j);
        if (this.matrix[i][j] > this.maxCells[0].score) {
          this.maxCells = [{ score: this.matrix[i][j], pos: { i, j } }];
        } else if (this.matrix[i][j] === this.maxCells[0].score) {
          this.maxCells.push({ score: this.matrix[i][j], pos: { i, j } });
        }
      }
    }
  }

  traceBack(
    i = this.seqA.length - 1,
    j = this.seqB.length - 1,
    alignment = { A: "", B: "" }
  ) {
    if (this.matrix[i][j] === 0) {
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
    this.maxCells.forEach((cell) => this.traceBack(cell.pos.i, cell.pos.j));
  }
}

// const smithWaterman = new SmithWaterman(
//   "TTCATAACD",
//   "TGCTCGTADFEWSATGCTCGTAD",
//   2,
//   -1,
//   -1
// );
// smithWaterman.solve();
// console.log(smithWaterman.matrix);
// console.log(smithWaterman.maxCells);
// console.log(smithWaterman.alignments);
