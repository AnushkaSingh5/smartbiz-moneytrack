import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import TransactionList from '../components/TransactionList';
import AddTransactionModal from '../components/AddTransactionModal';
import CategoriesTab from '../components/CategoriesTab';
import ReportsTab from '../components/ReportsTab';
import FilterModal from '../components/FilterModal';
import SMSImportModal from '../components/SMSImportModal';
import SMSPermissionModal from '../components/SMSPermissionModal';

const Home = () => {
  // Navigation & View states
  const [activeTab, setActiveTab] = useState('transactions'); // transactions, categories, reports
  const [view, setView] = useState('dashboard'); // dashboard, allTransactions

  // Transaction state
  const [transactions, setTransactions] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Filter state
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState({
    dateRange: 'month',
    fromDate: '',
    toDate: '',
    type: 'all',
    category: 'all'
  });

  // SMS related state & simulation
  const [isSMSModalOpen, setIsSMSModalOpen] = useState(false);
  const [isSMSPermissionModalOpen, setIsSMSPermissionModalOpen] = useState(false);
  const [hasSMSPermission, setHasSMSPermission] = useState(false);
  const [pendingSMSTransactions, setPendingSMSTransactions] = useState([]);
  const [smsStatus, setSmsStatus] = useState('Last synced: Just now');

  const sampleSmsMessages = [];

  const parseSMSToTransaction = (sms) => {
    const amountRegex = /[₹]\s*([0-9,.]+)/i;
    const debitRegex = /debit|spent|payment of/i;
    const creditRegex = /credited|received/i;

    const amountMatch = sms.body.match(amountRegex);
    if (!amountMatch) return null;

    const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    const isDebit = debitRegex.test(sms.body);
    const isCredit = creditRegex.test(sms.body);

    let type = isCredit ? 'income' : 'expense';
    let icon = 'money-bill-wave';
    let category = 'Other Expense';

    if (sms.body.includes('UBER') || sms.body.includes('RIDE')) {
        category = 'Transportation';
        icon = 'car';
    } else if (sms.body.includes('Amazon') || sms.body.includes('Flipkart')) {
        category = 'Shopping';
        icon = 'shopping-bag';
    } else if (sms.body.includes('Restaurant') || sms.body.includes('Swiggy') || sms.body.includes('Zomato')) {
        category = 'Food & Dining';
        icon = 'utensils';
    } else if (isCredit && sms.body.includes('Salary')) {
        category = 'Salary';
        icon = 'money-bill-wave';
    }

    return {
      type,
      amount,
      category,
      description: sms.address + ' ' + (isDebit ? 'Debit' : 'Credit'),
      date: sms.date.split('T')[0],
      icon,
      fromSms: true
    };
  };

  const handleSMSImport = () => {
    if (!hasSMSPermission) {
      setIsSMSPermissionModalOpen(true);
      return;
    }
    const found = sampleSmsMessages
      .map(parseSMSToTransaction)
      .filter(t => t && !transactions.some(existing => existing.description === t.description && existing.amount === t.amount));
    
    if (found.length > 0) {
      setPendingSMSTransactions(found);
      setIsSMSModalOpen(true);
    } else {
      setSmsStatus('No new transactions found');
    }
  };

  useEffect(() => {
    if (isAddModalOpen || isFilterModalOpen || isSMSModalOpen || isSMSPermissionModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isAddModalOpen, isFilterModalOpen, isSMSModalOpen, isSMSPermissionModalOpen]);

  const handleFetchTransactions = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/all', { timeout: 10000 });
      setTransactions(res.data);
    } catch (error) {
      console.error('SERVER ERROR (Fetch):', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    handleFetchTransactions();
  }, []);

  const handleAddTransaction = async (newTransaction) => {
    try {
      await axios.post('http://127.0.0.1:5000/add', newTransaction, { timeout: 10000 });
      await handleFetchTransactions(); 
      setIsAddModalOpen(false); 
    } catch (error) {
      console.error('SERVER ERROR (Add):', error.response?.data || error.message);
    }
  };

  const handleImportSelectedSMS = async (selected) => {
    try {
      for (const t of selected) {
        await axios.post('http://127.0.0.1:5000/add', t, { timeout: 10000 });
      }
      setPendingSMSTransactions([]);
      await handleFetchTransactions();
      setIsSMSModalOpen(false);
      setSmsStatus('Imported ' + selected.length + ' transactions');
    } catch (error) {
      console.error('SMS Import failed:', error);
    }
  };

  const availableCategories = useMemo(() => {
    const defaultCategories = ['Food & Dining', 'Shopping', 'Transportation', 'Salary', 'Freelance', 'Other Expense', 'Other Income'];
    const categories = new Set(defaultCategories);
    transactions.forEach(t => categories.add(t.category));
    return Array.from(categories);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];
    const today = new Date();
    const normalizeToLocalDay = (val) => {
        if (!val) return 0;
        const d = new Date(val);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    };
    const currentLocalDay = normalizeToLocalDay(today);

    switch (currentFilter.dateRange) {
      case 'today':
        filtered = filtered.filter(t => normalizeToLocalDay(t.date) === currentLocalDay);
        break;
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekStartTime = normalizeToLocalDay(weekStart);
        filtered = filtered.filter(t => normalizeToLocalDay(t.date) >= weekStartTime);
        break;
      case 'month':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthStartTime = normalizeToLocalDay(monthStart);
        filtered = filtered.filter(t => normalizeToLocalDay(t.date) >= monthStartTime);
        break;
      case 'quarter':
        const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
        const quarterStartTime = normalizeToLocalDay(quarterStart);
        filtered = filtered.filter(t => normalizeToLocalDay(t.date) >= quarterStartTime);
        break;
      case 'year':
        const yearStart = new Date(today.getFullYear(), 0, 1);
        const yearStartTime = normalizeToLocalDay(yearStart);
        filtered = filtered.filter(t => normalizeToLocalDay(t.date) >= yearStartTime);
        break;
      case 'custom':
        if (currentFilter.fromDate) {
            const from = normalizeToLocalDay(currentFilter.fromDate);
            filtered = filtered.filter(t => normalizeToLocalDay(t.date) >= from);
        }
        if (currentFilter.toDate) {
            const to = normalizeToLocalDay(currentFilter.toDate);
            filtered = filtered.filter(t => normalizeToLocalDay(t.date) <= to);
        }
        break;
      default: break;
    }

    if (currentFilter.type !== 'all') filtered = filtered.filter(t => t.type === currentFilter.type);
    if (currentFilter.category !== 'all') filtered = filtered.filter(t => t.category === currentFilter.category);

    return filtered.sort((a, b) => {
        const d1 = new Date(b.date).getTime();
        const d2 = new Date(a.date).getTime();
        if (d1 !== d2) return d1 - d2;
        return (b._id || '').localeCompare(a._id || '');
    });
  }, [transactions, currentFilter]);

  const totals = useMemo(() => {
    let income = 0, expense = 0;
    filteredTransactions.forEach(t => {
      const type = t.type?.toLowerCase();
      if (type === 'income') income += Number(t.amount);
      else if (type === 'expense') expense += Number(t.amount);
    });
    return { income, expense, balance: income - expense };
  }, [filteredTransactions]);

  const renderFilterSummary = () => {
    if (currentFilter.dateRange === 'month' && currentFilter.type === 'all' && currentFilter.category === 'all') return 'Showing: This Month';
    let t = currentFilter.dateRange.charAt(0).toUpperCase() + currentFilter.dateRange.slice(1);
    if (currentFilter.type !== 'all') t += ` • ${currentFilter.type.charAt(0).toUpperCase() + currentFilter.type.slice(1)}`;
    if (currentFilter.category !== 'all') t += ` • ${currentFilter.category}`;
    return `Showing: ${t}`;
  };

  const GlobalModals = (
    <>
      <AddTransactionModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAddTransaction={handleAddTransaction} />
      <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} currentFilter={currentFilter} availableCategories={availableCategories} onApplyFilter={(f) => { setCurrentFilter(f); setView('allTransactions'); }} />
      <SMSImportModal isOpen={isSMSModalOpen} onClose={() => setIsSMSModalOpen(false)} smsTransactions={pendingSMSTransactions} onImport={handleImportSelectedSMS} />
      <SMSPermissionModal isOpen={isSMSPermissionModalOpen} onClose={() => setIsSMSPermissionModalOpen(false)} onGrant={() => setHasSMSPermission(true)} />
    </>
  );

  const FAB = (
    <button 
      onClick={() => setIsAddModalOpen(true)} 
      className="fixed bottom-10 right-10 bg-indigo-600 text-white p-5 h-16 w-16 rounded-full shadow-2xl z-50 flex items-center justify-center hover:scale-110 active:scale-95 transition-all outline-none border-none border-0 ring-0"
    >
      <i className="fas fa-plus text-2xl"></i>
    </button>
  );

  if (view === 'allTransactions') {
    return (
        <div className="app-container no-scrollbar pb-10">
            <Header balance={totals.balance} income={totals.income} expense={totals.expense} onOpenFilter={() => setIsFilterModalOpen(true)} />
            <main className="px-5 -mt-12 relative z-10">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-gray-50 p-6 flex items-center justify-between border-b">
                        <div className="flex items-center">
                            <button onClick={() => setView('dashboard')} className="mr-4 bg-white p-2 rounded-xl shadow-sm border border-gray-200 text-indigo-600 hover:bg-gray-50 transition-all">
                                <i className="fas fa-arrow-left"></i>
                            </button>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Transaction History</h2>
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest">{renderFilterSummary()}</p>
                            </div>
                        </div>
                        <button className="bg-indigo-50 text-indigo-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all" onClick={() => setCurrentFilter({ dateRange: 'month', fromDate: '', toDate: '', type: 'all', category: 'all' })}>Reset All</button>
                    </div>
                    <div className="p-8"><TransactionList transactions={filteredTransactions} /></div>
                </div>
            </main>
            {FAB}
            {GlobalModals}
        </div>
    );
  }

  return (
    <div className="app-container no-scrollbar">
      <Header balance={totals.balance} income={totals.income} expense={totals.expense} onOpenFilter={() => setIsFilterModalOpen(true)} />
      <main className="px-5 -mt-12 relative z-10 pb-20">
        <div className="bg-white rounded-[2rem] shadow-2xl p-2.5 mb-10 flex max-w-2xl mx-auto overflow-hidden border border-gray-100 ring-2 ring-indigo-50/50">
            {['transactions', 'categories', 'reports'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)} className={`flex-1 py-4.5 font-bold text-center capitalize rounded-2xl transition-all duration-300 transform active:scale-95 text-xs sm:text-sm md:text-base ${activeTab === t ? 'bg-indigo-600 text-white shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)]' : 'text-gray-400 hover:text-indigo-600 hover:bg-gray-50'}`}>
                  {t}
                </button>
            ))}
        </div>

        <div className="desktop-grid">
            <div className="space-y-10">
                {activeTab === 'transactions' && (
                  <div className="tab-content active transition-opacity duration-300">
                    <div className="lg:hidden mb-10">
                        <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-[2rem] p-8 shadow-xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="bg-indigo-600 p-4 rounded-2xl mr-5 shadow-lg"><i className="fas fa-magic text-white text-2xl"></i></div>
                                    <div><h3 className="font-bold text-gray-800 text-lg">Smart Sync</h3><p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">{smsStatus}</p></div>
                                </div>
                                <button onClick={handleSMSImport} className="bg-indigo-600 text-white h-14 w-14 rounded-2xl shadow-xl pulse flex items-center justify-center"><i className="fas fa-sync-alt"></i></button>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-3xl font-bold text-gray-800 tracking-tight">Recent Activity</h3>
                        <button onClick={() => setView('allTransactions')} className="text-indigo-600 font-bold hover:underline px-6 py-3 bg-indigo-50 rounded-2xl text-sm">View Full History</button>
                    </div>
                    <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 border border-gray-50"><TransactionList transactions={filteredTransactions.slice(0, 15)} /></div>
                  </div>
                )}
                {activeTab === 'categories' && <CategoriesTab transactions={filteredTransactions} />}
                {activeTab === 'reports' && <ReportsTab transactions={filteredTransactions} />}
            </div>

            <div className="hidden lg:block space-y-10 lg:sticky lg:top-8">
                <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-[2.5rem] p-10 shadow-2xl">
                    <div className="flex items-center mb-8">
                        <div className="bg-indigo-600 p-5 rounded-3xl mr-6 shadow-xl"><i className="fas fa-magic text-white text-3xl"></i></div>
                        <div><h3 className="text-2xl font-bold text-gray-800">Smart Sync</h3><p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">{smsStatus}</p></div>
                    </div>
                    <p className="text-base text-gray-600 mb-10 leading-relaxed font-semibold">Instantly categorize bank transfers and spending alerts from SMS messages.</p>
                    <button onClick={handleSMSImport} className="w-full bg-indigo-600 text-white py-5 px-8 rounded-3xl font-bold shadow-xl hover:bg-indigo-700 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-4">
                        <i className="fas fa-sync-alt flex-shrink-0"></i>
                        <span className="text-lg whitespace-nowrap">Check New Messages</span>
                    </button>
                </div>
                <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-800 mb-8">Quick Stats</h3>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center p-5 bg-gray-50 rounded-[1.5rem]"><span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Logs</span><span className="text-2xl font-bold text-indigo-600">{filteredTransactions.length}</span></div>
                        <div className="flex justify-between items-center p-5 bg-gray-50 rounded-[1.5rem]"><span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Savings %</span><span className="text-2xl font-bold text-green-600">{totals.income > 0 ? Math.round(((totals.income - totals.expense) / totals.income) * 100) : 0}%</span></div>
                    </div>
                </div>
            </div>
        </div>
      </main>
      {FAB}
      {GlobalModals}
    </div>
  );
};

export default Home;
