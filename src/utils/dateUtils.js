import { 
  format, 
  parse, 
//   isWithinInterval, 
  eachDayOfInterval,
//   isSameDay 
} from 'date-fns';

// USA National Holidays (fixed dates)
export const USA_HOLIDAYS = {
  NEW_YEARS: '01-01',
  INDEPENDENCE_DAY: '07-04',
  CHRISTMAS: '12-25'
};

// Check if date is a holiday
export const isHoliday = (date) => {
  const dateStr = format(date, 'MM-dd');
  return Object.values(USA_HOLIDAYS).includes(dateStr);
};

// Check if date is a weekend
export const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
};

// Calculate business days between two dates
export const getBusinessDays = (startDate, endDate) => {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  return days.filter(day => !isWeekend(day) && !isHoliday(day));
};

// Format date for USA display
export const formatUSDate = (date) => {
  return format(date, 'MMMM d, yyyy');
};

// Format time for USA display (12-hour format)
export const formatUSTime = (date) => {
  return format(date, 'h:mm a');
};

// Format full datetime for USA
export const formatUSDateTime = (date) => {
  return format(date, 'MMMM d, yyyy \'at\' h:mm a');
};

// Parse USA date string (MM/DD/YYYY)
export const parseUSDate = (dateString) => {
  return parse(dateString, 'MM/dd/yyyy', new Date());
};

// Get season for pricing (peak, shoulder, off-peak)
export const getSeason = (date) => {
  const month = date.getMonth() + 1;
  
  // Peak season: Summer (June-August) and December
  if (month >= 6 && month <= 8 || month === 12) {
    return 'peak';
  }
  // Shoulder season: Spring and Fall
  if ((month >= 3 && month <= 5) || (month >= 9 && month <= 11)) {
    return 'shoulder';
  }
  // Off-peak: Winter (Jan-Feb)
  return 'off-peak';
};