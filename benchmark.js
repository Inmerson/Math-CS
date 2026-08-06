
import { performance } from 'perf_hooks';

// Mock MatrixData type as simple array of arrays
const matrix = [
    [0, 1, -1, 8],
    [-3, -1, 2, -11],
    [-2, 1, 2, -3]
];

// Robust Gaussian Elimination with Partial Pivoting
const getSteps = (m) => {
    const steps = [];

    let current = m.map(r => [...r]);
    const rows = current.length;
    const cols = current[0].length;

    steps.push({
        title: "System Initialization",
        data: current.map(r => [...r]),
        desc: "Starting Augmented Matrix [A|b]. Goal: Upper Triangular Form.",
        formula: "Start"
    });

    let pivotRow = 0;
    let pivotCol = 0;

    while (pivotRow < rows && pivotCol < cols - 1) {
        let maxRow = pivotRow;
        let maxVal = Math.abs(current[pivotRow][pivotCol]);

        for (let i = pivotRow + 1; i < rows; i++) {
            if (Math.abs(current[i][pivotCol]) > maxVal) {
                maxVal = Math.abs(current[i][pivotCol]);
                maxRow = i;
            }
        }

        if (maxRow !== pivotRow) {
            const temp = current[pivotRow];
            current[pivotRow] = current[maxRow];
            current[maxRow] = temp;

            steps.push({
                title: "Pivot Swap",
                data: current.map(r => [...r]),
                desc: `Swapping Row ${pivotRow + 1} with Row ${maxRow + 1} to place the largest value (${current[pivotRow][pivotCol].toFixed(1)}) on the diagonal for stability.`,
                highlightRow: maxRow,
                pivotRow: pivotRow,
                formula: `R${pivotRow + 1} ↔ R${maxRow + 1}`,
                isSwap: true
            });
        }

        if (Math.abs(current[pivotRow][pivotCol]) < 0.000001) {
            pivotCol++;
            continue;
        }

        for (let i = pivotRow + 1; i < rows; i++) {
            const valToEliminate = current[i][pivotCol];
            if (Math.abs(valToEliminate) > 0.000001) {
                const pivotVal = current[pivotRow][pivotCol];
                const factor = valToEliminate / pivotVal;

                const newRow = current[i].map((val, idx) => val - factor * current[pivotRow][idx]);
                current[i] = newRow;

                steps.push({
                    title: "Elimination",
                    data: current.map(r => [...r]),
                    desc: `Eliminating term in R${i + 1} using pivot from R${pivotRow + 1}.`,
                    highlightRow: i,
                    pivotRow: pivotRow,
                    formula: `R${i + 1} ← R${i + 1} - (${factor.toFixed(2)})·R${pivotRow + 1}`
                });
            }
        }
        pivotRow++;
        pivotCol++;
    }

    steps.push({
        title: "Row Echelon Form",
        data: current.map(r => [...r]),
        desc: "Matrix is now in Upper Triangular Form. Back-substitution can now solve for variables.",
        formula: "Done"
    });

    return steps;
};

const ITERATIONS = 100000;

console.log(`Running Gaussian Elimination Benchmark for ${ITERATIONS} iterations...`);
const start = performance.now();

for (let i = 0; i < ITERATIONS; i++) {
    getSteps(matrix);
}

const end = performance.now();
const totalTime = end - start;
const avgTime = totalTime / ITERATIONS;

console.log(`Total Time: ${totalTime.toFixed(2)} ms`);
console.log(`Average Time per Call: ${avgTime.toFixed(4)} ms`);
