import { useState } from 'react';
import { Calculator, Divide, X, Minus, Plus, Equal, Delete, Award } from 'lucide-react';
import Badges from '../Badges';
import FormulaCalculator from '../FormulaCalculator';

interface LabTriviaViewProps {
  progress: {
    materia: boolean;
    energia: boolean;
    calor: boolean;
  };
}

export default function LabTriviaView({ progress }: LabTriviaViewProps) {
  const [activeTab, setActiveTab] = useState<'calc' | 'trivia' | 'badges'>('calc');
  const [triviaStep, setTriviaStep] = useState(0);
  const [score, setScore] = useState(0);

  const triviaQuestions = [
    { q: "¿Cuál es una propiedad intensiva?", opts: ["Masa", "Volumen", "Densidad"], ans: 2 },
    { q: "Si la velocidad se duplica, la Energía Cinética...", opts: ["Se duplica", "Se cuadruplica", "No cambia"], ans: 1 },
    { q: "El calor viaja en el vacío por...", opts: ["Conducción", "Radiación", "Convección"], ans: 1 }
  ];

  const handleTriviaAns = (idx: number) => {
    if (idx === triviaQuestions[triviaStep].ans) setScore(s => s + 1);
    if (triviaStep < triviaQuestions.length - 1) {
      setTriviaStep(s => s + 1);
    } else {
      setTriviaStep(99); // Done
    }
  };

  return (
    <div className="flex flex-col w-full px-space-md pt-space-md pb-space-2xl space-y-space-md animate-in fade-in zoom-in-95 duration-200">
      
      {/* Top Segmented */}
      <div className="bg-surface-container-highest p-1 rounded-xl flex gap-1">
        <button onClick={()=>setActiveTab('calc')} className={`flex-1 py-2 rounded-lg font-space text-[12px] font-bold transition-colors flex justify-center items-center gap-1 ${activeTab==='calc'?'bg-primary text-on-primary shadow-sm':'text-on-surface-variant hover:text-on-surface'}`}>
          <Calculator className="w-3.5 h-3.5"/> Fórmulas
        </button>
        <button onClick={()=>setActiveTab('trivia')} className={`flex-1 py-2 rounded-lg font-space text-[12px] font-bold transition-colors ${activeTab==='trivia'?'bg-primary text-on-primary shadow-sm':'text-on-surface-variant hover:text-on-surface'}`}>Trivia Lab</button>
        <button onClick={()=>setActiveTab('badges')} className={`flex-1 py-2 rounded-lg font-space text-[12px] font-bold transition-colors flex items-center justify-center gap-1 ${activeTab==='badges'?'bg-tertiary text-on-primary shadow-sm':'text-on-surface-variant hover:text-on-surface'}`}>
          <Award className="w-3.5 h-3.5" /> Insignias
        </button>
      </div>

      {activeTab === 'calc' && (
        <FormulaCalculator />
      )}

      {activeTab === 'trivia' && (
        <section className="bg-surface-container p-space-md rounded-xl shadow-md flex flex-col gap-4">
          {triviaStep < 99 ? (
            <>
              <div className="flex justify-between items-center text-[12px] font-space text-secondary uppercase font-bold">
                <span>Pregunta {triviaStep + 1} de {triviaQuestions.length}</span>
                <span>Puntos: {score}</span>
              </div>
              <h3 className="font-space text-[20px] font-bold">{triviaQuestions[triviaStep].q}</h3>
              <div className="flex flex-col gap-2">
                {triviaQuestions[triviaStep].opts.map((opt, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleTriviaAns(idx)}
                    className="p-4 rounded-xl bg-surface-container-high hover:bg-surface-bright text-left font-bold transition-colors"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 flex flex-col items-center gap-2">
               <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-4xl mb-2">🏆</div>
               <h3 className="font-space text-2xl font-bold">¡Misión Completada!</h3>
               <p className="text-secondary font-bold text-lg">Acertaste {score} de {triviaQuestions.length}</p>
               <button onClick={()=>{setTriviaStep(0); setScore(0);}} className="mt-4 px-6 py-2 bg-primary text-on-primary rounded-xl font-bold transition-colors">Reiniciar Desafío</button>
            </div>
          )}
        </section>
      )}

      {activeTab === 'badges' && (
        <Badges progress={progress} />
      )}
    </div>
  );
}
