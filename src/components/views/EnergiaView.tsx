import { useState, useEffect } from 'react';
import { Zap, Play, Pause, RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';
import QuickReview from '../QuickReview';
import QuickTips from '../QuickTips';
import VoiceNotes from '../VoiceNotes';

interface Props {
  isCompleted?: boolean;
  onToggle?: () => void;
}

export default function EnergiaView({ isCompleted = false, onToggle }: Props) {
  const [isRunning, setIsRunning] = useState(false);
  const [mass, setMass] = useState(50);
  const [height, setHeight] = useState(6);
  const [isFriction, setIsFriction] = useState(false);
  const [time, setTime] = useState(0);

  // Simplified physics state
  const totalE = mass * 9.8 * height;
  const dampedAmplitude = isFriction ? Math.exp(-0.42 * time) : 1;
  const currentHeightRaw = Math.pow(Math.sin(time * 2), 2) * dampedAmplitude * (height / 6);
  const currentHeight = height === 0 ? 0 : currentHeightRaw * 6;
  
  const ep = Math.max(0, mass * 9.8 * currentHeight);
  const em = totalE * dampedAmplitude;
  const ec = Math.max(0, em - ep);
  const heat = totalE - em;
  const speed = (mass > 0 && ec > 0) ? Math.sqrt((2 * ec) / mass) : 0;

  useEffect(() => {
    let animationFrameId: number;
    if (isRunning && dampedAmplitude > 0.01) {
      const loop = () => {
        setTime((t) => t + 0.02);
        animationFrameId = requestAnimationFrame(loop);
      };
      animationFrameId = requestAnimationFrame(loop);
    } else if (dampedAmplitude <= 0.01 && isRunning) {
      setIsRunning(false); // Auto stop when friction kills it
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning, dampedAmplitude]);

  const reset = () => {
    setTime(0);
    setIsRunning(false);
  };

  const epPercent = totalE > 0 ? (ep / totalE) * 100 : 0;
  const ecPercent = totalE > 0 ? (ec / totalE) * 100 : 0;
  const heatPercent = totalE > 0 ? (heat / totalE) * 100 : 0;

  return (
    <div className="flex flex-col w-full px-space-md pt-space-md pb-space-2xl space-y-space-md">
      
      {/* Header */}
      <section className="relative overflow-hidden rounded-xl bg-surface-container-high p-space-md shadow-xl">
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-secondary/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-highest mb-2">
          <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
          <span className="font-space text-[12px] text-secondary uppercase tracking-wider font-bold">Módulo 2 • Física en Acción</span>
        </div>
        <h1 className="font-space text-headline-lg-mobile text-on-surface tracking-tight">Energía Mecánica</h1>
        <p className="text-body-md text-secondary-fixed mt-2">La energía no se crea ni se destruye: ¡solo se transforma!</p>
      </section>

      <QuickTips />

      {/* Simulator */}
      <section className="bg-surface-container-high rounded-xl p-space-md shadow-xl border border-outline-variant/30 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-space text-[16px] font-bold">Half-Pipe Quantum Skate</h3>
            <span className="font-space text-[11px] text-on-surface-variant">Física de Conservación en Tiempo Real</span>
          </div>
          <div className="flex gap-2">
            <button onClick={reset} className="p-2 bg-surface-container rounded-lg hover:bg-surface-bright"><RotateCcw className="w-4 h-4 text-on-surface-variant"/></button>
            <button onClick={() => setIsRunning(!isRunning)} className="px-3 py-1.5 bg-secondary text-on-secondary rounded-lg font-bold flex items-center gap-1">
              {isRunning ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>}
              {isRunning ? 'Pausar' : 'Simular'}
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-surface-container-low rounded-xl p-3 space-y-2 border border-outline-variant/20">
          <div className="flex justify-between items-center text-[12px] font-space text-on-surface-variant">
            <span>Fricción:</span>
            <div className="flex gap-2">
              <button onClick={()=>{setIsFriction(false); reset();}} className={`px-2 py-1 rounded ${!isFriction?'bg-primary text-on-primary':'bg-surface-container'}`}>Ideal (0%)</button>
              <button onClick={()=>{setIsFriction(true); reset();}} className={`px-2 py-1 rounded ${isFriction?'bg-error text-on-error':'bg-surface-container'}`}>Real</button>
            </div>
          </div>
          <div className="flex justify-between items-center text-[12px] font-space text-on-surface-variant">
            <span>Masa:</span>
            <div className="flex gap-2">
              <button onClick={()=>{setMass(35); reset();}} className={`px-2 py-1 rounded ${mass===35?'bg-secondary text-on-secondary':'bg-surface-container'}`}>35kg</button>
              <button onClick={()=>{setMass(50); reset();}} className={`px-2 py-1 rounded ${mass===50?'bg-secondary text-on-secondary':'bg-surface-container'}`}>50kg</button>
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="relative h-48 bg-surface-container-lowest rounded-xl border border-outline-variant/30 flex items-end justify-center pb-8 overflow-hidden">
           <div className="absolute top-2 left-2 flex gap-2">
             <div className="bg-surface-container/80 px-2 py-1 rounded text-[11px] font-space text-secondary font-bold">v = {speed.toFixed(1)} m/s</div>
             <div className="bg-surface-container/80 px-2 py-1 rounded text-[11px] font-space text-tertiary font-bold">h = {currentHeight.toFixed(1)} m</div>
           </div>
           
           {/* Abstract Ramp */}
           <div className="absolute bottom-0 w-[90%] h-32 border-b-4 border-l-4 border-r-4 border-secondary rounded-b-[100px] shadow-[0_0_15px_rgba(76,215,246,0.3)]"></div>
           
           {/* Skater */}
           <div 
              className="absolute w-6 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(208,188,255,0.8)]"
              style={{
                bottom: `${(currentHeight / 6) * 120 + 30}px`,
                transform: `translateX(${Math.sin(time * 2) * 120 * Math.sqrt(dampedAmplitude)}px)`
              }}
           />
        </div>

        {/* Energy Bars */}
        <div className="bg-surface-container rounded-xl p-3 space-y-2 border border-outline-variant/20">
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-space text-tertiary"><span>Ep (Potencial)</span><span>{Math.round(ep)} J</span></div>
            <div className="h-2 w-full bg-surface-container-lowest rounded-full overflow-hidden"><div className="h-full bg-tertiary transition-all" style={{width: `${epPercent}%`}}></div></div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-space text-secondary"><span>Ec (Cinética)</span><span>{Math.round(ec)} J</span></div>
            <div className="h-2 w-full bg-surface-container-lowest rounded-full overflow-hidden"><div className="h-full bg-secondary transition-all" style={{width: `${ecPercent}%`}}></div></div>
          </div>
          {isFriction && (
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-space text-error"><span>Q (Calor - Fricción)</span><span>{Math.round(heat)} J</span></div>
              <div className="h-2 w-full bg-surface-container-lowest rounded-full overflow-hidden"><div className="h-full bg-error transition-all" style={{width: `${heatPercent}%`}}></div></div>
            </div>
          )}
          <div className="mt-2 pt-2 border-t border-outline-variant/20 flex justify-between text-[12px] font-space text-primary font-bold">
            <span>Em Total</span>
            <span>{Math.round(totalE)} J</span>
          </div>
        </div>

        <div className="p-3 bg-surface-container-low rounded-xl text-[12px] border border-outline-variant/30 text-on-surface-variant flex gap-2">
           <AlertCircle className="w-5 h-5 text-secondary flex-shrink-0"/>
           <p><strong>Principio de Conservación:</strong> La energía total (Em + Q) siempre es constante = {totalE} J. ¡Nunca desaparece, se transforma!</p>
        </div>
      </section>

      <QuickReview moduleName="Energía Mecánica, Cinética y Potencial" />

      <VoiceNotes moduleName="Energía Mecánica, Cinética y Potencial" />

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
