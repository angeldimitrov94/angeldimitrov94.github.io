import { addDays, addMonths, addYears, isSameDay, parseISO, startOfDay } from 'date-fns';

export const FREQUENCIES = [
    { label: 'Once', value: 'once' },
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Biweekly', value: 'biweekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Biannually', value: 'biannually' },
    { label: 'Annually', value: 'annually' },
];

export const VANGUARD_FUNDS = [
    { symbol: 'VUG', name: 'Vanguard Growth', yield: 18.3 },
    { symbol: 'VOO', name: 'Vanguard S&P 500', yield: 15.6 },
    { symbol: 'VTI', name: 'Vanguard Total Stock Market', yield: 15.1 },
    { symbol: 'VIG', name: 'Vanguard Dividend Appreciation', yield: 11.8 },
    { symbol: 'VO', name: 'Vanguard Mid-Cap', yield: 11.3 },
    { symbol: 'VTV', name: 'Vanguard Value', yield: 10.8 },
    { symbol: 'VB', name: 'Vanguard Small-Cap', yield: 10.1 },
    { symbol: 'VYM', name: 'Vanguard High Dividend Yield', yield: 9.9 },
    { symbol: 'VT', name: 'Vanguard Total World Stock', yield: 9.6 },
    { symbol: 'VNQ', name: 'Vanguard Real Estate', yield: 6.3 },
    { symbol: 'BND', name: 'Vanguard Total Bond Market', yield: 1.6 },
];

export function calculateDailyData(planStartDate, beginBalance, expenses, compensation) {
    const startDate = startOfDay(parseISO(planStartDate));
    const endDate = addYears(startDate, 1);
    const dailyData = [];
    let currentBalance = parseFloat(beginBalance) || 0;

    for (let day = startDate; day <= endDate; day = addDays(day, 1)) {
        let totalComp = 0;
        let totalExp = 0;

        compensation.forEach(item => {
            if (occursOnDay(item, day)) {
                totalComp += parseFloat(item.amount) || 0;
            }
        });

        expenses.forEach(item => {
            if (occursOnDay(item, day)) {
                totalExp += parseFloat(item.amount) || 0;
            }
        });

        const net = totalComp - totalExp;
        currentBalance += net;

        dailyData.push({
            date: day.toISOString().split('T')[0],
            expenses: totalExp,
            compensation: totalComp,
            net: net,
            balance: currentBalance
        });
    }

    return dailyData;
}

function occursOnDay(item, day) {
    if (!item.date) return false;
    const itemDate = startOfDay(parseISO(item.date));
    if (day < itemDate) return false;

    const diffDays = Math.round((day.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));
    
    switch (item.frequency) {
        case 'once':
            return isSameDay(day, itemDate);
        case 'daily':
            return true;
        case 'weekly':
            return diffDays % 7 === 0;
        case 'biweekly':
            return diffDays % 14 === 0;
        case 'monthly': {
            const targetDay = itemDate.getDate();
            const currentDay = day.getDate();
            const lastDay = new Date(day.getFullYear(), day.getMonth() + 1, 0).getDate();
            if (targetDay >= lastDay) {
                return currentDay === lastDay;
            }
            return currentDay === targetDay;
        }
        case 'biannually': {
            const monthsDiff = (day.getFullYear() - itemDate.getFullYear()) * 12 + (day.getMonth() - itemDate.getMonth());
            if (monthsDiff % 6 !== 0) return false;
            const targetDayBi = itemDate.getDate();
            const currentDayBi = day.getDate();
            const lastDayBi = new Date(day.getFullYear(), day.getMonth() + 1, 0).getDate();
            if (targetDayBi >= lastDayBi) {
                return currentDayBi === lastDayBi;
            }
            return currentDayBi === targetDayBi;
        }
        case 'annually': {
            const monthsDiffAnn = (day.getFullYear() - itemDate.getFullYear()) * 12 + (day.getMonth() - itemDate.getMonth());
            if (monthsDiffAnn % 12 !== 0) return false;
            const targetDayAnn = itemDate.getDate();
            const currentDayAnn = day.getDate();
            const lastDayAnn = new Date(day.getFullYear(), day.getMonth() + 1, 0).getDate();
            if (targetDayAnn >= lastDayAnn) {
                return currentDayAnn === lastDayAnn;
            }
            return currentDayAnn === targetDayAnn;
        }
        default:
            return false;
    }
}
