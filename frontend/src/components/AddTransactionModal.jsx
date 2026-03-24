import React, { useState } from 'react';

const AddTransactionModal = ({ isOpen, onClose, onAddTransaction }) => {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Other Expense');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category || !date) return;
    let icon = 'money-bill-wave';
    if (type === 'expense') {
        if (description.toLowerCase().includes('food') || category === 'Food & Dining') icon = 'utensils';
        else if (description.toLowerCase().includes('uber') || category === 'Transportation') icon = 'car';
        else if (category === 'Shopping') icon = 'shopping-bag';
    }
    onAddTransaction({ type, amount: parseFloat(amount), category, description, date, icon, fromSms: false });
    setAmount(''); setDescription(''); onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[200] backdrop-blur-md">
        <div className="bg-white rounded-[3rem] w-full max-w-5xl slide-in overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-gray-100 flex flex-col max-h-[90vh]">
            <div className="p-7 border-b flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-2xl text-gray-800 tracking-tight">Add Transaction</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-all"><i className="fas fa-times text-xl"></i></button>
            </div>
            <div className="p-8 overflow-y-auto flex-1 no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-3">
                        <label className="block text-gray-500 font-bold mb-3 ml-1 text-[10px] uppercase tracking-[0.2em]">Transaction Flow</label>
                        <div className="flex bg-gray-100 p-1.5 rounded-xl shadow-inner max-w-xs">
                            <button onClick={() => setType('income')} className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${type === 'income' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}>Income</button>
                            <button onClick={() => setType('expense')} className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${type === 'expense' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}>Expense</button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-500 font-bold mb-3 ml-1 text-[10px] uppercase tracking-[0.2em]">Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-4 text-gray-300 font-bold text-lg">₹</span>
                            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full pl-10 p-3.5 border-2 border-gray-100 rounded-xl focus:border-indigo-600 outline-none transition-all shadow-sm font-bold text-xl" placeholder="0.00" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-500 font-bold mb-3 ml-1 text-[10px] uppercase tracking-[0.2em]">Category</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3.5 border-2 border-gray-100 rounded-xl focus:border-indigo-600 outline-none transition-all bg-white font-bold hover:bg-gray-50 cursor-pointer appearance-none shadow-sm">
                            {type === 'expense' ? (
                              <><option value="Other Expense">Other Expense</option><option value="Food & Dining">Food & Dining</option><option value="Shopping">Shopping</option><option value="Transportation">Transportation</option><option value="Utilities">Utilities</option></>
                            ) : (
                              <><option value="Salary">Salary</option><option value="Freelance">Freelance</option><option value="Other Income">Other Income</option></>
                            )}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-500 font-bold mb-3 ml-1 text-[10px] uppercase tracking-[0.2em]">Date</label>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-3.5 border-2 border-gray-100 rounded-xl focus:border-indigo-600 outline-none transition-all shadow-sm font-bold" />
                    </div>
                    <div className="lg:col-span-3">
                        <label className="block text-gray-500 font-bold mb-3 ml-1 text-[10px] uppercase tracking-[0.2em]">Memo / Note</label>
                        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3.5 border-2 border-gray-100 rounded-xl focus:border-indigo-600 outline-none transition-all shadow-sm font-semibold" placeholder="Add a description..." />
                    </div>
                </div>
            </div>
            <div className="p-7 border-t bg-gray-50/50 flex justify-end space-x-4">
                <button onClick={onClose} className="px-8 py-3.5 border-2 border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-white transition-all text-sm">Cancel</button>
                <button onClick={handleSubmit} className="px-12 py-3.5 bg-indigo-600 text-white rounded-xl font-bold shadow-xl hover:bg-indigo-700 transform hover:-translate-y-1 transition-all text-sm">Save Record</button>
            </div>
        </div>
    </div>
  );
};

export default AddTransactionModal;
