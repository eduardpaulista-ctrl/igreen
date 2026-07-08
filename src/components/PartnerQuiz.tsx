import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, Smartphone, Mail, AlertCircle, TrendingUp, Briefcase, Award, Rocket, Clock, Calendar, Zap, Coins, DollarSign, Wallet, Flame, ThumbsUp, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PartnerAnswers } from '../types';

interface PartnerQuizProps {
  answers: PartnerAnswers;
  onChangeAnswers: (newAnswers: PartnerAnswers) => void;
  onFinish: () => void;
  onDisqualify: () => void;
  onTriggerEvent: (name: string, payload: any) => void;
  onBackToHome?: () => void;
}

export default function PartnerQuiz({
  answers,
  onChangeAnswers,
  onFinish,
  onDisqualify,
  onTriggerEvent,
  onBackToHome
}: PartnerQuizProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;

  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Auto scroll to top when changing steps to maintain app feel
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onTriggerEvent('partner_quiz_step_view', { step: currentStep });
  }, [currentStep]);

  const percentage = Math.round(((currentStep - 1) / totalSteps) * 100);

  // Brazilian WhatsApp Mask
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const digitsOnly = rawValue.replace(/\D/g, '');
    
    let formatted = '';
    if (digitsOnly.length <= 2) {
      formatted = digitsOnly;
    } else if (digitsOnly.length <= 7) {
      formatted = `(${digitsOnly.slice(0, 2)}) ${digitsOnly.slice(2)}`;
    } else {
      formatted = `(${digitsOnly.slice(0, 2)}) ${digitsOnly.slice(2, 7)}-${digitsOnly.slice(7, 11)}`;
    }

    onChangeAnswers({ ...answers, whatsapp: formatted });
    setPhoneError('');
  };

  const validatePhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 11) {
      return 'Informe um WhatsApp com DDD válido de 10 ou 11 dígitos.';
    }
    if (digits.length === 11 && digits[2] !== '9') {
      return 'O número de celular deve começar with 9.';
    }
    return '';
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'O e-mail é obrigatório.';
    }
    if (!emailRegex.test(email)) {
      return 'Informe um formato de e-mail válido.';
    }
    return '';
  };

  const handleNext = () => {
    if (currentStep === 6 && answers.investimento === 'Nenhum valor agora') {
      onTriggerEvent('partner_quiz_disqualified', answers);
      onDisqualify();
      return;
    }

    if (currentStep === 7) {
      const error = validatePhone(answers.whatsapp);
      if (error) {
        setPhoneError(error);
        onTriggerEvent('partner_quiz_validation_failed', { field: 'whatsapp', error });
        return;
      }
    }
    if (currentStep === 8) {
      const error = validateEmail(answers.email);
      if (error) {
        setEmailError(error);
        onTriggerEvent('partner_quiz_validation_failed', { field: 'email', error });
        return;
      }
      onTriggerEvent('partner_quiz_completed', answers);
      onFinish();
      return;
    }

    onTriggerEvent('partner_quiz_step_complete', { step: currentStep, answer: getCurrentAnswer() });
    setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else if (onBackToHome) {
      onBackToHome();
    }
  };

  const handleOptionSelect = (fieldName: keyof PartnerAnswers, value: any) => {
    onChangeAnswers({ ...answers, [fieldName]: value });
    onTriggerEvent('partner_quiz_option_selected', { fieldName, value });
    
    // Auto-advance
    setTimeout(() => {
      if (fieldName === 'investimento' && value === 'Nenhum valor agora') {
        onTriggerEvent('partner_quiz_disqualified', { ...answers, [fieldName]: value });
        onDisqualify();
        return;
      }

      setCurrentStep(prev => {
        if (prev < 7) return prev + 1;
        return prev;
      });
    }, 150);
  };

  const getCurrentAnswer = () => {
    switch(currentStep) {
      case 1: return answers.nome;
      case 2: return answers.objetivo;
      case 3: return answers.dedicacao;
      case 4: return answers.metaRenda;
      case 5: return answers.experienciaVendas;
      case 6: return answers.investimento;
      case 7: return answers.whatsapp;
      case 8: return answers.email;
      default: return '';
    }
  };

  const isStepValid = () => {
    const answer = getCurrentAnswer() || '';
    if (currentStep === 1) return answer.trim().length >= 3;
    if (currentStep <= 6) return answer !== '';
    if (currentStep === 7) return answer.replace(/\D/g, '').length >= 10;
    if (currentStep === 8) return answer.length > 3 && answer.includes('@');
    return false;
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch p-6 select-none" id="partner-quiz-container">
      
      {/* Brand & Partner Benefits Side panel - Hidden on Mobile */}
      <div className="hidden lg:flex lg:col-span-5 flex-col justify-between bg-slate-50 border border-slate-100 rounded-[32px] p-8 space-y-8 animate-fade-in select-none">
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 bg-[#F0FDF4] text-[#00B859] font-extrabold text-[10px] py-1 px-3.5 rounded-full border border-[#00D166]/20 uppercase tracking-widest">
              iGreen Business
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Seja Licenciado da Maior Rede de Energia do Brasil!
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Como parceiro iGreen, você ajuda residências, condomínios e empresas a economizarem na conta de luz e é remunerado de forma recorrente por cada kWh consumido por eles.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-slate-100 p-4 rounded-2xl flex gap-3.5 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-[#00B859] shrink-0 font-extrabold text-xs">
                01
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Renda Recorrente Mensal</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Você recebe bônus e comissões recorrentes todos os meses enquanto os clientes usarem energia.</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-4 rounded-2xl flex gap-3.5 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-[#00B859] shrink-0 font-extrabold text-xs">
                02
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Trabalhe de Onde Quiser</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Modelo de negócio altamente escalável, 100% digital e operado por celular ou computador.</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-4 rounded-2xl flex gap-3.5 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-[#00B859] shrink-0 font-extrabold text-xs">
                03
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Sem Barreiras de Vendas</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Não há necessidade de vender novos hábitos: todos já consomem energia e todos desejam pagar mais barato.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#00D166]/10 border border-[#00D166]/20 p-4.5 rounded-2xl space-y-2">
          <span className="text-[10px] font-extrabold text-[#00B859] block uppercase tracking-wider">🚀 Sucesso de Expansão</span>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Mais de 100.000 clientes ativos em todo o Brasil já economizam milhões de reais por meio dos licenciados iGreen.
          </p>
        </div>
      </div>

      {/* Main Interactive Column */}
      <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6" id="partner-quiz-interactive-column">
      <div className="space-y-6">
        {/* Progress header */}
        <div className="space-y-2 select-none">
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold tracking-wider uppercase">
            <span>Análise de Perfil Empreendedor</span>
            <span>Passo {currentStep} de {totalSteps}</span>
          </div>
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#00D166]"
              initial={{ width: '0%' }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Dynamic step body */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="space-y-5"
          >
            {/* STEP 1: NOME COMPLETO */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h2 className="text-xl font-extrabold text-[#111827] tracking-tight">
                    Para iniciarmos a sua análise, qual é o seu nome completo?
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Sua licença comercial de parceiro iGreen será emitida e associada a este nome.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={answers.nome || ''}
                      onChange={(e) => {
                        onChangeAnswers({ ...answers, nome: e.target.value });
                      }}
                      placeholder="Digite seu nome completo"
                      className="w-full py-4 px-4 bg-slate-50 border border-slate-100 text-sm font-bold rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00D166] focus:bg-white transition-all focus:border-[#00D166]"
                      autoFocus
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: OBJETIVO */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h2 className="text-xl font-extrabold text-[#111827] tracking-tight">
                    O que você busca conquistando sua parceria com a iGreen?
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Selecione o principal objetivo que motiva você hoje.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { key: 'Renda extra', label: 'Renda Extra', desc: 'Complementar ganhos mensais nas horas livres.', icon: TrendingUp },
                    { key: 'Renda principal', label: 'Renda Principal', desc: 'Fazer deste o meu negócio principal.', icon: Briefcase },
                    { key: 'Crescimento profissional', label: 'Crescimento Profissional', desc: 'Desenvolver novas habilidades de liderança.', icon: Award },
                    { key: 'Empreender', label: 'Empreender', desc: 'Criar um negócio altamente escalável na minha região.', icon: Rocket }
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = answers.objetivo === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => handleOptionSelect('objetivo', item.key)}
                        className={`w-full text-left p-4 rounded-xl border flex items-center gap-4 transition-all duration-200 active:scale-[0.99] cursor-pointer ${
                          isSelected 
                            ? 'border-[#00D166] bg-[#00D166]/5 shadow-sm' 
                            : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#00D166]/10 text-[#00B859]' : 'bg-slate-50 text-slate-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold text-sm leading-snug ${isSelected ? 'text-[#00B859]' : 'text-[#111827]'}`}>
                            {item.label}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate">{item.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                          isSelected ? 'border-[#00D166] bg-[#00D166]' : 'border-slate-200 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white stroke-[3px]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: TEMPO DE DEDICAÇÃO */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h2 className="text-xl font-extrabold text-[#111827] tracking-tight">
                    Quanto tempo você pode dedicar à sua franquia?
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Você define seus próprios horários. Seja realista com sua disponibilidade.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { key: 'Poucas horas', label: 'Poucas horas por semana', desc: 'Até 10 horas semanais flexíveis.', icon: Clock },
                    { key: 'Meio período', label: 'Meio período', desc: 'Entre 15 e 25 horas semanais.', icon: Calendar },
                    { key: 'Período integral', label: 'Período integral', desc: 'Dedicação total ao negócio (+35h/semana).', icon: Zap }
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = answers.dedicacao === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => handleOptionSelect('dedicacao', item.key)}
                        className={`w-full text-left p-4 rounded-xl border flex items-center gap-4 transition-all duration-200 active:scale-[0.99] cursor-pointer ${
                          isSelected 
                            ? 'border-[#00D166] bg-[#00D166]/5 shadow-sm' 
                            : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#00D166]/10 text-[#00B859]' : 'bg-slate-50 text-slate-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-bold text-sm leading-snug ${isSelected ? 'text-[#00B859]' : 'text-[#111827]'}`}>
                            {item.label}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                          isSelected ? 'border-[#00D166] bg-[#00D166]' : 'border-slate-200 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white stroke-[3px]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: META DE RENDA */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h2 className="text-xl font-extrabold text-[#111827] tracking-tight">
                    Qual meta de ganhos recorrentes mais atrai você?
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Selecione a faixa de ganho mensal que sanaria suas necessidades hoje.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { key: 'R$1.000 a R$3.000', label: 'R$ 1.000 a R$ 3.000', desc: 'Renda complementar para alavancagem financeira.', icon: Coins },
                    { key: 'R$3.000 a R$5.000', label: 'R$ 3.000 a R$ 5.000', desc: 'Renda sólida equivalente a cargo executivo.', icon: DollarSign },
                    { key: 'R$5.000 a R$10.000', label: 'R$ 5.000 a R$ 10.000', desc: 'Independência financeira de alta performance.', icon: Wallet },
                    { key: 'Acima de R$10.000', label: 'Acima de R$ 10.000', desc: 'Construção de ativos recorrentes de alta escala.', icon: Flame }
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = answers.metaRenda === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => handleOptionSelect('metaRenda', item.key)}
                        className={`w-full text-left p-4 rounded-xl border flex items-center gap-4 transition-all duration-200 active:scale-[0.99] cursor-pointer ${
                          isSelected 
                            ? 'border-[#00D166] bg-[#00D166]/5 shadow-sm' 
                            : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#00D166]/10 text-[#00B859]' : 'bg-slate-50 text-slate-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-bold text-sm leading-snug ${isSelected ? 'text-[#00B859]' : 'text-[#111827]'}`}>
                            {item.label}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                          isSelected ? 'border-[#00D166] bg-[#00D166]' : 'border-slate-200 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white stroke-[3px]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 5: EXPERIÊNCIA VENDAS */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h2 className="text-xl font-extrabold text-[#111827] tracking-tight">
                    Você já trabalhou com vendas ou comercial?
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Não exigimos experiência! Oferecemos treinamentos semanais e material gratuito de suporte.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { key: 'Sim', label: 'Sim, já possuo experiência', desc: 'Tenho facilidade para lidar com público e fechar negócios.', icon: ThumbsUp },
                    { key: 'Não', label: 'Não, mas quero aprender', desc: 'Vou utilizar o material e capacitações da iGreen.', icon: HelpCircle }
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = answers.experienciaVendas === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => handleOptionSelect('experienciaVendas', item.key)}
                        className={`w-full text-left p-4 rounded-xl border flex items-center gap-4 transition-all duration-200 active:scale-[0.99] cursor-pointer ${
                          isSelected 
                            ? 'border-[#00D166] bg-[#00D166]/5 shadow-sm' 
                            : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#00D166]/10 text-[#00B859]' : 'bg-slate-50 text-slate-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-bold text-sm leading-snug ${isSelected ? 'text-[#00B859]' : 'text-[#111827]'}`}>
                            {item.label}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                          isSelected ? 'border-[#00D166] bg-[#00D166]' : 'border-slate-200 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white stroke-[3px]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 6: INVESTIMENTO */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h2 className="text-xl font-extrabold text-[#111827] tracking-tight">
                    Sobre a Ativação Comercial da sua Microfranquia
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Para obter sua Licença Comercial de Distribuição, ter acesso ao sistema de faturamento e suporte VIP, é necessária a ativação comercial no valor de <strong className="text-[#00B859] font-extrabold">R$ 1.997,00 à vista</strong> ou <strong className="text-[#00B859] font-extrabold">12x de R$ 197,00</strong>. Qual sua situação atual para essa etapa?
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { key: 'R$ 1.997 ou 12x de R$ 197', label: 'Sim, tenho limite ou saldo', desc: 'Desejo realizar a ativação imediata de R$ 1.997 ou 12x R$ 197 para começar.', icon: Wallet },
                    { key: 'Interesse com dúvida', label: 'Tenho interesse, mas preciso de detalhes', desc: 'Gostaria de uma breve ligação para entender o retorno sobre o investimento.', icon: Coins },
                    { key: 'Nenhum valor agora', label: 'Não possuo essa capacidade financeira', desc: 'No momento atual, não tenho capacidade de investimento para iniciar.', icon: AlertCircle }
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = answers.investimento === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => handleOptionSelect('investimento', item.key)}
                        className={`w-full text-left p-4 rounded-xl border flex items-center gap-4 transition-all duration-200 active:scale-[0.99] cursor-pointer ${
                          isSelected 
                            ? 'border-[#00D166] bg-[#00D166]/5 shadow-sm' 
                            : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#00D166]/10 text-[#00B859]' : 'bg-slate-50 text-slate-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-bold text-sm leading-snug ${isSelected ? 'text-[#00B859]' : 'text-[#111827]'}`}>
                            {item.label}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                          isSelected ? 'border-[#00D166] bg-[#00D166]' : 'border-slate-200 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white stroke-[3px]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 7: WHATSAPP */}
            {currentStep === 7 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h2 className="text-xl font-extrabold text-[#111827] tracking-tight flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-[#00D166]" />
                    Qual é o seu WhatsApp de contato?
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Precisamos de um contato válido para enviar sua proposta de franquia e o link do seu dashboard exclusivo.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="tel"
                      value={answers.whatsapp}
                      onChange={handlePhoneChange}
                      placeholder="(31) 99999-9999"
                      className={`w-full py-4 px-4 bg-slate-50 border text-sm font-bold tracking-wide rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00D166] focus:bg-white transition-all ${
                        phoneError ? 'border-red-500 focus:ring-red-500' : 'border-slate-100'
                      }`}
                    />
                  </div>

                  {phoneError && (
                    <p className="text-xs text-red-500 flex items-center gap-1.5 px-1 animate-pulse">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {phoneError}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 8: EMAIL */}
            {currentStep === 8 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h2 className="text-xl font-extrabold text-[#111827] tracking-tight flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[#00D166]" />
                    Qual é o seu melhor e-mail corporativo?
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Enviaremos sua ficha cadastral pré-aprovada e os manuais do parceiro por este endereço.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      value={answers.email}
                      onChange={(e) => {
                        onChangeAnswers({ ...answers, email: e.target.value });
                        setEmailError('');
                      }}
                      placeholder="nome@email.com"
                      className={`w-full py-4 px-4 bg-slate-50 border text-sm font-bold rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00D166] focus:bg-white transition-all ${
                        emailError ? 'border-red-500 focus:ring-red-500' : 'border-slate-100'
                      }`}
                    />
                  </div>

                  {emailError && (
                    <p className="text-xs text-red-500 flex items-center gap-1.5 px-1 animate-pulse">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {emailError}
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Persistent Nav Actions */}
      <div className="flex justify-between items-center gap-4 pt-6 border-t border-slate-100/60 mt-8">
        <button
          onClick={handlePrev}
          className="flex items-center gap-2 text-xs font-bold py-3.5 px-5 rounded-xl border border-slate-100 text-slate-600 bg-white hover:bg-slate-50 transition-all cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{currentStep === 1 ? 'Início' : 'Voltar'}</span>
        </button>

        <button
          onClick={handleNext}
          disabled={!isStepValid()}
          className={`flex items-center gap-2 text-xs font-bold py-3.5 px-6 rounded-xl transition-all cursor-pointer select-none ${
            isStepValid()
              ? 'bg-[#00D166] text-white hover:bg-[#00B859] active:scale-95 hover:shadow-lg hover:shadow-[#00D166]/10'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>{currentStep === totalSteps ? 'Finalizar Análise' : 'Avançar'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
  );
}
