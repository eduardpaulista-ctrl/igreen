import React from 'react';
import { ShieldCheck, Instagram, Youtube, Globe, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-50/80 border-t border-slate-100 py-10 px-6 select-none mt-auto">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        
        {/* Main Footer Layout */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-6 border-b border-slate-200/50">
          
          {/* Brand Logo and Description */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <a 
              href="https://www.igreenenergy.com.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center group cursor-pointer"
              id="footer-logo-link"
            >
              <img 
                src="https://webdu.com.br/wp-content/uploads/2026/07/Design-sem-nome-2.png" 
                alt="iGreen Energy" 
                className="h-8 w-auto object-contain group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
            </a>
            <p className="text-xs text-slate-500 max-w-sm text-center md:text-left leading-relaxed">
              Conectando você ao futuro da energia limpa e renovável. Economia inteligente de forma simples e 100% digital.
            </p>
          </div>

          {/* Social Channels and Links */}
          <div className="flex flex-col items-center md:items-end gap-3.5">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              Siga nossas redes
            </span>
            <div className="flex items-center gap-3">
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/igreen.energy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center text-white transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-pink-500/20 hover:scale-105 active:scale-95 group"
                aria-label="Siga-nos no Instagram"
                id="footer-instagram-link"
              >
                <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>

              {/* YouTube */}
              <a 
                href="https://www.youtube.com/@IgreenEnergy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#FF0000] flex items-center justify-center text-white transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-red-600/20 hover:scale-105 active:scale-95 group"
                aria-label="Inscreva-se no YouTube"
                id="footer-youtube-link"
              >
                <Youtube className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>

              {/* Official Website */}
              <a 
                href="https://www.igreenenergy.com.br" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#00D166] flex items-center justify-center text-white transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#00D166]/20 hover:scale-105 active:scale-95 group"
                aria-label="Site Oficial da iGreen"
                id="footer-website-link"
              >
                <Globe className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
            
            <a 
              href="https://www.igreenenergy.com.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-semibold text-slate-600 hover:text-[#00B859] flex items-center gap-1 transition-colors group/link"
              id="footer-site-text-link"
            >
              <span>Acesse o site oficial</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </a>
          </div>

        </div>

        {/* Bottom row (Compliance & Legal) */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
          <div className="flex items-center gap-2 bg-white/80 border border-slate-100 px-3 py-1.5 rounded-full shadow-sm">
            <ShieldCheck className="w-4 h-4 text-[#00D166]" />
            <span className="text-slate-500">CONEXÃO SEGURA • LGPD COMPLIANT</span>
          </div>
          <div className="text-slate-400 font-medium normal-case">
            © {currentYear} iGreen Energy. Todos os direitos reservados.
          </div>
        </div>

        {/* Micro legal text */}
        <p className="text-[9px] text-slate-400/80 leading-relaxed text-center px-2">
          Os dados fornecidos estão protegidos pela Lei Geral de Proteção de Dados (Lei nº 13.709/18 - LGPD) e serão utilizados estritamente para o cálculo de estimativa de economia de energia e análise de viabilidade técnica sem compromisso.
        </p>

      </div>
    </footer>
  );
}
