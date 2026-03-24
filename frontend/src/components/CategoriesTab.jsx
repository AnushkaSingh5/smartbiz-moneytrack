import React, { useMemo } from 'react';

const CategoriesTab = ({ transactions }) => {
  const categorySummary = useMemo(() => {
    const summary = {};
    const totalExpense = transactions.reduce((acc, t) => {
        if (t.type?.toLowerCase() === 'expense') {
            const amount = Number(t.amount);
            if (!summary[t.category]) {
                summary[t.category] = { amount: 0, count: 0 };
            }
            summary[t.category].amount += amount;
            summary[t.category].count += 1;
            return acc + amount;
        }
        return acc;
    }, 0);

    return Object.entries(summary).map(([name, data]) => ({
      name,
      amount: data.amount,
      count: data.count,
      avg: data.amount / data.count,
      percentage: totalExpense > 0 ? (data.amount / totalExpense) * 100 : 0
    })).sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const getCategoryIcon = (cat) => {
    switch(cat) {
      case 'Food & Dining': return 'utensils';
      case 'Shopping': return 'shopping-bag';
      case 'Transportation': return 'car';
      case 'Utilities': return 'bolt';
      default: return 'tag';
    }
  };

  return (
    <div className="tab-content active transition-opacity duration-300">
        {/* COMPACT REFINED HEADER */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-xl mb-8 flex justify-between items-center relative overflow-hidden">
            <div className="relative z-10">
                <h3 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight">Spending Categories</h3>
                <p className="text-[9px] md:text-[10px] font-black text-gray-400 mt-1 uppercase tracking-[0.2em] opacity-70">Live Sector Analysis</p>
            </div>
            <div className="relative z-10 bg-indigo-600/10 text-indigo-600 px-4 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-indigo-600/20 shadow-sm">
                {categorySummary.length} Segments Detected
            </div>
        </div>
        
        {/* COMPACT FULL-WIDTH GRID (HEIGHT FIXED - IMAGE 1240 RECOVERY) */}
        <div className="grid grid-cols-1 gap-8 pb-20">
            {categorySummary.length > 0 ? categorySummary.map((cat, index) => (
                <div key={index} className="bg-white rounded-[2.2rem] md:rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-50 hover:shadow-xl hover:scale-[1.002] transition-all group relative overflow-hidden flex flex-col justify-between">
                    <div className="flex justify-between items-baseline mb-6 md:mb-8 relative z-10">
                        <div className="space-y-3">
                             <h4 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight leading-tight">{cat.name}</h4>
                             <div className="flex items-center space-x-4">
                                <p className="text-[9px] font-black text-white bg-indigo-600 px-3 py-1 md:py-1.5 rounded-full uppercase tracking-widest shadow-sm">{cat.percentage.toFixed(0)}% SHARE</p>
                                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{cat.count} Ops</p>
                             </div>
                        </div>
                        <div className="bg-gray-50/50 p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center w-20 h-20 md:w-24 md:h-24 group-hover:bg-indigo-50 transition-all">
                             <i className={`fas fa-${getCategoryIcon(cat.name)} text-indigo-500 text-3xl md:text-4xl`}></i>
                        </div>
                    </div>
                    
                    <div className="mb-6 md:mb-8 relative z-10">
                        <p className="text-gray-300 font-bold uppercase tracking-widest text-[8px] md:text-[9px] mb-2 md:mb-3">Cumulative Sector Balance</p>
                        <p className="text-6xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none mb-0 flex items-baseline select-none">
                            <span className="text-3xl md:text-4xl mr-4 text-indigo-600 opacity-20 font-bold tracking-normal">₹</span>
                            {cat.amount.toLocaleString('en-IN')}
                        </p>
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-3 md:mb-4">
                            <span className="text-[8px] md:text-[9px] font-black text-gray-300 uppercase tracking-widest">Growth Dynamics Pulse</span>
                            <span className="text-[9px] md:text-[10px] font-black text-red-500 uppercase italic">TOTAL ACCUMULATED</span>
                        </div>
                        <div className="h-2 md:h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-100 ring-4 ring-gray-50/50">
                            <div className="h-full bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all duration-1500 ease-out rounded-full" style={{ width: `${cat.percentage}%` }}></div>
                        </div>
                    </div>
                    
                    {/* ENHANCED DESIGN FROM BLUEPRINT */}
                    <div className="absolute -right-16 -bottom-16 opacity-[0.02] transform rotate-12 -z-0">
                        <i className={`fas fa-${getCategoryIcon(cat.name)} text-[18rem]`}></i>
                    </div>
                </div>
            )) : (
                <div className="col-span-full py-24 bg-gray-50/20 rounded-[3rem] border-4 border-dashed border-gray-100 text-center flex flex-col items-center justify-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 text-gray-100 text-4xl shadow-md">
                        <i className="fas fa-search-dollar"></i>
                    </div>
                    <p className="text-2xl font-black text-gray-200 italic">No Sector breakdown data</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default CategoriesTab;
