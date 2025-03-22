// calendarService.js
import cropService from './CropService';
import {getMonthNumber} from '../utils/dateUtils';

const calendarService = {
    generateSchedule: (region, cropName) => {
        const cropDetails = cropService.getCropDetails(region, cropName);

        if (!cropDetails) {
            return []; // Or handle the error as needed
        }

        const schedule = cropDetails.activities.map(activity => {
            const startDate = new Date();
            startDate.setMonth(getMonthNumber(activity.month) - 1); // Month is 0-indexed
            startDate.setDate(1); // Start of the month

            const durationParts = activity.duration.split(' ');
            const durationValue = parseInt(durationParts[0]);
            const durationUnit = durationParts[1].toLowerCase();

            let endDate = new Date(startDate);

            if (durationUnit === 'weeks') {
                endDate.setDate(startDate.getDate() + (durationValue * 7));
            } else if (durationUnit === 'months') {
                endDate.setMonth(startDate.getMonth() + durationValue);
            } else if (durationUnit === 'days') {
                endDate.setDate(startDate.getDate() + durationValue);
            } else {
                // Handle other duration units or throw an error
                console.warn(`Unsupported duration unit: ${durationUnit}`);
            }

            return {
                activityName: activity.name,
                startDate: startDate.toISOString().slice(0, 10), // Format as YYYY-MM-DD
                endDate: endDate.toISOString().slice(0, 10)
            };
        });

        return schedule;
    }
};

export default calendarService;