import { useState } from 'react';
import { Flame, Thermometer, ArrowRight, ArrowDown, ChevronDown, CheckCircle, CheckCircle2 } from 'lucide-react';
import QuickReview from '../QuickReview';
import QuickTips from '../QuickTips';
import VoiceNotes from '../VoiceNotes';

interface Props {
  isCompleted?: boolean;
  onToggle?: () => void;
}

export default function CalorView({ isCompleted = false, onToggle }: Props) {
  const [tempC, setTempC] = useState(25);
  const [activeAcc, setActiveAcc] = useState<number | null>(null);
  
  // Nutri Calc
  const [food, setFood] = useState<'manzana' | 'pizza'>('manzana');
  const kcal = food === 'manzana' ? 52 : 285;
  const joules = kcal * 1000 * 4.184;

  const getThermoState = () => {
    if (tempC < 15) return { color: 'text-secondary', label: 'Frío / Solidificación' };
    if (tempC < 40) return { color: 'text-tertiary', label: 'Ambiente / Corporal' };
    return { color: 'text-error', label: 'Caliente / Ebullición' };
  };
  const tState = getThermoState();

  return (
    <div className="flex flex-col w-full px-space-md pt-space-md pb-space-2xl space-y-space-md animate-in fade-in zoom-in-95 duration-200">
      
      {/* Hero */}
      <section className="relative overflow-hidden rounded-xl bg-surface-container-high p-space-md shadow-xl">
        <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-secondary/15 blur-2xl pointer-events-none"></div>
        <div className="absolute -left-6 -bottom-6 w-32 h-32 rounded-full bg-primary/15 blur-2xl pointer-events-none"></div>
        <div className="flex items-center gap-space-xs mb-space-xs">
          <span className="px-space-xs py-0.5 rounded-full bg-secondary/20 text-secondary font-space text-[10px] font-bold tracking-wide uppercase">
            Módulo 3 • Termodinámica
          </span>
        </div>
        <h1 className="font-space text-headline-lg-mobile text-on-surface tracking-tight mb-1">Calor y Temperatura</h1>
        <p className="text-body-sm text-on-surface-variant">Descubrí por qué las cosas queman, por qué el frío no existe y medí la energía.</p>
      </section>

      <QuickTips />

      {/* Calor vs Temp */}
      <section className="grid grid-cols-1 gap-2">
        <div className="rounded-xl bg-surface-container p-3 shadow-md border-l-4 border-error">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-5 h-5 text-error" />
            <h3 className="font-space font-bold text-[18px]">CALOR</h3>
            <span className="ml-auto text-[10px] font-bold bg-error-container text-on-error-container px-2 py-0.5 rounded">J / cal</span>
          </div>
          <p className="text-[13px] text-on-surface-variant">Energía térmica en tránsito. Siempre viaja del cuerpo de mayor temperatura al de menor temperatura.</p>
        </div>
        <div className="rounded-xl bg-surface-container p-3 shadow-md border-l-4 border-secondary">
          <div className="flex items-center gap-2 mb-1">
            <Thermometer className="w-5 h-5 text-secondary" />
            <h3 className="font-space font-bold text-[18px]">TEMPERATURA</h3>
            <span className="ml-auto text-[10px] font-bold bg-secondary-container text-on-secondary px-2 py-0.5 rounded">°C / K</span>
          </div>
          <p className="text-[13px] text-on-surface-variant">Magnitud que mide la velocidad promedio (agitación) de las partículas. ¡Mide el nivel de calor, no la cantidad!</p>
        </div>
      </section>

      {/* Laboratorio de Escalas */}
      <section className="rounded-xl bg-surface-container-high p-space-md shadow-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-space text-[16px] font-bold text-on-surface flex items-center gap-2">
            <Thermometer className="text-secondary w-5 h-5"/> Laboratorio de Escalas
          </h3>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-surface-container-lowest rounded-lg p-2 flex flex-col items-center">
            <span className="text-[11px] font-space text-secondary uppercase">Celsius</span>
            <span className="font-space text-2xl font-bold">{tempC} °C</span>
            <span className={`text-[10px] font-bold ${tState.color}`}>{tState.label}</span>
          </div>
          <div className="bg-surface-container-lowest rounded-lg p-2 flex flex-col items-center">
            <span className="text-[11px] font-space text-primary uppercase">Kelvin</span>
            <span className="font-space text-2xl text-primary font-bold">{(tempC + 273.15).toFixed(2)} K</span>
            <span className="text-[10px] text-on-surface-variant">K = °C + 273,15</span>
          </div>
        </div>

        <div>
          <input 
            type="range" min="0" max="100" 
            value={tempC} onChange={(e)=>setTempC(parseInt(e.target.value))}
            className="w-full accent-secondary h-2 bg-surface-container-lowest rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-space text-on-surface-variant mt-1">
            <span>0°C (Fusión)</span><span>100°C (Ebullición)</span>
          </div>
        </div>
      </section>

      {/* Transmisión */}
      <section className="flex flex-col gap-2">
        <h2 className="font-space text-[18px] font-bold flex items-center gap-2"><ArrowRight className="text-primary w-5 h-5"/> 3 Formas de Transmisión</h2>
        
        {[
          { id: 1, title: 'Conducción (Contacto)', desc: 'Choque de partículas sin desplazamiento (Sólidos). Ej: Cuchara en café.' },
          { id: 2, title: 'Convección (Fluidos)', desc: 'El fluido caliente asciende y el frío desciende creando corrientes. Ej: Aire acondicionado.' },
          { id: 3, title: 'Radiación (Ondas)', desc: 'Viaja por el vacío sin necesidad de materia. Ej: Calor del Sol.' }
        ].map((item) => (
          <div key={item.id} className="rounded-xl bg-surface-container overflow-hidden">
            <button onClick={() => setActiveAcc(activeAcc === item.id ? null : item.id)} className="w-full p-3 flex justify-between items-center text-left">
              <span className="font-space font-bold">{item.title}</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${activeAcc === item.id ? 'rotate-180' : ''}`} />
            </button>
            {activeAcc === item.id && (
              <div className="p-3 pt-0 text-[13px] text-on-surface-variant border-t border-surface-bright">
                {item.desc}
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Calc Nutricional */}
      <section className="rounded-xl bg-surface-container-high p-space-md shadow-lg flex flex-col gap-3">
        <h3 className="font-space text-[16px] font-bold">Calculadora Nutricional</h3>
        <div className="flex gap-2">
          <button onClick={()=>setFood('manzana')} className={`flex-1 p-2 rounded-lg font-space text-[12px] font-bold ${food==='manzana'?'bg-secondary text-on-secondary':'bg-surface-container'}`}>Manzana (52 kcal)</button>
          <button onClick={()=>setFood('pizza')} className={`flex-1 p-2 rounded-lg font-space text-[12px] font-bold ${food==='pizza'?'bg-error text-on-error':'bg-surface-container'}`}>Pizza (285 kcal)</button>
        </div>
        <div className="bg-surface-container-lowest p-3 rounded-xl flex flex-col gap-2 font-mono text-[12px]">
          <div className="flex flex-col">
            <span className="text-on-surface-variant">1) kcal a cal:</span>
            <span className="font-bold">{kcal} × 1000 = {kcal*1000} cal</span>
          </div>
          <div className="flex flex-col">
            <span className="text-on-surface-variant">2) cal a Joules (×4.184):</span>
            <span className="font-bold text-primary text-[14px]">{(kcal*1000).toLocaleString('es-AR')} × 4.184 = {Math.round(joules).toLocaleString('es-AR')} J</span>
          </div>
          <div className="flex flex-col">
            <span className="text-on-surface-variant">3) kJ:</span>
            <span className="font-bold text-tertiary">{(joules/1000).toFixed(2)} kJ</span>
          </div>
        </div>
      </section>

      <QuickReview moduleName="Termodinámica: Calor y Temperatura" />

      <VoiceNotes moduleName="Termodinámica: Calor y Temperatura" />

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
