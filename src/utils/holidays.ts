const HOLIDAYS_API_URL = 'https://content.capta.co/Recruitment/WorkingDays.json';

export async function getHolidays(): Promise<string[]> {
  try {
    const response = await fetch(HOLIDAYS_API_URL);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }
    const data = await response.json() as unknown;
    if (!Array.isArray(data) || !data.every((item: unknown) => typeof item === 'string')) {
      throw new Error('Invalid data format: expected array of strings');
    }
    return data;
  } catch (error) {
    console.error('Error fetching holidays:', error);
    throw error;
  }
}