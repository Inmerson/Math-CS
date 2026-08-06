
import { ModuleType } from '../types';
import { Grid3X3, TrendingUp, Activity, Infinity as InfinityIcon, Divide, AreaChart, Layers } from 'lucide-react';

export interface Question {
    id: number;
    text: string;
    options: { key: string; text: string }[];
    correct: string;
    explanation?: string;
    memoryKey?: string;
    topic?: ModuleType;
}

export const examTopics = [
    { id: ModuleType.MATRIX, label: "Matrix", icon: Grid3X3, color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10" },
    { id: ModuleType.SEQUENCES, label: "Sequences", icon: TrendingUp, color: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/10" },
    { id: ModuleType.FUNCTIONS, label: "Functions", icon: Activity, color: "text-pink-400", border: "border-pink-500/30", bg: "bg-pink-500/10" },
    { id: ModuleType.LIMITS, label: "Limits", icon: InfinityIcon, color: "text-orange-400", border: "border-orange-500/30", bg: "bg-orange-500/10" },
    { id: ModuleType.DERIVATIVES, label: "Derivatives", icon: Divide, color: "text-cyan-400", border: "border-cyan-500/30", bg: "bg-cyan-500/10" },
    { id: ModuleType.INTEGRALS, label: "Integrals", icon: AreaChart, color: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10" },
    { id: ModuleType.DIFF_EQ, label: "Differential Eq", icon: Layers, color: "text-rose-400", border: "border-rose-500/30", bg: "bg-rose-500/10" },
];

export const questionBank: Partial<Record<ModuleType, Question[]>> = {
    [ModuleType.MATRIX]: [
        {
            id: 1,
            text: "What is a matrix?",
            options: [
                { key: "A", text: "Any sequence of numbers" },
                { key: "B", text: "A rectangular array of numbers arranged in rows and columns" },
                { key: "C", text: "A graph of a function" }
            ],
            correct: "B",
            explanation: "A matrix is formally defined as a rectangular array of numbers, symbols, or expressions, arranged in rows and columns.",
            memoryKey: "Rectangular Array"
        },
        {
            id: 2,
            text: "The dimension of matrix $A_{n \\times m}$ means:",
            options: [
                { key: "A", text: "$n$ columns and $m$ rows" },
                { key: "B", text: "$n$ rows and $m$ columns" },
                { key: "C", text: "$m$ rows and $n$ columns" }
            ],
            correct: "B",
            explanation: "Matrix dimensions are always stated as Rows $\\times$ Columns ($RC$).",
            memoryKey: "Rows × Columns"
        },
        {
            id: 3,
            text: "A square matrix is a matrix in which:",
            options: [
                { key: "A", text: "$n \\neq m$" },
                { key: "B", text: "all elements are zeros" },
                { key: "C", text: "$n = m$" }
            ],
            correct: "C",
            explanation: "A square matrix has the same number of rows and columns.",
            memoryKey: "n = m"
        },
        {
            id: 4,
            text: "The identity matrix is:",
            options: [
                { key: "A", text: "A matrix with ones on the main diagonal and zeros elsewhere" },
                { key: "B", text: "A matrix with all elements equal to $1$" },
                { key: "C", text: "The zero matrix" }
            ],
            correct: "A",
            explanation: "The identity matrix ($I$) acts like the number $1$ in matrix multiplication. It has $1$s on the diagonal and $0$s everywhere else.",
            memoryKey: "Diagonal Ones"
        },
        {
            id: 5,
            text: "The zero matrix is:",
            options: [
                { key: "A", text: "A matrix whose determinant is zero" },
                { key: "B", text: "A matrix with all zeros" },
                { key: "C", text: "A diagonal matrix" }
            ],
            correct: "B",
            explanation: "A zero matrix is a matrix where every single entry is zero.",
            memoryKey: "All Zeros"
        },
        {
            id: 6,
            text: "A diagonal matrix is:",
            options: [
                { key: "A", text: "Non-zero elements only on the main diagonal" },
                { key: "B", text: "Ones on the diagonal" },
                { key: "C", text: "Zeros in the columns" }
            ],
            correct: "A",
            explanation: "In a diagonal matrix, entries outside the main diagonal are all zero.",
            memoryKey: "Only Diagonal"
        },
        {
            id: 7,
            text: "To add two matrices, they must have:",
            options: [
                { key: "A", text: "The same number of rows" },
                { key: "B", text: "The same number of columns" },
                { key: "C", text: "Identical dimensions" }
            ],
            correct: "C",
            explanation: "Matrix addition is element-wise, so both matrices must have exactly the same number of rows and columns.",
            memoryKey: "Exact Size Match"
        },
        {
            id: 8,
            text: "The transposition of a matrix means:",
            options: [
                { key: "A", text: "Reversing the order of columns" },
                { key: "B", text: "Swapping rows and columns" },
                { key: "C", text: "Squaring the matrix" }
            ],
            correct: "B",
            explanation: "Transposition flips a matrix over its diagonal, switching the row and column indices of each element.",
            memoryKey: "Swap Rows/Cols"
        },
        {
            id: 9,
            text: "The symbol $A^T$ denotes:",
            options: [
                { key: "A", text: "The inverse matrix" },
                { key: "B", text: "The transposed matrix" },
                { key: "C", text: "A square matrix" }
            ],
            correct: "B",
            explanation: "The superscript $T$ stands for Transpose.",
            memoryKey: "T for Transpose"
        },
        {
            id: 10,
            text: "The product $A_{n \\times m} \\cdot B_{p \\times q}$ exists when:",
            options: [
                { key: "A", text: "$n = q$" },
                { key: "B", text: "$m = p$" },
                { key: "C", text: "$n = p$" }
            ],
            correct: "B",
            explanation: "For matrix multiplication to be defined, the number of columns in the first matrix must equal the number of rows in the second matrix.",
            memoryKey: "Inner Dimensions Match"
        },
        {
            id: 11,
            text: "The result of multiplying $A_{n \\times m} \\cdot B_{m \\times p}$ has dimensions:",
            options: [
                { key: "A", text: "$n \\times m$" },
                { key: "B", text: "$m \\times p$" },
                { key: "C", text: "$n \\times p$" }
            ],
            correct: "C",
            explanation: "The resulting matrix takes the number of rows from the first matrix and the number of columns from the second matrix.",
            memoryKey: "Outer Dimensions"
        },
        {
            id: 12,
            text: "The transposition rule of a matrix product is:",
            options: [
                { key: "A", text: "$(AB)^T = A^T B^T$" },
                { key: "B", text: "$(AB)^T = B^T A^T$" },
                { key: "C", text: "$(AB)^T = AB$" }
            ],
            correct: "B",
            explanation: "The transpose of a product is the product of the transposes in reverse order.",
            memoryKey: "Reverse Order"
        },
        {
            id: 13,
            text: "The distributive law of multiplication over addition is:",
            options: [
                { key: "A", text: "$A(B + C) = AB + AC$" },
                { key: "B", text: "$A + (B + C) = AB + AC$" },
                { key: "C", text: "$A(B + C) = A + B + C$" }
            ],
            correct: "A",
            explanation: "Matrix multiplication distributes over matrix addition.",
            memoryKey: "Distributive Property"
        },
        {
            id: 14,
            text: "A symmetric matrix satisfies:",
            options: [
                { key: "A", text: "$A = -A^T$" },
                { key: "B", text: "$A = A^T$" },
                { key: "C", text: "$A^T = 0$" }
            ],
            correct: "B",
            explanation: "A symmetric matrix is equal to its own transpose (mirrored across the main diagonal).",
            memoryKey: "A = A^T"
        },
        {
            id: 15,
            text: "In the matrix product, which law does not hold:",
            options: [
                { key: "A", text: "Commutativity ($AB \\neq BA$)" },
                { key: "B", text: "Associativity" },
                { key: "C", text: "Distributivity" }
            ],
            correct: "A",
            explanation: "In general, $AB \\neq BA$. Matrix multiplication is not commutative.",
            memoryKey: "Not Commutative"
        },
        {
            id: 16,
            text: "The determinant of a square matrix $A$ is denoted as:",
            options: [
                { key: "A", text: "$\\det(A)$ or $|A|$" },
                { key: "B", text: "$\\text{rank}(A)$" },
                { key: "C", text: "$A^{-1}$" }
            ],
            correct: "A",
            explanation: "The determinant is denoted by $\\det(A)$ or vertical bars $|A|$.",
            memoryKey: "|A|"
        },
        {
            id: 17,
            text: "A matrix is singular when:",
            options: [
                { key: "A", text: "$\\det(A) \\neq 0$" },
                { key: "B", text: "$\\det(A) = 0$" },
                { key: "C", text: "$A^{-1}$ exists" }
            ],
            correct: "B",
            explanation: "A singular matrix has a determinant of zero and is not invertible.",
            memoryKey: "Det = 0"
        },
        {
            id: 18,
            text: "For a 2×2 matrix $|A| = \\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}$, the determinant equals:",
            options: [
                { key: "A", text: "$a+b+c+d$" },
                { key: "B", text: "$ad - bc$" },
                { key: "C", text: "$ab - cd$" }
            ],
            correct: "B",
            explanation: "The determinant of a 2x2 matrix is the product of the main diagonal minus the product of the antidiagonal.",
            memoryKey: "ad - bc"
        },
        {
            id: 19,
            text: "The Sarrus rule applies to:",
            options: [
                { key: "A", text: "2×2 matrix" },
                { key: "B", text: "3×3 matrix" },
                { key: "C", text: "Any matrix" }
            ],
            correct: "B",
            explanation: "Sarrus' rule is a shortcut method specifically for calculating the determinant of a 3x3 matrix.",
            memoryKey: "3x3 Only"
        },
        {
            id: 20,
            text: "The Laplace expansion is used for:",
            options: [
                { key: "A", text: "Raising a matrix to a power" },
                { key: "B", text: "Expanding a determinant by a row or column" },
                { key: "C", text: "Transposing a matrix" }
            ],
            correct: "B",
            explanation: "Laplace expansion allows calculation of determinants of any size by expanding along a row or column.",
            memoryKey: "Determinant Expansion"
        },
        {
            id: 21,
            text: "Swapping two rows of a matrix:",
            options: [
                { key: "A", text: "Determinant doesn’t change sign" },
                { key: "B", text: "Determinant changes sign" },
                { key: "C", text: "Determinant becomes $0$" }
            ],
            correct: "B",
            explanation: "Swapping any two rows (or columns) of a matrix negates the value of the determinant.",
            memoryKey: "Sign Flip"
        },
        {
            id: 22,
            text: "If a matrix has two identical rows, then:",
            options: [
                { key: "A", text: "$\\det(A) = 1$" },
                { key: "B", text: "$\\det(A) = 0$" },
                { key: "C", text: "$\\det(A) = -1$" }
            ],
            correct: "B",
            explanation: "If two rows are identical, the matrix is linearly dependent, so the determinant is zero.",
            memoryKey: "Identical = Zero"
        },
        {
            id: 23,
            text: "Adding a linear combination of other rows to one row:",
            options: [
                { key: "A", text: "Determinant doesn’t change" },
                { key: "B", text: "Determinant doubles" },
                { key: "C", text: "Determinant changes sign" }
            ],
            correct: "A",
            explanation: "This row operation preserves the volume/determinant of the matrix.",
            memoryKey: "Preserves Det"
        },
        {
            id: 24,
            text: "For the inverse matrix, the following holds:",
            options: [
                { key: "A", text: "$A^{-1} A = I$" },
                { key: "B", text: "$A^{-1} A = 0$" },
                { key: "C", text: "$A^{-1} A = A$" }
            ],
            correct: "A",
            explanation: "Multiplying a matrix by its inverse results in the identity matrix.",
            memoryKey: "Result is Identity"
        },
        {
            id: 25,
            text: "The inverse matrix exists only when:",
            options: [
                { key: "A", text: "$\\det(A) \\neq 0$" },
                { key: "B", text: "$\\det(A) = 0$" },
                { key: "C", text: "$A$ is rectangular" }
            ],
            correct: "A",
            explanation: "A matrix is invertible (non-singular) if and only if its determinant is non-zero.",
            memoryKey: "Non-Zero Det"
        },
        {
            id: 26,
            text: "The property $\\det(A^T)$ equals:",
            options: [
                { key: "A", text: "$-\\det(A)$" },
                { key: "B", text: "$\\det(A)$" },
                { key: "C", text: "$(\\det(A))^2$" }
            ],
            correct: "B",
            explanation: "The determinant of a matrix is the same as the determinant of its transpose.",
            memoryKey: "Transpose Same Det"
        },
        {
            id: 27,
            text: "For a diagonal matrix $D = \\text{diag}(a, b, c)$, $\\det D$ equals:",
            options: [
                { key: "A", text: "$a+b+c$" },
                { key: "B", text: "$abc$" },
                { key: "C", text: "$a^2+b^2+c^2$" }
            ],
            correct: "B",
            explanation: "The determinant of a diagonal (or triangular) matrix is simply the product of the diagonal elements.",
            memoryKey: "Product of Diagonal"
        },
        {
            id: 28,
            text: "The product of determinants satisfies:",
            options: [
                { key: "A", text: "$\\det(AB) = \\det(A) + \\det(B)$" },
                { key: "B", text: "$\\det(AB) = \\det(A) \\cdot \\det(B)$" },
                { key: "C", text: "$\\det(AB) = 0$" }
            ],
            correct: "B",
            explanation: "The determinant of a product is the product of the determinants.",
            memoryKey: "Product Rule"
        },
        {
            id: 29,
            text: "If all elements of a row are multiplied by $k$, then:",
            options: [
                { key: "A", text: "$\\det(A)$ is multiplied by $k$" },
                { key: "B", text: "$\\det(A)$ is divided by $k$" },
                { key: "C", text: "$\\det(A)$ doesn’t change" }
            ],
            correct: "A",
            explanation: "Scaling a single row by $k$ scales the entire determinant by $k$.",
            memoryKey: "Row Scaling"
        },
        {
            id: 30,
            text: "The Gauss–Jordan method is used to:",
            options: [
                { key: "A", text: "Finding determinant" },
                { key: "B", text: "Finding the inverse matrix" },
                { key: "C", text: "Transposing a matrix" }
            ],
            correct: "B",
            explanation: "Gauss-Jordan elimination is a method to find the inverse of a matrix or solve systems of linear equations.",
            memoryKey: "Inverse Finding"
        },
        {
            id: 31,
            text: "The matrix form of a system of equations is:",
            options: [
                { key: "A", text: "$A + X = B$" },
                { key: "B", text: "$A \\cdot X = B$" },
                { key: "C", text: "$X = A + B$" }
            ],
            correct: "B",
            explanation: "Coefficient Matrix ($A$) times Variable Vector ($X$) equals Constant Vector ($B$).",
            memoryKey: "AX = B"
        },
        {
            id: 32,
            text: "The coefficient matrix of a system is denoted by:",
            options: [
                { key: "A", text: "$B$" },
                { key: "B", text: "$X$" },
                { key: "C", text: "$A$" }
            ],
            correct: "C",
            explanation: "$A$ is the coefficient matrix, $X$ is the variable matrix, $B$ is the constant matrix.",
            memoryKey: "Matrix A"
        },
        {
            id: 33,
            text: "A Cramer’s system has a unique solution when:",
            options: [
                { key: "A", text: "$\\det(A) = 0$" },
                { key: "B", text: "$\\det(A) \\neq 0$" },
                { key: "C", text: "$A$ is rectangular" }
            ],
            correct: "B",
            explanation: "Cramer's rule requires dividing by the main determinant $W$ ($\\det A$), so it must be non-zero.",
            memoryKey: "Non-Zero Main Det"
        },
        {
            id: 34,
            text: "In Cramer’s rule, $x_i = W_i / W$, where $W$ is:",
            options: [
                { key: "A", text: "Determinant of inverse matrix" },
                { key: "B", text: "Determinant of coefficient matrix" },
                { key: "C", text: "Determinant of augmented matrix" }
            ],
            correct: "B",
            explanation: "$W$ is the main determinant calculated from the coefficient matrix $A$.",
            memoryKey: "Coeff Det"
        },
        {
            id: 35,
            text: "If $W=0$ and all $W_i=0$, the system:",
            options: [
                { key: "A", text: "Has no solutions" },
                { key: "B", text: "Has one solution" },
                { key: "C", text: "Has infinitely many solutions" }
            ],
            correct: "C",
            explanation: "This is the indefinite case, usually implying dependent equations and infinite solutions.",
            memoryKey: "Infinite Solutions"
        },
        {
            id: 36,
            text: "If $W=0$ and at least one $W_i \\neq 0$, the system:",
            options: [
                { key: "A", text: "Inconsistent" },
                { key: "B", text: "Has one solution" },
                { key: "C", text: "Has many solutions" }
            ],
            correct: "A",
            explanation: "This is a contradiction ($0 \\cdot x = \\text{non-zero}$), meaning the system has no solution (inconsistent).",
            memoryKey: "No Solution"
        }
    ],
    [ModuleType.SEQUENCES]: [
        {
            id: 101,
            text: "A number sequence is:",
            options: [
                { key: "A", text: "a real function of two variables" },
                { key: "B", text: "an assignment of one real number to each natural number" },
                { key: "C", text: "an arbitrary set of numbers" }
            ],
            correct: "B",
            explanation: "Formally, a sequence is a function whose domain is the set of natural numbers $\\mathbb{N}$.",
            memoryKey: "Function on N"
        },
        {
            id: 102,
            text: "The general term of a sequence represents:",
            options: [
                { key: "A", text: "the first term of the sequence" },
                { key: "B", text: "a formula describing all terms of the sequence" },
                { key: "C", text: "the sum of all terms" }
            ],
            correct: "B",
            explanation: "The general term (usually denoted $a_n$) allows calculation of any term based on its position $n$.",
            memoryKey: "Formula for an"
        },
        {
            id: 103,
            text: "A sequence that has a finite limit is called:",
            options: [
                { key: "A", text: "divergent" },
                { key: "B", text: "convergent" },
                { key: "C", text: "monotonic" }
            ],
            correct: "B",
            explanation: "Convergence means the terms approach a specific, finite numeric value as $n$ goes to infinity.",
            memoryKey: "Finite Limit"
        },
        {
            id: 104,
            text: "The sequence $a_n = 1/n$ is:",
            options: [
                { key: "A", text: "increasing" },
                { key: "B", text: "decreasing" },
                { key: "C", text: "constant" }
            ],
            correct: "B",
            explanation: "As $n$ increases ($1, 2, 3...$), the value $1/n$ decreases ($1, 0.5, 0.33...$).",
            memoryKey: "1/n Decreases"
        },
        {
            id: 105,
            text: "The sequence $a_n = \\sqrt{n}$ is:",
            options: [
                { key: "A", text: "convergent" },
                { key: "B", text: "divergent to infinity" },
                { key: "C", text: "divergent to zero" }
            ],
            correct: "B",
            explanation: "As $n$ grows larger, the square root of $n$ also grows without bound.",
            memoryKey: "Unbounded Growth"
        },
        {
            id: 106,
            text: "The sequence $a_n = 3$ is:",
            options: [
                { key: "A", text: "constant" },
                { key: "B", text: "increasing" },
                { key: "C", text: "decreasing" }
            ],
            correct: "A",
            explanation: "Every term is the same ($3, 3, 3...$), so it is a constant sequence.",
            memoryKey: "Always 3"
        },
        {
            id: 107,
            text: "The sequence $a_n = (-1)^n$ is:",
            options: [
                { key: "A", text: "convergent" },
                { key: "B", text: "divergent" },
                { key: "C", text: "increasing" }
            ],
            correct: "B",
            explanation: "The sequence oscillates between $-1$ and $1$ forever, never settling on a single limit.",
            memoryKey: "Oscillating"
        },
        {
            id: 108,
            text: "An arithmetic sequence satisfies the condition:",
            options: [
                { key: "A", text: "$a_{n+1} = a_n + r$" },
                { key: "B", text: "$a_{n+1} = a_n \\cdot q$" },
                { key: "C", text: "$a_{n+1} = a_n^2 + r$" }
            ],
            correct: "A",
            explanation: "Arithmetic sequences grow by adding a constant difference ($r$) to each term.",
            memoryKey: "Add r"
        },
        {
            id: 109,
            text: "A geometric sequence satisfies the condition:",
            options: [
                { key: "A", text: "$a_{n+1} = a_n + q$" },
                { key: "B", text: "$a_{n+1} = a_n \\cdot q$" },
                { key: "C", text: "$a_{n+1} = a_n / q$" }
            ],
            correct: "B",
            explanation: "Geometric sequences grow by multiplying each term by a constant ratio ($q$).",
            memoryKey: "Multiply q"
        },
        {
            id: 110,
            text: "The Fibonacci sequence is defined by:",
            options: [
                { key: "A", text: "$a_{n+1} = a_n + 1$" },
                { key: "B", text: "$a_{n+2} = a_{n+1} + a_n$" },
                { key: "C", text: "$a_{n+2} = a_{n+1} - a_n$" }
            ],
            correct: "B",
            explanation: "Each term is the sum of the two preceding terms.",
            memoryKey: "Sum Previous Two"
        },
        {
            id: 111,
            text: "An increasing sequence is one where:",
            options: [
                { key: "A", text: "$a_{n+1} > a_n$" },
                { key: "B", text: "$a_{n+1} = a_n$" },
                { key: "C", text: "$a_{n+1} < a_n$" }
            ],
            correct: "A",
            explanation: "Each subsequent term is strictly greater than the one before it.",
            memoryKey: "Next > Previous"
        },
        {
            id: 112,
            text: "A decreasing sequence is one where:",
            options: [
                { key: "A", text: "$a_{n+1} > a_n$" },
                { key: "B", text: "$a_{n+1} < a_n$" },
                { key: "C", text: "$a_{n+1} = a_n$" }
            ],
            correct: "B",
            explanation: "Each subsequent term is strictly less than the one before it.",
            memoryKey: "Next < Previous"
        },
        {
            id: 113,
            text: "The number $e$ (Euler's number) is the limit of the sequence:",
            options: [
                { key: "A", text: "$(1+1/n)^n$" },
                { key: "B", text: "$1/n$" },
                { key: "C", text: "$\\sqrt{n}$" }
            ],
            correct: "A",
            explanation: "This is the classic definition of $e \\approx 2.718...$, arising from compound interest.",
            memoryKey: "(1 + 1/n)^n"
        },
        {
            id: 114,
            text: "The sequence $a_n = q^n$ converges to zero when:",
            options: [
                { key: "A", text: "$|q| > 1$" },
                { key: "B", text: "$-1 < q < 1$" },
                { key: "C", text: "$q = 1$" }
            ],
            correct: "B",
            explanation: "If the absolute value of the ratio is less than $1$, powers of $q$ shrink towards zero.",
            memoryKey: "|q| < 1"
        },
        {
            id: 115,
            text: "The theorem of three sequences states that:",
            options: [
                { key: "A", text: "if $a_n \\le b_n \\le c_n$ and $\\lim a_n = \\lim c_n = g$, then $\\lim b_n = g$" },
                { key: "B", text: "if $a_n = b_n + c_n$, then $\\lim a_n = \\lim b_n \\cdot \\lim c_n$" },
                { key: "C", text: "if $a_n > b_n$, then $\\lim a_n > \\lim b_n$" }
            ],
            correct: "A",
            explanation: "If a sequence is squeezed between two others converging to the same limit, it must also converge to that limit.",
            memoryKey: "Sandwich Theorem"
        }
    ],
    [ModuleType.FUNCTIONS]: [
        { id: 201, text: "The function $x^3$ has:", options: [{key:"A", text:"Two extrema"}, {key:"B", text:"A horizontal asymptote"}, {key:"C", text:"No extrema"}], correct: "C", explanation: "$f'(x) = 3x^2$ which is always $\\ge 0$. The function is strictly increasing, so no peaks/valleys.", memoryKey: "Monotonic Cubic" },
        { id: 202, text: "The domain of $\\ln(x)$ is:", options: [{key:"A", text:"$(-\\infty, \\infty)$"}, {key:"B", text:"$(0, \\infty)$"}, {key:"C", text:"$(1, \\infty)$"}], correct: "B", explanation: "Logarithms are only defined for positive numbers.", memoryKey: "Positive Inputs Only" },
        { id: 203, text: "In studying the behavior of a function, the first step is:", options: [{key:"A", text:"Integration"}, {key:"B", text:"The domain"}, {key:"C", text:"The derivative"}], correct: "B", explanation: "You must first determine where the function exists before analyzing it.", memoryKey: "Domain First" },
        { id: 204, text: "The extrema of $3x^2 - 9x - 2$ occur at:", options: [{key:"A", text:"$-1$"}, {key:"B", text:"$0$"}, {key:"C", text:"$3/2$"}], correct: "C", explanation: "Vertex of parabola $x = -b/2a = -(-9)/(2 \\cdot 3) = 9/6 = 3/2$.", memoryKey: "-b/2a" },
        { id: 205, text: "Where is $\\ln(x)$ defined?", options: [{key:"A", text:"All real numbers"}, {key:"B", text:"$(0, \\infty)$"}, {key:"C", text:"$[0, \\infty)$"}], correct: "B", explanation: "Duplicate concept check: Logarithm domain is strictly positive real numbers.", memoryKey: "x > 0" },
        { id: 206, text: "The range (values of the function) of $e^x$ is:", options: [{key:"A", text:"$(-\\infty, 0)$"}, {key:"B", text:"$(-\\infty, \\infty)$"}, {key:"C", text:"$(0, \\infty)$"}], correct: "C", explanation: "Exponential functions with positive bases are always positive.", memoryKey: "Always Positive" },
        { id: 207, text: "The function $1/x$ is undefined for:", options: [{key:"A", text:"$x = 1$"}, {key:"B", text:"$x < 0$"}, {key:"C", text:"$x = 0$"}], correct: "C", explanation: "Division by zero is undefined.", memoryKey: "Div by Zero" },
        { id: 208, text: "The range of $1/x^2$ is:", options: [{key:"A", text:"All real numbers"}, {key:"B", text:"Negative numbers"}, {key:"C", text:"$(0, \\infty)$"}], correct: "C", explanation: "Squares are positive, and 1 divided by a positive is positive. It never reaches 0.", memoryKey: "Positive Range" },
        { id: 209, text: "The parabola $y = x^2$ has:", options: [{key:"A", text:"Two maxima"}, {key:"B", text:"A horizontal asymptote"}, {key:"C", text:"A minimum at $x = 0$"}], correct: "C", explanation: "Basic standard parabola opens upwards with vertex at origin.", memoryKey: "Vertex Min" },
        { id: 210, text: "The domain of $1/(x^2 - 4)$ is:", options: [{key:"A", text:"All real numbers"}, {key:"B", text:"Only positive numbers"}, {key:"C", text:"All numbers except $-2$ and $2$"}], correct: "C", explanation: "Denominator $x^2-4$ cannot be zero. $x \\neq \\pm 2$.", memoryKey: "Exclude Roots" },
        { id: 211, text: "The function $e^x$ is:", options: [{key:"A", text:"A parabola"}, {key:"B", text:"Decreasing"}, {key:"C", text:"Increasing on its entire domain"}], correct: "C", explanation: "Derivative $e^x$ is always positive, so function is always increasing.", memoryKey: "Exp Growth" },
        { id: 212, text: "The function $\\ln x$:", options: [{key:"A", text:"Has a horizontal asymptote $y = 0$"}, {key:"B", text:"Is a parabola"}, {key:"C", text:"Has a vertical asymptote $x = 0$"}], correct: "C", explanation: "As $x$ approaches $0$ from the right, $\\ln(x)$ goes to $-\\infty$.", memoryKey: "Vert Asym at 0" },
        { id: 213, text: "The parabola $y = -x^2 + 4$ has the range:", options: [{key:"A", text:"$(4, \\infty)$"}, {key:"B", text:"All real numbers"}, {key:"C", text:"$(-\\infty, 4]$"}], correct: "C", explanation: "It opens downward with vertex at $y=4$, so all values are $\\le 4$.", memoryKey: "Max Value 4" }
    ],
    [ModuleType.LIMITS]: [
        { id: 301, text: "A vertical asymptote means:", options: [{key:"A", text:"The limit equals $0$"}, {key:"B", text:"The limit exists"}, {key:"C", text:"The limit tends to $\\infty$ or $-\\infty$"}], correct: "C", explanation: "Function grows without bound near the vertical line.", memoryKey: "Unbounded Growth" },
        { id: 302, text: "$\\lim_{x \\to \\infty} \\frac{1}{e^x+1}$ equals:", options: [{key:"A", text:"$1$"}, {key:"B", text:"$\\infty$"}, {key:"C", text:"$0$"}], correct: "C", explanation: "$e^\\infty$ is very large. $1/\\text{large}$ approaches $0$.", memoryKey: "1/Big = 0" },
        { id: 303, text: "L'Hospital's rule applies to:", options: [{key:"A", text:"All expressions"}, {key:"B", text:"Determined expressions"}, {key:"C", text:"$0/0$ and $\\infty/\\infty$ forms"}], correct: "C", explanation: "It is a technique specifically for indeterminate forms.", memoryKey: "Indeterminate Forms" },
        { id: 304, text: "A horizontal asymptote exists when:", options: [{key:"A", text:"$f'=0$"}, {key:"B", text:"The limit at infinity is finite"}, {key:"C", text:"The function is differentiable"}], correct: "B", explanation: "If $\\lim_{x \\to \\infty} f(x) = L$, then $y=L$ is the horizontal asymptote.", memoryKey: "Limit at Infinity" },
        { id: 305, text: "An asymptote at $x=1$ means:", options: [{key:"A", text:"The limit exists"}, {key:"B", text:"The function is continuous"}, {key:"C", text:"$|f(x)| \\to \\infty$"}], correct: "C", explanation: "Vertical asymptote definition.", memoryKey: "Explodes at x" },
        { id: 306, text: "$\\lim_{x \\to -\\infty} \\frac{x-1}{x^2-4}$ equals:", options: [{key:"A", text:"$1$"}, {key:"B", text:"$-1$"}, {key:"C", text:"$0$"}], correct: "C", explanation: "Degree of denominator (2) is greater than numerator (1), so limit is $0$.", memoryKey: "Bottom Heavy" },
        { id: 307, text: "The indeterminate form $[1^\\infty]$ is:", options: [{key:"A", text:"Determined"}, {key:"B", text:"$0$"}, {key:"C", text:"Indeterminate"}], correct: "C", explanation: "It requires special techniques (usually $e^{\\ln}$) to solve.", memoryKey: "Needs Work" },
        { id: 308, text: "For $\\frac{1}{e^x+1}$, the asymptote as $x \\to -\\infty$ is:", options: [{key:"A", text:"$y=0$"}, {key:"B", text:"$y=x$"}, {key:"C", text:"$y=1$"}], correct: "C", explanation: "$e^{-\\infty}$ is $0$. So $1/(0+1) = 1$.", memoryKey: "e^-inf -> 0" },
        { id: 309, text: "The horizontal asymptote of $\\frac{x-1}{x^2-4}$ is:", options: [{key:"A", text:"$y=1$"}, {key:"B", text:"$y=x$"}, {key:"C", text:"$y=0$"}], correct: "C", explanation: "Same logic as the limit at infinity question. $y=0$.", memoryKey: "y=0" },
        { id: 310, text: "A function is continuous at a point when:", options: [{key:"A", text:"It has no asymptotes"}, {key:"B", text:"It is differentiable"}, {key:"C", text:"The limit equals the function value"}], correct: "C", explanation: "Formal definition: $\\lim_{x \\to c} f(x) = f(c)$.", memoryKey: "No Holes/Jumps" },
        { id: 311, text: "A vertical asymptote means that:", options: [{key:"A", text:"The graph has a minimum or maximum"}, {key:"B", text:"The function is bounded"}, {key:"C", text:"The function grows unbounded near the point"}], correct: "C", explanation: "Rephrasing of vertical asymptote concept.", memoryKey: "Infinite Growth" },
        { id: 312, text: "L'Hospital's rule is used when the limit has the form:", options: [{key:"A", text:"Any form"}, {key:"B", text:"A real number"}, {key:"C", text:"$0/0$ or $\\infty/\\infty$"}], correct: "C", explanation: "Standard application condition.", memoryKey: "0/0" },
        { id: 313, text: "A horizontal asymptote exists when:", options: [{key:"A", text:"The derivative changes sign"}, {key:"B", text:"There is a square in the denominator"}, {key:"C", text:"The limit at $\\pm \\infty$ is finite"}], correct: "C", explanation: "Behavior at the far left or right ends of the graph.", memoryKey: "Finite End Behavior" }
    ],
    [ModuleType.DERIVATIVES]: [
        { id: 401, text: "The derivative of a constant function equals:", options: [{key:"A", text:"A positive constant"}, {key:"B", text:"The same constant"}, {key:"C", text:"$0$"}], correct: "C", explanation: "Constants do not change, so their rate of change is zero.", memoryKey: "Const -> 0" },
        { id: 402, text: "The derivative of $x^a$ (for $a \\in \\mathbb{R}$) equals:", options: [{key:"A", text:"$x^{a+1}$"}, {key:"B", text:"$ax^{a+1}$"}, {key:"C", text:"$ax^{a-1}$"}], correct: "C", explanation: "Power Rule.", memoryKey: "nx^{n-1}" },
        { id: 403, text: "The derivative of $e^x$ equals:", options: [{key:"A", text:"$xe^{x-1}$"}, {key:"B", text:"$1$"}, {key:"C", text:"$e^x$"}], correct: "C", explanation: "$e^x$ is the unique function that is its own derivative.", memoryKey: "Itself" },
        { id: 404, text: "The difference quotient tends to:", options: [{key:"A", text:"The integral"}, {key:"B", text:"The value of the function"}, {key:"C", text:"The derivative at the point"}], correct: "C", explanation: "Limit of the difference quotient is the definition of the derivative.", memoryKey: "Def of Deriv" },
        { id: 405, text: "A necessary condition for a local extremum is:", options: [{key:"A", text:"$f(x)=0$"}, {key:"B", text:"The function is increasing"}, {key:"C", text:"$f'(x)=0$"}], correct: "C", explanation: "Fermat's Theorem: tangent must be horizontal at peak/valley.", memoryKey: "Slope Zero" },
        { id: 406, text: "If $f'(x) > 0$, the function is:", options: [{key:"A", text:"Constant"}, {key:"B", text:"Decreasing"}, {key:"C", text:"Increasing"}], correct: "C", explanation: "Positive rate of change implies growth.", memoryKey: "Pos Slope = Up" },
        { id: 407, text: "If the derivative changes sign from $+$ to $-$, we have a:", options: [{key:"A", text:"Minimum"}, {key:"B", text:"Increase"}, {key:"C", text:"Maximum"}], correct: "C", explanation: "First Derivative Test: Going up then down means a peak.", memoryKey: "Peak Pattern" },
        { id: 408, text: "The derivative of a multiplication is:", options: [{key:"A", text:"$f'g' + fg$"}, {key:"B", text:"$f'g' - fg'$"}, {key:"C", text:"$f'g + fg'$"}], correct: "C", explanation: "Product Rule: $(fg)' = f'g + fg'$.", memoryKey: "Product Rule" },
        { id: 409, text: "The derivative of a quotient is:", options: [{key:"A", text:"$(f'g - fg')/g^2$"}, {key:"B", text:"$f'g'/g$"}, {key:"C", text:"$f'g + g'f$"}], correct: "A", explanation: "Quotient Rule: Low d-High minus High d-Low over Low Low.", memoryKey: "Quotient Rule" },
        { id: 410, text: "The derivative of the composition $f(g(x))$ is:", options: [{key:"A", text:"$f(x)g(x)$"}, {key:"B", text:"$f'g + fg'$"}, {key:"C", text:"$f'(g(x))g'(x)$"}], correct: "C", explanation: "Chain Rule.", memoryKey: "Chain Rule" },
        { id: 411, text: "$(\\ln x)' =$", options: [{key:"A", text:"$x \\ln x$"}, {key:"B", text:"$1$"}, {key:"C", text:"$1/x$"}], correct: "C", explanation: "Standard derivative of natural log.", memoryKey: "1/x" },
        { id: 412, text: "The multiplication rule contains:", options: [{key:"A", text:"Multiplication of derivatives"}, {key:"B", text:"Quotient rule"}, {key:"C", text:"The sum of two components"}], correct: "C", explanation: "Referring to the Product Rule structure: $uv' + vu'$ (sum of two parts).", memoryKey: "Sum of Parts" },
        { id: 413, text: "$(x^{-1})' =$", options: [{key:"A", text:"$-1/x^2$"}, {key:"B", text:"$1/x^2$"}, {key:"C", text:"$x$"}], correct: "A", explanation: "Power rule: $-1 \\cdot x^{-2} = -1/x^2$.", memoryKey: "-1/x²" },
        { id: 414, text: "If $f'(x) < 0$, the function is:", options: [{key:"A", text:"Increasing"}, {key:"B", text:"Constant"}, {key:"C", text:"Decreasing"}], correct: "C", explanation: "Negative slope implies decline.", memoryKey: "Neg Slope = Down" },
        { id: 415, text: "$(\\sqrt{x})' =$", options: [{key:"A", text:"$x^{1/2}$"}, {key:"B", text:"$1/x$"}, {key:"C", text:"$1/(2\\sqrt{x})$"}], correct: "C", explanation: "Power rule on $x^{1/2} \\to (1/2)x^{-1/2}$.", memoryKey: "1/2root" },
        { id: 416, text: "If $f'=0$ on an interval, the function is:", options: [{key:"A", text:"Decreasing"}, {key:"B", text:"Increasing"}, {key:"C", text:"Constant"}], correct: "C", explanation: "Zero rate of change everywhere means no change.", memoryKey: "Flatline" },
        { id: 417, text: "The derivative of $x^{5/2}$ is:", options: [{key:"A", text:"$5x^{3/2}$"}, {key:"B", text:"$(5/2)x^{3/2}$"}, {key:"C", text:"$(2/5)x^{3/2}$"}], correct: "B", explanation: "Power rule.", memoryKey: "Power Rule" },
        { id: 418, text: "The growth of a function is determined by:", options: [{key:"A", text:"Integration"}, {key:"B", text:"The second derivative"}, {key:"C", text:"The sign of the derivative"}], correct: "C", explanation: "First derivative indicates increasing/decreasing intervals.", memoryKey: "Sign of f'" },
        { id: 419, text: "Extrema occur where:", options: [{key:"A", text:"$f'>0$"}, {key:"B", text:"The function is increasing"}, {key:"C", text:"$f'=0$"}], correct: "C", explanation: "Critical points.", memoryKey: "f'=0" },
        { id: 420, text: "The derivative describes:", options: [{key:"A", text:"The area under the graph"}, {key:"B", text:"The limit of a function"}, {key:"C", text:"The rate of change"}], correct: "C", explanation: "Physical interpretation of derivative.", memoryKey: "Rate of Change" },
        { id: 421, text: "A positive derivative means:", options: [{key:"A", text:"The function is constant"}, {key:"B", text:"The function reaches a maximum"}, {key:"C", text:"The function is increasing"}], correct: "C", explanation: "Slope is up.", memoryKey: "Going Up" },
        { id: 422, text: "A function is increasing when:", options: [{key:"A", text:"Its derivative is constant"}, {key:"B", text:"Its values are bounded"}, {key:"C", text:"Larger inputs correspond to larger outputs"}], correct: "C", explanation: "Algebraic definition of increasing function.", memoryKey: "x1<x2 -> f1<f2" }
    ],
    [ModuleType.INTEGRALS]: [
        { id: 601, text: "An antiderivative of the function $f(x)$ is a function:", options: [{key:"A", text:"Continuous"}, {key:"B", text:"Whose derivative equals $f(x)$"}, {key:"C", text:"Increasing"}], correct: "B", explanation: "Definition: $F'(x) = f(x)$.", memoryKey: "F'(x)=f(x)" },
        { id: 602, text: "If $\\int f(x)dx = F(x)+C$, then:", options: [{key:"A", text:"$C$ depends on $x$"}, {key:"B", text:"$F'(x)=f(x)$"}, {key:"C", text:"$F(x)$ is unique"}], correct: "B", explanation: "The indefinite integral is the family of antiderivatives.", memoryKey: "Antiderivative Def" },
        { id: 603, text: "The integral $\\int x^a dx$ for $a \\neq -1$ equals:", options: [{key:"A", text:"$\\ln|x|+C$"}, {key:"B", text:"$x^{a+1}+C$"}, {key:"C", text:"$\\frac{1}{a+1} x^{a+1} + C$"}], correct: "C", explanation: "Power rule for integration.", memoryKey: "Power Rule" },
        { id: 604, text: "The integral $\\int \\frac{1}{x} dx$ equals:", options: [{key:"A", text:"$1/x + C$"}, {key:"B", text:"$\\ln|x| + C$"}, {key:"C", text:"$x + C$"}], correct: "B", explanation: "Logarithmic integration rule.", memoryKey: "ln|x|" },
        { id: 605, text: "The integral $\\int e^x dx$ equals:", options: [{key:"A", text:"$xe^x$"}, {key:"B", text:"$e^x + C$"}, {key:"C", text:"$\\ln e^x$"}], correct: "B", explanation: "Exponential function is its own integral.", memoryKey: "e^x" },
        { id: 606, text: "If $F'(x)=f(x)$, then the integral $\\int f(x)dx$ equals:", options: [{key:"A", text:"$F(x)+C$"}, {key:"B", text:"$F'(x)+C$"}, {key:"C", text:"$C$"}], correct: "A", explanation: "Definition of indefinite integral.", memoryKey: "F(x)+C" },
        { id: 607, text: "What do we call an antiderivative of the function $f(x)$?", options: [{key:"A", text:"A function whose derivative equals $f(x)$"}, {key:"B", text:"The inverse function"}, {key:"C", text:"The limit"}], correct: "A", explanation: "Also known as the primitive function.", memoryKey: "Primitive" },
        { id: 608, text: "What does the constant $C$ mean in an indefinite integral?", options: [{key:"A", text:"An arbitrary real constant"}, {key:"B", text:"A limit of integration"}, {key:"C", text:"Value at $0$"}], correct: "A", explanation: "Represents the family of parallel curves.", memoryKey: "Arbitrary Constant" },
        { id: 609, text: "What is the result of $\\int x^2 dx$?", options: [{key:"A", text:"$x^3/3 + C$"}, {key:"B", text:"$2x + C$"}, {key:"C", text:"$x^2 + C$"}], correct: "A", explanation: "Power rule: $x^{2+1}/(2+1)$.", memoryKey: "x^3/3" },
        { id: 610, text: "Which integral equals $\\ln|x| + C$?", options: [{key:"A", text:"$\\int 1/x dx$"}, {key:"B", text:"$\\int x dx$"}, {key:"C", text:"$\\int e^x dx$"}], correct: "A", explanation: "Reverse of derivative of $\\ln(x)$.", memoryKey: "1/x -> ln" },
        { id: 611, text: "The constant of integration:", options: [{key:"A", text:"is always positive"}, {key:"B", text:"can be any real number"}, {key:"C", text:"depends on the function"}], correct: "B", explanation: "It shifts the function vertically.", memoryKey: "Any Real" },
        { id: 612, text: "If two functions have the same derivative on an interval, they:", options: [{key:"A", text:"are identical"}, {key:"B", text:"differ by a constant"}, {key:"C", text:"have the same zero"}], correct: "B", explanation: "Geometric interpretation of the constant $C$.", memoryKey: "Vertical Shift" },
        { id: 613, text: "$\\int(f(x)+g(x))dx$ equals:", options: [{key:"A", text:"$\\int f(x)dx \\cdot \\int g(x)dx$"}, {key:"B", text:"$\\int f(x)dx + \\int g(x)dx$"}, {key:"C", text:"$\\int f(x)g(x)dx$"}], correct: "B", explanation: "Linearity of integration.", memoryKey: "Sum Rule" },
        { id: 614, text: "$\\int kf(x)dx$ equals:", options: [{key:"A", text:"$k \\int f(x)dx$"}, {key:"B", text:"$\\int f(kx)dx$"}, {key:"C", text:"$\\int f(x)dk$"}], correct: "A", explanation: "Constant multiple rule.", memoryKey: "Pull out k" },
        { id: 615, text: "$\\int(x-2)dx$ equals:", options: [{key:"A", text:"$-x-1+C$"}, {key:"B", text:"$x^2/2 - 2x + C$"}, {key:"C", text:"$x^2/2 - 2 + C$"}], correct: "B", explanation: "Power rule term by term.", memoryKey: "Term by Term" },
        { id: 616, text: "$\\int x dx$ equals:", options: [{key:"A", text:"$2x+C$"}, {key:"B", text:"$x^2/2 + C$"}, {key:"C", text:"$x^{1/2} + C$"}], correct: "B", explanation: "Power rule $n=1$.", memoryKey: "x^2/2" },
        { id: 617, text: "Integration by substitution consists of:", options: [{key:"A", text:"decomposing sum"}, {key:"B", text:"replacing variable"}, {key:"C", text:"differentiating"}], correct: "B", explanation: "$u$-substitution technique.", memoryKey: "u-sub" },
        { id: 618, text: "In substitution, the auxiliary variable:", options: [{key:"A", text:"must be linear"}, {key:"B", text:"simplifies the integral"}, {key:"C", text:"replaces constant"}], correct: "B", explanation: "Goal is to transform into a known form.", memoryKey: "Simplifies" },
        { id: 619, text: "$\\int 1/(x-3)dx$ gives:", options: [{key:"A", text:"$\\ln|x-3|$"}, {key:"B", text:"$\\ln|x-3|+C$"}, {key:"C", text:"$-\\ln|x-3|+C$"}], correct: "B", explanation: "Log rule with linear inner function.", memoryKey: "ln(linear)" },
        { id: 620, text: "Integration by parts is based on:", options: [{key:"A", text:"$(uv)'=u'v'$"}, {key:"B", text:"$d(uv)=udv+vdu$"}, {key:"C", text:"$(u+v)'=u'v$"}], correct: "B", explanation: "Derived from product rule.", memoryKey: "Product Rule Reverse" },
        { id: 621, text: "In integration by parts, choose $u$ as:", options: [{key:"A", text:"easy to integrate"}, {key:"B", text:"easy to differentiate"}, {key:"C", text:"arbitrarily"}], correct: "B", explanation: "LIATE rule helps select $u$ to simplify derivative.", memoryKey: "LIATE" },
        { id: 622, text: "In integration by parts, choose $dv$ as:", options: [{key:"A", text:"easy to integrate"}, {key:"B", text:"easy to differentiate"}, {key:"C", text:"arbitrarily"}], correct: "A", explanation: "You must be able to find $v$ from $dv$.", memoryKey: "Easy Integral" },
        { id: 623, text: "An indefinite integral describes:", options: [{key:"A", text:"area"}, {key:"B", text:"family of antiderivatives"}, {key:"C", text:"number"}], correct: "B", explanation: "Set of all possible primitives.", memoryKey: "Family" },
        { id: 624, text: "Integration is inverse to:", options: [{key:"A", text:"differentiation"}, {key:"B", text:"limits"}, {key:"C", text:"algebra"}], correct: "A", explanation: "Fundamental Theorem of Calculus.", memoryKey: "Inverse Deriv" },
        { id: 625, text: "$\\int dx$ equals:", options: [{key:"A", text:"$1$"}, {key:"B", text:"$x+C$"}, {key:"C", text:"$\\ln x$"}], correct: "B", explanation: "Integral of $1$ is $x$.", memoryKey: "x+C" },
        { id: 626, text: "If $F'(x)=0$, then:", options: [{key:"A", text:"$F(x)=x$"}, {key:"B", text:"$F(x)=C$"}, {key:"C", text:"$F(x)=0$"}], correct: "B", explanation: "Only constants have zero derivative.", memoryKey: "Constant Slope 0" },
        { id: 627, text: "$\\int x^0 dx$ equals:", options: [{key:"A", text:"$0$"}, {key:"B", text:"$\\ln x$"}, {key:"C", text:"$x+C$"}], correct: "C", explanation: "$x^0 = 1$.", memoryKey: "Int 1" },
        { id: 628, text: "$\\int(x^2-2x)dx$ equals:", options: [{key:"A", text:"$x^3/3 - x^2 + C$"}, {key:"B", text:"$2x - 2 + C$"}, {key:"C", text:"$x^2/2 - 2x + C$"}], correct: "A", explanation: "Power rule applied to polynomial.", memoryKey: "Poly Rule" },
        { id: 629, text: "The integral of a negative function:", options: [{key:"A", text:"is always positive"}, {key:"B", text:"is negative (definite)"}, {key:"C", text:"positive"}], correct: "B", explanation: "Area below x-axis is signed negative.", memoryKey: "Negative Area" },
        { id: 630, text: "Integral of a polynomial is:", options: [{key:"A", text:"polynomial of higher degree"}, {key:"B", text:"logarithm"}, {key:"C", text:"exponential"}], correct: "A", explanation: "Degree increases by 1.", memoryKey: "Degree +1" },
        { id: 631, text: "Integration by parts is used when:", options: [{key:"A", text:"product of functions"}, {key:"B", text:"rational function"}, {key:"C", text:"even function"}], correct: "A", explanation: "Reverse product rule.", memoryKey: "Product" },
        { id: 632, text: "Indefinite integral does not contain:", options: [{key:"A", text:"limits of integration"}, {key:"B", text:"constants"}, {key:"C", text:"functions"}], correct: "A", explanation: "It has no bounds $[a,b]$.", memoryKey: "No Limits" },
        { id: 633, text: "Constant of integration results from:", options: [{key:"A", text:"differentiation"}, {key:"B", text:"non-uniqueness"}, {key:"C", text:"error"}], correct: "B", explanation: "Many functions share the same derivative.", memoryKey: "Non-Unique" },
        { id: 634, text: "Indefinite integral is used for:", options: [{key:"A", text:"determining limits"}, {key:"B", text:"solving diff equations"}, {key:"C", text:"monotonicity"}], correct: "B", explanation: "Finding the function $y$ from $y'$.", memoryKey: "Solve DE" },
        { id: 635, text: "A definite integral is:", options: [{key:"A", text:"always positive"}, {key:"B", text:"dependent on $C$"}, {key:"C", text:"a number (dependent on limits)"}], correct: "C", explanation: "It evaluates to a scalar value.", memoryKey: "Scalar Value" },
        { id: 636, text: "If $F'(x)=f(x)$, then $\\int_a^b f(x)dx$ equals:", options: [{key:"A", text:"$F(a)-F(b)$"}, {key:"B", text:"$F(b)-F(a)$"}, {key:"C", text:"$C$"}], correct: "B", explanation: "Fundamental Theorem of Calculus.", memoryKey: "F(b)-F(a)" },
        { id: 637, text: "Area under positive function:", options: [{key:"A", text:"definite integral"}, {key:"B", text:"indefinite integral"}, {key:"C", text:"no interpretation"}], correct: "A", explanation: "Geometric application.", memoryKey: "Area" },
        { id: 638, text: "If $f(x) \\le 0$, the area is:", options: [{key:"A", text:"integral"}, {key:"B", text:"-integral"}, {key:"C", text:"undefined"}], correct: "B", explanation: "Area must be positive, integral is negative.", memoryKey: "-Integral" },
        { id: 639, text: "Definite integral does not depend on:", options: [{key:"A", text:"function"}, {key:"B", text:"limits"}, {key:"C", text:"constant of integration"}], correct: "C", explanation: "$C$s cancel out in subtraction.", memoryKey: "No C" },
        { id: 640, text: "Additivity property:", options: [{key:"A", text:"function"}, {key:"B", text:"interval of integration"}, {key:"C", text:"constant"}], correct: "B", explanation: "Integral $a$ to $c$ = $a$ to $b$ + $b$ to $c$.", memoryKey: "Split Interval" },
        { id: 641, text: "$\\int_a^a f(x)dx$ equals:", options: [{key:"A", text:"$1$"}, {key:"B", text:"$f(a)$"}, {key:"C", text:"$0$"}], correct: "C", explanation: "Zero width interval.", memoryKey: "Zero Width" },
        { id: 642, text: "Integral of sum:", options: [{key:"A", text:"sum of integrals"}, {key:"B", text:"product"}, {key:"C", text:"difference"}], correct: "A", explanation: "Linearity.", memoryKey: "Sum is Sum" },
        { id: 643, text: "Constant factor in definite integral:", options: [{key:"A", text:"stays inside"}, {key:"B", text:"factored out"}, {key:"C", text:"disappears"}], correct: "B", explanation: "Linearity.", memoryKey: "Factor Out" },
        { id: 644, text: "Improper integral occurs when:", options: [{key:"A", text:"continuous"}, {key:"B", text:"unbounded interval/function"}, {key:"C", text:"limits equal"}], correct: "B", explanation: "Infinity in bounds or asymptote.", memoryKey: "Unbounded" },
        { id: 645, text: "$\\int_a^\\infty$ defined as:", options: [{key:"A", text:"infinite sum"}, {key:"B", text:"limit of definite integrals"}, {key:"C", text:"indefinite"}], correct: "B", explanation: "$\\lim_{b\\to\\infty}$ of integral $a$ to $b$.", memoryKey: "Limit Def" },
        { id: 646, text: "If limit doesn't exist:", options: [{key:"A", text:"zero"}, {key:"B", text:"convergent"}, {key:"C", text:"divergent"}], correct: "C", explanation: "No finite value.", memoryKey: "Divergent" },
        { id: 647, text: "$\\int_{-\\infty}^0 e^x dx$ is:", options: [{key:"A", text:"divergent"}, {key:"B", text:"$0$"}, {key:"C", text:"convergent ($1$)"}], correct: "C", explanation: "$e^0 - e^{-\\infty} = 1 - 0 = 1$.", memoryKey: "Convergent 1" },
        { id: 648, text: "Integral over $(-\\infty, \\infty)$ is sum of:", options: [{key:"A", text:"two improper integrals"}, {key:"B", text:"one definite"}, {key:"C", text:"indefinite"}], correct: "A", explanation: "Split at arbitrary point (usually $0$).", memoryKey: "Split Inf" },
        { id: 649, text: "Improper integral may be:", options: [{key:"A", text:"only positive"}, {key:"B", text:"only negative"}, {key:"C", text:"convergent or divergent"}], correct: "C", explanation: "Result type.", memoryKey: "Conv/Div" },
        { id: 650, text: "Integral of PDF over $(-\\infty, \\infty)$:", options: [{key:"A", text:"$0$"}, {key:"B", text:"$1$"}, {key:"C", text:"undefined"}], correct: "B", explanation: "Total probability is $1$.", memoryKey: "Prob = 1" },
        { id: 651, text: "Normal distribution PDF:", options: [{key:"A", text:"polynomial"}, {key:"B", text:"contains exponential"}, {key:"C", text:"linear"}], correct: "B", explanation: "Gaussian bell curve form.", memoryKey: "Exp Form" },
        { id: 652, text: "Parameter $\\mu$ denotes:", options: [{key:"A", text:"variance"}, {key:"B", text:"mean"}, {key:"C", text:"std dev"}], correct: "B", explanation: "Center of distribution.", memoryKey: "Mean" },
        { id: 653, text: "Parameter $\\sigma$ denotes:", options: [{key:"A", text:"mean"}, {key:"B", text:"variance"}, {key:"C", text:"standard deviation"}], correct: "C", explanation: "Spread of distribution.", memoryKey: "Std Dev" },
        { id: 654, text: "CDF is defined as:", options: [{key:"A", text:"derivative of density"}, {key:"B", text:"integral of density"}, {key:"C", text:"limit"}], correct: "B", explanation: "Cumulative area.", memoryKey: "Integral PDF" },
        { id: 655, text: "Area under density function:", options: [{key:"A", text: "Greater than $1$"}, {key:"B", text: "equals $1$"}, {key:"C", text: "negative"}], correct: "B", explanation: "Total probability.", memoryKey: "Area 1" },
        { id: 656, text: "Definite integral used for:", options: [{key:"A", text:"antiderivatives"}, {key:"B", text:"areas/numerical values"}, {key:"C", text:"algebra"}], correct: "B", explanation: "Geometric application.", memoryKey: "Numerical" },
        { id: 657, text: "If $f(x)$ non-negative:", options: [{key:"A", text:"integral negative"}, {key:"B", text:"integral non-negative"}, {key:"C", text:"zero"}], correct: "B", explanation: "Positive height = positive area.", memoryKey: "Non-neg" },
        { id: 658, text: "$\\int_0^1 1/\\sqrt{x} dx$ is:", options: [{key:"A", text:"divergent"}, {key:"B", text:"convergent"}, {key:"C", text:"$0$"}], correct: "B", explanation: "Equals $2$.", memoryKey: "Conv 2" },
        { id: 659, text: "If improper integral convergent:", options: [{key:"A", text:"limit exists"}, {key:"B", text:"function continuous"}, {key:"C", text:"interval closed"}], correct: "A", explanation: "Definition of convergence.", memoryKey: "Limit Exists" },
        { id: 660, text: "Geometric interpretation:", options: [{key:"A", text:"length"}, {key:"B", text:"area under graph"}, {key:"C", text:"volume"}], correct: "B", explanation: "Standard definition.", memoryKey: "Area" },
        { id: 661, text: "Orientation of interval:", options: [{key:"A", text:"no effect"}, {key:"B", text:"only continuous"}, {key:"C", text:"swapping limits changes sign"}], correct: "C", explanation: "Integral $a$ to $b$ = - Integral $b$ to $a$.", memoryKey: "Sign Flip" },
        { id: 685, text: "Notation for indefinite integral:", options: [{key:"A", text:"$\\int f(x)dx$"}, {key:"B", text:"$\\lim f(x)$"}, {key:"C", text:"$f'(x)$"}], correct: "A", explanation: "Integral symbol.", memoryKey: "Notation" },
        { id: 686, text: "Integral property:", options: [{key:"A", text:"$\\int(f+g) = \\int f + \\int g$"}, {key:"B", text:"$\\int(f+g) = \\int f \\cdot \\int g$"}, {key:"C", text:"$\\int kf = \\int f$"}], correct: "A", explanation: "Linearity.", memoryKey: "Sum Prop" },
        { id: 687, text: "Substitution method:", options: [{key:"A", text:"replace variable"}, {key:"B", text:"differentiate"}, {key:"C", text:"limit"}], correct: "A", explanation: "Change of variables.", memoryKey: "Replace Var" },
        { id: 688, text: "Substitution for $\\int 1/(2x-3) dx$:", options: [{key:"A", text:"$t=2x-3$"}, {key:"B", text:"$t=x^2$"}, {key:"C", text:"$t=\\ln x$"}], correct: "A", explanation: "Inner linear function.", memoryKey: "Linear Sub" },
        { id: 689, text: "Integration by parts formula:", options: [{key:"A", text:"$\\int udv = uv - \\int vdu$"}, {key:"B", text:"$\\int udv = du-v$"}, {key:"C", text:"$\\int udv=u+v$"}], correct: "A", explanation: "Correct formula.", memoryKey: "uv-int vdu" },
        { id: 690, text: "Definite integral is:", options: [{key:"A", text:"difference of antiderivatives"}, {key:"B", text:"indefinite"}, {key:"C", text:"derivative"}], correct: "A", explanation: "FTC Part 2.", memoryKey: "Diff Anti" },
        { id: 691, text: "True statement:", options: [{key:"A", text:"DE contains derivatives"}, {key:"B", text:"DE no independent"}, {key:"C", text:"DE linear"}], correct: "A", explanation: "Definition of Differential Equation.", memoryKey: "Contains Deriv" },
        { id: 692, text: "Compute $\\int x^2 dx$:", options: [{key:"A", text:"$x^3/3 + C$"}, {key:"B", text:"$2x + C$"}, {key:"C", text:"$x^2 + C$"}], correct: "A", explanation: "Power rule.", memoryKey: "Power" },
        { id: 693, text: "Compute $\\int \\sqrt{x} dx$:", options: [{key:"A", text:"$\\frac{2}{3} x^{3/2} + C$"}, {key:"B", text:"$2\\sqrt{x} + C$"}, {key:"C", text:"$x^{1/2} + C$"}], correct: "A", explanation: "$x^{1/2} \\to x^{3/2} / (3/2)$.", memoryKey: "2/3 x^3/2" },
        { id: 694, text: "Compute $\\int 1/x^2 dx$:", options: [{key:"A", text:"$-1/x + C$"}, {key:"B", text:"$\\ln x + C$"}, {key:"C", text:"$x^{-1} + C$"}], correct: "A", explanation: "$x^{-2} \\to x^{-1} / -1$.", memoryKey: "-1/x" },
        { id: 695, text: "Compute $\\int 3x^2 dx$:", options: [{key:"A", text:"$x^3 + C$"}, {key:"B", text:"$3x^3 + C$"}, {key:"C", text:"$x^2 + C$"}], correct: "A", explanation: "$3 \\cdot x^3/3$.", memoryKey: "x^3" },
        { id: 696, text: "Compute $\\int 5 dx$:", options: [{key:"A", text:"$5x + C$"}, {key:"B", text:"$x + C$"}, {key:"C", text:"$0$"}], correct: "A", explanation: "Constant rule.", memoryKey: "5x" },
        { id: 697, text: "$\\int_0^1 x dx$:", options: [{key:"A", text:"$1/2$"}, {key:"B", text:"$1$"}, {key:"C", text:"$0$"}], correct: "A", explanation: "$1/2 - 0$.", memoryKey: "1/2" },
        { id: 698, text: "$\\int_0^1 1 dx$:", options: [{key:"A", text:"$1$"}, {key:"B", text:"$2$"}, {key:"C", text:"$3$"}], correct: "A", explanation: "$1 - 0$.", memoryKey: "1" },
        { id: 699, text: "$\\int k f(x) dx$:", options: [{key:"A", text:"$k \\int f(x)dx$"}, {key:"B", text:"$\\int f(x)dx + k$"}, {key:"C", text:"$\\int f(kx)dx$"}], correct: "A", explanation: "Constant multiple.", memoryKey: "Const Mult" }
    ],
    [ModuleType.DIFF_EQ]: [
        { id: 801, text: "A first-order differential equation is:", options: [{key:"A", text:"algebraic"}, {key:"B", text:"equation containing first derivative"}, {key:"C", text:"quadratic"}], correct: "B", explanation: "Order 1 means max derivative is $y'$.", memoryKey: "1st Deriv" },
        { id: 802, text: "The general solution of a DE is:", options: [{key:"A", text:"a number"}, {key:"B", text:"a family of functions (parameter)"}, {key:"C", text:"no constants"}], correct: "B", explanation: "Contains arbitrary constants ($C$).", memoryKey: "Family" },
        { id: 803, text: "A particular solution is obtained:", options: [{key:"A", text:"by differentiation"}, {key:"B", text:"by applying initial conditions"}, {key:"C", text:"definite int"}], correct: "B", explanation: "Fixing $C$ to a specific value.", memoryKey: "Init Cond" },
        { id: 804, text: "The equation $y'=2y$ is:", options: [{key:"A", text:"linear"}, {key:"B", text:"separable"}, {key:"C", text:"second-order"}], correct: "B", explanation: "Separable ($dy/y = 2dx$). (Also linear, but separable is primary method logic here)", memoryKey: "Separable" },
        { id: 805, text: "Method of separation of variables:", options: [{key:"A", text:"changing variable"}, {key:"B", text:"separating $y$ and $x$"}, {key:"C", text:"parts"}], correct: "B", explanation: "Moving terms to opposite sides.", memoryKey: "Separate" },
        { id: 806, text: "Equation $dN/dt = -\\lambda N$ describes:", options: [{key:"A", text:"pop growth"}, {key:"B", text:"radioactive decay"}, {key:"C", text:"logistic"}], correct: "B", explanation: "Negative rate proportional to amount.", memoryKey: "Decay" },
        { id: 807, text: "Constant $\\lambda$ in decay denotes:", options: [{key:"A", text:"decay probability per time"}, {key:"B", text:"half-life"}, {key:"C", text:"initial"}], correct: "A", explanation: "Rate constant.", memoryKey: "Prob/Time" },
        { id: 808, text: "Malthus model describes:", options: [{key:"A", text:"limited growth"}, {key:"B", text:"exponential growth"}, {key:"C", text:"decline"}], correct: "B", explanation: "Unbounded geometric growth.", memoryKey: "Exp Growth" },
        { id: 809, text: "Equation $dN/dt = (r-s)N$ describes:", options: [{key:"A", text:"growth without mortality"}, {key:"B", text:"growth including mortality"}, {key:"C", text:"logistic"}], correct: "B", explanation: "Net rate = birth - death.", memoryKey: "Net Rate" },
        { id: 810, text: "Verhulst model accounts for:", options: [{key:"A", text:"reproduction only"}, {key:"B", text:"limited resources"}, {key:"C", text:"mortality only"}], correct: "B", explanation: "Carrying capacity (Logistic).", memoryKey: "Limited" },
        { id: 811, text: "Newton's law of cooling describes:", options: [{key:"A", text:"temp increase"}, {key:"B", text:"temp difference"}, {key:"C", text:"const"}], correct: "B", explanation: "Rate proportional to difference.", memoryKey: "Temp Diff" },
        { id: 812, text: "DEs are used for:", options: [{key:"A", text:"geometry"}, {key:"B", text:"modeling dynamic phenomena"}, {key:"C", text:"algebra"}], correct: "B", explanation: "Change over time.", memoryKey: "Dynamic" },
        { id: 813, text: "Gompertz model describes:", options: [{key:"A", text:"linear"}, {key:"B", text:"epidemic/tumor (decreasing rate)"}, {key:"C", text:"decay"}], correct: "B", explanation: "Sigmoidal but asymmetric.", memoryKey: "Tumor" },
        { id: 814, text: "Ordinary differential equation:", options: [{key:"A", text:"many indep vars"}, {key:"B", text:"one independent variable"}, {key:"C", text:"no deriv"}], correct: "B", explanation: "vs Partial DE.", memoryKey: "One Indep" },
        { id: 815, text: "DE without initial conditions has:", options: [{key:"A", text:"one solution"}, {key:"B", text:"many solutions"}, {key:"C", text:"no solution"}], correct: "B", explanation: "Infinitely many (General Solution).", memoryKey: "Many" },
        { id: 816, text: "Initial conditions used to:", options: [{key:"A", text:"check continuity"}, {key:"B", text:"determine constant"}, {key:"C", text:"diff"}], correct: "B", explanation: "Find $C$.", memoryKey: "Find C" },
        { id: 817, text: "A particular solution is:", options: [{key:"A", text:"family"}, {key:"B", text:"single function"}, {key:"C", text:"limit"}], correct: "B", explanation: "Unique curve.", memoryKey: "Single Func" },
        { id: 818, text: "$y'=f(x)$ is solved by:", options: [{key:"A", text:"differentiation"}, {key:"B", text:"indefinite integration"}, {key:"C", text:"definite"}], correct: "B", explanation: "Direct integration.", memoryKey: "Integrate" },
        { id: 819, text: "Separable equation form:", options: [{key:"A", text:"$y'=f(x,y)$"}, {key:"B", text:"$g(y)dy=f(x)dx$"}, {key:"C", text:"linear"}], correct: "B", explanation: "Variables separated.", memoryKey: "Split" },
        { id: 820, text: "Differential equations describe:", options: [{key:"A", text:"motion only"}, {key:"B", text:"changes"}, {key:"C", text:"linear functions"}], correct: "B", explanation: "Rates of change.", memoryKey: "Change" },
        { id: 821, text: "First-order DE contains:", options: [{key:"A", text:"only $y$"}, {key:"B", text:"only $x$"}, {key:"C", text:"derivative $y'$"}], correct: "C", explanation: "Must have $y'$.", memoryKey: "y'" },
        { id: 822, text: "Applications include:", options: [{key:"A", text:"math only"}, {key:"B", text:"physics, biology, medicine"}, {key:"C", text:"stats"}], correct: "B", explanation: "Broad utility.", memoryKey: "Science" },
        { id: 823, text: "Two functions with same derivative:", options: [{key:"A", text:"differ by constant"}, {key:"B", text:"identical"}, {key:"C", text:"diff sign"}], correct: "A", explanation: "Parallel curves.", memoryKey: "Constant Diff" },
        { id: 824, text: "General solution of $y'=ky$:", options: [{key:"A", text:"$y=Ce^{kx}$"}, {key:"B", text:"$y=kx+C$"}, {key:"C", text:"polynomial"}], correct: "A", explanation: "Exponential growth/decay.", memoryKey: "Ce^kx" },
        { id: 825, text: "If $y'=-\\lambda y$, solution describes:", options: [{key:"A", text:"exp decay"}, {key:"B", text:"linear"}, {key:"C", text:"oscillation"}], correct: "A", explanation: "Negative exponent.", memoryKey: "Decay" },
        { id: 826, text: "Law of radioactive decay:", options: [{key:"A", text:"$dN/dt = -\\lambda N$"}, {key:"B", text:"linear"}, {key:"C", text:"positive"}], correct: "A", explanation: "Differential form.", memoryKey: "Eq" },
        { id: 827, text: "Condition $N(T_{1/2}) = N_0/2$:", options: [{key:"A", text:"half-life"}, {key:"B", text:"total time"}, {key:"C", text:"initial"}], correct: "A", explanation: "Definition of half-life.", memoryKey: "Half-Life" },
        { id: 828, text: "Solutions of $y'=ay$:", options: [{key:"A", text:"exponential"}, {key:"B", text:"polynomial"}, {key:"C", text:"trig"}], correct: "A", explanation: "$y = Ce^{ax}$.", memoryKey: "Exp" },
        { id: 829, text: "DE always contains:", options: [{key:"A", text:"derivative"}, {key:"B", text:"integral"}, {key:"C", text:"graph"}], correct: "A", explanation: "By definition.", memoryKey: "Deriv" },
        { id: 830, text: "Parameter $C$ denotes:", options: [{key:"A", text:"constant of integration"}, {key:"B", text:"variable"}, {key:"C", text:"derivative"}], correct: "A", explanation: "Arbitrary constant.", memoryKey: "Const" },
        { id: 831, text: "Set of general solutions forms:", options: [{key:"A", text:"family of curves"}, {key:"B", text:"line"}, {key:"C", text:"point"}], correct: "A", explanation: "Infinite curves.", memoryKey: "Family" }
    ]
};
