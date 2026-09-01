// Web Worker for financial calculations
self.onmessage = (e) => {
    try {
        const { planStartDate, beginBalance, expenses = [], compensation = [], reserveAmount, portfolio = [] } = e.data;
        
        if (!planStartDate) {
            self.postMessage([]);
            return;
        }

        // Use UTC-safe date parsing to avoid timezone shifts
        const [year, month, day] = planStartDate.split('-').map(Number);
        const startDate = new Date(Date.UTC(year, month - 1, day));
        
        const endDate = new Date(startDate);
        endDate.setUTCFullYear(endDate.getUTCFullYear() + 1);
        
        const dailyData = [];
        const reserve = parseFloat(reserveAmount) || 0;
        let currentBalance = parseFloat(beginBalance) || 0;
        const safePortfolio = portfolio || [];
        
        // Fix: Calculate portfolio-wide annual yield as a weighted sum.
        const portfolioAnnualYield = safePortfolio.reduce((acc, inv) => {
            const yieldVal = parseFloat(inv.yield) || 0;
            const percentVal = parseFloat(inv.percent) || 0;
            return acc + ((yieldVal / 100) * (percentVal / 100));
        }, 0);
        
        // Convert annual yield to monthly growth rate
        const monthlyRate = Math.pow(1 + portfolioAnnualYield, 1 / 12) - 1;

        let currentDay = new Date(startDate);
        while (currentDay <= endDate) {
            let totalComp = 0;
            let totalExp = 0;
            const compItems = [];
            const expItems = [];

            // Apply monthly growth on the first of each month (except the very first day)
            if (currentDay.getUTCDate() === 1 && currentDay.getTime() !== startDate.getTime()) {
                const investable = Math.max(0, currentBalance - reserve);
                const growth = investable * monthlyRate;
                if (growth > 0) {
                    totalComp += growth;
                    compItems.push({ name: 'Portfolio Growth', amount: growth });
                }
            }

            // Regular Income
            compensation.forEach(item => {
                if (occursOnDay(item, currentDay)) {
                    const amt = parseFloat(item.amount) || 0;
                    totalComp += amt;
                    if (amt > 0) compItems.push({ name: item.name || 'Income', amount: amt });
                }
            });

            // Regular Expenses
            expenses.forEach(item => {
                if (occursOnDay(item, currentDay)) {
                    const amt = parseFloat(item.amount) || 0;
                    totalExp += amt;
                    if (amt > 0) expItems.push({ name: item.name || 'Expense', amount: amt });
                }
            });

            currentBalance += (totalComp - totalExp);

            const emergencyFund = Math.min(currentBalance, reserve);
            const investedBalance = Math.max(0, currentBalance - reserve);

            dailyData.push({
                date: currentDay.toISOString().split('T')[0],
                expenses: totalExp,
                compensation: totalComp,
                net: totalComp - totalExp,
                balance: currentBalance,
                emergencyFund: emergencyFund,
                investedBalance: investedBalance,
                details: { income: compItems, expenses: expItems }
            });

            currentDay.setUTCDate(currentDay.getUTCDate() + 1);
        }

        self.postMessage(dailyData);
    } catch (error) {
        console.error('Worker Internal Error:', error);
        self.postMessage([]);
    }
};

function occursOnDay(item, day) {
    if (!item.date) return false;
    const [iY, iM, iD] = item.date.split('-').map(Number);
    const itemDate = new Date(Date.UTC(iY, iM - 1, iD));
    if (day < itemDate) return false;

    const diffDays = Math.round((day - itemDate) / (1000 * 60 * 60 * 24));
    
    switch (item.frequency) {
        case 'once':
            return day.getTime() === itemDate.getTime();
        case 'daily':
            return true;
        case 'weekly':
            return diffDays % 7 === 0;
        case 'biweekly':
            return diffDays % 14 === 0;
        case 'monthly': {
            const targetDay = itemDate.getUTCDate();
            const currentDayNum = day.getUTCDate();
            const lastDay = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth() + 1, 0)).getUTCDate();
            return currentDayNum === Math.min(targetDay, lastDay);
        }
        case 'biannually': {
            const monthsDiff = (day.getUTCFullYear() - itemDate.getUTCFullYear()) * 12 + (day.getUTCMonth() - itemDate.getUTCMonth());
            if (monthsDiff % 6 !== 0) return false;
            const targetDay = itemDate.getUTCDate();
            const currentDayNum = day.getUTCDate();
            const lastDay = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth() + 1, 0)).getUTCDate();
            return currentDayNum === Math.min(targetDay, lastDay);
        }
        case 'annually': {
            if (day.getUTCMonth() !== itemDate.getUTCMonth()) return false;
            const targetDay = itemDate.getUTCDate();
            const currentDayNum = day.getUTCDate();
            const lastDay = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth() + 1, 0)).getUTCDate();
            return currentDayNum === Math.min(targetDay, lastDay);
        }
        default:
            return false;
    }
}
