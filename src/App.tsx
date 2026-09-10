import { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import MateriaView from './components/views/MateriaView';
import EnergiaView from './components/views/EnergiaView';
import CalorView from './components/views/CalorView';
import LabTriviaView from './components/views/LabTriviaView';
import DictionaryView from './components/views/DictionaryView';

export default function App() {
  const [activeTab, setActiveTab] = useState('materia');
  const [progress, setProgress] = useState({
    materia: false,
    energia: false,
    calor: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem('fisiquilab-progress');
    if (saved) {
      try { setProgress(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const totalProgress = Math.round((Object.values(progress).filter(Boolean).length / 3) * 100);

  const toggleProgress = (module: keyof typeof progress) => {
    setProgress(prev => {
      const next = { ...prev, [module]: !prev[module] };
      localStorage.setItem('fisiquilab-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="bg-surface text-on-surface font-spline min-h-screen flex flex-col">
      <Header progressPercent={totalProgress} />
      
      {/* Main Content Area */}
      <main className="flex-1 pt-16 pb-24 relative w-full flex flex-col items-center">
        <div className="w-full max-w-2xl mx-auto">
          {activeTab === 'materia' && <MateriaView isCompleted={progress.materia} onToggle={() => toggleProgress('materia')} />}
          {activeTab === 'energia' && <EnergiaView isCompleted={progress.energia} onToggle={() => toggleProgress('energia')} />}
          {activeTab === 'calor' && <CalorView isCompleted={progress.calor} onToggle={() => toggleProgress('calor')} />}
          {activeTab === 'lab-trivia' && <LabTriviaView progress={progress} />}
          {activeTab === 'diccionario' && <DictionaryView />}
        </div>
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
