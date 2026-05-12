import { type LocalizedText } from '../types';

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
}
export const getLocalizedText = (currentLanguage: string, localizedContent: LocalizedText): string => {
  if (!localizedContent) return '';

  // Try current language
  if (localizedContent[currentLanguage]) {
    return localizedContent[currentLanguage];
  }

  // Fallback to English
  if (localizedContent['en']) {
    return localizedContent['en'];
  }

  // Return first available language
  const firstKey = Object.keys(localizedContent)[0];
  return firstKey ? localizedContent[firstKey] : '';
};

export const isValidUUID = (value: string): boolean => {
  const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return regex.test(value);
};
