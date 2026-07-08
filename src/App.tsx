import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, MessageSquare, Flame, Sparkles, Check, Star, TrendingDown, TrendingUp, DollarSign, Wallet, Award, AlertCircle, ShieldAlert } from 'lucide-react';
import { QuizAnswers, PartnerAnswers, AppStep } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import VideoPlayer from './components/VideoPlayer';
import LeadQuiz from './components/LeadQuiz';
import PartnerQuiz from './components/PartnerQuiz';
import ProcessingState from './components/ProcessingState';
import SuccessState from './components/SuccessState';
import BusinessPresentation from './components/BusinessPresentation';
import { trackEvent } from './utils/analytics';
import { saveLeadToFirestore, savePartnerToFirestore } from './utils/firebase';

export default function App() {
  // 1. Core State
  const [step, setStep] = useState<AppStep>('hero');
  const [flowType, setFlowType] = useState<'customer' | 'partner' | null>(null);
  const [urlName, setUrlName] = useState<string>('');
  
  const [answers, setAnswers] = useState<QuizAnswers>({
    nome: '',
    perfil: '',
    consumo: '',
    estado: '',
    imovelProprio: '',
    querEconomizar: '',
    whatsapp: '',
    email: '',
  });

  const [partnerAnswers, setPartnerAnswers] = useState<PartnerAnswers>({
    nome: '',
    objetivo: '',
    dedicacao: '',
    metaRenda: '',
    experienciaVendas: '',
    investimento: '',
    whatsapp: '',
    email: '',
  });

  // Track initial load on mount
  useEffect(() => {
    trackEvent('app_init', { url: window.location.href, timestamp: new Date().toISOString() });
    
    // Check for custom parameters
    try {
      const params = new URLSearchParams(window.location.search);
      const view = params.get('view');
      const nameParam = params.get('name');
      
      if (nameParam) {
        setUrlName(decodeURIComponent(nameParam));
      }
      if (view === 'presentation') {
        setStep('presentation');
      }
    } catch (e) {
      console.error('Failed to parse URL params:', e);
    }
  }, []);

  const handleTriggerEvent = (name: string, payload: any) => {
    trackEvent(name, payload);
  };

  const handleStartCustomerQuiz = () => {
    handleTriggerEvent('customer_quiz_started', { timestamp: new Date().toISOString() });
    setFlowType('customer');
    setStep('saving-quiz');
  };

  const handleStartPartnerQuiz = () => {
    handleTriggerEvent('partner_quiz_started', { timestamp: new Date().toISOString() });
    setFlowType('partner');
    setStep('partner-quiz');
  };

  const handleQuizFinish = async () => {
    setStep('processing');
    try {
      if (flowType === 'partner') {
        await savePartnerToFirestore(partnerAnswers);
      } else {
        await saveLeadToFirestore(answers);
      }
    } catch (err) {
      console.error('Failed to save lead to Firestore:', err);
    }
  };

  const handlePartnerDisqualify = () => {
    setStep('disqualified');
  };

  const handleProcessingComplete = async () => {
    handleTriggerEvent('quiz_processed_successfully', flowType === 'partner' ? partnerAnswers : answers);
    setStep('success');
  };

  const handleReset = () => {
    // Reset answers
    setAnswers({
      perfil: '',
      consumo: '',
      estado: '',
      imovelProprio: '',
      querEconomizar: '',
      whatsapp: '',
      email: '',
    });
    setPartnerAnswers({
      objetivo: '',
      dedicacao: '',
      metaRenda: '',
      experienciaVendas: '',
      investimento: '',
      whatsapp: '',
      email: '',
    });
    setFlowType(null);
    setStep('hero');
  };

  const isFullPage = true;

  return (
    <div className="min-h-screen bg-[#F9FAFB] md:py-8 md:px-4 flex flex-col justify-center items-center relative overflow-x-hidden font-sans text-[#111827]">
      
      {/* Decorative ambient blurred vector elements for high-end Stripe/Apple vibe */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00D166]/5 rounded-full filter blur-3xl pointer-events-none select-none animate-soft-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#F0FDF4]/30 rounded-full filter blur-3xl pointer-events-none select-none animate-soft-pulse" style={{ animationDelay: '3s' }} />

      {/* Dynamic Sizing Container based on Step */}
      <main 
        id="app-root-frame"
        className={`w-full bg-white border-0 md:border border-gray-100 md:rounded-[40px] md:shadow-2xl md:shadow-black/5 overflow-hidden flex flex-col relative z-10 transition-all duration-500 ease-in-out ${
          isFullPage 
            ? 'max-w-7xl min-h-screen md:min-h-[820px] p-4 md:p-8' 
            : 'max-w-[440px] min-h-screen md:min-h-[720px]'
        }`}
      >
        {/* Top-most sleek progress indicator */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100 z-50">
          <div 
            className="h-full bg-[#00D166] transition-all duration-700 ease-out"
            style={{ 
              width: step === 'hero' 
                ? '10%' 
                : step === 'saving-quiz' || step === 'partner-quiz'
                ? '60%' 
                : step === 'processing' 
                ? '90%' 
                : '100%' 
            }}
          />
        </div>

        {/* Minimal Trust Header - Spans full width on hero */}
        <Header isFullPage={isFullPage} />

        {/* Dynamic Multi-Step Routing with Smooth Animation Viewports */}
        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            
            {/* TELA 1: HERO & DECISION - GORGEOUS WIDESCREEN DASHBOARD */}
            {step === 'hero' && (
              <motion.div
                key="hero"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="flex-1 flex flex-col justify-between py-6 md:py-8 space-y-8 md:space-y-12"
              >
                
                {/* Hero Title & Subheadline */}
                <div className="text-center max-w-3xl mx-auto space-y-4">
                  <span className="inline-flex items-center gap-1.5 bg-[#F0FDF4] text-[#00B859] font-extrabold text-[10px] md:text-[11px] py-1 px-4 rounded-full border border-[#00D166]/15 uppercase tracking-wider select-none">
                    <Sparkles className="w-3.5 h-3.5 text-[#00D166] animate-pulse" />
                    Seja Bem-vindo à iGreen Energy
                  </span>
                </div>

                {/* Video presentation block below welcome section */}
                <div className="max-w-4xl mx-auto w-full px-4 md:px-6">
                  <div className="bg-white border border-slate-100 rounded-[28px] p-5 sm:p-7 shadow-sm hover:shadow-md transition-shadow">
                    <VideoPlayer />
                  </div>
                </div>

                {/* Question & Path Description below the video */}
                <div className="text-center max-w-3xl mx-auto space-y-3">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
                    O que você quer conquistar com a iGreen?
                  </h1>
                  <p className="text-xs sm:text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed px-2">
                    Escolha o caminho ideal para você e descubra, em poucos minutos, como economizar na conta de energia ou transformar essa solução em uma nova fonte de renda.
                  </p>
                </div>

                {/* Split Widescreen Cards - Responsive Grid layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto w-full items-stretch px-2 md:px-4">
                  
                  {/* CARD 1: ECONOMIZE (CUSTOMER) */}
                  <div className="bg-white border border-slate-100 rounded-[24px] p-6 md:p-8 flex flex-col justify-between space-y-6 md:space-y-8 shadow-sm hover:shadow-xl hover:shadow-[#00D166]/5 hover:border-[#00D166]/20 transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D166]/2 rounded-full filter blur-2xl pointer-events-none group-hover:bg-[#00D166]/4 transition-colors" />
                    
                    <div className="space-y-4">
                      {/* Icon Container */}
                      <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] border border-[#00D166]/10 flex items-center justify-center text-[#00B859] shadow-sm">
                        <TrendingDown className="w-6 h-6 stroke-[2.5px]" />
                      </div>
                      
                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-extrabold text-[#111827] tracking-tight leading-snug">
                          Economize todos os meses na sua conta de energia.
                        </h2>
                        <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                          Descubra gratuitamente quanto você pode economizar com uma solução simples, segura e sem nenhum tipo de custo de instalação ou compromisso.
                        </p>
                      </div>

                      {/* Benefits checklist */}
                      <div className="space-y-2.5 pt-2 select-none">
                        {[
                          { text: 'Simulação gratuita', desc: 'Sem compromisso financeiro.' },
                          { text: 'Economia recorrente', desc: 'Até 20% de desconto mensal direto.' },
                          { text: 'Resultado em poucos minutos', desc: 'Análise automática e segura.' }
                        ].map((benefit, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <div className="w-4 h-4 rounded-full bg-[#F0FDF4] border border-[#00D166]/10 flex items-center justify-center text-[#00B859] shrink-0 mt-0.5">
                              <Check className="w-3 h-3 stroke-[3px]" />
                            </div>
                            <div className="text-xs leading-normal">
                              <span className="font-bold text-slate-700 block">{benefit.text}</span>
                              <span className="text-[10px] text-slate-400 font-medium">{benefit.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={handleStartCustomerQuiz}
                      className="w-full bg-[#00D166] hover:bg-[#00B859] active:scale-[0.99] text-white font-display font-extrabold text-sm py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#00D166]/10 hover:shadow-[#00D166]/20 transition-all cursor-pointer relative overflow-hidden"
                    >
                      <span>Descobrir minha economia</span>
                      <span>➔</span>
                    </button>
                  </div>

                  {/* CARD 2: GERAR RENDA (PARTNER) */}
                  <div className="bg-white border border-slate-100 rounded-[24px] p-6 md:p-8 flex flex-col justify-between space-y-6 md:space-y-8 shadow-sm hover:shadow-xl hover:shadow-[#00D166]/5 hover:border-[#00D166]/20 transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D166]/2 rounded-full filter blur-2xl pointer-events-none group-hover:bg-[#00D166]/4 transition-colors" />

                    <div className="space-y-4">
                      {/* Icon Container */}
                      <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] border border-[#00D166]/10 flex items-center justify-center text-[#00B859] shadow-sm">
                        <TrendingUp className="w-6 h-6 stroke-[2.5px]" />
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-extrabold text-[#111827] tracking-tight leading-snug">
                          Transforme economia em uma nova fonte de renda.
                        </h2>
                        <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                          Ajude pessoas e empresas a economizarem na conta de energia enquanto desenvolve uma renda recorrente exponencial em um dos maiores mercados do país.
                        </p>
                      </div>

                      {/* Benefits checklist */}
                      <div className="space-y-2.5 pt-2 select-none">
                        {[
                          { text: 'Modelo validado', desc: 'Atue sob uma marca líder de expansão.' },
                          { text: 'Comece mesmo sem experiência', desc: 'Oferecemos treinamento completo e VIP.' },
                          { text: 'Potencial de renda recorrente', desc: 'Receba comissão todo mês sobre o consumo.' }
                        ].map((benefit, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <div className="w-4 h-4 rounded-full bg-[#F0FDF4] border border-[#00D166]/10 flex items-center justify-center text-[#00B859] shrink-0 mt-0.5">
                              <Check className="w-3 h-3 stroke-[3px]" />
                            </div>
                            <div className="text-xs leading-normal">
                              <span className="font-bold text-slate-700 block">{benefit.text}</span>
                              <span className="text-[10px] text-slate-400 font-medium">{benefit.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={handleStartPartnerQuiz}
                      className="w-full bg-[#111827] hover:bg-slate-800 active:scale-[0.99] text-white font-display font-extrabold text-sm py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-black/5 transition-all cursor-pointer relative overflow-hidden"
                    >
                      <span>Conhecer a oportunidade</span>
                      <span>➔</span>
                    </button>
                  </div>

                </div>

                {/* Visual Accent Spacer */}
                <div className="h-4" />

              </motion.div>
            )}

            {/* TELA 2: PROGRESSIVE CUSTOMER LEAD QUIZ */}
            {step === 'saving-quiz' && (
              <motion.div
                key="saving-quiz"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="flex-1 flex flex-col"
              >
                <LeadQuiz
                  answers={answers}
                  onChangeAnswers={setAnswers}
                  onFinish={handleQuizFinish}
                  onTriggerEvent={handleTriggerEvent}
                  onBackToHome={handleReset}
                />
              </motion.div>
            )}

            {/* TELA 3: PROGRESSIVE PARTNER RECRUITER QUIZ */}
            {step === 'partner-quiz' && (
              <motion.div
                key="partner-quiz"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="flex-1 flex flex-col"
              >
                <PartnerQuiz
                  answers={partnerAnswers}
                  onChangeAnswers={setPartnerAnswers}
                  onFinish={handleQuizFinish}
                  onDisqualify={handlePartnerDisqualify}
                  onTriggerEvent={handleTriggerEvent}
                  onBackToHome={handleReset}
                />
              </motion.div>
            )}

            {/* TELA 4: PROCESSING STATE */}
            {step === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1 flex flex-col"
              >
                <ProcessingState 
                  type={flowType || 'customer'} 
                  onComplete={handleProcessingComplete} 
                />
              </motion.div>
            )}

            {/* TELA 5: SUCCESS & FINAL REDIRECT */}
            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="flex-1 flex flex-col"
              >
                <SuccessState
                  type={flowType || 'customer'}
                  answers={answers}
                  partnerAnswers={partnerAnswers}
                  onBackToHome={handleReset}
                />
              </motion.div>
            )}

            {/* TELA 6: DISQUALIFIED STATE (EXCLUSIVITY/PARTNER COMPLIANCE SCREEN) */}
            {step === 'disqualified' && (
              <motion.div
                key="disqualified"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="flex-1 flex flex-col justify-between p-6 text-center select-none"
              >
                <div className="space-y-6 my-auto">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200/50 flex items-center justify-center text-amber-500 animate-pulse">
                      <ShieldAlert className="w-8 h-8" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
                      {partnerAnswers.nome ? `${partnerAnswers.nome.trim().split(' ')[0].charAt(0).toUpperCase() + partnerAnswers.nome.trim().split(' ')[0].slice(1).toLowerCase()}, não` : 'Não'} foi possível prosseguir no momento.
                    </h2>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                      No momento, é necessário um investimento inicial para iniciar o próprio negócio comercial de energia. Para assegurar seu suporte, material gráfico e plataforma oficial, oferecemos apenas licenças ativadas.
                    </p>
                  </div>

                  <div className="bg-emerald-50/50 border border-emerald-100/40 rounded-2xl p-4 text-left space-y-2">
                    <span className="text-[10px] font-bold text-[#00B859] uppercase tracking-wider block">EXCELENTE ALTERNATIVA:</span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Se você deseja **apenas economizar na sua própria conta de luz** sem custo algum, o cadastro de consumidor iGreen é **100% gratuito** e pode economizar até 20% do seu orçamento mensal hoje mesmo.
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5 pt-6 border-t border-slate-100">
                  <button
                    onClick={handleReset}
                    className="w-full bg-[#00D166] hover:bg-[#00B859] active:scale-[0.98] text-white font-display font-bold text-sm py-4 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#00D166]/10 transition-all cursor-pointer"
                  >
                    <span>Quero Economizar Energia (Grátis)</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer select-none"
                  >
                    Voltar para tela inicial
                  </button>
                </div>
              </motion.div>
            )}

            {/* TELA 7: BUSINESS PRESENTATION SCREEN */}
            {step === 'presentation' && (
              <motion.div
                key="presentation"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="flex-1 flex flex-col justify-center"
              >
                <BusinessPresentation
                  userName={urlName || (partnerAnswers.nome ? partnerAnswers.nome.trim().split(' ')[0] : undefined)}
                  onBackToHome={handleReset}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Minimalistic Trust Footer */}
        <Footer />
      </main>
    </div>
  );
}
