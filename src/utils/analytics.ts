import { QuizAnswers } from '../types';

/**
 * Utility to handle event tracking and analytics logging.
 * Logs to console for transparent visibility and can easily hook into standard tag managers.
 */
export const trackEvent = (
  eventName: string,
  params: Record<string, any> = {}
) => {
  console.log(
    `%c[EVENT]: ${eventName}`,
    'color: #00D166; font-weight: bold; font-size: 11px;',
    params
  );

  // Standard Google Analytics event dispatch if gtag is present globally
  if (typeof window !== 'undefined') {
    const anyWindow = window as any;
    if (anyWindow.gtag) {
      anyWindow.gtag('event', eventName, params);
    }
    if (anyWindow.fbq) {
      anyWindow.fbq('trackCustom', eventName, params);
    }
  }
};
