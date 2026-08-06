
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModuleType } from '../types';
import { MathRenderer } from '../components/MathRenderer';

interface HomeworkViewProps {
    module?: ModuleType;
}

interface QuestionItem {
    id: string | number;
    text: string;
    options?: string[]; // Added options support for multiple choice style
    correctAnswer?: string;
    solutionSteps: string[];
}

interface QuestionCategory {
    category: string;
    items: QuestionItem[];
}

export const HomeworkView: React.FC<HomeworkViewProps> = ({ module }) => {
    const [expandedId, setExpandedId] = useState<string | number | null>(null);

    const toggleSolution = (id: string | number) => {
        setExpandedId(expandedId === id ? null : id);
    };
    
    // --- DATA ---

    const matrixQuestions: QuestionCategory[] = [
        {
            category: "Definitions & Dimensions",
            items: [
                {
                    id: 'm_1',
                    text: "1. What is a matrix?",
                    options: ["A) Any sequence of numbers", "B) A rectangular array of numbers arranged in rows and columns", "C) A graph of a function"],
                    correctAnswer: "B",
                    solutionSteps: ["A matrix is defined as a rectangular array of numbers (or symbols/expressions) arranged in rows and columns."]
                },
                {
                    id: 'm_2',
                    text: "2. The dimension of matrix An×m means:",
                    options: ["A) n columns and m rows", "B) n rows and m columns", "C) m rows and n columns"],
                    correctAnswer: "B",
                    solutionSteps: ["Convention: Rows × Columns (n × m)."]
                },
                {
                    id: 'm_3',
                    text: "3. A square matrix is a matrix in which:",
                    options: ["A) n ≠ m", "B) all elements are zeros", "C) n = m"],
                    correctAnswer: "C",
                    solutionSteps: ["Square implies equal sides, so number of rows (n) equals number of columns (m)."]
                },
                {
                    id: 'm_4',
                    text: "4. The identity matrix is:",
                    options: ["A) a matrix with ones on the main diagonal and zeros elsewhere", "B) a matrix with all elements equal to 1", "C) the zero matrix"],
                    correctAnswer: "A",
                    solutionSteps: ["Identity matrix I has 1s on diagonal, 0s elsewhere. AI = IA = A."]
                },
                {
                    id: 'm_6',
                    text: "6. A diagonal matrix is:",
                    options: ["A) non-zero elements only on the main diagonal", "B) ones on the diagonal", "C) zeros in the columns"],
                    correctAnswer: "A",
                    solutionSteps: ["A diagonal matrix has entries outside the main diagonal equal to zero."]
                }
            ]
        },
        {
            category: "Operations & Properties",
            items: [
                {
                    id: 'm_7',
                    text: "7. To add two matrices, they must have:",
                    options: ["A) the same number of rows", "B) the same number of columns", "C) identical dimensions"],
                    correctAnswer: "C",
                    solutionSteps: ["Matrix addition is element-wise, so dimensions (rows and columns) must match."]
                },
                {
                    id: 'm_8',
                    text: "8. The transposition of a matrix means:",
                    options: ["A) reversing the order of columns", "B) swapping rows and columns", "C) squaring the matrix"],
                    correctAnswer: "B",
                    solutionSteps: ["Transpose A^T swaps indices ij to ji, effectively turning rows into columns."]
                },
                {
                    id: 'm_10',
                    text: "10. The product A(n×m) * B(p×q) exists when:",
                    options: ["A) n = q", "B) m = p", "C) n = p"],
                    correctAnswer: "B",
                    solutionSteps: ["Inner dimensions must match. (n×m) * (m×q) yields (n×q)."]
                },
                {
                    id: 'm_12',
                    text: "12. The transposition rule of a matrix product is:",
                    options: ["A) (AB)^T = A^T B^T", "B) (AB)^T = B^T A^T", "C) (AB)^T = AB"],
                    correctAnswer: "B",
                    solutionSteps: ["The transpose of a product is the product of transposes in reverse order."]
                },
                {
                    id: 'm_14',
                    text: "14. A symmetric matrix satisfies:",
                    options: ["A) A = -A^T", "B) A = A^T", "C) A^T = 0"],
                    correctAnswer: "B",
                    solutionSteps: ["Symmetry means the matrix is equal to its transpose."]
                }
            ]
        },
        {
            category: "Determinants & Inverse",
            items: [
                {
                    id: 'm_17',
                    text: "17. A matrix is singular when:",
                    options: ["A) detA ≠ 0", "B) detA = 0", "C) A^-1 exists"],
                    correctAnswer: "B",
                    solutionSteps: ["A singular matrix has a determinant of zero and no inverse."]
                },
                {
                    id: 'm_18',
                    text: "18. For a 2×2 matrix, |A| equals:",
                    options: ["A) a+b+c+d", "B) ad - bc", "C) ab - cd"],
                    correctAnswer: "B",
                    solutionSteps: ["Standard formula for 2x2 determinant."]
                },
                {
                    id: 'm_25',
                    text: "25. The inverse matrix exists only when:",
                    options: ["A) detA ≠ 0", "B) detA = 0", "C) A is rectangular"],
                    correctAnswer: "A",
                    solutionSteps: ["A non-zero determinant is required to calculate the inverse (1/detA)."]
                },
                {
                    id: 'm_28',
                    text: "28. The product of determinants satisfies:",
                    options: ["A) det(AB) = detA + detB", "B) det(AB) = detA * detB", "C) det(AB) = 0"],
                    correctAnswer: "B",
                    solutionSteps: ["The determinant of a product is the product of the determinants."]
                }
            ]
        },
        {
            category: "Systems of Equations",
            items: [
                {
                    id: 'm_31',
                    text: "31. The matrix form of a system of equations is:",
                    options: ["A) A + X = B", "B) A * X = B", "C) X = A + B"],
                    correctAnswer: "B",
                    solutionSteps: ["Coefficient Matrix (A) * Variable Vector (X) = Constant Vector (B)."]
                },
                {
                    id: 'm_33',
                    text: "33. A Cramer's system has a solution when:",
                    options: ["A) detA = 0", "B) detA ≠ 0", "C) A is rectangular"],
                    correctAnswer: "B",
                    solutionSteps: ["Cramer's rule requires dividing by the main determinant W (detA), so it must be non-zero."]
                },
                {
                    id: 'm_36',
                    text: "36. If W=0 and at least one Wi≠0, the system:",
                    options: ["A) is inconsistent (no solution)", "B) has one solution", "C) has many solutions"],
                    correctAnswer: "A",
                    solutionSteps: ["This represents a contradiction (0 * x = non-zero), so no solution exists."]
                }
            ]
        }
    ];

    const sequenceQuestions: QuestionCategory[] = [
        {
            category: "Fundamentals",
            items: [
                {
                    id: 's_1',
                    text: "1. A number sequence is:",
                    options: ["A) a real function of two variables", "B) an assignment of one real number to each natural number", "C) an arbitrary set"],
                    correctAnswer: "B",
                    solutionSteps: ["A sequence is essentially a function f: N -> R."]
                },
                {
                    id: 's_3',
                    text: "3. A sequence that has a finite limit is called:",
                    options: ["A) divergent", "B) convergent", "C) monotonic"],
                    correctAnswer: "B",
                    solutionSteps: ["Convergence is defined as approaching a finite limit g."]
                },
                {
                    id: 's_8',
                    text: "8. An arithmetic sequence satisfies:",
                    options: ["A) a_{n+1} = a_n + r", "B) a_{n+1} = a_n * q", "C) a_{n+1} = a_n^2 + r"],
                    correctAnswer: "A",
                    solutionSteps: ["Terms change by adding a constant difference r."]
                },
                {
                    id: 's_9',
                    text: "9. A geometric sequence satisfies:",
                    options: ["A) a_{n+1} = a_n + q", "B) a_{n+1} = a_n * q", "C) a_{n+1} = a_n / q"],
                    correctAnswer: "B",
                    solutionSteps: ["Terms change by multiplying by a constant ratio q."]
                }
            ]
        },
        {
            category: "Limits & Properties",
            items: [
                {
                    id: 's_13',
                    text: "13. The number e (Euler's number) is the limit of:",
                    options: ["A) (1 + 1/n)^n", "B) 1/n", "C) sqrt(n)"],
                    correctAnswer: "A",
                    solutionSteps: ["Standard definition of e."]
                },
                {
                    id: 's_14',
                    text: "14. The sequence a_n = q^n converges to zero when:",
                    options: ["A) |q| > 1", "B) -1 < q < 1", "C) q = 1"],
                    correctAnswer: "B",
                    solutionSteps: ["Geometric sequence converges to 0 if the absolute value of the ratio is less than 1."]
                },
                {
                    id: 's_15',
                    text: "15. The theorem of three sequences (Squeeze Theorem) states that:",
                    options: ["A) if a_n <= b_n <= c_n and lim a_n = lim c_n = g, then lim b_n = g", "B) if a_n = b_n + c_n...", "C) if a_n > b_n..."],
                    correctAnswer: "A",
                    solutionSteps: ["If a sequence is squeezed between two others converging to the same limit, it must also converge to that limit."]
                }
            ]
        }
    ];

    const functionQuestions: QuestionCategory[] = [
        {
            category: "Domain & Properties",
            items: [
                {
                    id: 'f_15',
                    text: "15. The domain of ln(x) is:",
                    options: ["A) (-∞, ∞)", "B) (0, ∞)", "C) (1, ∞)"],
                    correctAnswer: "B",
                    solutionSteps: ["Logarithm is only defined for positive numbers."]
                },
                {
                    id: 'f_42',
                    text: "42. The function 1/x is undefined for:",
                    options: ["A) x = 1", "B) x < 0", "C) x = 0"],
                    correctAnswer: "C",
                    solutionSteps: ["Division by zero is undefined."]
                },
                {
                    id: 'f_46',
                    text: "46. The function e^x is:",
                    options: ["A) A parabola", "B) Decreasing", "C) Increasing on its entire domain"],
                    correctAnswer: "C",
                    solutionSteps: ["Exponential functions with base > 1 are strictly increasing."]
                }
            ]
        },
        {
            category: "Limits & Asymptotes",
            items: [
                {
                    id: 'f_12',
                    text: "12. A vertical asymptote means:",
                    options: ["A) The limit equals 0", "B) The limit exists", "C) The limit tends to ∞ or -∞"],
                    correctAnswer: "C",
                    solutionSteps: ["Function grows unbounded near the asymptote."]
                },
                {
                    id: 'f_34',
                    text: "34. A function is continuous at a point when:",
                    options: ["A) It has no asymptotes", "B) It is differentiable", "C) The limit equals the function value"],
                    correctAnswer: "C",
                    solutionSteps: ["Definition of continuity: lim(x->c) f(x) = f(c)."]
                },
                {
                    id: 'f_39',
                    text: "39. A horizontal asymptote exists when:",
                    options: ["A) The derivative changes sign", "B) There is a square in denominator", "C) The limit at ±∞ is finite"],
                    correctAnswer: "C",
                    solutionSteps: ["If lim(x->inf) f(x) = L, then y=L is a horizontal asymptote."]
                }
            ]
        }
    ];

    const derivativeQuestions: QuestionCategory[] = [
        {
            category: "Basic Rules",
            items: [
                {
                    id: 'd_1',
                    text: "1. The derivative of a constant function equals:",
                    options: ["A) A positive constant", "B) The same constant", "C) 0"],
                    correctAnswer: "C",
                    solutionSteps: ["Rate of change of a constant is zero."]
                },
                {
                    id: 'd_2',
                    text: "2. The derivative of x^a (for a ∈ R) equals:",
                    options: ["A) x^{a+1}", "B) ax^{a+1}", "C) ax^{a-1}"],
                    correctAnswer: "C",
                    solutionSteps: ["Power Rule: nx^{n-1}."]
                },
                {
                    id: 'd_8',
                    text: "8. The derivative of a multiplication is:",
                    options: ["A) f'g + fg'", "B) f'g' - fg'", "C) f'g + fg'"],
                    correctAnswer: "A",
                    solutionSteps: ["Product Rule: (uv)' = u'v + uv'."]
                },
                {
                    id: 'd_10',
                    text: "10. The derivative of the composition f(g(x)) is:",
                    options: ["A) f(x)g(x)", "B) f'g + fg'", "C) f'(g(x))g'(x)"],
                    correctAnswer: "C",
                    solutionSteps: ["Chain Rule: Outer derivative times inner derivative."]
                }
            ]
        },
        {
            category: "Analysis & Geometry",
            items: [
                {
                    id: 'd_5',
                    text: "5. A necessary condition for a local extremum is:",
                    options: ["A) f(x)=0", "B) The function is increasing", "C) f'(x)=0"],
                    correctAnswer: "C",
                    solutionSteps: ["Fermat's Theorem: If f has a local extremum and is differentiable, f'(x)=0."]
                },
                {
                    id: 'd_6',
                    text: "6. If f'(x) > 0, the function is:",
                    options: ["A) Constant", "B) Decreasing", "C) Increasing"],
                    correctAnswer: "C",
                    solutionSteps: ["Positive derivative implies growth."]
                },
                {
                    id: 'd_33',
                    text: "33. The derivative describes:",
                    options: ["A) The area under the graph", "B) The limit of a function", "C) The rate of change"],
                    correctAnswer: "C",
                    solutionSteps: ["Instantaneous rate of change or slope."]
                }
            ]
        }
    ];

    const integralQuestions: QuestionCategory[] = [
        {
            category: "Indefinite Integrals",
            items: [
                {
                    id: 'i_1',
                    text: "1. An antiderivative of the function f(x) is a function:",
                    options: ["A) continuous", "B) whose derivative equals f(x)", "C) increasing"],
                    correctAnswer: "B",
                    solutionSteps: ["F'(x) = f(x)."]
                },
                {
                    id: 'i_3',
                    text: "3. The integral ∫ x^a dx for a≠−1 equals:",
                    options: ["A) ln|x|+C", "B) x^{a+1}+C", "C) 1/(a+1) * x^{a+1} + C"],
                    correctAnswer: "C",
                    solutionSteps: ["Power Rule for integration."]
                },
                {
                    id: 'i_4',
                    text: "4. The integral ∫ 1/x dx equals:",
                    options: ["A) 1/x + C", "B) ln|x| + C", "C) x + C"],
                    correctAnswer: "B",
                    solutionSteps: ["Special case of power rule where n=-1."]
                },
                {
                    id: 'i_20',
                    text: "20. Integration by parts is based on the formula:",
                    options: ["A) (uv)'=u'v'", "B) d(uv)=udv+vdu", "C) (u+v)'=u'v'"],
                    correctAnswer: "B",
                    solutionSteps: ["Derived from the product rule of differentiation."]
                }
            ]
        },
        {
            category: "Definite Integrals",
            items: [
                {
                    id: 'i_35',
                    text: "35. A definite integral is a number:",
                    options: ["A) always positive", "B) dependent on constant C", "C) dependent on limits of integration"],
                    correctAnswer: "C",
                    solutionSteps: ["It evaluates to a value determined by the function and the interval [a, b]."]
                },
                {
                    id: 'i_36',
                    text: "36. If F'(x)=f(x), then ∫_a^b f(x)dx equals:",
                    options: ["A) F(a)-F(b)", "B) F(b)-F(a)", "C) C"],
                    correctAnswer: "B",
                    solutionSteps: ["Newton-Leibniz formula (Fundamental Theorem of Calculus)."]
                },
                {
                    id: 'i_37',
                    text: "37. The area under the graph of a positive function:",
                    options: ["A) is equal to the definite integral", "B) is indefinite", "C) has no interpretation"],
                    correctAnswer: "A",
                    solutionSteps: ["Geometric interpretation of the definite integral."]
                }
            ]
        }
    ];

    const diffEqQuestions: QuestionCategory[] = [
        {
            category: "Differential Equations",
            items: [
                {
                    id: 'de_62',
                    text: "62. A first-order differential equation is:",
                    options: ["A) an algebraic equation", "B) an equation containing a first derivative", "C) a quadratic equation"],
                    correctAnswer: "B",
                    solutionSteps: ["Order is determined by the highest derivative present."]
                },
                {
                    id: 'de_65',
                    text: "65. The equation y'=2y is:",
                    options: ["A) linear/separable", "B) separable", "C) second-order"],
                    correctAnswer: "B",
                    solutionSteps: ["Can be written as dy/y = 2dx."]
                },
                {
                    id: 'de_66',
                    text: "66. The method of separation of variables consists of:",
                    options: ["A) changing variable", "B) separating y and x onto opposite sides", "C) integration by parts"],
                    correctAnswer: "B",
                    solutionSteps: ["Group all y terms with dy and x terms with dx."]
                },
                {
                    id: 'de_69',
                    text: "69. The Malthus model describes:",
                    options: ["A) limited growth", "B) exponential population growth", "C) decline"],
                    correctAnswer: "B",
                    solutionSteps: ["Unconstrained growth proportional to population size (y' = ky)."]
                },
                {
                    id: 'de_71',
                    text: "71. The Verhulst model accounts for:",
                    options: ["A) reproduction only", "B) limited environmental resources", "C) mortality only"],
                    correctAnswer: "B",
                    solutionSteps: ["Logistic growth model that introduces a carrying capacity K."]
                }
            ]
        }
    ];

    // --- LOGIC ---

    const getQuestions = () => {
        switch (module) {
            case ModuleType.MATRIX: return matrixQuestions;
            case ModuleType.SEQUENCES: return sequenceQuestions;
            case ModuleType.FUNCTIONS: return functionQuestions;
            case ModuleType.LIMITS: return functionQuestions.filter(q => q.category.includes("Limits"));
            case ModuleType.DERIVATIVES: return derivativeQuestions;
            case ModuleType.INTEGRALS: return integralQuestions;
            case ModuleType.DIFF_EQ: return diffEqQuestions;
            default: return [...matrixQuestions, ...sequenceQuestions];
        }
    };

    const currentQuestions = getQuestions();
    const moduleName = module ? module.charAt(0).toUpperCase() + module.slice(1).toLowerCase().replace('_', ' ') : 'General';

    return (
        <div className="space-y-12 pb-20">
            <header>
                <h2 className="text-4xl font-bold text-white mb-4">{moduleName} Homework</h2>
                <p className="text-slate-400">
                    Practice problems from the lecture material. Click to reveal step-by-step solutions.
                </p>
            </header>

            {currentQuestions.length === 0 ? (
                <div className="p-8 text-center border border-slate-800 rounded-xl bg-slate-900/50">
                    <p className="text-slate-500">No exercises available for this specific module view.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {currentQuestions.map((section, idx) => (
                        <div key={idx} className="space-y-6">
                            <h3 className="text-xl font-semibold text-cyan-400 border-b border-slate-800 pb-2">
                                {section.category}
                            </h3>
                            <div className="space-y-4">
                                {section.items.map((item) => {
                                    const isExpanded = expandedId === item.id;
                                    return (
                                        <motion.div 
                                            key={item.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            className={`group relative rounded-xl border transition-all duration-300 overflow-hidden
                                                ${isExpanded 
                                                    ? 'bg-slate-800 border-cyan-500/50 shadow-lg shadow-cyan-900/20' 
                                                    : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/60 hover:border-slate-600'
                                                }`}
                                        >
                                            <div 
                                                className="p-5 cursor-pointer flex justify-between items-start gap-4"
                                                onClick={() => toggleSolution(item.id)}
                                            >
                                                <div className="flex-1">
                                                    <div className="text-slate-200 text-sm leading-relaxed">
                                                        <p className="mb-3 font-medium text-base">{item.text}</p>
                                                        
                                                        {item.options && (
                                                            <div className="grid gap-2 pl-2">
                                                                {item.options.map((opt, i) => (
                                                                    <div key={i} className={`text-slate-400 text-xs ${isExpanded && opt.startsWith(item.correctAnswer || '') ? 'text-emerald-400 font-bold' : ''}`}>
                                                                        {opt}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div className="text-slate-500 hover:text-cyan-400 transition-colors">
                                                    {isExpanded ? <ChevronUp /> : <ChevronDown />}
                                                </div>
                                            </div>

                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                                        className="border-t border-slate-700 bg-slate-900/50"
                                                    >
                                                        <div className="p-5 space-y-4">
                                                            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest">
                                                                <Lightbulb size={14} /> Correct Answer: {item.correctAnswer}
                                                            </div>
                                                            <div className="space-y-3 pl-4 border-l-2 border-slate-600/50">
                                                                {item.solutionSteps.map((step, i) => (
                                                                    <div key={i} className="text-sm text-slate-300">
                                                                        <MathRenderer expression={step} inline />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
