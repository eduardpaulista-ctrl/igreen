import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'motion/react';

interface ProcessingStateProps {
  type: 'customer' | 'partner';
  onComplete: () => void;
}

const CUSTOMER_STEPS = [
  { id: 1, text: "Estamos analisando seu perfil..." },
  { id: 2, text: "Calculando potencial de economia..." },
  { id: 3, text: "Verificando disponibilidade no seu Estado..." },
  { id: 4, text: "Preparando seu resultado sob medida..." }
];

const PARTNER_STEPS = [
  { id: 1, text: "Analisando seu objetivo de renda..." },
  { id: 2, text: "Consultando vagas de liderança regional..." },
  { id: 3, text: "Avaliando perfil comercial..." },
  { id: 4, text: "Gerando manual da sua franquia..." }
];

export default function ProcessingState({ type, onComplete }: ProcessingStateProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = type === 'partner' ? PARTNER_STEPS : CUSTOMER_STEPS;

  useEffect(() => {
    // Total duration: 2.5 seconds (2500 ms)
    // Step index updates every 0.6 seconds
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 600);

    // Progress updates smoothly
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 1;
        }
        clearInterval(progressInterval);
        return 100;
      });
    }, 20); // 100 * 20ms = 2s (smooth finish)

    // Complete callback after 2.5 seconds
    const timeout = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      clearTimeout(timeout);
    };
  }, [onComplete, steps.length]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-10 px-6 space-y-8 select-none text-center">
      
      {/* Animated Circular Progress Spinner */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        {/* Outer pulsating radial ring */}
        <div className="absolute inset-0 rounded-full bg-[#00D166]/10 animate-ping opacity-60" style={{ animationDuration: '3s' }} />
        
        {/* Inner high-contrast spinner */}
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            className="stroke-slate-100"
            strokeWidth="5"
            fill="transparent"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            className="stroke-[#00D166] transition-all duration-300"
            strokeWidth="5"
            fill="transparent"
            strokeDasharray={251.2}
            strokeDashoffset={251.2 - (251.2 * progress) / 100}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center">
          <span className="font-mono text-xl font-bold text-slate-800">{progress}%</span>
          <span className="text-[8px] font-semibold text-slate-400 tracking-wider uppercase">Análise</span>
        </div>
      </div>

      {/* Primary Status Title */}
      <div className="space-y-2 max-w-sm">
        <h3 className="text-xl font-display font-bold text-slate-900 tracking-tight">
          {type === 'partner' ? 'Processando perfil comercial' : 'Processando sua simulação'}
        </h3>
        <p className="text-xs text-slate-500">
          {type === 'partner' 
            ? 'Nossos algoritmos comerciais estão avaliando as vagas e bônus vigentes para sua localidade.'
            : 'Nossos algoritmos inteligentes estão conferindo os benefícios disponíveis de acordo com seu perfil.'}
        </p>
      </div>

      {/* Sequential status list */}
      <div className="w-full max-w-xs bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3.5 text-left">
        {steps.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isActive = idx === currentStepIndex;

          return (
            <div 
              key={step.id} 
              className={`flex items-center gap-3 transition-all duration-300 ${
                isDone ? 'opacity-100 text-slate-800' : isActive ? 'opacity-100 font-medium text-[#00B859]' : 'opacity-40 text-slate-400'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-[#00D166] shrink-0" />
              ) : isActive ? (
                <Loader2 className="w-4 h-4 text-[#00D166] animate-spin shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-300 shrink-0" />
              )}
              <span className="text-xs">{step.text}</span>
            </div>
          );
        })}
      </div>

      {/* Footer Trust badge */}
      <div className="text-[10px] text-slate-400 flex items-center gap-1">
        <Loader2 className="w-3.5 h-3.5 text-[#00D166] animate-spin" />
        <span>Garantindo criptografia ponta a ponta</span>
      </div>
    </div>
  );
}
