export function formatDate(dateStr) {
  if (!dateStr) return "Date not available";

  const date = new Date(dateStr);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  try {
    return new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Date format error";
  }
}
export function getRandomItems(arr, num) {
  if (num > arr.length) {
    throw new Error("Not enough items in the array");
  }

  // Make a copy so original isn't modified
  const shuffled = [...arr].sort(() => 0.5 - Math.random());

  // Return first `num` items
  return shuffled.slice(0, num);
}
export function formatTime(dateString) {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

 export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export function validateUSAPhoneNumber(phone){
  const cleaned = phone.replace(/\D/g, "");
  const patterns = [
    /^1?[2-9]\d{9}$/,
    /^\([2-9]\d{2}\)\s?\d{3}-\d{4}$/,
    /^[2-9]\d{2}-\d{3}-\d{4}$/,
    /^[2-9]\d{2}\.\d{3}\.\d{4}$/,
    /^[2-9]\d{2}\s\d{3}\s\d{4}$/,
  ];

  return (
    patterns.some((pattern) => pattern.test(phone)) ||
    cleaned.length === 10 ||
    (cleaned.length === 11 && cleaned.startsWith("1"))
  );
};

export function formatDateOfBirth(dobStr) {
  if (!dobStr) return "Date of birth not available";

  const dob = new Date(dobStr);

  // Validate date
  if (isNaN(dob.getTime())) {
    return "Invalid date of birth";
  }

  try {
    return new Intl.DateTimeFormat("en", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(dob);
  } catch (error) {
    console.error("Error formatting date of birth:", error);
    return "Date format error";
  }
}
 export function getCurrentTimeInStLouis(){
  return new Date().toLocaleTimeString('en-US', {
    timeZone: 'America/Chicago',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  });
};

export function isToday (someDate) {
  const today = new Date();
  return someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear();
};


export const USA_CONFIG = {
  // Central Time for St. Louis
  timeZone: 'America/Chicago',
  timeZoneDisplay: 'Central Time (CT)',
  
  // Business hours (8 AM - 8 PM Central Time)
  businessHours: {
    start: 8,   // 8 AM
    end: 20     // 8 PM
  },
  
  // Minimum rental period (4 hours)
  minRentalHours: 4,
  
  // Maximum rental period (30 days)
  maxRentalDays: 30,
  
  // Available locations
  cities: ["St. Louis"]
};
export function generateTimeSlots(forDate = null){
  const slots = [];
  
  // If it's for today, start from current time rounded up to next 30-minute interval
  if (forDate && isToday(new Date(forDate))) {
    const stLouisTime = getCurrentTimeInStLouis();
    const [currentHourStr, currentMinuteStr] = stLouisTime.split(':');
    const currentHour = parseInt(currentHourStr, 10);
    const currentMinute = parseInt(currentMinuteStr, 10);
    
    console.log('Current St. Louis time:', { currentHour, currentMinute, stLouisTime });
    
    // Round up to next 30-minute interval
    let startHour = currentHour;
    let startMinute = currentMinute < 30 ? 30 : 0;
    
    if (currentMinute >= 30) {
      startHour += 1;
      startMinute = 0;
    }
    
    // Ensure we don't start before business hours
    startHour = Math.max(startHour, USA_CONFIG.businessHours.start);
    
    // If we're past business hours for today, return empty array
    if (startHour > USA_CONFIG.businessHours.end) {
      console.log('Past business hours, no slots available');
      return [];
    }
    
    console.log('Generating slots starting from:', { startHour, startMinute });
    
    for (let hour = startHour; hour <= USA_CONFIG.businessHours.end; hour++) {
      for (let minute of ['00', '30']) {
        // Skip the last 30-minute slot if it would go past business hours
        if (hour === USA_CONFIG.businessHours.end && minute === '30') continue;
        
        // For the starting hour, only include minutes that are after current rounded time
        if (hour === startHour) {
          if (minute === '00' && startMinute > 0) continue;
          if (minute === '30' && startMinute > 30) continue;
        }
        
        const time24h = `${hour.toString().padStart(2, '0')}:${minute}`;
        slots.push(time24h);
      }
    }
  } else {
    // For future dates, use all business hours
    for (let hour = USA_CONFIG.businessHours.start; hour <= USA_CONFIG.businessHours.end; hour++) {
      for (let minute of ['00', '30']) {
        if (hour === USA_CONFIG.businessHours.end && minute === '30') continue;
        const time24h = `${hour.toString().padStart(2, '0')}:${minute}`;
        slots.push(time24h);
      }
    }
  }
  

  return slots;
};

export const DEFAULT_TIME_SLOTS = (() => {
  const slots = [];
  for (let hour = USA_CONFIG.businessHours.start; hour <= USA_CONFIG.businessHours.end; hour++) {
    for (let minute of ['00', '30']) {
      if (hour === USA_CONFIG.businessHours.end && minute === '30') continue;
      const time24h = `${hour.toString().padStart(2, '0')}:${minute}`;
      slots.push(time24h);
    }
  }
  return slots;
})();
const KM_TO_MI = 0.621371;
export const formatOdometer = (n) =>
  typeof n === "number" && !Number.isNaN(n)
    ? `${Math.round(n * KM_TO_MI).toLocaleString()} mi`
    : "—";


    export const formatTimeForDisplay = (time24h) => {
      const [hour, minute] = time24h.split(':');
      const hourNum = parseInt(hour, 10);
      const period = hourNum >= 12 ? 'PM' : 'AM';
      const hour12 = hourNum % 12 || 12;
      return `${hour12}:${minute} ${period}`;
    };
    