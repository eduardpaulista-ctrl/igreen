import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Sparkles, ShieldCheck, ArrowRight, ArrowLeft, Award, DollarSign, Users, Briefcase, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';

interface BusinessPresentationProps {
  userName?: string;
  onBackToHome?: () => void;
  flowType?: 'customer' | 'partner';
}

export default function BusinessPresentation({ userName, onBackToHome, flowType: propFlowType }: BusinessPresentationProps) {
  const [flowType, setFlowType] = useState<'customer' | 'partner'>('partner');

  useEffect(() => {
    if (propFlowType) {
      setFlowType(propFlowType);
    } else {
      try {
        const params = new URLSearchParams(window.location.search);
        const flowParam = params.get('flow');
        if (flowParam === 'customer' || flowParam === 'partner') {
          setFlowType(flowParam);
        }
      } catch (e) {
        console.error('Failed to parse flow parameter from URL:', e);
      }
    }
  }, [propFlowType]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  
  const [duration, setDuration] = useState(559); // Fallback to 9:19 (559s) until metadata is loaded
  
  // High quality royalty free video stream of green energy
  const videoSource = flowType === 'customer'
    ? "https://webdu.com.br/wp-content/uploads/2026/07/WhatsApp-Video-2026-07-06-at-17.26.49.mp4"
    : "https://webdu.com.br/wp-content/uploads/2026/07/WhatsApp-Video-2026-07-04-at-12.19.57.mp4";

  // Shareholder subscription URL
  const SHAREHOLDER_URL = "https://expansao.igreenenergy.com.br/?id=154061";

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.log("Play blocked: ", err);
        setIsPlaying(true);
      });
    }
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    const videoDuration = videoRef.current.duration || duration || 1;
    setProgress((videoRef.current.currentTime / videoDuration) * 100);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 559);
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    
    const videoDuration = videoRef.current.duration || duration || 1;
    videoRef.current.currentTime = percentage * videoDuration;
    
    setCurrentTime(percentage * videoDuration);
    setProgress(percentage * 100);
  };

  const handleFullScreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-10 animate-fade-in select-none">
      
      {/* Back button */}
      {onBackToHome && (
        <div className="flex justify-start">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs font-bold py-2.5 px-4 rounded-xl border border-slate-100 text-slate-600 bg-white hover:bg-slate-50 transition-all cursor-pointer active:scale-95"
            id="presentation-back-button"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao início</span>
          </button>
        </div>
      )}
      
      {/* 1. Header with Powerful Captivating Hook */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1.5 bg-[#F0FDF4] text-[#00B859] font-extrabold text-[10px] md:text-xs py-1 px-4 rounded-full border border-[#00D166]/20 uppercase tracking-widest animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-[#00D166]" />
          {flowType === 'customer' ? 'Simulação Concluída · Economia Ativa' : 'Apresentação Oficial de Negócios iGreen'}
        </span>
        
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
          {flowType === 'customer' 
            ? (userName ? `${userName}, veja como ativar seu desconto de até 20%!` : 'Veja como ativar seu desconto de até 20%!')
            : (userName ? `${userName}, assista à Apresentação do Negócio do Século!` : 'Assista à Apresentação do Negócio do Século!')
          }
        </h1>
        
        <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
          {flowType === 'customer'
            ? 'Assista ao vídeo explicativo de 9 minutos para entender a nossa tecnologia de energia sustentável e garanta sua redução de tarifa mensal sem custos de adesão.'
            : <>Descubra como construir uma <strong className="text-slate-800 font-extrabold">Renda Recorrente Exponencial</strong> ajudando pessoas e empresas a economizarem em suas contas de luz, sem que precisem investir nada para isso.</>
          }
        </p>
      </div>

      {/* 2. Responsive 2-Column layout: Video on Left, Copy & CTA on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
        
        {/* Left: Beautiful Custom Responsive Video Player (supports both 9:16 and 16:9) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className={`w-full transition-all duration-500 ease-in-out space-y-4 ${aspectRatio === '9:16' ? 'max-w-[360px] md:max-w-[380px]' : 'max-w-2xl'}`}>
            
            {/* Aspect Ratio Switcher Controls */}
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200/60 p-2 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-2">
                Formato do Vídeo
              </span>
              <div className="flex bg-slate-200/60 p-1 rounded-xl text-[10px] font-extrabold gap-1">
                <button
                  onClick={() => setAspectRatio('9:16')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${aspectRatio === '9:16' ? 'bg-white text-[#00B859] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Vertical (9:16)
                </button>
                <button
                  onClick={() => setAspectRatio('16:9')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${aspectRatio === '16:9' ? 'bg-white text-[#00B859] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Horizontal (16:9)
                </button>
              </div>
            </div>

            {flowType === 'partner' ? (
              <div 
                className={`relative w-full rounded-[32px] bg-slate-950 overflow-hidden shadow-2xl border-4 border-slate-900/10 hover:shadow-[#00D166]/10 transition-all duration-500 group ${aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-[16/9]'}`}
                id="presentation-player-container"
              >
                <iframe
                  src="https://www.youtube.com/embed/25u4W7-cVBA?autoplay=1&rel=0"
                  title="Apresentação iGreen"
                  className="w-full h-full border-0 absolute inset-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                {/* Status Indicator */}
                <div className="absolute top-4 left-4 bg-[#00D166]/90 text-white font-extrabold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow z-10 pointer-events-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  DURANTE A APRESENTAÇÃO
                </div>
              </div>
            ) : (
              <div 
                onClick={handlePlayPause}
                className={`relative w-full rounded-[32px] bg-slate-950 overflow-hidden shadow-2xl border-4 border-slate-900/10 hover:shadow-[#00D166]/10 transition-all duration-500 cursor-pointer group ${aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-[16/9]'}`}
                id="presentation-player-container"
              >
                <video
                  ref={videoRef}
                  src={videoSource}
                  className="w-full h-full object-cover brightness-[0.80] transition-all duration-500 group-hover:scale-102"
                  loop
                  muted={isMuted}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  playsInline
                />

                {/* Ambient glass overlay when playing */}
                {isPlaying && (
                  <div className="absolute inset-0 bg-[#00D166]/5 pointer-events-none mix-blend-overlay" />
                )}

                {/* Custom Play/Pause Overlay */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all group-hover:bg-black/30">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-20 h-20 rounded-full bg-[#00D166] flex items-center justify-center text-white shadow-xl shadow-[#00D166]/30 relative z-10"
                    >
                      <div className="absolute inset-0 rounded-full bg-[#00D166] animate-ping opacity-35" />
                      <Play className="w-8 h-8 fill-current translate-x-1" />
                    </motion.div>
                    <span className="text-white text-xs font-bold mt-4 tracking-wider uppercase drop-shadow bg-black/40 px-3 py-1 rounded-full">
                      Clique para Iniciar
                    </span>
                  </div>
                )}

                {/* Controls Overlay at Bottom */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 pt-12 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  
                  {/* Custom Seek Bar */}
                  <div 
                    onClick={handleProgressBarClick}
                    className="w-full h-1.5 bg-white/25 rounded-full overflow-hidden cursor-pointer relative hover:h-2 transition-all group/bar"
                  >
                    <div 
                      className="h-full bg-[#00D166] rounded-full relative transition-all" 
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border border-[#00D166] rounded-full shadow opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-3.5">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handlePlayPause(); }}
                        className="hover:text-[#00D166] transition-colors focus:outline-none"
                      >
                        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                      </button>
                      
                      <button 
                        onClick={handleMuteToggle}
                        className="hover:text-[#00D166] transition-colors focus:outline-none"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>

                      <span className="text-[11px] font-mono opacity-90 select-none bg-black/40 px-2 py-0.5 rounded">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <button 
                      onClick={handleFullScreen}
                      className="hover:text-[#00D166] transition-colors focus:outline-none"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="absolute top-4 left-4 bg-[#00D166]/90 text-white font-extrabold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  DURANTE A APRESENTAÇÃO
                </div>
              </div>
            )}
            </div>
        </div>

        {/* Right: Pitch & Call To Action */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
              {flowType === 'customer' ? 'COMO FUNCIONA O SEU DESCONTO?' : 'POR QUE ATUAR COM A IGREEN?'}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {flowType === 'customer' 
                ? 'Reduza sua conta de luz todo mês sem gastar nada com isso!'
                : 'Torne-se um Acionista e participe dos lucros das faturas de energia!'
              }
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              {flowType === 'customer'
                ? 'Nossa tecnologia conecta usinas parceiras de energia limpa direto à sua rede. O desconto é aplicado de forma 100% digital e automática na sua fatura de sempre, sem taxas ou obras.'
                : 'O mercado de energia livre está sendo totalmente descentralizado. A iGreen Energy permite que você adquira uma licença para ser um distribuidor autorizado e receba comissões mensais recorrentes sempre que seus clientes pagarem a conta de luz.'
              }
            </p>
          </div>

          {/* Core Highlights */}
          <div className="space-y-3.5">
            {(flowType === 'customer' ? [
              { icon: TrendingDown, text: "Ganhe até 20% de desconto na sua conta de energia de todos os meses de forma recorrente.", title: "Economia Inteligente" },
              { icon: ShieldCheck, text: "Não precisa de placas solares, obras no telhado ou taxas de adesão.", title: "Sem Investimento ou Obras" },
              { icon: Sparkles, text: "Processo digital seguro integrado com a sua concessionária local (ANEEL).", title: "Tecnologia Homologada" }
            ] : [
              { icon: DollarSign, text: "Faturamento recorrente todo mês sobre o consumo de energia.", title: "Renda Passiva Real" },
              { icon: Award, text: "Treinamentos diários, mentoria de líderes e material gráfico oficial.", title: "Suporte VIP e Capacitação" },
              { icon: Users, text: "Atue 100% online ou presencial em qualquer região homologada.", title: "Flexibilidade Total de Trabalho" }
            ]).map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-white border border-slate-100 p-4 rounded-2xl flex gap-3.5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-[#00B859] shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Premium Call to Action Area */}
          <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-2xl p-4.5 space-y-4 text-center lg:text-left">
            <div className="space-y-1">
              <span className="text-[10px] bg-[#00D166]/10 text-[#00B859] font-extrabold px-2.5 py-1 rounded-md inline-block uppercase tracking-wider">
                {flowType === 'customer' ? 'Desconto Disponível' : 'Vagas de Ativação Limitadas'}
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {flowType === 'customer'
                  ? 'Clique no botão abaixo para acessar o portal oficial de conexão e ativar o desconto da sua conta de luz em minutos.'
                  : 'Clique no botão abaixo para acessar o portal oficial de credenciamento e garantir sua licença comercial com suporte VIP.'
                }
              </p>
            </div>

            <a
              href={flowType === 'customer' 
                ? "https://green.igreenenergy.com.br/?id=154061"
                : SHAREHOLDER_URL
              }
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#00D166] hover:bg-[#00B859] active:scale-[0.98] text-white font-display font-extrabold text-sm py-4 px-6 rounded-xl flex items-center justify-center gap-2.5 shadow-lg shadow-[#00D166]/20 transition-all cursor-pointer relative overflow-hidden group"
            >
              <span>{flowType === 'customer' ? 'Ativar meu Desconto' : 'Seja um Acionista iGreen Energy'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </a>
          </div>

          {/* Footer of card / Reset */}
          {onBackToHome && (
            <div className="text-center lg:text-left pt-2">
              <button
                onClick={onBackToHome}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors select-none"
              >
                ← Voltar para tela inicial
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
