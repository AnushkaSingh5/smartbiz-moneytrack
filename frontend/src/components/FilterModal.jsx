import React, { useState } from 'react';

const FilterModal = ({ isOpen, onClose, currentFilter, availableCategories, onApplyFilter }) => {
  const [dateRange, setDateRange] = useState(currentFilter.dateRange || 'all');
  const [type, setType] = useState(currentFilter.type || 'all');
  const [category, setCategory] = useState(currentFilter.category || 'all');

  const handleApply = () => {
    onApplyFilter({ dateRange, type, category, fromDate: '', toDate: '' });
    onClose();
  };

  const handleReset = () => {
    setDateRange('all');
    setType('all');
    setCategory('all');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[200] backdrop-blur-md">
        <div className="bg-white rounded-[3rem] w-full max-w-4xl slide-in overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-gray-100 flex flex-col max-h-[90vh]">
            <div className="p-7 border-b flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-2xl text-gray-800 tracking-tight">Refine Records</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-all"><i className="fas fa-times text-xl"></i></button>
            </div>
            
            <div className="p-8 space-y-8 overflow-y-auto flex-1 no-scrollbar">
                <div className="space-y-3">
                    <label className="block text-gray-500 font-bold ml-1 text-[10px] uppercase tracking-[0.2em]">Timeline</label>
                    <div className="grid grid-cols-4 gap-3">
                        {['all', 'today', 'week', 'month'].map(r => (
                            <button key={r} onClick={() => setDateRange(r)} className={`py-2.5 rounded-xl font-bold transition-all text-xs border-2 ${dateRange === r ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}>
                                {r.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="block text-gray-500 font-bold ml-1 text-[10px] uppercase tracking-[0.2em]">Record Type</label>
                        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-3.5 border-2 border-gray-100 rounded-xl focus:border-indigo-600 outline-none transition-all font-bold text-sm bg-white">
                            <option value="all">All Transactions</option>
                            <option value="income">Credits Only</option>
                            <option value="expense">Debits Only</option>
                        </select>
                    </div>
                    <div className="space-y-3">
                        <label className="block text-gray-500 font-bold ml-1 text-[10px] uppercase tracking-[0.2em]">Sector</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3.5 border-2 border-gray-100 rounded-xl focus:border-indigo-600 outline-none transition-all font-bold text-sm bg-white">
                            <option value="all">All Categories</option>
                            {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="p-7 border-t bg-gray-50/50 flex justify-end space-x-4">
                <button onClick={handleReset} className="px-8 py-3.5 border-2 border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-white transition-all text-sm">Reset</button>
                <button onClick={handleApply} className="px-12 py-3.5 bg-indigo-600 text-white rounded-xl font-bold shadow-xl hover:bg-indigo-700 transform hover:-translate-y-1 transition-all text-sm">Apply Filters</button>
            </div>
        </div>
    </div>
  );
};

export default FilterModal;
