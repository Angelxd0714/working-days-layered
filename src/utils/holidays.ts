import fetch from "node-fetch";

const HOLIDAYS_API_URL = 'https://content.capta.co/Recruitment/WorkingDays.json';

export async function getHolidays():Promise<String[]> {
    try {
        const response = await fetch(HOLIDAYS_API_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if(!Array.isArray(data)||!data.every((item:string)=>typeof item === 'string')){
            throw new Error('Invalid data format');
        }
        return data;
    } catch (error) {
        console.error('Error fetching holidays:', error);
        throw error;
    }
}