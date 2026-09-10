import { useState, useEffect } from 'react';
import { Sparkles, Loader2, Volume2, Square, Download } from 'lucide-react';

interface QuickReviewProps {
  moduleName: string;
}

export default function QuickReview({ moduleName }: QuickReviewProps) {
  const [concepts, setConcepts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Cleanup speech synthesis on unmount
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    const fetchReview = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ moduleName }),
        });
        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("Oops, we haven't got JSON!");
        }
        
        const data = await response.json();
        
        if (!response.ok) {
           throw new Error(data.error || 'Failed to fetch');
        }

        setConcepts(data.concepts);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Hubo un error al generar el resumen.');
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [moduleName]);

  const toggleSpeech = () => {
    if (!window.speechSynthesis) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const textToRead = `Resumen clave de ${moduleName}. ` + concepts.join(". ");
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'es-ES';
    
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleDownload = () => {
    if (!concepts || concepts.length === 0) return;
    const textContent = `FisiQuiLab - Resumen: ${moduleName}\n\n` + concepts.map(c => `• ${c}`).join('\n');
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Resumen_${moduleName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="bg-surface-container-high rounded-xl p-space-md shadow-lg border border-primary/20 relative overflow-hidden mt-2">
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-space text-[16px] font-bold text-on-surface">Resumen Rápido con IA</h3>
        </div>
        {!loading && !error && concepts.length > 0 && (
          <div className="flex gap-2">
            <button 
              onClick={handleDownload}
              className="p-2 rounded-full flex items-center justify-center transition-all bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-bright"
              title="Descargar resumen"
            >
              <Download className="w-4 h-4" />
            </button>
            <button 
              onClick={toggleSpeech}
              className={`p-2 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-error/20 text-error shadow-[0_0_10px_rgba(255,180,171,0.3)]' : 'bg-primary/20 text-primary hover:bg-primary/30'}`}
              title={isPlaying ? "Detener lectura" : "Escuchar resumen"}
            >
              {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-on-surface-variant font-space text-[13px] py-2 relative z-10">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          Generando conceptos clave...
        </div>
      ) : error ? (
        <div className="text-error text-[13px] font-space py-2 relative z-10">
          {error}
        </div>
      ) : (
        <ul className="space-y-2 relative z-10">
          {concepts.map((concept, idx) => (
            <li key={idx} className="flex items-start gap-2 bg-surface-container p-3 rounded-lg border border-outline-variant/30 text-[13px] text-on-surface leading-tight font-spline shadow-sm animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${idx * 100}ms` }}>
              <span className="text-primary font-bold mt-0.5">•</span>
              <span>{concept}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
