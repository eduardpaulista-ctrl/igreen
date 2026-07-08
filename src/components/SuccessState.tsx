import React, { useState, useEffect } from 'react';
import { CheckCircle2, MessageSquare, ArrowRight, ArrowLeft, ShieldCheck, Sparkles, Award, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { QuizAnswers, PartnerAnswers } from '../types';

interface SuccessStateProps {
  type: 'customer' | 'partner';
  answers?: QuizAnswers;
  partnerAnswers?: PartnerAnswers;
  onBackToHome?: () => void;
}

export default function SuccessState({ type, answers, partnerAnswers, onBackToHome }: SuccessStateProps) {
  const [countdown, setCountdown] = useState(5);
  const [redirected, setRedirected] = useState(false);

  const email = type === 'partner' ? partnerAnswers?.email : answers?.email;

  // Prioritize the actual captured name, falling back to email prefix
  const userName = React.useMemo(() => {
    const capturedName = type === 'partner' ? partnerAnswers?.nome : answers?.nome;
    if (capturedName && capturedName.trim()) {
      const firstWord = capturedName.trim().split(' ')[0];
      return firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
    }
    if (!email) return '';
    const prefix = email.split('@')[0];
    const cleanPrefix = prefix.split(/[._-]/)[0];
    return cleanPrefix.charAt(0).toUpperCase() + cleanPrefix.slice(1).toLowerCase();
  }, [email, type, partnerAnswers?.nome, answers?.nome]);

  // Compute final WhatsApp link
  const getWhatsAppLink = () => {
    const cleanNumber = '5548974003980';
    
    if (type === 'partner' && partnerAnswers) {
      const formattedObjetivo = partnerAnswers.objetivo || 'Não informado';
      const formattedDedicacao = partnerAnswers.dedicacao || 'Não informado';
      const formattedMetaRenda = partnerAnswers.metaRenda || 'Não informado';
      const formattedExperiencia = partnerAnswers.experienciaVendas || 'Não informado';
      const formattedInvestimento = partnerAnswers.investimento || 'Não informado';
      
      const message = `Olá! Realizei o teste de Perfil Empreendedor da iGreen Energy.
Meu objetivo: ${formattedObjetivo}
Tempo de dedicação: ${formattedDedicacao}
Meta de ganhos: ${formattedMetaRenda}
Experiência em vendas: ${formattedExperiencia}
Capital de investimento disponível: ${formattedInvestimento}
WhatsApp: ${partnerAnswers.whatsapp}
E-mail: ${partnerAnswers.email}

Gostaria de falar com o Gestor de Expansão para ativar minha microfranquia iGreen!`;
      return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    } else if (answers) {
      const formattedProfile = answers.perfil || 'Não informado';
      const formattedConsumo = answers.consumo || 'Não informado';
      const formattedEstado = answers.estado || 'Não informado';
      const formattedImovel = answers.imovelProprio || 'Não informado';
      
      const message = `Olá! Fiz a simulação iGreen para minha conta de energia.
Meu perfil: ${formattedProfile}
Consumo aproximado: ${formattedConsumo}
Estado: ${formattedEstado}
Imóvel próprio: ${formattedImovel}
WhatsApp: ${answers.whatsapp}
E-mail: ${answers.email}

Gostaria de falar com um especialista e obter meu desconto de até 20%!`;
      return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    }
    return `https://wa.me/${cleanNumber}`;
  };

  const getRedirectUrl = () => {
    if (type === 'partner') {
      return `/?view=presentation&name=${encodeURIComponent(userName)}&flow=partner`;
    }
    return `/?view=presentation&name=${encodeURIComponent(userName)}&flow=customer`;
  };

  const handleRedirect = () => {
    const url = getRedirectUrl();
    window.open(url, '_blank', 'noopener,noreferrer');
    setRedirected(true);
  };

  useEffect(() => {
    if (countdown <= 0) {
      if (!redirected) {
        handleRedirect();
      }
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, redirected]);

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col gap-4 p-6 select-none" id="success-container">
      {onBackToHome && (
        <div className="flex justify-start">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs font-bold py-2.5 px-4 rounded-xl border border-slate-100 text-slate-600 bg-white hover:bg-slate-50 transition-all cursor-pointer active:scale-95"
            id="success-back-button"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao início</span>
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column - Success Info */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6 text-center lg:text-left">
          
          {/* Celebration Sparkles */}
        <div className="space-y-3.5">
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 bg-[#F0FDF4] text-[#00B859] font-bold text-xs py-1 px-4 rounded-full border border-[#00D166]/25 animate-bounce">
              <Sparkles className="w-3.5 h-3.5 text-[#00D166]" />
              {type === 'partner' ? 'PERFIL PRÉ-APROVADO!' : 'SIMULAÇÃO CONCLUÍDA!'}
            </span>
          </div>

        {userName ? (
          <h2 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
            {userName}, você conquistou <br />sua aprovação!
          </h2>
        ) : (
          <h2 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
            Você conquistou <br />sua aprovação!
          </h2>
        )}

        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          {type === 'partner' 
            ? 'Seus dados foram analisados com sucesso pelo departamento de expansão. Um gestor receberá você para concluir seu cadastramento comercial.'
            : 'Seu perfil foi analisado com sucesso por nossa inteligência de distribuição. Em instantes, você verá a apresentação do seu desconto de energia.'}
        </p>
      </div>

      {/* Verified Badges Block */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3 text-left">
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                {type === 'partner' ? 'Perfil Licenciado' : 'Perfil Aprovado'}
              </span>
              <span className="text-[9px] text-slate-400 font-medium">
                {type === 'partner' ? 'Critérios de ativação aprovados' : 'Requisitos mínimos alcançados'}
              </span>
            </div>
          </div>
          <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded">CONFIRMADO</span>
        </div>

        <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Star className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                {type === 'partner' ? 'Potencial de Ganhos' : 'Potencial Verificado'}
              </span>
              <span className="text-[9px] text-slate-400 font-medium">
                {type === 'partner' ? 'Renda recorrente atrativa' : 'Até 20% de economia direta'}
              </span>
            </div>
          </div>
          <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded">CONFIRMADO</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">Acesso Liberado</span>
              <span className="text-[9px] text-slate-400 font-medium">
                {type === 'partner' ? 'Dashboard de treinamento ativo' : 'Estudo energético gratuito'}
              </span>
            </div>
          </div>
          <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded">CONFIRMADO</span>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="grid grid-cols-2 gap-2 text-left">
        {type === 'partner' ? (
          <>
            <div className="bg-emerald-50/60 border border-emerald-100/40 rounded-xl p-2.5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00D166] shrink-0" />
              <span className="text-[11px] font-semibold text-slate-700">Ganhos recorrentes</span>
            </div>
            <div className="bg-emerald-50/60 border border-emerald-100/40 rounded-xl p-2.5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00D166] shrink-0" />
              <span className="text-[11px] font-semibold text-slate-700">Modelo 100% online</span>
            </div>
            <div className="bg-emerald-50/60 border border-emerald-100/40 rounded-xl p-2.5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00D166] shrink-0" />
              <span className="text-[11px] font-semibold text-slate-700">Sem chefe ou horário</span>
            </div>
            <div className="bg-emerald-50/60 border border-emerald-100/40 rounded-xl p-2.5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00D166] shrink-0" />
              <span className="text-[11px] font-semibold text-slate-700">Capacitação VIP</span>
            </div>
          </>
        ) : (
          <>
            <div className="bg-emerald-50/60 border border-emerald-100/40 rounded-xl p-2.5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00D166] shrink-0" />
              <span className="text-[11px] font-semibold text-slate-700">Economia possível</span>
            </div>
            <div className="bg-emerald-50/60 border border-emerald-100/40 rounded-xl p-2.5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00D166] shrink-0" />
              <span className="text-[11px] font-semibold text-slate-700">Sem instalação/obra</span>
            </div>
            <div className="bg-emerald-50/60 border border-emerald-100/40 rounded-xl p-2.5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00D166] shrink-0" />
              <span className="text-[11px] font-semibold text-slate-700">Energia 100% limpa</span>
            </div>
            <div className="bg-emerald-50/60 border border-emerald-100/40 rounded-xl p-2.5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00D166] shrink-0" />
              <span className="text-[11px] font-semibold text-slate-700">Atendimento VIP</span>
            </div>
          </>
        )}
      </div>
    </div>

      {/* Right Column - Redirection & CTA */}
      <div className="lg:col-span-5 flex flex-col justify-center bg-slate-50 border border-slate-200/50 rounded-[32px] p-6 lg:p-8 space-y-6 text-center shadow-sm">
        
        {/* Countdown and Auto-redirect info */}
        <div className="space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#00D166] flex items-center justify-center font-mono font-bold text-[#00B859] text-sm animate-pulse">
            {countdown}s
          </div>
          <div className="text-left">
            <span className="text-xs font-bold text-slate-800 block">Redirecionamento Automático</span>
            <span className="text-[10px] text-slate-500 block">
              {type === 'partner' 
                ? 'Preparando a apresentação oficial do negócio...' 
                : 'Preparando a explicação do seu desconto...'}
            </span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-2 w-full">
          <button
            onClick={handleRedirect}
            className="flex-1 bg-[#00D166] hover:bg-[#00B859] active:scale-[0.98] text-white font-display font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#00D166]/20 hover:shadow-[#00D166]/30 transition-all cursor-pointer relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>{type === 'partner' ? 'Ver Apresentação' : 'Ver Meu Desconto'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            title={type === 'partner' ? "Falar no WhatsApp com o Gestor de Expansão" : "Falar no WhatsApp com o Especialista"}
            className="px-4 bg-emerald-50 hover:bg-emerald-100 active:scale-[0.98] border border-emerald-200 text-[#00B859] rounded-xl flex items-center justify-center transition-all shadow-sm hover:shadow-md"
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
              alt="WhatsApp" 
              className="w-5 h-5 shrink-0" 
            />
          </a>
        </div>

        <span className="text-[9px] text-slate-400 block uppercase tracking-wider font-semibold">
          ATENDIMENTO EXCLUSIVO · SEM COMPROMISSO
        </span>
      </div>

    </div>
    </div>
  </div>
  );
}
