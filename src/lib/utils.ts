import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Parse dates like "23.02.2025" and optional times like "12:23:00" into a Date
// Returns an invalid Date if input is not recognized
export function parseDateTimeFromDotted(dateString?: string, timeString?: string): Date {
  if (!dateString || typeof dateString !== 'string') return new Date(NaN);

  // If it's already an ISO or otherwise parseable format, fall back to native Date
  if (dateString.includes('-') || dateString.includes('/')) {
    const fallback = new Date(`${dateString}${timeString ? ` ${timeString}` : ''}`.trim());
    if (!isNaN(fallback.getTime())) return fallback;
  }

  const [dayStr, monthStr, yearStr] = dateString.split('.') as [string, string, string];
  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr);
  if (!day || !month || !year) return new Date(NaN);

  let hours = 0, minutes = 0, seconds = 0;
  if (timeString && typeof timeString === 'string') {
    const [hStr = '0', mStr = '0', sStr = '0'] = timeString.split(':');
    hours = Number(hStr) || 0;
    minutes = Number(mStr) || 0;
    seconds = Number(sStr) || 0;
  }

  return new Date(year, month - 1, day, hours, minutes, seconds);
}
