/**
 * Types and Interfaces for the iGreen Energy Saving Progressive Quiz Landing Page.
 */

export interface QuizAnswers {
  nome: string;
  perfil: 'Pessoa Física' | 'Empresa' | 'Produtor Rural' | 'Condomínio' | '';
  consumo: 'Até R$300' | 'R$300 a R$700' | 'R$700 a R$1500' | 'Mais de R$1500' | '';
  estado: string;
  imovelProprio: 'Sim' | 'Não' | '';
  querEconomizar: 'Sim' | 'Quero entender melhor' | '';
  whatsapp: string;
  email: string;
}

export interface PartnerAnswers {
  nome: string;
  objetivo: 'Renda extra' | 'Renda principal' | 'Crescimento profissional' | 'Empreender' | '';
  dedicacao: 'Poucas horas' | 'Meio período' | 'Período integral' | '';
  metaRenda: 'R$1.000 a R$3.000' | 'R$3.000 a R$5.000' | 'R$5.000 a R$10.000' | 'Acima de R$10.000' | '';
  experienciaVendas: 'Sim' | 'Não' | '';
  investimento: string; // Let's make it string because we will change the options for investment
  whatsapp: string;
  email: string;
}

export type AppStep = 'hero' | 'saving-quiz' | 'partner-quiz' | 'processing' | 'success' | 'disqualified' | 'presentation';

export interface StateData {
  id: string;
  name: string;
  region: string;
}
