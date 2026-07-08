import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

interface HeaderProps {
  isFullPage?: boolean;
}

export default function Header({ isFullPage }: HeaderProps) {
  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100 py-3.5 px-6 sticky top-0 z-40 transition-all">
      <div className={`mx-auto flex items-center justify-between transition-all duration-500 ${isFullPage ? 'max-w-7xl' : 'max-w-md'}`}>
        {/* Logo iGreen */}
        <a 
          href="https://www.igreenenergy.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center select-none cursor-pointer"
          id="header-logo-link"
        >
          <img 
            src="https://webdu.com.br/wp-content/uploads/2026/07/Design-sem-nome-2.png" 
            alt="iGreen Energy" 
            className="h-8 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </a>

        {/* Security / Trust Badge */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100/80 rounded-full py-1 px-3">
          <Shield className="w-3 h-3 text-[#00D166]" />
          <span className="text-[9px] font-bold text-slate-500 tracking-tight">CONEXÃO SEGURA</span>
          <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>
    </header>
  );
}
