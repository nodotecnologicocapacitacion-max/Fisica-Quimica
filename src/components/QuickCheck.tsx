import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface QuickCheckProps {
  questions: Question[];
}

export default function QuickCheck({ questions }: QuickCheckProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (questionId: number, optionIndex: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length === questions.length) {
      setSubmitted(true);
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setSubmitted(false);
  };

  let score = 0;
  if (submitted) {
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) score++;
    });
  }

  return (
    <section className="bg-surface-container-high rounded-xl p-space-md shadow-lg border border-primary/20 space-y-4">
      <h3 className="font-space text-[18px] font-bold text-primary mb-2">Comprobación Rápida</h3>
      <p className="text-[13px] text-on-surface-variant mb-4">¿Qué tanto aprendiste sobre la energía? Responde estas 3 preguntas.</p>

      <div className="space-y-6">
        {questions.map((q, idx) => {
          const selected = answers[q.id];
          const isCorrect = selected === q.correctAnswer;
          
          return (
            <div key={q.id} className="space-y-3">
              <p className="font-spline text-[14px] text-on-surface font-bold">
                {idx + 1}. {q.text}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  let buttonStyles = "w-full text-left p-3 rounded-lg border text-[13px] font-spline transition-all ";
                  
                  if (!submitted) {
                    buttonStyles += selected === optIdx 
                      ? "bg-primary text-on-primary border-primary shadow-md" 
                      : "bg-surface-container border-outline-variant/30 text-on-surface hover:bg-surface-container-highest";
                  } else {
                    if (optIdx === q.correctAnswer) {
                      buttonStyles += "bg-tertiary/20 border-tertiary text-on-surface";
                    } else if (selected === optIdx && !isCorrect) {
                      buttonStyles += "bg-error/20 border-error text-on-surface";
                    } else {
                      buttonStyles += "bg-surface-container border-outline-variant/30 text-on-surface-variant opacity-50";
                    }
                  }

                  return (
                    <button 
                      key={optIdx}
                      onClick={() => handleSelect(q.id, optIdx)}
                      className={buttonStyles}
                      disabled={submitted}
                    >
                      <div className="flex justify-between items-center gap-2">
                        <span>{opt}</span>
                        {submitted && optIdx === q.correctAnswer && <CheckCircle2 className="w-4 h-4 text-tertiary flex-shrink-0" />}
                        {submitted && selected === optIdx && !isCorrect && <XCircle className="w-4 h-4 text-error flex-shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length !== questions.length}
          className="w-full py-3 mt-4 bg-primary text-on-primary rounded-xl font-space font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Revisar Respuestas
        </button>
      ) : (
        <div className="mt-4 p-4 bg-surface-container rounded-xl text-center space-y-3 border border-outline-variant/20">
          <p className="font-space font-bold text-[16px] text-on-surface">
            Tu puntuación: <span className={score === questions.length ? "text-tertiary" : "text-primary"}>{score} / {questions.length}</span>
          </p>
          <button onClick={resetQuiz} className="text-[13px] text-primary underline font-bold hover:text-primary-fixed">
            Intentar de nuevo
          </button>
        </div>
      )}
    </section>
  );
}
