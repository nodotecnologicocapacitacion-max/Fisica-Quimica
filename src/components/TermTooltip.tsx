import { useState } from 'react';

interface TermTooltipProps {
  term: string;
  definition: string;
}

export default function TermTooltip({ term, definition }: TermTooltipProps) {
  return (
    <span className="relative group inline-block cursor-help font-bold text-primary underline decoration-primary/40 decoration-dashed underline-offset-4 hover:text-primary-fixed transition-colors">
      {term}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-surface-container-highest text-on-surface text-[12px] font-spline font-normal rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-center border border-outline-variant/30 pointer-events-none">
        {definition}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-outline-variant/30"></span>
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-surface-container-highest -mt-[1px]"></span>
      </span>
    </span>
  );
}
