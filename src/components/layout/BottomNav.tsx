import { FlaskConical, Zap, Thermometer, BrainCircuit, BookText } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const tabs = [
    { id: 'materia', label: 'Materia', icon: FlaskConical },
    { id: 'energia', label: 'Energía', icon: Zap },
    { id: 'calor', label: 'Calor', icon: Thermometer },
    { id: 'lab-trivia', label: 'Trivia', icon: BrainCircuit },
    { id: 'diccionario', label: 'Glosario', icon: BookText },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/90 backdrop-blur-2xl shadow-[0_-8px_32px_rgba(0,0,0,0.4)]">
      <div className="flex justify-around items-center h-16 px-space-xs max-w-2xl mx-auto w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center min-w-[50px] min-h-[44px] py-1 px-1 rounded-xl transition-all duration-300",
                isActive 
                  ? "text-secondary bg-surface-container-high/80 shadow-[0_0_16px_rgba(76,215,246,0.25)] scale-105" 
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-space text-[10px] mt-0.5 tracking-tight font-semibold">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
