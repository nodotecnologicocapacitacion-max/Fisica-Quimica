import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Trash2, Play, CircleDot, Pause } from 'lucide-react';

interface VoiceNotesProps {
  moduleName: string;
}

interface Note {
  id: string;
  blob: Blob;
  url: string;
  transcript: string;
  date: string;
}

export default function VoiceNotes({ moduleName }: VoiceNotesProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [transcript, setTranscript] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Check for SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'es-ES';

      recognitionRef.current.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const newNote: Note = {
          id: Date.now().toString(),
          blob: audioBlob,
          url: audioUrl,
          transcript: transcript,
          date: new Date().toLocaleDateString('es-ES', { hour: '2-digit', minute: '2-digit' })
        };
        setNotes((prev) => [...prev, newNote]);
        setTranscript("");
      };

      mediaRecorder.start();
      if (recognitionRef.current) {
        setTranscript("");
        recognitionRef.current.start();
      }
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied or error:", err);
      alert("Por favor, permite el acceso al micrófono para grabar notas de voz.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const playNote = (id: string, url: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(url);
    audioRef.current = audio;
    
    audio.onended = () => setPlayingId(null);
    audio.play();
    setPlayingId(id);
  };

  const stopPlaying = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlayingId(null);
  };

  const deleteNote = (id: string) => {
    if (playingId === id) stopPlaying();
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  return (
    <section className="bg-surface-container-high rounded-xl p-space-md shadow-lg border border-secondary/20 relative mt-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary">
          <Mic className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-space text-[16px] font-bold text-on-surface leading-tight">Notas de Voz</h3>
          <p className="text-[12px] text-on-surface-variant font-spline">¿Dudas? Grábalas en voz alta</p>
        </div>
      </div>

      {isRecording && (
        <div className="bg-surface-container p-3 rounded-lg mb-4 border border-error/20 animate-in fade-in">
          <div className="flex items-center gap-2 text-error font-space font-bold text-[13px] mb-2">
            <CircleDot className="w-4 h-4 animate-pulse" />
            Grabando...
          </div>
          <p className="text-[13px] text-on-surface italic opacity-80 min-h-[40px]">
            {transcript || "Escuchando..."}
          </p>
        </div>
      )}

      <div className="flex justify-center mb-4">
        {isRecording ? (
          <button 
            onClick={stopRecording}
            className="flex items-center gap-2 bg-error text-on-error px-6 py-3 rounded-full font-space font-bold shadow-lg animate-pulse"
          >
            <Square className="w-5 h-5 fill-current" />
            Detener Grabación
          </button>
        ) : (
          <button 
            onClick={startRecording}
            className="flex items-center gap-2 bg-secondary text-on-secondary px-6 py-3 rounded-full font-space font-bold shadow-lg hover:opacity-90 transition-opacity"
          >
            <Mic className="w-5 h-5" />
            Grabar Nota
          </button>
        )}
      </div>

      {notes.length > 0 && (
        <div className="space-y-2 mt-4">
          <h4 className="font-space text-[12px] font-bold text-secondary uppercase tracking-wider mb-2">Tus grabaciones</h4>
          {notes.map(note => (
            <div key={note.id} className="bg-surface-container rounded-lg p-3 border border-outline-variant/30 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-space text-on-surface-variant">{note.date}</span>
                <div className="flex gap-2">
                  {playingId === note.id ? (
                    <button onClick={stopPlaying} className="p-1.5 rounded-md bg-primary/20 text-primary">
                      <Pause className="w-4 h-4" />
                    </button>
                  ) : (
                    <button onClick={() => playNote(note.id, note.url)} className="p-1.5 rounded-md bg-surface-container-highest text-on-surface hover:text-primary">
                      <Play className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => deleteNote(note.id)} className="p-1.5 rounded-md bg-surface-container-highest text-error hover:bg-error/20">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {note.transcript && (
                <p className="text-[13px] text-on-surface font-spline leading-tight italic">"{note.transcript}"</p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
