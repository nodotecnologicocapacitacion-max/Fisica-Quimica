import { useState } from 'react';
import { Calculator, ChevronDown, Beaker, Zap, Flame, ArrowRight } from 'lucide-react';

const FORMULAS = [
  {
    id: 'densidad',
    name: 'Densidad',
    formula: 'd = m / v',
    icon: Beaker,
    color: 'text-primary',
    bg: 'bg-primary/20',
    inputs: [
      { id: 'm', label: 'Masa (m)', unit: 'kg' },
      { id: 'v', label: 'Volumen (v)', unit: 'm³' }
    ],
    calc: (v: Record<string, number>) => (v.v && v.v !== 0 ? v.m / v.v : 0),
    resUnit: 'kg/m³'
  },
  {
    id: 'fuerza',
    name: 'Fuerza (2da Ley Newton)',
    formula: 'F = m · a',
    icon: Zap,
    color: 'text-secondary',
    bg: 'bg-secondary/20',
    inputs: [
      { id: 'm', label: 'Masa (m)', unit: 'kg' },
      { id: 'a', label: 'Aceleración (a)', unit: 'm/s²' }
    ],
    calc: (v: Record<string, number>) => v.m * v.a,
    resUnit: 'N (Newtons)'
  },
  {
    id: 'energia_cinetica',
    name: 'Energía Cinética',
    formula: 'Ec = ½ · m · v²',
    icon: Zap,
    color: 'text-secondary',
    bg: 'bg-secondary/20',
    inputs: [
      { id: 'm', label: 'Masa (m)', unit: 'kg' },
      { id: 'v', label: 'Velocidad (v)', unit: 'm/s' }
    ],
    calc: (v: Record<string, number>) => 0.5 * v.m * Math.pow(v.v, 2),
    resUnit: 'J (Joules)'
  },
  {
    id: 'energia_potencial',
    name: 'Energía Potencial',
    formula: 'Ep = m · g · h',
    icon: Zap,
    color: 'text-secondary',
    bg: 'bg-secondary/20',
    inputs: [
      { id: 'm', label: 'Masa (m)', unit: 'kg' },
      { id: 'h', label: 'Altura (h)', unit: 'm' }
    ],
    calc: (v: Record<string, number>) => v.m * 9.8 * v.h,
    resUnit: 'J (Joules)'
  },
  {
    id: 'calor',
    name: 'Calor Sensible',
    formula: 'Q = m · c · ΔT',
    icon: Flame,
    color: 'text-error',
    bg: 'bg-error/20',
    inputs: [
      { id: 'm', label: 'Masa (m)', unit: 'g' },
      { id: 'c', label: 'Calor Específico (c)', unit: 'cal/g°C' },
      { id: 'dt', label: 'Var. Temp (ΔT)', unit: '°C' }
    ],
    calc: (v: Record<string, number>) => v.m * v.c * v.dt,
    resUnit: 'cal'
  }
];

export default function FormulaCalculator() {
  const [activeFormulaId, setActiveFormulaId] = useState(FORMULAS[0].id);
  const [values, setValues] = useState<Record<string, string>>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const activeFormula = FORMULAS.find(f => f.id === activeFormulaId)!;

  const handleInputChange = (id: string, val: string) => {
    setValues(prev => ({ ...prev, [id]: val }));
  };

  const calculateResult = () => {
    const numValues: Record<string, number> = {};
    activeFormula.inputs.forEach(input => {
      numValues[input.id] = parseFloat(values[input.id] || '0');
    });
    const res = activeFormula.calc(numValues);
    return isNaN(res) ? 0 : Number(res.toFixed(4));
  };

  const selectFormula = (id: string) => {
    setActiveFormulaId(id);
    setValues({});
    setIsDropdownOpen(false);
  };

  const ActiveIcon = activeFormula.icon;

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2">
      
      {/* Dropdown Selector */}
      <div className="relative">
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl p-4 flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeFormula.bg}`}>
              <ActiveIcon className={`w-5 h-5 ${activeFormula.color}`} />
            </div>
            <div className="text-left">
              <h3 className="font-space font-bold text-on-surface leading-tight">{activeFormula.name}</h3>
              <p className="font-space text-[12px] text-on-surface-variant tracking-wider">{activeFormula.formula}</p>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-on-surface-variant transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-high border border-outline-variant/30 rounded-xl shadow-xl z-20 overflow-hidden flex flex-col">
            {FORMULAS.map(f => {
              const FIcon = f.icon;
              return (
                <button 
                  key={f.id} 
                  onClick={() => selectFormula(f.id)}
                  className={`flex items-center gap-3 p-4 hover:bg-surface-bright transition-colors border-b border-outline-variant/10 last:border-0 ${activeFormulaId === f.id ? 'bg-surface-bright' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${f.bg}`}>
                    <FIcon className={`w-4 h-4 ${f.color}`} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-space font-bold text-[14px] text-on-surface leading-tight">{f.name}</h3>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Input Fields */}
      <div className="bg-surface-container p-space-md rounded-xl shadow-inner border border-outline-variant/20 flex flex-col gap-3">
        <h4 className="font-space text-[12px] text-on-surface-variant uppercase font-bold tracking-wider mb-1">Ingresa las variables</h4>
        
        {activeFormula.inputs.map(input => (
          <div key={input.id} className="flex flex-col gap-1.5">
            <label className="font-space text-[13px] font-semibold text-on-surface flex justify-between">
              {input.label}
              <span className="text-secondary">{input.unit}</span>
            </label>
            <input 
              type="number" 
              value={values[input.id] || ''}
              onChange={(e) => handleInputChange(input.id, e.target.value)}
              placeholder="0.00"
              className="w-full bg-surface-container-highest border border-outline-variant/40 rounded-lg p-3 text-on-surface font-space focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        ))}
      </div>

      {/* Result Display */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-lg border border-primary/20 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-secondary/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="flex items-center gap-2 mb-2 relative z-10">
          <ArrowRight className="w-4 h-4 text-primary" />
          <span className="font-space text-[12px] uppercase tracking-wider font-bold text-on-surface-variant">Resultado ({activeFormula.formula.split(' ')[0]})</span>
        </div>
        
        <div className="relative z-10 flex items-baseline gap-2">
          <span className="font-space text-4xl font-bold text-primary break-all">
            {calculateResult().toLocaleString('es-AR', { maximumFractionDigits: 4 })}
          </span>
          <span className="font-space text-lg text-secondary font-bold">
            {activeFormula.resUnit}
          </span>
        </div>
      </div>

    </div>
  );
}
