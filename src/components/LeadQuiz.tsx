import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, Search, Smartphone, Mail, AlertCircle, Building, User, Leaf, Home, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QuizAnswers } from '../types';
import { BRAZIL_STATES } from '../data/brazilStates';

interface LeadQuizProps {
  answers: QuizAnswers;
  onChangeAnswers: (newAnswers: QuizAnswers) => void;
  onFinish: () => void;
  onTriggerEvent: (name: string, payload: any) => void;
  onBackToHome?: () => void;
}

export default function LeadQuiz({
  answers,
  onChangeAnswers,
  onFinish,
  onTriggerEvent,
  onBackToHome
}: LeadQuizProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;

  // Search filter for state step
  const [stateSearch, setStateSearch] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Auto scroll to top when changing steps to maintain app feel
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onTriggerEvent('quiz_step_view', { step: currentStep });
  }, [currentStep]);

  const percentage = Math.round(((currentStep - 1) / totalSteps) * 100);

  // Brazilian WhatsApp Mask
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const digitsOnly = rawValue.replace(/\D/g, '');
    
    // Masking logic
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
    // Verify first digit of the number is 9 (most cell phones in Brazil start with 9)
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
    if (currentStep === 7) {
      const error = validatePhone(answers.whatsapp);
      if (error) {
        setPhoneError(error);
        onTriggerEvent('quiz_validation_failed', { field: 'whatsapp', error });
        return;
      }
    }
    if (currentStep === 8) {
      const error = validateEmail(answers.email);
      if (error) {
        setEmailError(error);
        onTriggerEvent('quiz_validation_failed', { field: 'email', error });
        return;
      }
      onTriggerEvent('quiz_completed', answers);
      onFinish();
      return;
    }

    onTriggerEvent('quiz_step_complete', { step: currentStep, answer: getCurrentAnswer() });
    setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else if (onBackToHome) {
      onBackToHome();
    }
  };

  const handleOptionSelect = (fieldName: keyof QuizAnswers, value: any) => {
    onChangeAnswers({ ...answers, [fieldName]: value });
    onTriggerEvent('quiz_option_selected', { fieldName, value });
    
    // Smooth auto-advance on option clicks for frictionless progression
    setTimeout(() => {
      setCurrentStep(prev => {
        if (prev < 7) return prev + 1;
        return prev;
      });
    }, 150);
  };

  const getCurrentAnswer = () => {
    switch(currentStep) {
      case 1: return answers.nome;
      case 2: return answers.perfil;
      case 3: return answers.consumo;
      case 4: return answers.estado;
      case 5: return answers.imovelProprio;
      case 6: return answers.querEconomizar;
      case 7: return answers.whatsapp;
      case 8: return answers.email;
      default: return '';
    }
  };

  const isStepValid = () => {
    const ans = getCurrentAnswer() || '';
    if (currentStep === 1) {
      return ans.trim().length >= 3;
    }
    if (currentStep === 7) {
      return ans.replace(/\D/g, '').length >= 10;
    }
    if (currentStep === 8) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ans);
    }
    return ans !== '';
  };

  // Filter Brazilian States based on search
  const filteredStates = BRAZIL_STATES.filter(st => 
    st.name.toLowerCase().includes(stateSearch.toLowerCase()) || 
    st.id.toLowerCase().includes(stateSearch.toLowerCase())
  );

  // Popular/most populated states in Brazil for quick selection
  const popularStates = ['SP', 'MG', 'RJ', 'BA', 'PR', 'RS', 'GO'];

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch py-6 px-4 md:px-6 select-none" id="quiz-container">
      
      {/* Brand & Testimonials Side panel - Hidden on Mobile */}
      <div className="hidden lg:flex lg:col-span-5 flex-col justify-between bg-slate-50 border border-slate-100 rounded-[32px] p-8 space-y-8 animate-fade-in select-none">
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 bg-[#F0FDF4] text-[#00B859] font-extrabold text-[10px] py-1 px-3.5 rounded-full border border-[#00D166]/20 uppercase tracking-widest">
              iGreen Energy
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Economize na sua conta de luz sem gastar nada!
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Você está prestes a ingressar no melhor programa de energia compartilhada do Brasil. Ao responder a simulação, analisamos a sua distribuidora para gerar créditos automáticos na sua conta.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-slate-100 p-4 rounded-2xl flex gap-3.5 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-[#00B859] shrink-0 font-extrabold text-xs">
                01
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Sem Investimentos</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Não precisa comprar painel solar, fazer obras ou alterações na fiação.</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-4 rounded-2xl flex gap-3.5 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-[#00B859] shrink-0 font-extrabold text-xs">
                02
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Desconto Garantido</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Sua fatura de energia vem com desconto garantido todos os meses de forma sustentável.</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-4 rounded-2xl flex gap-3.5 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-[#00B859] shrink-0 font-extrabold text-xs">
                03
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Processo 100% Digital</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Simulação rápida e ativação online segura sem burocracias.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#00D166]/10 border border-[#00D166]/20 p-4.5 rounded-2xl space-y-2">
          <span className="text-[10px] font-extrabold text-[#00B859] block uppercase tracking-wider">🔒 Conexão Criptografada</span>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Seus dados de faturamento estão totalmente protegidos sob conformidade rígida da LGPD (Lei Geral de Proteção de Dados).
          </p>
        </div>
      </div>

      {/* Main Interactive Column */}
      <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6" id="quiz-interactive-column">
      
      {/* Upper Navigation & Progress */}
      <div className="space-y-4">
        {/* Step indicator */}
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 tracking-wider uppercase">
          <button 
            onClick={handlePrev}
            className="flex items-center gap-1 transition-all hover:text-slate-800 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {currentStep === 1 ? 'Início' : 'Voltar'}
          </button>
          <span>Pergunta {currentStep} de {totalSteps}</span>
          <span className="text-brand-primary-dark font-mono">{percentage}%</span>
        </div>

        {/* Progress Bar with neon green glow */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200/40">
          <motion.div 
            className="h-full bg-gradient-to-r from-brand-primary to-brand-primary-dark rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Slide & Fade Question Block */}
      <div className="flex-1 my-6 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="space-y-5"
          >
            {/* PERGUNTA 1: NOME COMPLETO */}
            {currentStep === 1 && (
              <div className="space-y-4 text-center">
                <div className="space-y-1">
                  <span className="text-[9px] bg-brand-light border border-brand-primary/20 text-brand-primary-dark font-bold px-2 py-0.5 rounded-full select-none inline-block">
                    CONEXÃO SEGURA
                  </span>
                  <h3 className="text-xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
                    Para começarmos, qual é o seu nome completo?
                  </h3>
                  <p className="text-xs text-slate-500">
                    Queremos personalizar sua simulação de forma profissional e exclusiva.
                  </p>
                </div>

                <div className="max-w-sm mx-auto space-y-3 text-left">
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={answers.nome || ''}
                      onChange={(e) => {
                        onChangeAnswers({ ...answers, nome: e.target.value });
                      }}
                      placeholder="Digite seu nome completo"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none transition-all focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
                      autoFocus
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PERGUNTA 2: PERFIL */}
            {currentStep === 2 && (
              <div className="space-y-4 text-center">
                <div className="space-y-1">
                  <h3 className="text-xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
                    Qual é o seu perfil de consumo?
                  </h3>
                  <p className="text-xs text-slate-500">
                    Isso nos ajuda a categorizar as melhores tarifas de compensação energética.
                  </p>
                </div>

                <div className="space-y-2.5 max-w-sm mx-auto text-left">
                  {[
                    { value: 'Pessoa Física', label: 'Pessoa Física', sub: 'Para minha residência ou apartamento', icon: User },
                    { value: 'Empresa', label: 'Empresa / Comércio', sub: 'Para estabelecimentos, escritórios e CNPJ', icon: Building },
                    { value: 'Produtor Rural', label: 'Produtor Rural', sub: 'Chácaras, fazendas e atividades agrícolas', icon: Leaf },
                    { value: 'Condomínio', label: 'Condomínio', sub: 'Áreas comuns, residenciais ou comerciais', icon: Home }
                  ].map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = answers.perfil === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleOptionSelect('perfil', opt.value)}
                        className={`w-full p-4 rounded-xl border text-left flex items-center justify-between gap-4 transition-all duration-300 group cursor-pointer ${
                          isSelected 
                            ? 'border-brand-primary bg-brand-light ring-1 ring-brand-primary shadow-sm shadow-brand-primary/10' 
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-brand-gray-light'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            isSelected ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">{opt.label}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{opt.sub}</span>
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected ? 'border-brand-primary bg-brand-primary text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[4]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PERGUNTA 3: CONTA DE ENERGIA */}
            {currentStep === 3 && (
              <div className="space-y-4 text-center">
                <div className="space-y-1">
                  <h3 className="text-xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
                    Quanto você paga aproximadamente na conta de energia?
                  </h3>
                  <p className="text-xs text-slate-500">
                    Selecione o valor médio dos últimos meses.
                  </p>
                </div>

                <div className="space-y-2.5 max-w-sm mx-auto text-left">
                  {[
                    { value: 'Até R$300', label: 'Até R$ 300', sub: 'Ideal para apartamentos e casas compactas' },
                    { value: 'R$300 a R$700', label: 'R$ 300 a R$ 700', sub: 'Consumo intermediário residencial' },
                    { value: 'R$700 a R$1500', label: 'R$ 700 a R$ 1.500', sub: 'Residências grandes ou pequenos comércios' },
                    { value: 'Mais de R$1500', label: 'Mais de R$ 1.500', sub: 'Indústrias, comércios maiores ou agro' }
                  ].map((opt) => {
                    const isSelected = answers.consumo === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleOptionSelect('consumo', opt.value)}
                        className={`w-full p-4 rounded-xl border text-left flex items-center justify-between gap-4 transition-all duration-300 group cursor-pointer ${
                          isSelected 
                            ? 'border-brand-primary bg-brand-light ring-1 ring-brand-primary shadow-sm shadow-brand-primary/10' 
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-brand-gray-light'
                        }`}
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">{opt.label}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{opt.sub}</span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected ? 'border-brand-primary bg-brand-primary text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[4]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PERGUNTA 4: ESTADO */}
            {currentStep === 4 && (
              <div className="space-y-4 text-center">
                <div className="space-y-1">
                  <h3 className="text-xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
                    Em qual estado você mora?
                  </h3>
                  <p className="text-xs text-slate-500">
                    A iGreen possui parcerias específicas com concessionárias estaduais.
                  </p>
                </div>

                <div className="max-w-sm mx-auto space-y-3">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={stateSearch}
                      onChange={(e) => setStateSearch(e.target.value)}
                      placeholder="Pesquisar seu estado (Ex: Minas Gerais)..."
                      className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* Popular states shortcuts */}
                  {stateSearch === '' && (
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {popularStates.map(stId => {
                        const stateObj = BRAZIL_STATES.find(s => s.id === stId);
                        if (!stateObj) return null;
                        const isSelected = answers.estado === stateObj.name;
                        return (
                          <button
                            key={stId}
                            onClick={() => handleOptionSelect('estado', stateObj.name)}
                            className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-brand-primary border-brand-primary text-white'
                                : 'bg-slate-100 border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            {stateObj.id}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Scrollable states selection */}
                  <div className="border border-slate-100 bg-white rounded-2xl h-44 overflow-y-auto p-1.5 text-left space-y-1">
                    {filteredStates.length === 0 ? (
                      <span className="text-slate-400 text-center block text-xs py-10">Nenhum estado localizado.</span>
                    ) : (
                      filteredStates.map((st) => {
                        const isSelected = answers.estado === st.name;
                        return (
                          <button
                            key={st.id}
                            onClick={() => handleOptionSelect('estado', st.name)}
                            className={`w-full px-3 py-2 rounded-lg text-xs font-semibold text-left flex items-center justify-between transition-colors cursor-pointer ${
                              isSelected 
                                ? 'bg-brand-light text-brand-primary-dark' 
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <span>{st.name} ({st.id})</span>
                            <span className="text-[9px] text-slate-400 font-normal">{st.region}</span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PERGUNTA 5: IMÓVEL PRÓPRIO */}
            {currentStep === 5 && (
              <div className="space-y-4 text-center">
                <div className="space-y-1">
                  <h3 className="text-xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
                    Você possui imóvel próprio?
                  </h3>
                  <p className="text-xs text-slate-500">
                    O benefício iGreen também é aplicável para imóveis alugados!
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                  {[
                    { value: 'Sim', label: 'Sim, é meu', desc: 'Proprietário' },
                    { value: 'Não', label: 'Não, alugado', desc: 'Inquilino/Aluguel' }
                  ].map((opt) => {
                    const isSelected = answers.imovelProprio === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleOptionSelect('imovelProprio', opt.value)}
                        className={`p-5 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                          isSelected 
                            ? 'border-brand-primary bg-brand-light ring-1 ring-brand-primary shadow-sm' 
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-brand-gray-light'
                        }`}
                      >
                        <span className="text-xs font-extrabold text-slate-800">{opt.label}</span>
                        <span className="text-[9px] text-slate-400 font-medium">{opt.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PERGUNTA 6: ECONOMIZAR ATÉ 20% SEM PLACAS */}
            {currentStep === 6 && (
              <div className="space-y-4 text-center">
                <div className="space-y-1">
                  <h3 className="text-xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
                    Gostaria de economizar até 20% na conta sem instalar placas solares?
                  </h3>
                  <p className="text-xs text-slate-500">
                    Nossa tecnologia distribui energia de fazendas solares diretamente para a rede comum.
                  </p>
                </div>

                <div className="space-y-2.5 max-w-sm mx-auto text-left">
                  {[
                    { value: 'Sim', label: 'Sim! Com certeza', desc: 'Quero obter o desconto máximo imediato' },
                    { value: 'Quero entender melhor', label: 'Quero entender melhor', desc: 'Como economizar sem investir ou fazer obras' }
                  ].map((opt) => {
                    const isSelected = answers.querEconomizar === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleOptionSelect('querEconomizar', opt.value)}
                        className={`w-full p-4 rounded-xl border text-left flex items-center justify-between gap-4 transition-all duration-300 cursor-pointer ${
                          isSelected 
                            ? 'border-brand-primary bg-brand-light ring-1 ring-brand-primary shadow-sm' 
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-brand-gray-light'
                        }`}
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">{opt.label}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{opt.desc}</span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected ? 'border-brand-primary bg-brand-primary text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[4]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PERGUNTA 7: WHATSAPP */}
            {currentStep === 7 && (
              <div className="space-y-4 text-center">
                <div className="space-y-1">
                  <span className="text-[9px] bg-brand-light border border-brand-primary/20 text-brand-primary-dark font-bold px-2 py-0.5 rounded-full select-none inline-block">
                    ETAPA DE SEGURANÇA
                  </span>
                  <h3 className="text-xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
                    Qual é o seu WhatsApp de contato?
                  </h3>
                  <p className="text-xs text-slate-500">
                    Necessário para enviarmos o resultado oficial do seu estudo de economia.
                  </p>
                </div>

                <div className="max-w-sm mx-auto space-y-3 text-left">
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={answers.whatsapp}
                      onChange={handlePhoneChange}
                      placeholder="(DD) 9XXXX-XXXX"
                      className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-sm font-semibold tracking-wide outline-none transition-all ${
                        phoneError ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary'
                      }`}
                      autoFocus
                    />
                  </div>

                  {phoneError && (
                    <div className="flex items-center gap-1.5 text-red-500 text-[10px] font-semibold bg-red-50 p-2.5 rounded-lg border border-red-100">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{phoneError}</span>
                    </div>
                  )}

                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      Seus dados estão protegidos sob confidencialidade estrita. Não realizamos ligações indesejadas nem compartilhamos suas informações de contato.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* PERGUNTA 8: MELHOR E-MAIL */}
            {currentStep === 8 && (
              <div className="space-y-4 text-center">
                <div className="space-y-1">
                  <span className="text-[9px] bg-brand-light border border-brand-primary/20 text-brand-primary-dark font-bold px-2 py-0.5 rounded-full select-none inline-block">
                    CONCURSO DE BENEFÍCIOS
                  </span>
                  <h3 className="text-xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
                    Qual é o seu melhor e-mail?
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enviaremos um relatório detalhado com a projeção de economia anual por e-mail.
                  </p>
                </div>

                <div className="max-w-sm mx-auto space-y-3 text-left">
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={answers.email}
                      onChange={(e) => {
                        onChangeAnswers({ ...answers, email: e.target.value });
                        setEmailError('');
                      }}
                      placeholder="seuemail@exemplo.com"
                      className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-sm font-semibold outline-none transition-all ${
                        emailError ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary'
                      }`}
                      autoFocus
                    />
                  </div>

                  {emailError && (
                    <div className="flex items-center gap-1.5 text-red-500 text-[10px] font-semibold bg-red-50 p-2.5 rounded-lg border border-red-100">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{emailError}</span>
                    </div>
                  )}

                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      De acordo com a nossa Política de Privacidade, você pode solicitar a remoção ou exportação dos seus dados a qualquer momento com apenas um clique.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Persistent "Continuar" Action Row */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {currentStep === 1 ? 'Início' : 'Anterior'}
        </button>

        <button
          onClick={handleNext}
          disabled={!isStepValid()}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
            isStepValid()
              ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/15'
              : 'bg-slate-100 text-slate-400 border border-slate-200/50 cursor-not-allowed shadow-none'
          }`}
        >
          <span>{currentStep === totalSteps ? 'Finalizar Análise' : 'Continuar'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  </div>
  );
}
