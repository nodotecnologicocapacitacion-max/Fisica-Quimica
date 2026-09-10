import { useState } from 'react';
import { ArrowRight, ArrowLeft, RefreshCw, Shuffle } from 'lucide-react';

interface FlashcardItem {
  term: string;
  definition: string;
  category: string;
}

interface FlashcardsProps {
  items: FlashcardItem[];
}

export default function Flashcards({ items }: FlashcardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledItems, setShuffledItems] = useState<FlashcardItem[]>(items);

  if (!items || items.length === 0) return null;

  const currentItem = shuffledItems[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % shuffledItems.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? shuffledItems.length - 1 : prev - 1));
    }, 150);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setTimeout(() => {
      const shuffled = [...items].sort(() => Math.random() - 0.5);
      setShuffledItems(shuffled);
      setCurrentIndex(0);
    }, 150);
  };

  return (
    <div className="flex flex-col items-center w-full space-y-4">
      {/* Card Container */}
      <div 
        className="relative w-full max-w-sm h-64 perspective-1000 cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div 
          className={`w-full h-full transition-transform duration-500 transform-style-3d relative ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          {/* Front of Card */}
          <div className="absolute w-full h-full backface-hidden bg-surface-container-high border-2 border-primary/20 rounded-2xl shadow-xl flex flex-col items-center justify-center p-6 text-center">
            <span className="absolute top-4 right-4 text-[11px] font-space text-primary font-bold uppercase tracking-wider bg-primary/10 px-2 py-1 rounded-full">
              {currentItem.category}
            </span>
            <h3 className="font-space text-2xl font-bold text-on-surface">
              {currentItem.term}
            </h3>
            <p className="absolute bottom-4 text-[12px] text-on-surface-variant/60 font-spline animate-pulse">
              Toca para ver la definición
            </p>
          </div>

          {/* Back of Card */}
          <div className="absolute w-full h-full backface-hidden bg-primary text-on-primary rounded-2xl shadow-xl flex flex-col items-center justify-center p-6 text-center rotate-y-180">
            <p className="font-spline text-[15px] leading-relaxed">
              {currentItem.definition}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between w-full max-w-sm px-2">
        <button 
          onClick={handlePrev}
          className="p-3 bg-surface-container rounded-full hover:bg-surface-bright transition-colors text-on-surface"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4">
          <span className="font-space text-[14px] text-on-surface-variant font-bold">
            {currentIndex + 1} / {shuffledItems.length}
          </span>
          <button 
            onClick={handleShuffle}
            className="p-2 bg-surface-container-lowest rounded-full hover:bg-surface-bright transition-colors text-secondary border border-outline-variant/30"
            title="Mezclar tarjetas"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>

        <button 
          onClick={handleNext}
          className="p-3 bg-primary text-on-primary rounded-full hover:bg-primary-fixed transition-colors shadow-lg shadow-primary/20"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
