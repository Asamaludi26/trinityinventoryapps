/**
 * Converts a Date object to a 'YYYY-MM-DD' string, correctly handling timezone offsets.
 * This prevents the common "one day off" bug by using the local date parts
 * instead of converting to UTC.
 * @param date The date object to format.
 * @returns A string in 'YYYY-MM-DD' format, or an empty string if the date is null/undefined.
 */
export const toYYYYMMDD = (date: Date | null | undefined): string => {
  if (!date) {
    return '';
  }
  
  const d = new Date(date); // Create a new Date object to avoid modifying the original
  const year = d.getFullYear();
  const month = d.getMonth() + 1; // getMonth() is zero-based
  const day = d.getDate();

  return [
    year,
    month.toString().padStart(2, '0'),
    day.toString().padStart(2, '0')
  ].join('-');
};

/**
 * Safely parses a date string to a Date object
 * FIXED M10: Validates date string and handles invalid dates
 * @param dateString The date string to parse (YYYY-MM-DD format)
 * @returns A Date object if valid, null otherwise
 */
export const safeParseDate = (dateString: string | null | undefined): Date | null => {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }
  
  // Validate format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    console.warn(`Invalid date format: ${dateString}. Expected YYYY-MM-DD`);
    return null;
  }
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    console.warn(`Invalid date value: ${dateString}`);
    return null;
  }
  
  // Additional validation: check if parsed date matches input (handles invalid dates like 2023-13-45)
  const [year, month, day] = dateString.split('-').map(Number);
  if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
    console.warn(`Date out of range: ${dateString}`);
    return null;
  }
  
  return date;
};

/**
 * Safely parses a date string from various formats
 * @param dateString The date string to parse
 * @returns A Date object if valid, null otherwise
 */
export const safeParseDateFlexible = (dateString: string | null | undefined): Date | null => {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return null;
  }
  
  return date;
};