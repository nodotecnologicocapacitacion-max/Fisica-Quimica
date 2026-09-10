import { useState, useEffect } from 'react';
import { Scale, Fingerprint, Info, CheckCircle2, XCircle } from 'lucide-react';
import QuickReview from '../QuickReview';
import QuickTips from '../QuickTips';
import VoiceNotes from '../VoiceNotes';

interface Props {
  isCompleted?: boolean;
  onToggle?: () => void;
}

export default function MateriaView({ isCompleted = false, onToggle }: Props) {
  const [pizzaSlices, setPizzaSlices] = useState<1 | 8>(1);
  const [activeTab, setActiveTab] = useState<'extensivas' | 'intensivas'>('extensivas');
  
  // Rule of 3 state
  const [convType, setConvType] = useState(1);
  const [convInput, setConvInput] = useState('2.5');

  // Particle Sim State
  const [particleState, setParticleState] = useState<'solido' | 'liquido' | 'gaseoso'>('solido');

  // Mini quiz state
  const [quizAnswered, setQuizAnswered] = useState<string | null>(null);

  // Conversion logic
  const getConvResult = () => {
    const val = parseFloat(convInput) || 0;
    if (convType === 1) return {
      eq: 'Si 1 km = 1.000 m',
      formula: `x = (${val} km · 1.000 m) / 1 km`,
      res: `= ${(val * 1000).toLocaleString('es-AR')} m`
    };
    if (convType === 2) return {
      eq: 'Si 1.000 g = 1 kg',
      formula: `x = (${val} g · 1 kg) / 1.000 g`,
      res: `= ${(val / 1000).toLocaleString('es-AR')} kg`
    };
    return {
      eq: 'Si 60 s = 1 min',
      formula: `x = (${val} s · 1 min) / 60 s`,
      res: `= ${(val / 60).toFixed(2).toLocaleString()} min`
    };
  };

  const convRes = getConvResult();

  return (
    <div className="flex flex-col w-full px-space-md pt-space-md pb-space-2xl space-y-space-xl">
      
      {/* Hero Capsule */}
      <section className="relative rounded-2xl bg-surface-container-high p-space-lg shadow-xl overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-secondary/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col gap-space-xs">
          <div className="flex items-center justify-between gap-space-xs">
            <div className="inline-flex items-center gap-space-xxs bg-primary-container/20 px-space-xs py-1 rounded-full text-primary">
              <span className="font-space text-[12px] font-bold tracking-wider uppercase">Módulo 1 • Cuaderno N°3</span>
            </div>
            <span className="font-space text-[12px] text-on-surface-variant bg-surface-container-highest px-space-xs py-0.5 rounded">1° Año Sec.</span>
          </div>
          <h1 className="font-space text-headline-lg-mobile text-on-surface font-bold mt-1">
            Materia y sus Propiedades
          </h1>
          <p className="text-body-md text-secondary leading-relaxed">
            ¿Alguna vez te preguntaste si todo lo que te rodea está hecho exactamente de lo mismo?
          </p>
          <p className="text-body-sm text-on-surface-variant">
            Desde la pantalla de tu celular hasta el aire que respirás: todo es <strong className="text-on-surface">materia</strong>, ocupa espacio y tiene masa.
          </p>
        </div>
      </section>

      <QuickTips />

      {/* Extensivas vs Intensivas */}
      <section className="flex flex-col gap-space-md">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-space-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
            <span className="font-space text-[12px] font-bold text-secondary uppercase tracking-wider">Laboratorio Comparativo</span>
          </div>
          <h2 className="font-space text-headline-md text-on-surface font-bold">
            Extensivas vs. Intensivas
          </h2>
        </div>

        {/* Segmented Control */}
        <div className="grid grid-cols-2 p-1 bg-surface-container-lowest rounded-xl shadow-inner gap-1">
          <button 
            onClick={() => setActiveTab('extensivas')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-space text-[14px] font-bold transition-all ${activeTab === 'extensivas' ? 'bg-secondary text-on-secondary shadow-md' : 'text-on-surface-variant'}`}
          >
            <Scale className="w-4 h-4" /> Extensivas
          </button>
          <button 
            onClick={() => setActiveTab('intensivas')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-space text-[14px] font-bold transition-all ${activeTab === 'intensivas' ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant'}`}
          >
            <Fingerprint className="w-4 h-4" /> Intensivas
          </button>
        </div>

        {/* Tab Content Extensivas */}
        {activeTab === 'extensivas' && (
          <div className="rounded-xl bg-surface-container p-space-md shadow-md flex flex-col gap-space-sm animate-in fade-in zoom-in-95 duration-200">
             <div className="flex items-start gap-space-sm">
                <div className="p-2 rounded-lg bg-secondary/15 text-secondary flex-shrink-0">
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-space text-[18px] font-bold text-on-surface">Dependen de la Cantidad</h3>
                  <p className="text-[14px] text-on-surface-variant mt-0.5">Si agregás o quitás materia, estas magnitudes se modifican.</p>
                </div>
             </div>
             
             {/* Pizza interactive */}
             <div className="bg-surface-container-lowest p-space-md rounded-xl mt-space-xs flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-space text-[14px] text-secondary font-bold">El Experimento de la Pizza</span>
                  <span className="font-space text-[12px] text-tertiary font-bold bg-tertiary-container/20 px-2 py-0.5 rounded">{pizzaSlices === 1 ? '1 Porción' : 'Pizza Entera'}</span>
                </div>
                
                <div className="flex items-center justify-center gap-8 py-4">
                  <button onClick={() => setPizzaSlices(1)} className={`flex flex-col items-center transition-all ${pizzaSlices === 1 ? 'scale-110 opacity-100' : 'opacity-50'}`}>
                    <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-3xl">🍕</div>
                    <span className="font-space text-[12px] text-on-surface mt-2 font-bold">1 Porción</span>
                  </button>
                  
                  <button onClick={() => setPizzaSlices(8)} className={`flex flex-col items-center transition-all ${pizzaSlices === 8 ? 'scale-110 opacity-100' : 'opacity-50'}`}>
                    <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-3xl">🍕🍕</div>
                    <span className="font-space text-[12px] text-on-surface mt-2 font-bold">8 Porciones</span>
                  </button>
                </div>
                
                <div className="bg-surface-container p-3 rounded-lg text-sm text-center">
                  {pizzaSlices === 1 ? (
                    <p><strong className="text-secondary">1 porción:</strong> Masa: 120g | Volumen: 150cm³</p>
                  ) : (
                    <p><strong className="text-secondary">Pizza entera:</strong> Masa: 960g | Volumen: 1200cm³</p>
                  )}
                </div>
             </div>
          </div>
        )}

        {/* Tab Content Intensivas */}
        {activeTab === 'intensivas' && (
          <div className="rounded-xl bg-surface-container p-space-md shadow-md flex flex-col gap-space-sm animate-in fade-in zoom-in-95 duration-200">
             <div className="flex items-start gap-space-sm">
                <div className="p-2 rounded-lg bg-primary/15 text-primary flex-shrink-0">
                  <Fingerprint className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-space text-[18px] font-bold text-on-surface">NO Dependen de la Cantidad</h3>
                  <p className="text-[14px] text-on-surface-variant mt-0.5">Son el "DNI" de la sustancia. Punto de Fusión, Densidad, etc.</p>
                </div>
             </div>
             <div className="p-3 bg-surface-container-lowest rounded-xl flex items-center gap-3 mt-2">
                <div className="text-2xl">🧊</div>
                <div className="flex-1">
                  <span className="font-space text-[14px] text-primary font-bold">¿Por qué flota el hielo?</span>
                  <p className="text-[13px] text-on-surface-variant">El hielo tiene menor densidad que el agua líquida. ¡Por eso no se hunde jamás, sin importar el tamaño del hielo!</p>
                </div>
             </div>
          </div>
        )}
      </section>

      {/* Particle Simulator Simplified Placeholder */}
      <section className="flex flex-col gap-space-md rounded-2xl bg-surface-container-high p-space-lg shadow-xl relative overflow-hidden">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-space-xs">
             <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse"></span>
             <span className="font-space text-[12px] font-bold text-tertiary uppercase tracking-wider">Simulador Cuántico</span>
          </div>
          <h2 className="font-space text-[20px] text-on-surface font-bold">Modelo Cinético Corpuscular</h2>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <button onClick={()=>setParticleState('solido')} className={`py-2 rounded-xl font-space text-[12px] font-bold transition-all ${particleState==='solido'?'bg-secondary text-on-secondary':'bg-surface-container text-on-surface-variant'}`}>Sólido</button>
          <button onClick={()=>setParticleState('liquido')} className={`py-2 rounded-xl font-space text-[12px] font-bold transition-all ${particleState==='liquido'?'bg-tertiary text-on-tertiary':'bg-surface-container text-on-surface-variant'}`}>Líquido</button>
          <button onClick={()=>setParticleState('gaseoso')} className={`py-2 rounded-xl font-space text-[12px] font-bold transition-all ${particleState==='gaseoso'?'bg-primary text-on-primary':'bg-surface-container text-on-surface-variant'}`}>Gaseoso</button>
        </div>

        <div className="relative w-full h-48 bg-surface-container-lowest rounded-xl overflow-hidden flex flex-col items-center justify-center p-4">
          <div className="text-center">
            {particleState === 'solido' && <div className="text-4xl animate-pulse">🧊🧊🧊<br/>🧊🧊🧊</div>}
            {particleState === 'liquido' && <div className="text-4xl animate-bounce">💧 💧 💧<br/> 💧 💧</div>}
            {particleState === 'gaseoso' && <div className="text-4xl flex gap-8 animate-ping">💨 💨</div>}
          </div>
          <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[11px] font-space font-bold opacity-70">
            <span>E. Cinética: {particleState==='solido'?'Baja':particleState==='liquido'?'Media':'Alta'}</span>
            <span>Atracción: {particleState==='solido'?'Fuerte':particleState==='liquido'?'Media':'Débil'}</span>
          </div>
        </div>
      </section>

      {/* Converter */}
      <section className="rounded-2xl bg-surface-container-high p-space-md shadow-lg flex flex-col gap-space-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-secondary/15 text-secondary"><Info className="w-5 h-5"/></div>
          <h3 className="font-space font-bold text-on-surface text-[16px]">Simulador: Regla de Tres</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-1 bg-surface-container-lowest p-1 rounded-lg">
          <button onClick={()=>setConvType(1)} className={`py-1.5 rounded font-space text-[12px] font-bold ${convType===1?'bg-secondary text-on-secondary':'text-on-surface-variant'}`}>km → m</button>
          <button onClick={()=>setConvType(2)} className={`py-1.5 rounded font-space text-[12px] font-bold ${convType===2?'bg-tertiary text-on-tertiary':'text-on-surface-variant'}`}>g → kg</button>
          <button onClick={()=>setConvType(3)} className={`py-1.5 rounded font-space text-[12px] font-bold ${convType===3?'bg-primary text-on-primary':'text-on-surface-variant'}`}>s → min</button>
        </div>

        <div className="flex gap-2 items-center mt-2">
          <input type="number" value={convInput} onChange={(e)=>setConvInput(e.target.value)} className="flex-1 bg-surface-container-lowest text-on-surface font-space text-xl px-4 py-3 rounded-xl outline-none" />
          <span className="bg-surface-container px-4 py-3 rounded-xl font-space font-bold text-secondary">{convType===1?'km':convType===2?'g':'s'}</span>
        </div>

        <div className="bg-surface-container-lowest p-3 rounded-xl mt-2 font-mono text-[13px]">
          <div className="text-on-surface-variant">{convRes.eq}</div>
          <div className="text-on-surface mt-1 p-2 bg-surface-container rounded">{convRes.formula}</div>
          <div className="text-secondary font-bold text-lg mt-2 text-right">{convRes.res}</div>
        </div>
      </section>

      {/* Trivia Mini */}
      <section className="rounded-2xl bg-surface-container-high p-space-lg shadow-xl flex flex-col gap-space-md">
        <h3 className="font-space text-headline-md font-bold">Desafío del Chocolate 🍫</h3>
        <p className="text-[14px]">Si partís una barra por la mitad, ¿cuál propiedad NO cambia?</p>
        
        <div className="flex flex-col gap-2">
          <button onClick={()=>setQuizAnswered('masa')} className={`p-4 rounded-xl text-left flex items-center justify-between font-bold ${quizAnswered==='masa'?'bg-error-container text-on-error-container':'bg-surface-container hover:bg-surface-bright text-on-surface'}`}>
            A) Masa de cada trozo
            {quizAnswered === 'masa' && <XCircle className="w-5 h-5"/>}
          </button>
          <button onClick={()=>setQuizAnswered('volumen')} className={`p-4 rounded-xl text-left flex items-center justify-between font-bold ${quizAnswered==='volumen'?'bg-error-container text-on-error-container':'bg-surface-container hover:bg-surface-bright text-on-surface'}`}>
            B) Volumen ocupado
            {quizAnswered === 'volumen' && <XCircle className="w-5 h-5"/>}
          </button>
          <button onClick={()=>setQuizAnswered('fusion')} className={`p-4 rounded-xl text-left flex items-center justify-between font-bold ${quizAnswered==='fusion'?'bg-tertiary-container text-on-tertiary-fixed':'bg-surface-container hover:bg-surface-bright text-on-surface'}`}>
            C) Punto de Fusión
            {quizAnswered === 'fusion' && <CheckCircle2 className="w-5 h-5"/>}
          </button>
        </div>

        {quizAnswered === 'fusion' && (
          <div className="p-3 bg-tertiary/10 border border-tertiary/30 rounded-xl text-tertiary text-[13px] animate-in fade-in slide-in-from-bottom-2">
            <strong>¡Correcto!</strong> El punto de fusión es intensivo.
          </div>
        )}
      </section>

      <QuickReview moduleName="Materia y sus Propiedades" />
      
      <VoiceNotes moduleName="Materia y sus Propiedades" />

      <section className="pt-4">
        <button 
          onClick={onToggle} 
          className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-space font-bold transition-all ${isCompleted ? 'bg-tertiary text-on-tertiary shadow-[0_0_15px_rgba(78,222,163,0.3)]' : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-bright'}`}
        >
          <CheckCircle2 className="w-5 h-5" />
          {isCompleted ? 'Módulo Completado' : 'Marcar como Completado'}
        </button>
      </section>

    </div>
  );
}
