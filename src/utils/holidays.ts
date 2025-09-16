import fetch from 'node-fetch';

const HOLIDAYS_API_URL = 'https://content.capta.co/Recruitment/WorkingDays.json';

export async function getHolidays(): Promise<string[]> {
  try {
    const response = await fetch(HOLIDAYS_API_URL);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if (!Array.isArray(data) || !data.every((item: unknown) => typeof item === 'string')) {
      throw new Error('Invalid data format');
    }
    return data;
  } catch (error) {
    // Log the error for debugging purposes
    // eslint-disable-next-line no-console
    console.error('Error fetching holidays:', error);
    throw error;
  }
}