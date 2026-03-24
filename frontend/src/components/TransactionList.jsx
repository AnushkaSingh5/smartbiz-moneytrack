import React from 'react';
import TransactionItem from './TransactionItem';

const TransactionList = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div className="bg-gray-50 rounded-[2.5rem] p-16 text-center border-4 border-dashed border-gray-100 flex flex-col items-center">
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-6">
          <i className="fas fa-receipt text-gray-300 text-3xl"></i>
        </div>
        <h3 className="text-xl font-black text-gray-500 uppercase tracking-widest">No matching logs found</h3>
        <p className="text-sm text-gray-400 mt-2 font-bold italic">Adjust your filters or sync your SMS!</p>
      </div>
    );
  }

  // Group by date for a better desktop "Bank Statement" feel
  const groups = transactions.reduce((acc, t) => {
    const date = new Date(t.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    if (!acc[date]) acc[date] = [];
    acc[date].push(t);
    return acc;
  }, {});

  return (
    <div className="space-y-12">
      {Object.entries(groups).map(([date, items]) => (
        <div key={date}>
          <div className="flex items-center space-x-4 mb-6 sticky top-0 bg-white bg-opacity-90 backdrop-blur-sm py-2 z-10 pr-4">
             <div className="bg-gray-800 h-10 w-1.5 rounded-full"></div>
             <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">{date}</h4>
          </div>
          <div className="space-y-4">
            {items.map((t) => (
              <TransactionItem key={t._id || t.id} transaction={t} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
