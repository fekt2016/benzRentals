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