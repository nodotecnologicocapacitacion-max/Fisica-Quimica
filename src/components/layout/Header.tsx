import { User, Flame } from 'lucide-react';

interface HeaderProps {
  progressPercent?: number;
}

export default function Header({ progressPercent = 0 }: HeaderProps) {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.35)] pt-safe">
      <div className="h-16 px-space-md flex items-center justify-between gap-1 max-w-2xl mx-auto w-full">
        
        {/* Left Section: Text */}
        <div className="flex flex-col min-w-0 flex-1" translate="no">
          <span className="font-space text-[14px] sm:text-[16px] text-on-surface truncate leading-tight font-bold block">
            Física Química - 1ro "A"
          </span>
          <span className="text-secondary font-bold text-[10px] tracking-wider uppercase truncate block">
            3er Trimestre
          </span>
        </div>
        
        {/* Center Section: Logo */}
        <div className="flex justify-center items-center flex-shrink-0 px-2">
          <img 
            src="/LOGO CARMEN.jpg" 
            alt="Logo Colegio del Carmen y San José" 
            className="h-11 w-11 object-contain bg-white rounded-full p-1 shadow-[0_0_10px_rgba(255,255,255,0.1)]"
          />
        </div>
        
        {/* Right Section: Stats & Profile */}
        <div className="flex items-center gap-space-xs flex-shrink-0 flex-1 justify-end">
          <div className="flex items-center gap-space-xxs bg-surface-container-high/70 px-space-xs py-1 rounded-full text-secondary shadow-[0_0_12px_rgba(76,215,246,0.15)]">
            <Flame className="w-4 h-4 text-error animate-pulse" />
            <span className="font-space text-[12px] font-bold text-on-surface">3 d</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-[0_0_12px_rgba(208,188,255,0.3)] flex-shrink-0">
            <User className="w-5 h-5 text-on-primary" />
          </div>
        </div>
      </div>
      
      {/* Global Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-surface-container-highest">
        <div 
          className="h-full bg-tertiary shadow-[0_0_12px_rgba(78,222,163,0.8)] transition-all duration-700 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </header>
  );
}
