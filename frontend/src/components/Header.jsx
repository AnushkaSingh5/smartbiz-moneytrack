import React from 'react';

const formatCurrency = (amount) => {
    const isNegative = amount < 0;
    const absAmount = Math.abs(amount).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    return `${isNegative ? '-' : ''}₹${absAmount}`;
};

const Header = ({ balance, income, expense, onOpenFilter }) => {
  return (
    <header className="gradient-bg text-white p-6 rounded-b-[3.5rem] shadow-2xl relative z-20">
        <div className="flex justify-between items-center mb-10 pb-2">
            <div>
                <h1 className="text-4xl font-bold tracking-tighter text-white">MoneyTrack</h1>
                <p className="text-sm opacity-90 font-semibold uppercase tracking-widest pl-1 mt-1 text-indigo-100">Elite Wealth Dashboard</p>
            </div>
            <div className="flex space-x-3 items-center ml-auto">
                <button onClick={onOpenFilter} className="bg-white/20 hover:bg-white/30 p-3 rounded-2xl flex items-center transition-all border border-white/20 backdrop-blur-md shadow-lg">
                    <i className="fas fa-filter text-white"></i>
                </button>
                <div className="bg-white/20 p-3 rounded-2xl cursor-pointer hover:bg-white/30 transition-all border border-white/20 shadow-lg">
                    <i className="fas fa-bell text-white"></i>
                </div>
                <div className="bg-white/20 p-3 rounded-2xl cursor-pointer hover:bg-white/30 transition-all border border-white/20 shadow-lg hidden sm:block">
                    <i className="fas fa-cog text-white"></i>
                </div>
            </div>
        </div>
        
        <div className="bg-white/10 p-10 rounded-[2.5rem] backdrop-blur-2xl border border-white/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] transform transition-transform hover:scale-[1.01]">
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-white opacity-80 mb-3 text-center">Consolidated Floating Capital</p>
            <h2 className="text-6xl font-bold mb-10 tracking-tighter text-center leading-none text-white drop-shadow-2xl">{formatCurrency(balance)}</h2>
            <div className="grid grid-cols-2 gap-12 border-t border-white/20 pt-8">
                <div className="flex flex-col items-center border-r border-white/10">
                    <p className="text-[9px] uppercase tracking-widest text-indigo-100 mb-2 font-bold text-center">Gross Inflow</p>
                    <div className="flex items-center space-x-3">
                        <div className="bg-green-400 p-2 rounded-lg shadow-inner"><i className="fas fa-arrow-down text-white text-xs"></i></div>
                        <p className="text-3xl font-bold text-green-400 leading-none">{formatCurrency(income)}</p>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-[9px] uppercase tracking-widest text-indigo-100 mb-2 font-bold text-center">Expenditure</p>
                    <div className="flex items-center space-x-3">
                        <div className="bg-red-400 p-2 rounded-lg shadow-inner"><i className="fas fa-arrow-up text-white text-xs"></i></div>
                        <p className="text-3xl font-bold text-red-400 leading-none">{formatCurrency(expense)}</p>
                    </div>
                </div>
            </div>
        </div>
    </header>
  );
};

export default Header;
