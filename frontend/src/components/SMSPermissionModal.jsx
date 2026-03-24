import React from 'react';

const SMSPermissionModal = ({ isOpen, onClose, onGrant }) => {
  if (!isOpen) return null;

  const handleGrant = () => {
    onGrant();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-6 z-[300] backdrop-blur-md">
        <div className="bg-white rounded-[3.5rem] w-full max-w-lg slide-in overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-gray-100 text-center">
            <div className="p-12 pb-6 flex flex-col items-center">
                <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-8 pulse shadow-inner">
                    <i className="fas fa-shield-alt text-indigo-600 text-3xl"></i>
                </div>
                <h3 className="text-3xl font-black text-gray-800 tracking-tight mb-4 uppercase tracking-[0.05em]">System Permissions Required</h3>
                <p className="text-gray-500 font-bold leading-relaxed mb-10 px-6">To enable <span className="text-indigo-600 font-black">Smart Sync</span>, we need your consent to read financial SMS messages for automatic categorization.</p>
                
                <div className="space-y-4 w-full px-10">
                    <button onClick={handleGrant} className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black shadow-2xl hover:bg-indigo-700 transform hover:-translate-y-1 transition-all text-xl">Grant Full Access</button>
                    <button onClick={onClose} className="w-full py-4 rounded-2xl font-black text-gray-400 hover:text-gray-600 transition-all text-sm uppercase tracking-widest">Maybe Later</button>
                </div>
            </div>
            
            <div className="p-8 bg-gray-50 border-t flex justify-center items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <i className="fas fa-lock text-gray-300"></i>
                <span>Enabling local-only on-device synchronization and encryption</span>
            </div>
        </div>
    </div>
  );
};

export default SMSPermissionModal;
