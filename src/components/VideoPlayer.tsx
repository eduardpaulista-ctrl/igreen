import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // High quality royalty free video stream of green energy / tech loop
  const videoSource = "https://webdu.com.br/wp-content/uploads/2026/07/WhatsApp-Video-2026-07-04-at-12.19.57.mp4";

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.log("Auto-play blocked or error: ", err);
        // Fallback or toggle state anyway to simulate
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
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration || 1;
    setCurrentTime(current);
    setProgress((current / total) * 100);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 0);
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const newTime = percentage * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(percentage * 100);
  };

  const handleFullScreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  // Format time (e.g. 0:45)
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full space-y-5">
      {/* Title block matching Clean Minimalism template */}
      <div className="text-center space-y-2 px-1 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 bg-[#F0FDF4] text-[#00B859] font-bold text-[10px] py-1 px-3.5 rounded-full border border-[#00D166]/10 select-none uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-[#00D166] animate-pulse" />
          Apresentação Oficial iGreen
        </span>
        <h2 className="text-[24px] sm:text-[28px] font-extrabold text-[#111827] tracking-tight leading-tight">
          Descubra quanto você pode economizar.
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          Análise gratuita em menos de 2 minutos. Sem taxas de adesão ou obras.
        </p>
      </div>

      {/* Video Box */}
      <div 
        onClick={handlePlayPause}
        className="relative aspect-video w-full rounded-2xl bg-slate-950 overflow-hidden shadow-xl border border-slate-100 hover:shadow-brand-primary/5 transition-all duration-500 cursor-pointer group"
        id="player-container"
      >
        <video
          ref={videoRef}
          src={videoSource}
          className="w-full h-full object-cover brightness-[0.85] transition-all duration-500 group-hover:scale-105"
          loop
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          playsInline
        />

        {/* Ambient background glow when playing */}
        {isPlaying && (
          <div className="absolute inset-0 bg-brand-primary/5 pointer-events-none mix-blend-color-dodge transition-all" />
        )}

        {/* Custom Play/Pause Overlay Button */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px] transition-all group-hover:bg-black/20">
            <motion.div 
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 rounded-full bg-brand-primary flex items-center justify-center text-white shadow-lg shadow-brand-primary/40 relative"
            >
              <div className="absolute inset-0 rounded-full bg-brand-primary animate-ping opacity-30" />
              <Play className="w-6 h-6 fill-current translate-x-0.5" />
            </motion.div>
          </div>
        )}

        {/* Premium subtle glass controls at the bottom */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          
          {/* Interactive Progress Bar */}
          <div 
            onClick={handleProgressBarClick}
            className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer relative hover:h-2 transition-all group/bar"
          >
            <div 
              className="h-full bg-brand-primary rounded-full relative transition-all" 
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border border-brand-primary rounded-full shadow opacity-0 group-hover/bar:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <button 
                onClick={(e) => { e.stopPropagation(); handlePlayPause(); }}
                className="hover:text-brand-primary transition-colors focus:outline-none"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </button>
              
              <button 
                onClick={handleMuteToggle}
                className="hover:text-brand-primary transition-colors focus:outline-none"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <span className="text-[10px] font-mono opacity-80 select-none">
                {formatTime(currentTime)} / {formatTime(duration || 60)}
              </span>
            </div>

            <button 
              onClick={handleFullScreen}
              className="hover:text-brand-primary transition-colors focus:outline-none"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mute badge on top-right when playing */}
        {isPlaying && isMuted && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md rounded-full px-2.5 py-1 text-[9px] font-medium text-white/90 flex items-center gap-1 pointer-events-none">
            <VolumeX className="w-3 h-3" />
            Vídeo Mudo
          </div>
        )}
      </div>
    </div>
  );
}
