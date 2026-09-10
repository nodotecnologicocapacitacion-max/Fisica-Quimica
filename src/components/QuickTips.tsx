import { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';

const TIPS = [
  "Dibuja los problemas: Los diagramas y esquemas visuales son tu mejor herramienta para entender física.",
  "Las unidades son tus amigas: Si buscas una distancia y el resultado te da en 'kg/s', sabrás que algo salió mal.",
  "La energía no desaparece: Si te 'falta' energía en un cálculo de mecánica, probablemente se disipó como calor.",
  "Observa tu entorno: Hervir agua, derretir chocolate o el rocío de la mañana... ¡todo es termodinámica en acción!",
  "Ordena tus datos: Antes de buscar una fórmula, haz una lista clara con los datos que tienes y la incógnita que buscas.",
  "Cuidado con los prefijos: Convierte siempre 'kilo', 'mili' o 'centi' a las unidades base del Sistema Internacional antes de operar.",
  "Aplica el sentido común: ¿Es posible que un auto viaje a 5000 m/s? Evaluar tus resultados lógicamente evita muchos errores."
];

export default function QuickTips() {
  const [tip, setTip] = useState<string>('');

  useEffect(() => {
    // Select a random tip on component mount
    const randomTip = TIPS[Math.floor(Math.random() * TIPS.length)];
    setTip(randomTip);
  }, []);

  if (!tip) return null;

  return (
    <div className="bg-surface-container-low border border-secondary/30 rounded-xl p-space-sm flex items-start gap-3 shadow-lg animate-in fade-in slide-in-from-top-4 duration-500 relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute -left-4 -top-4 w-16 h-16 bg-secondary/10 rounded-full blur-xl pointer-events-none"></div>
      
      <div className="bg-secondary/20 p-2 rounded-lg flex-shrink-0 relative z-10">
        <Lightbulb className="w-5 h-5 text-secondary animate-pulse" />
      </div>
      <div className="relative z-10">
        <h4 className="font-space text-[12px] font-bold text-secondary uppercase tracking-wider mb-0.5">Tip de Laboratorio</h4>
        <p className="font-spline text-[13px] text-on-surface-variant leading-snug">{tip}</p>
      </div>
    </div>
  );
}
