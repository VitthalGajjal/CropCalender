// calendarService.js
import cropService from './CropService';
import {getMonthNumber} from '../utils/dateUtils';

const calendarService = {
    generateSchedule: (region, cropName) => {
        const cropDetails = cropService.getCropDetails(region, cropName);

        if (!cropDetails) {
            console.warn(`No crop details found for region: ${region}, cropName: ${cropName}`);
            return []; // Or handle the error as needed (e.g., throw an error)
        }

        const schedule = cropDetails.activities.map(activity => {
            const startDate = new Date();
            startDate.setMonth(getMonthNumber(activity.month) - 1); // Month is 0-indexed
            startDate.setDate(1); // Start of the month

            const durationParts = activity.duration.split(' ');

            //  Robustly handle cases where duration is missing or in the wrong format
            if (!durationParts || durationParts.length < 2) {
                console.warn(`Invalid duration format: ${activity.duration}.  Skipping activity.`);
                return null; // Skip this activity
            }

            const durationValue = parseInt(durationParts[0], 10);
            const durationUnit = durationParts[1]?.toLowerCase(); // Use optional chaining

            // Validate durationValue is a number
            if (isNaN(durationValue)) {
                console.warn(`Invalid duration value in duration: ${activity.duration}. Skipping activity.`);
                return null; // Skip this activity
            }

            if (!durationUnit) {
                console.warn(`No duration unit found in duration: ${activity.duration}.  Skipping activity.`);
                return null; //Skip the current activity if durationUnit is undefined
            }

            let endDate = new Date(startDate);

            if (durationUnit === 'weeks') {
                endDate.setDate(startDate.getDate() + (durationValue * 7));
            } else if (durationUnit === 'months') {
                endDate.setMonth(startDate.getMonth() + durationValue);
            } else if (durationUnit === 'days') {
                endDate.setDate(startDate.getDate() + durationValue);
            } else {
                console.warn(`Unsupported duration unit: ${durationUnit} in duration: ${activity.duration}.  Skipping activity.`);
                return null; // Skip this activity
            }

            return {
                activityName: activity.name,
                startDate: startDate.toISOString().slice(0, 10), // Format as YYYY-MM-DD
                endDate: endDate.toISOString().slice(0, 10)
            };
        }).filter(activity => activity !== null); // Remove skipped activities;

        return schedule;
    }
};

export default calendarService;