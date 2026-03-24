import React, { useState } from 'react';

const SMSImportModal = ({ isOpen, onClose, smsTransactions, onImport }) => {
  const [selected, setSelected] = useState(smsTransactions.map((_, i) => i));

  if (!isOpen) return null;

  const toggleSelect = (idx) => {
    if (selected.includes(idx)) setSelected(selected.filter(i => i !== idx));
    else setSelected([...selected, idx]);
  };

  const handleImport = () => {
    onImport(smsTransactions.filter((_, i) => selected.includes(i)));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-6 z-[200] backdrop-blur-sm">
        <div className="bg-white rounded-[3rem] w-full max-w-2xl slide-in overflow-hidden shadow-2xl border border-gray-100">
            <div className="p-8 border-b flex justify-between items-center bg-indigo-600 text-white">
                <div className="flex items-center space-x-4">
                    <i className="fas fa-magic text-2xl"></i>
                    <h3 className="font-black text-2xl tracking-tight uppercase tracking-[0.1em]">Parsed Bank Messages</h3>
                </div>
                <button onClick={onClose} className="text-white opacity-60 hover:opacity-100"><i className="fas fa-times text-xl"></i></button>
            </div>
            
            <div className="p-10">
                <p className="text-gray-500 font-black uppercase text-sm tracking-widest mb-6 px-1">Detected {smsTransactions.length} Potential Logs</p>
                <div className="space-y-4 max-h-[450px] overflow-y-auto pr-4 no-scrollbar">
                    {smsTransactions.map((t, i) => (
                        <div key={i} onClick={() => toggleSelect(i)} className={`p-6 rounded-3xl border-3 cursor-pointer transition-all flex items-center justify-between group ${selected.includes(i) ? 'border-indigo-600 bg-indigo-50 shadow-xl scale-[1.02]' : 'border-gray-50 bg-gray-50 hover:border-gray-200 opacity-60'}`}>
                            <div className="flex items-center space-x-5">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${t.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    <i className={`fas fa-${t.icon || 'money-bill-wave'} text-xl`}></i>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-black text-gray-800 text-lg">{t.description}</h4>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t.category} • {t.date}</p>
                                </div>
                            </div>
                            <div className="text-right flex flex-col items-end space-y-2">
                                <p className={`text-2xl font-black ${t.type === 'income' ? 'text-green-600' : 'text-red-600'} tracking-tighter`}>{t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}</p>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${selected.includes(i) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                                    {selected.includes(i) && <i className="fas fa-check text-white text-[10px]"></i>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-8 border-t bg-gray-50 flex justify-end space-x-4">
                <button onClick={onClose} className="px-8 py-4 bg-white border-2 border-gray-100 rounded-[1.5rem] font-black text-gray-400 hover:text-gray-600 transition-all shadow-sm">Discard All</button>
                <button onClick={handleImport} className="px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black shadow-xl hover:bg-indigo-700 transform hover:-translate-y-1 transition-all flex items-center space-x-3">
                    <i className="fas fa-sync-alt"></i>
                    <span className="text-lg">Synchronize Selected</span>
                </button>
            </div>
        </div>
    </div>
  );
};

export default SMSImportModal;
