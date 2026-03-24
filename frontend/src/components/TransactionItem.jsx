import React from 'react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const TransactionItem = ({ transaction }) => {
  const isIncome = transaction.type === 'income';
  
  return (
    <div className={`flex items-center justify-between p-5 mb-4 bg-white rounded-2xl shadow-sm border-l-[6px] transition-all hover:shadow-md ${isIncome ? 'border-green-500' : 'border-red-500'}`}>
        <div className="flex items-center space-x-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-inner ${isIncome ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                <i className={`fas ${transaction.icon || (isIncome ? 'fa-wallet' : 'fa-shopping-cart')}`}></i>
            </div>
            <div>
                <h4 className="font-bold text-gray-800 text-lg">{transaction.description}</h4>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">{transaction.category} • {new Date(transaction.date).toLocaleDateString()}</p>
            </div>
        </div>
        <div className={`text-xl font-bold ${isIncome ? 'text-green-600' : 'text-red-500'}`}>
            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
        </div>
    </div>
  );
};

export default TransactionItem;
