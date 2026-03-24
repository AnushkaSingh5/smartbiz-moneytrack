import React, { useMemo, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const ReportsTab = ({ transactions }) => {
  const [timeFilter, setTimeFilter] = useState('month');

  // 1. DYNAMIC DATA & TREND CALCULATIONS
  const now = new Date();
  const currentMonthIdx = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthFiltered = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonthIdx && d.getFullYear() === currentYear;
  });

  const lastMonthIdx = currentMonthIdx === 0 ? 11 : currentMonthIdx - 1;
  const lastMonthYear = currentMonthIdx === 0 ? currentYear - 1 : currentYear;

  const lastMonthFiltered = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === lastMonthIdx && d.getFullYear() === lastMonthYear;
  });

  const filteredData = useMemo(() => {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      const transactionDate = new Date(tDate.getFullYear(), tDate.getMonth(), tDate.getDate());
      switch (timeFilter) {
        case 'week':
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          return transactionDate >= weekStart;
        case 'month':
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
          return transactionDate >= monthStart;
        case 'quarter':
          const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
          return transactionDate >= quarterStart;
        case 'year':
          const yearStart = new Date(today.getFullYear(), 0, 1);
          return transactionDate >= yearStart;
        default: return true;
      }
    });
  }, [transactions, timeFilter]);

  const totalIncome = filteredData.filter(t => t.type?.toLowerCase() === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = filteredData.filter(t => t.type?.toLowerCase() === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

  const expenseTransactions = filteredData.filter(t => t.type?.toLowerCase() === 'expense');
  const biggestExpense = expenseTransactions.length > 0
    ? [...expenseTransactions].sort((a, b) => b.amount - a.amount)[0]
    : null;

  const lastIncomeTotal = lastMonthFiltered.filter(t => t.type?.toLowerCase() === 'income').reduce((acc, t) => acc + t.amount, 0);
  const lastExpenseTotal = lastMonthFiltered.filter(t => t.type?.toLowerCase() === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const lastSavingsRate = lastIncomeTotal > 0 ? Math.round(((lastIncomeTotal - lastExpenseTotal) / lastIncomeTotal) * 100) : 0;

  const incomeTrend = lastIncomeTotal > 0 ? Math.round(((totalIncome - lastIncomeTotal) / lastIncomeTotal) * 100) : 0;
  const expenseTrend = lastExpenseTotal > 0 ? Math.round(((totalExpenses - lastExpenseTotal) / lastExpenseTotal) * 100) : 0;
  const savingsRateTrend = Math.abs(savingsRate - lastSavingsRate);

  const categorySummary = useMemo(() => {
    const totals = {};
    expenseTransactions.forEach(t => {
      totals[t.category] = (totals[t.category] || 0) + Number(t.amount);
    });
    return Object.entries(totals).sort((a, b) => b[1] - a[1]);
  }, [expenseTransactions]);

  const activeInsights = useMemo(() => {
    const insights = [];
    if (expenseTransactions.length === 0) return null;

    if (categorySummary.length > 0) {
      const topCat = categorySummary[0];
      const percentage = totalExpenses > 0 ? Math.round((topCat[1] / totalExpenses) * 100) : 0;
      insights.push({ title: `Spending Dominance`, desc: `${topCat[0]} accounts for ${percentage}% of your outgoings. Audit this sector to optimize growth.`, icon: 'exclamation-circle', color: 'text-orange-500' });
    }

    if (savingsRate > 50) {
      insights.push({ title: `Elite Savings`, desc: `You're saving ${savingsRate}% of your income. High efficiency detected in cumulative flow.`, icon: 'trophy', color: 'text-green-600' });
    } else if (savingsRate < 10 && totalExpenses > 0) {
      insights.push({ title: `Budget Alert`, desc: `Low savings rate identified (${savingsRate}%). Recommend immediate audit of discretionary expenses.`, icon: 'shield-alt', color: 'text-red-500' });
    }

    if (expenseTrend > 20) {
      insights.push({ title: `Expense Surge`, desc: `Expenditure momentum is up by ${expenseTrend}% compared to last month. Analyze recent operations.`, icon: 'chart-line', color: 'text-red-500' });
    }

    return insights;
  }, [expenseTransactions, categorySummary, totalExpenses, savingsRate, expenseTrend]);

  const chartData = useMemo(() => {
    let labels = [], incomeSeries = [], expenseSeries = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (timeFilter === 'week') {
      labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      incomeSeries = new Array(7).fill(0); expenseSeries = new Array(7).fill(0);
      filteredData.forEach(t => { const d = new Date(t.date); if (t.type?.toLowerCase() === 'income') incomeSeries[d.getDay()] += t.amount; else expenseSeries[d.getDay()] += t.amount; });
    } else if (timeFilter === 'month') {
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];
      incomeSeries = new Array(5).fill(0); expenseSeries = new Array(5).fill(0);
      filteredData.forEach(t => { const d = new Date(t.date); const weekIdx = Math.floor((d.getDate() - 1) / 7); if (t.type?.toLowerCase() === 'income') incomeSeries[weekIdx] += t.amount; else expenseSeries[weekIdx] += t.amount; });
    } else {
      for (let i = 5; i >= 0; i--) { const d = new Date(); d.setMonth(now.getMonth() - i); labels.push(months[d.getMonth()]); }
      incomeSeries = new Array(6).fill(0); expenseSeries = new Array(6).fill(0);
      transactions.forEach(t => { const d = new Date(t.date); const mName = months[d.getMonth()]; const idx = labels.indexOf(mName); if (idx !== -1) { if (t.type?.toLowerCase() === 'income') incomeSeries[idx] += t.amount; else expenseSeries[idx] += t.amount; } });
    }
    return { labels, incomeSeries, expenseSeries };
  }, [transactions, filteredData, timeFilter]);

  const barData = {
    labels: chartData.labels,
    datasets: [
      { label: 'Income', data: chartData.incomeSeries, backgroundColor: '#10b981', borderRadius: 12, categoryPercentage: 0.8, barPercentage: 0.9 },
      { label: 'Expenses', data: chartData.expenseSeries, backgroundColor: '#ef4444', borderRadius: 12, categoryPercentage: 0.8, barPercentage: 0.9 }
    ]
  };

  const lineData = { labels: chartData.labels, datasets: [{ label: 'Expenditure', data: chartData.expenseSeries, borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', fill: true, tension: 0.4, pointRadius: 6, borderWidth: 4 }] };

  // ELITE CHART OPTIONS (PADDING FIXED - IMAGE 1294 RECOVERY)
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { bottom: 30 }
    },
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        grid: { display: false },
        border: { display: true, color: '#f3f4f6' },
        ticks: { font: { size: 12, weight: '900' }, color: '#111827', display: true }
      },
      x: {
        grid: { display: false },
        border: { display: true, color: '#f3f4f6' },
        ticks: { font: { size: 12, weight: '900' }, color: '#111827', display: true, autoSkip: false, maxRotation: 0 }
      }
    }
  };

  return (
    <div className="space-y-10 pb-20 no-scrollbar animate-fadeIn text-left">
      {/* RESPONSIVE TIME FILTER */}
      <div className="bg-white p-2 md:p-3 rounded-2xl flex justify-between items-center shadow-md border border-gray-50 w-full md:max-w-2xl mx-auto md:mx-0 mb-4 overflow-hidden">
        {['week', 'month', 'quarter', 'year'].map(filter => (
          <button key={filter} onClick={() => setTimeFilter(filter)} className={`px-4 md:px-10 py-2.5 md:py-3 rounded-xl text-[10px] md:text-sm font-black transition-all capitalize flex-1 mx-1 ${timeFilter === filter ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-indigo-600'}`}>{filter}</button>
        ))}
      </div>

      {/* 2 BOXES PER LINE SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col justify-between h-56">
          <div><h4 className="text-gray-400 font-bold text-sm mb-2 uppercase tracking-widest">Total Income</h4><h3 className="text-5xl font-black text-green-600 truncate">{formatCurrency(totalIncome)}</h3></div>
          <p className="text-gray-400 font-bold text-sm flex items-center"><i className={`fas fa-arrow-${incomeTrend >= 0 ? 'up' : 'down'} transform rotate-45 mr-3 text-indigo-500`}></i> {Math.abs(incomeTrend)}% from last month</p>
        </div>
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col justify-between h-56">
          <div><h4 className="text-gray-400 font-bold text-sm mb-2 uppercase tracking-widest">Total Expenses</h4><h3 className="text-5xl font-black text-red-500 truncate">{formatCurrency(totalExpenses)}</h3></div>
          <p className="text-gray-400 font-bold text-sm flex items-center"><i className={`fas fa-arrow-${expenseTrend >= 0 ? 'down' : 'up'} transform rotate-45 mr-3 text-indigo-500`}></i> {Math.abs(expenseTrend)}% from last month</p>
        </div>
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col justify-between h-56">
          <div><h4 className="text-gray-400 font-bold text-sm mb-2 uppercase tracking-widest">Savings Rate</h4><h3 className="text-5xl font-black text-indigo-600">{savingsRate}%</h3></div>
          <p className="text-gray-400 font-bold text-sm flex items-center"><i className={`fas fa-arrow-${savingsRate >= lastSavingsRate ? 'up' : 'down'} transform rotate-45 mr-3 text-indigo-500`}></i> {savingsRateTrend}% change</p>
        </div>
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col justify-between h-56">
          <div><h4 className="text-gray-400 font-bold text-sm mb-2 uppercase tracking-widest">Biggest Expense</h4><h3 className="text-5xl font-black text-gray-900 truncate">{biggestExpense ? formatCurrency(biggestExpense.amount) : 'None'}</h3></div>
          <p className="text-gray-400 font-bold text-sm flex items-center truncate">{biggestExpense ? <><i className="fas fa-arrow-up transform rotate-45 mr-3 text-indigo-500"></i> {biggestExpense.category}</> : 'No records found'}</p>
        </div>
      </div>

      {/* VERTICAL CHARTS */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/20"><h3 className="text-xl font-black text-gray-800 tracking-tight">Expense Trend</h3><button className="text-indigo-600 font-bold text-sm hover:underline">Details</button></div>
        <div className="p-10 h-[400px]"><Line data={lineData} options={chartOptions} /></div>
      </div>
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/20">
          <h3 className="text-xl font-black text-gray-800 tracking-tight text-left">Income vs Expenses</h3>
          <button className="text-indigo-600 font-bold text-sm hover:underline">Details</button>
        </div>
        <div className="p-10 h-[500px]">
          <div className="flex justify-center space-x-12 mb-10">
            <div className="flex items-center text-[11px] font-black text-gray-600 uppercase tracking-[0.2em]"><div className="w-4 h-4 bg-green-500 rounded-sm mr-4 shadow-sm"></div> Income</div>
            <div className="flex items-center text-[11px] font-black text-gray-600 uppercase tracking-[0.2em]"><div className="w-4 h-4 bg-red-500 rounded-sm mr-4 shadow-sm"></div> Expense</div>
          </div>
          <Bar data={barData} options={chartOptions} />
        </div>
      </div>

      {/* EXPANDED SPENDING INSIGHTS */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-10 border-b border-gray-50 bg-gray-50/20"><h3 className="text-xl font-black text-gray-800 tracking-tight">Spending Insights</h3></div>
        <div className="p-10">
          {activeInsights ? (
            <div className="space-y-6">
              {activeInsights.map((insight, i) => (
                <div key={i} className="bg-gray-50/50 p-10 rounded-[2.5rem] border border-gray-100 flex items-center space-x-10 hover:bg-white transition-all shadow-sm">
                  <div className={`bg-white w-20 h-20 rounded-[1.8rem] flex items-center justify-center shadow-xl border border-gray-100 ${insight.color} text-4xl flex-shrink-0`}><i className={`fas fa-${insight.icon}`}></i></div>
                  <div className="flex-1 text-left">
                    <h4 className="font-black text-gray-800 text-lg mb-2 uppercase tracking-tight">{insight.title}</h4>
                    <p className="text-gray-400 text-sm font-bold leading-relaxed">{insight.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50/80 rounded-[3rem] p-16 text-center border border-gray-100/50 shadow-inner">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg text-gray-200"><i className="fas fa-microchip text-3xl"></i></div>
              <p className="text-lg text-gray-400 font-bold italic">Analytical Engine Standby</p>
              <p className="text-[11px] text-gray-300 font-black uppercase tracking-[0.2em] mt-3">Synthesizing spend patterns from live data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;
