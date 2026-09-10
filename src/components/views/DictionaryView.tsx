import { useState } from 'react';
import { Search, BookText, Beaker, Zap, Thermometer, Info, List, Layers } from 'lucide-react';
import Flashcards from '../Flashcards';

const DICTIONARY = [
  { term: "Materia", definition: "Todo lo que tiene masa y ocupa lugar en el espacio (volumen).", category: "Materia" },
  { term: "Masa", definition: "Cantidad de materia que contiene un cuerpo. Se mide en kilogramos o gramos.", category: "Materia" },
  { term: "Volumen", definition: "Espacio tridimensional que ocupa un cuerpo.", category: "Materia" },
  { term: "Densidad", definition: "Relación entre la masa y el volumen de un cuerpo. Es una propiedad intensiva.", category: "Materia" },
  { term: "Propiedad Intensiva", definition: "Aquella que no depende de la cantidad de materia (ej. densidad, temperatura de ebullición).", category: "Materia" },
  { term: "Propiedad Extensiva", definition: "Aquella que depende directamente de la cantidad de materia (ej. masa, peso, volumen).", category: "Materia" },
  
  { term: "Energía", definition: "Capacidad que tiene la materia de producir trabajo en forma de movimiento, luz, calor, etc.", category: "Energía" },
  { term: "Energía Cinética", definition: "Energía que posee un cuerpo a causa de su movimiento. Depende de su masa y velocidad.", category: "Energía" },
  { term: "Energía Potencial", definition: "Energía almacenada en un objeto debido a su posición en un campo de fuerza (como la gravedad).", category: "Energía" },
  { term: "Energía Mecánica", definition: "La suma de la energía cinética y potencial de un cuerpo.", category: "Energía" },
  { term: "Joule", definition: "Unidad del Sistema Internacional para la energía. 1 Joule equivale al trabajo para producir un vatio de potencia por un segundo (o mover 100g a 1 metro de altura).", category: "Energía" },
  
  { term: "Calor", definition: "Energía térmica en tránsito; se transfiere de un cuerpo de mayor temperatura a uno de menor temperatura.", category: "Termodinámica" },
  { term: "Temperatura", definition: "Medida de la energía cinética promedio de las partículas en una sustancia.", category: "Termodinámica" },
  { term: "Termodinámica", definition: "Rama de la física que estudia la relación entre el calor, la fuerza aplicada y la transferencia de energía.", category: "Termodinámica" },
  { term: "Punto de Ebullición", definition: "Temperatura a la cual una sustancia cambia de estado líquido a gaseoso.", category: "Termodinámica" },
  { term: "Punto de Fusión", definition: "Temperatura a la cual una sustancia cambia de estado sólido a líquido.", category: "Termodinámica" }
];

export default function DictionaryView() {
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'flashcards'>('list');

  const filteredTerms = DICTIONARY.filter(item => 
    item.term.toLowerCase().includes(query.toLowerCase()) || 
    item.definition.toLowerCase().includes(query.toLowerCase())
  );

  const getCategoryIcon = (category: string) => {
    if (category === 'Materia') return <Beaker className="w-4 h-4 text-primary" />;
    if (category === 'Energía') return <Zap className="w-4 h-4 text-secondary" />;
    if (category === 'Termodinámica') return <Thermometer className="w-4 h-4 text-error" />;
    return <Info className="w-4 h-4 text-on-surface-variant" />;
  };

  return (
    <div className="flex flex-col w-full px-space-md pt-space-md pb-space-2xl space-y-space-md animate-in fade-in zoom-in-95 duration-200">
      
      {/* Header */}
      <section className="relative overflow-hidden rounded-xl bg-surface-container-high p-space-md shadow-xl">
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-primary/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-highest mb-2">
          <BookText className="w-3.5 h-3.5 text-primary" />
          <span className="font-space text-[12px] text-primary uppercase tracking-wider font-bold">Diccionario de Conceptos</span>
        </div>
        <h1 className="font-space text-headline-lg-mobile text-on-surface tracking-tight">Glosario Técnico</h1>
        <p className="text-body-md text-on-surface-variant mt-2">Buscá y repasá rápidamente los términos fundamentales de física y química.</p>
      </section>

      {/* View Toggle */}
      <section className="flex items-center bg-surface-container-high rounded-lg p-1 border border-outline-variant/30">
        <button 
          onClick={() => setViewMode('list')}
          className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-md font-space text-[14px] font-bold transition-colors ${viewMode === 'list' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-highest'}`}
        >
          <List className="w-4 h-4" /> Lista
        </button>
        <button 
          onClick={() => setViewMode('flashcards')}
          className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-md font-space text-[14px] font-bold transition-colors ${viewMode === 'flashcards' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-highest'}`}
        >
          <Layers className="w-4 h-4" /> Flashcards
        </button>
      </section>

      {viewMode === 'list' ? (
        <>
          {/* Search Input */}
          <section className="sticky top-16 z-20 pb-4 bg-surface pt-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-on-surface-variant" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-outline-variant/30 rounded-xl bg-surface-container-high text-on-surface placeholder-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow shadow-sm font-spline"
                placeholder="Buscar por término o definición..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </section>

          {/* Dictionary List */}
          <section className="flex flex-col gap-3">
            {filteredTerms.length > 0 ? (
              filteredTerms.map((item, idx) => (
                <div 
                  key={idx} 
                  className="bg-surface-container p-4 rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-2 hover:border-primary/40 transition-colors animate-in slide-in-from-bottom-2 fade-in"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-space font-bold text-[16px] text-on-surface">{item.term}</h3>
                    <div className="flex items-center gap-1.5 bg-surface-container-highest px-2 py-0.5 rounded text-[11px] font-space text-on-surface-variant uppercase tracking-wider font-semibold">
                      {getCategoryIcon(item.category)}
                      {item.category}
                    </div>
                  </div>
                  <p className="font-spline text-[14px] text-on-surface-variant leading-relaxed">
                    {item.definition}
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-surface-container-low p-8 rounded-xl flex flex-col items-center justify-center text-center gap-3 border border-dashed border-outline-variant">
                <Search className="w-10 h-10 text-on-surface-variant/40" />
                <div>
                  <p className="font-space font-bold text-on-surface">No se encontraron resultados</p>
                  <p className="text-body-sm text-on-surface-variant">Prueba escribiendo otra palabra o concepto.</p>
                </div>
              </div>
            )}
          </section>
        </>
      ) : (
        <section className="flex items-center justify-center py-4">
          <Flashcards items={DICTIONARY} />
        </section>
      )}
    </div>
  );
}
