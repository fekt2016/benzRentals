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
  console.log("arr", arr);
  if (num > arr.length) {
    throw new Error("Not enough items in the array");
  }

  // Make a copy so original isn't modified
  const shuffled = [...arr].sort(() => 0.5 - Math.random());

  // Return first `num` items
  return shuffled.slice(0, num);
}
