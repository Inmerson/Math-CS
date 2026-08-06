import React, { lazy, Suspense, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ViewMode, ModuleType } from './types';
import { DashboardView } from './views/DashboardView';
import { AnimatedBackground } from './components/AnimatedBackground';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { LoaderCircle, Lock, Menu } from 'lucide-react';
import { usePersistedState } from './utils/usePersistedState';
import {
  getDefaultViewForModule,
  LearningDestinationRef,
} from './data/learningCatalog';

const BasicsView = lazy(() => import('./views/BasicsView').then(({ BasicsView }) => ({ default: BasicsView })));
const OperationsView = lazy(() => import('./views/OperationsView').then(({ OperationsView }) => ({ default: OperationsView })));
const DeterminantView = lazy(() => import('./views/DeterminantView').then(({ DeterminantView }) => ({ default: DeterminantView })));
const InverseView = lazy(() => import('./views/InverseView').then(({ InverseView }) => ({ default: InverseView })));
const HomeworkView = lazy(() => import('./views/ExercisesView').then(({ HomeworkView }) => ({ default: HomeworkView })));
const SequencesView = lazy(() => import('./views/SequencesView').then(({ SequencesView }) => ({ default: SequencesView })));
const Sequences3DView = lazy(() => import('./views/Sequences3DView').then(({ Sequences3DView }) => ({ default: Sequences3DView })));
const FunctionsView = lazy(() => import('./views/FunctionsView').then(({ FunctionsView }) => ({ default: FunctionsView })));
const Surface3DView = lazy(() => import('./views/Surface3DView').then(({ Surface3DView }) => ({ default: Surface3DView })));
const FinalExamView = lazy(() => import('./views/FinalExamView').then(({ FinalExamView }) => ({ default: FinalExamView })));
const ExamAnalysisView = lazy(() => import('./views/ExamAnalysisView').then(({ ExamAnalysisView }) => ({ default: ExamAnalysisView })));
const DerivativesRulesView = lazy(() => import('./views/DerivativesRulesView').then(({ DerivativesRulesView }) => ({ default: DerivativesRulesView })));
const FunctionAnalysisView = lazy(() => import('./views/FunctionAnalysisView').then(({ FunctionAnalysisView }) => ({ default: FunctionAnalysisView })));
const SystemsView = lazy(() => import('./views/SystemsView').then(({ SystemsView }) => ({ default: SystemsView })));
const ContinuityView = lazy(() => import('./views/ContinuityView').then(({ ContinuityView }) => ({ default: ContinuityView })));
const GaussianView = lazy(() => import('./views/GaussianView').then(({ GaussianView }) => ({ default: GaussianView })));
const EigenView = lazy(() => import('./views/EigenView').then(({ EigenView }) => ({ default: EigenView })));
const CobwebView = lazy(() => import('./views/CobwebView').then(({ CobwebView }) => ({ default: CobwebView })));
const SeriesView = lazy(() => import('./views/SeriesView').then(({ SeriesView }) => ({ default: SeriesView })));
const TransformationsView = lazy(() => import('./views/TransformationsView').then(({ TransformationsView }) => ({ default: TransformationsView })));
const NewtonView = lazy(() => import('./views/NewtonView').then(({ NewtonView }) => ({ default: NewtonView })));
const TaylorSeriesView = lazy(() => import('./views/TaylorSeriesView').then(({ TaylorSeriesView }) => ({ default: TaylorSeriesView })));
const IntegralBasicsView = lazy(() => import('./views/IntegralBasicsView').then(({ IntegralBasicsView }) => ({ default: IntegralBasicsView })));
const IntegralRulesView = lazy(() => import('./views/IntegralRulesView').then(({ IntegralRulesView }) => ({ default: IntegralRulesView })));
const AreaUnderCurveView = lazy(() => import('./views/AreaUnderCurveView').then(({ AreaUnderCurveView }) => ({ default: AreaUnderCurveView })));
const Integrals3DView = lazy(() => import('./views/Integrals3DView').then(({ Integrals3DView }) => ({ default: Integrals3DView })));
const DiffEqBasicsView = lazy(() => import('./views/DiffEqBasicsView').then(({ DiffEqBasicsView }) => ({ default: DiffEqBasicsView })));
const PopulationModelsView = lazy(() => import('./views/PopulationModelsView').then(({ PopulationModelsView }) => ({ default: PopulationModelsView })));
const RadioactiveDecayView = lazy(() => import('./views/RadioactiveDecayView').then(({ RadioactiveDecayView }) => ({ default: RadioactiveDecayView })));
const DiffEq3DView = lazy(() => import('./views/DiffEq3DView').then(({ DiffEq3DView }) => ({ default: DiffEq3DView })));
const CheatSheetView = lazy(() => import('./views/CheatSheetView').then(({ CheatSheetView }) => ({ default: CheatSheetView })));
const LinearTransformation3DView = lazy(() => import('./views/LinearTransformation3DView').then(({ LinearTransformation3DView }) => ({ default: LinearTransformation3DView })));
const VectorOperations3DView = lazy(() => import('./views/VectorOperations3DView').then(({ VectorOperations3DView }) => ({ default: VectorOperations3DView })));
const AIChatView = lazy(() => import('./views/AIChatView').then(({ AIChatView }) => ({ default: AIChatView })));

const EmptyExamView: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
    <div className="p-6 bg-slate-900/50 rounded-full border border-slate-800 shadow-xl backdrop-blur-sm">
      <Lock size={48} className="text-slate-600" />
    </div>
    <div className="space-y-2">
      <h2 className="text-3xl font-bold text-white tracking-tight">{title}</h2>
      <div className="px-3 py-1 rounded-full bg-slate-800/50 text-xs font-mono text-slate-400 inline-block border border-slate-700">
        STATUS: LOCKED
      </div>
    </div>
    <p className="text-slate-400 max-w-md text-sm leading-relaxed">
      This examination module is currently unavailable. Please proceed to the <strong>Final Exam</strong> for comprehensive assessment.
    </p>
  </div>
);

const ViewLoadingFallback: React.FC = () => (
  <div
    className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center"
    role="status"
    aria-live="polite"
  >
    <div className="p-4 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan">
      <LoaderCircle size={30} className="animate-spin" />
    </div>
    <div>
      <p className="font-semibold text-white">Preparing the learning lab</p>
      <p className="text-xs text-slate-500 mt-1">Loading only the resources required for this topic.</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentModule, setCurrentModule] = usePersistedState<ModuleType>('app_module', ModuleType.HOME);
  const [view, setView] = usePersistedState<ViewMode>('app_view', ViewMode.BASICS);
  const [lastDestination, setLastDestination] = usePersistedState<LearningDestinationRef | null>(
    'last_learning_destination',
    null,
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const navigateTo = (destination: LearningDestinationRef) => {
    setCurrentModule(destination.module);
    setView(destination.view);
    setLastDestination(destination);
    setIsMobileMenuOpen(false);
  };

  const handleModuleSelect = (module: ModuleType) => {
    navigateTo({
      module,
      view: getDefaultViewForModule(module),
    });
  };

  const handleViewSelect = (nextView: ViewMode) => {
    setView(nextView);
    if (currentModule !== ModuleType.HOME) {
      setLastDestination({
        module: currentModule,
        view: nextView,
      });
    }
  };

  const handleGoHome = () => {
    setCurrentModule(ModuleType.HOME);
    setIsMobileMenuOpen(false);
  };

  const renderView = () => {
    switch (view) {
      case ViewMode.BASICS: return <BasicsView />;
      case ViewMode.OPERATIONS: return <OperationsView />;
      case ViewMode.DETERMINANT: return <DeterminantView />;
      case ViewMode.INVERSE: return <InverseView />;
      case ViewMode.SYSTEMS: return <SystemsView />;
      case ViewMode.GAUSSIAN: return <GaussianView />;
      case ViewMode.EIGENVALUES: return <EigenView />;
      case ViewMode.VECTOR_3D: return <LinearTransformation3DView />;
      case ViewMode.VECTOR_OPS_3D: return <VectorOperations3DView />;
      case ViewMode.SEQUENCES: return <SequencesView />;
      case ViewMode.SERIES: return <SeriesView />;
      case ViewMode.COBWEB: return <CobwebView />;
      case ViewMode.SEQUENCES_3D: return <Sequences3DView />;
      case ViewMode.FUNCTIONS: return <FunctionsView />;
      case ViewMode.TRANSFORMATIONS: return <TransformationsView />;
      case ViewMode.NEWTON: return <NewtonView />;
      case ViewMode.FUNCTIONS_3D: return <Surface3DView mode="function" />;
      case ViewMode.LIMITS: return <FunctionsView />;
      case ViewMode.CONTINUITY: return <ContinuityView />;
      case ViewMode.LIMITS_3D: return <Surface3DView mode="limit" />;
      case ViewMode.DERIVATIVE_RULES: return <DerivativesRulesView />;
      case ViewMode.FUNCTION_ANALYSIS: return <FunctionAnalysisView />;
      case ViewMode.TAYLOR: return <TaylorSeriesView />;
      case ViewMode.DERIVATIVES_3D: return <Surface3DView mode="derivative" />;
      case ViewMode.INTEGRAL_BASICS: return <IntegralBasicsView />;
      case ViewMode.INTEGRAL_RULES: return <IntegralRulesView />;
      case ViewMode.AREA_UNDER_CURVE: return <AreaUnderCurveView />;
      case ViewMode.INTEGRALS_3D: return <Integrals3DView />;
      case ViewMode.DIFF_BASICS: return <DiffEqBasicsView />;
      case ViewMode.POPULATION_MODELS: return <PopulationModelsView />;
      case ViewMode.RADIOACTIVE_DECAY: return <RadioactiveDecayView />;
      case ViewMode.DIFF_EQ_3D: return <DiffEq3DView />;
      case ViewMode.CLASS_EXAM_1: return <EmptyExamView title="Class Exam I" />;
      case ViewMode.CLASS_EXAM_2: return <EmptyExamView title="Class Exam II" />;
      case ViewMode.CLASS_EXAM_3: return <EmptyExamView title="Class Exam III" />;
      case ViewMode.FULL_EXAM: return <FinalExamView key="FINAL" examMode="FINAL" />;
      case ViewMode.EXAM_ANALYSIS: return <ExamAnalysisView />;
      case ViewMode.HOMEWORK: return <HomeworkView key={currentModule} module={currentModule} />;
      case ViewMode.FINAL_EXAM: return <FinalExamView key={currentModule} module={currentModule} />;
      case ViewMode.CHEAT_SHEET: return <CheatSheetView key={currentModule} module={currentModule} />;
      case ViewMode.AI_CHAT: return <AIChatView />;
      default: return <BasicsView />;
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-slate-200 font-sans selection:bg-accent-cyan/30 overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10">
        {currentModule === ModuleType.HOME ? (
          <DashboardView
            onSelectModule={handleModuleSelect}
            onNavigate={navigateTo}
            lastDestination={lastDestination}
          />
        ) : (
          <div className="flex h-screen overflow-hidden">
            <Sidebar
              currentView={view}
              currentModule={currentModule}
              setView={handleViewSelect}
              goHome={handleGoHome}
              isOpen={isMobileMenuOpen}
              toggleSidebar={() => setIsMobileMenuOpen((open) => !open)}
            />

            <main className="flex-1 md:ml-20 lg:ml-0 overflow-y-auto h-full relative">
              <div className="md:hidden sticky top-0 z-30 flex items-center justify-between p-4 bg-background/80 backdrop-blur-md border-b border-white/5">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                  aria-label="Open learning navigation"
                >
                  <Menu size={24} />
                </button>
                <span className="text-xs font-bold text-accent-cyan tracking-widest uppercase glow-text">
                  {currentModule.replace('_', ' ')}
                </span>
                <div className="w-10" aria-hidden="true" />
              </div>

              <div className="max-w-[1600px] mx-auto p-4 md:p-8 pb-32">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={view}
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20, filter: 'blur(10px)' }}
                    transition={{ duration: shouldReduceMotion ? 0.01 : 0.4, ease: 'easeOut' }}
                  >
                    <Suspense fallback={<ViewLoadingFallback />}>
                      {renderView()}
                    </Suspense>
                  </motion.div>
                </AnimatePresence>
              </div>
            </main>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
