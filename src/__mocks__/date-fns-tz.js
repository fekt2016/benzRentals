// Mock for date-fns-tz package (used in tests when package is not installed)
export const format = (date, formatStr) => {
  const d = new Date(date);
  if (formatStr === 'MMM d, yyyy') {
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
  return d.toString();
};

export const formatInTimeZone = (date, timeZone, formatStr) => {
  const d = new Date(date);
  return `${d.toLocaleDateString()} in ${timeZone}`;
};

export const toZonedTime = (date, timeZone) => {
  return new Date(date);
};

