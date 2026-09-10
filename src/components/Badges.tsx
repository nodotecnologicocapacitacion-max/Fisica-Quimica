import { Award, Beaker, Zap, Flame, Trophy, Lock } from 'lucide-react';

interface BadgesProps {
  progress: {
    materia: boolean;
    energia: boolean;
    calor: boolean;
  };
}

export default function Badges({ progress }: BadgesProps) {
  const allCompleted = progress.materia && progress.energia && progress.calor;

  const badges = [
    {
      id: 'materia',
      title: 'Investigador de Materia',
      description: 'Completaste el módulo de Materia y sus Propiedades.',
      unlocked: progress.materia,
      icon: Beaker,
      color: 'text-primary',
      bg: 'bg-primary/20',
      border: 'border-primary/40'
    },
    {
      id: 'energia',
      title: 'Experto en Energía',
      description: 'Completaste el módulo de Energía Mecánica.',
      unlocked: progress.energia,
      icon: Zap,
      color: 'text-secondary',
      bg: 'bg-secondary/20',
      border: 'border-secondary/40'
    },
    {
      id: 'calor',
      title: 'Maestro Termodinámico',
      description: 'Completaste el módulo de Calor y Temperatura.',
      unlocked: progress.calor,
      icon: Flame,
      color: 'text-error',
      bg: 'bg-error/20',
      border: 'border-error/40'
    }
  ];

  return (
    <div className="flex flex-col gap-space-md animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Master Badge */}
      <div className={`relative overflow-hidden rounded-2xl p-space-lg shadow-xl text-center flex flex-col items-center gap-3 transition-all duration-500 border ${allCompleted ? 'bg-surface-container-high border-tertiary shadow-[0_0_30px_rgba(45,212,191,0.2)]' : 'bg-surface-container-low border-outline-variant/30 grayscale opacity-70'}`}>
        {allCompleted && (
          <>
            <div className="absolute -left-12 -top-12 w-40 h-40 bg-tertiary/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
          </>
        )}
        
        <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-inner relative ${allCompleted ? 'bg-surface-container shadow-tertiary/20' : 'bg-surface-container-highest'}`}>
          {allCompleted ? (
            <Trophy className="w-12 h-12 text-tertiary drop-shadow-[0_0_10px_rgba(45,212,191,0.8)] animate-pulse" />
          ) : (
            <Lock className="w-10 h-10 text-on-surface-variant/50" />
          )}
          {allCompleted && (
            <div className="absolute inset-0 border-4 border-tertiary rounded-full animate-[spin_4s_linear_infinite] border-t-transparent border-b-transparent"></div>
          )}
        </div>
        
        <div className="relative z-10">
          <h2 className={`font-space text-2xl font-bold tracking-tight ${allCompleted ? 'text-tertiary' : 'text-on-surface-variant'}`}>
            Graduado Cuántico
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-1 max-w-[250px]">
            {allCompleted 
              ? '¡Felicitaciones! Has dominado todos los módulos del laboratorio.'
              : 'Completa los 3 módulos principales para desbloquear la insignia definitiva.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {badges.map(badge => {
          const Icon = badge.icon;
          return (
            <div 
              key={badge.id}
              className={`p-4 rounded-xl flex flex-col items-center text-center gap-2 transition-all duration-300 border ${badge.unlocked ? `bg-surface-container shadow-md ${badge.border}` : 'bg-surface-container-lowest border-outline-variant/30 grayscale opacity-60'}`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-1 ${badge.unlocked ? badge.bg : 'bg-surface-container-highest'}`}>
                {badge.unlocked ? (
                  <Icon className={`w-7 h-7 ${badge.color}`} />
                ) : (
                  <Lock className="w-6 h-6 text-on-surface-variant/50" />
                )}
              </div>
              <h3 className={`font-space text-[14px] font-bold leading-tight ${badge.unlocked ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                {badge.title}
              </h3>
              <p className="text-[11px] text-on-surface-variant leading-tight">
                {badge.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
