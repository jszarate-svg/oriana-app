'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Wallet, Receipt, History, PlusCircle, 
  CheckCircle, Banknote, ShieldCheck, Trash2, Calendar as CalendarIcon,
  Target, TrendingUp, ChevronRight, ChevronLeft, PiggyBank,
  PanelLeftClose, PanelLeftOpen, AlertCircle, Edit2, Check, X, ArrowUpRight, ArrowDownRight, Scale, Printer, Building2, ChevronDown,
  Sun, Moon, Tag, Coins, User, Sparkles, HelpCircle, BookOpen, Layers, Sunrise,
  Eye, EyeOff, Lock, Download, Upload, CreditCard, RefreshCw, PieChart, Shield
} from 'lucide-react';

type TabType = 'dashboard' | 'savings' | 'transactions' | 'accounts' | 'bills' | 'budgets' | 'debts';

interface Account {
  id: string;
  name: string;
  type: 'Savings' | 'Wallet' | 'Cash';
  logoKey: string;
  startingBalance: number;
  selected?: boolean;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'Income' | 'Expense' | 'Transfer';
  category: string;
  fromAccount: string;
  toAccount?: string;
}

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  isPaid: boolean;
  frequency?: 'One-time' | 'Weekly' | 'Bi-weekly' | 'Monthly';
  durationMonths?: number;
}

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
}

interface CategoryBudget {
  category: string;
  limit: number;
}

interface Debt {
  id: string;
  name: string;
  totalBalance: number;
  remainingBalance: number;
  interestRate: number;
  monthlyPayment: number;
  dueDate: string;
}

const CATEGORY_PRESETS = [
  'Essentials',
  'Groceries',
  'Transport',
  'Entertainment',
  'Education',
  'Savings',
  'Food & Dining',
  'Bills & Utilities',
  'Shopping',
  'Income',
  'Custom...'
];

const LOGO_OPTIONS = [
  { id: 'landbank', name: 'LandBank' },
  { id: 'maribank', name: 'MariBank' },
  { id: 'gotyme', name: 'GoTyme' },
  { id: 'gcash', name: 'GCash' },
  { id: 'maya', name: 'Maya' },
  { id: 'seabank', name: 'SeaBank' },
  { id: 'bdo', name: 'BDO' },
  { id: 'bpi', name: 'BPI' },
  { id: 'unionbank', name: 'UnionBank' },
  { id: 'metrobank', name: 'Metrobank' },
  { id: 'cimb', name: 'CIMB Bank' },
  { id: 'grabpay', name: 'GrabPay' },
  { id: 'shopeepay', name: 'ShopeePay' },
  { id: 'tonik', name: 'Tonik' },
  { id: 'cash', name: 'Cash' },
  { id: 'generic', name: 'Generic Bank' },
];

const PRESET_ACCOUNTS: Account[] = [
  { id: 'LandBank', name: 'LandBank (Payroll)', type: 'Wallet', logoKey: 'landbank', startingBalance: 0, selected: true },
  { id: 'MariBank - Savings', name: 'MariBank Savings', type: 'Savings', logoKey: 'maribank', startingBalance: 0, selected: true },
  { id: 'GoTyme - Savings', name: 'GoTyme Savings', type: 'Savings', logoKey: 'gotyme', startingBalance: 0, selected: true },
  { id: 'GCash', name: 'GCash Wallet', type: 'Wallet', logoKey: 'gcash', startingBalance: 0, selected: true },
  { id: 'Maya', name: 'Maya Wallet', type: 'Wallet', logoKey: 'maya', startingBalance: 0, selected: false },
  { id: 'Cash', name: 'Physical Cash', type: 'Cash', logoKey: 'cash', startingBalance: 0, selected: true },
];

const DEFAULT_BILLS: Bill[] = [
  { id: '1', name: 'Electricity Bill', amount: 3500, dueDate: '2026-10-25', category: 'Bills & Utilities', isPaid: false, frequency: 'Monthly', durationMonths: 12 },
  { id: '2', name: 'Internet Fiber', amount: 1699, dueDate: '2026-10-28', category: 'Bills & Utilities', isPaid: true, frequency: 'Monthly', durationMonths: 0 },
  { id: '3', name: 'Water Supply', amount: 450, dueDate: '2026-10-30', category: 'Bills & Utilities', isPaid: false, frequency: 'Monthly', durationMonths: 6 },
];

const DEFAULT_SAVINGS_GOALS: SavingsGoal[] = [
  { id: '1', name: 'Emergency Fund', targetAmount: 100000, currentAmount: 30000, targetDate: '2026-12-31', category: 'Safety Net' },
  { id: '2', name: 'New Laptop Goal', targetAmount: 45000, currentAmount: 20000, targetDate: '2026-11-15', category: 'Gadgets' },
];

const DEFAULT_BUDGETS: CategoryBudget[] = [
  { category: 'Groceries', limit: 12000 },
  { category: 'Food & Dining', limit: 8000 },
  { category: 'Entertainment', limit: 5000 },
  { category: 'Shopping', limit: 6000 },
];

const DEFAULT_DEBTS: Debt[] = [
  { id: '1', name: 'Credit Card Balance', totalBalance: 35000, remainingBalance: 22000, interestRate: 3.5, monthlyPayment: 5000, dueDate: '2026-11-05' },
];

const OrianaLogoMark = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 100 60" fill="none" className={className}>
    <path d="M 50,55 L 50,25" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
    <path d="M 50,55 L 35,28" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
    <path d="M 50,55 L 65,28" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
    <path d="M 50,55 L 22,35" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
    <path d="M 50,55 L 78,35" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
    <path d="M 50,55 L 12,45" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
    <path d="M 50,55 L 88,45" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
    <path d="M 50,55 L 5,55" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
    <path d="M 50,55 L 95,55" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

const BankLogo = ({ logoKey, name, className = "w-9 h-9" }: { logoKey?: string; name?: string; className?: string }) => {
  const key = (logoKey || name || '').toLowerCase();

  if (key.includes('landbank')) {
    return (
      <div className={`${className} rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center p-1 shrink-0`}>
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
          <circle cx="50" cy="50" r="46" fill="white" />
          <path d="M 50 15 C 44 32 30 40 25 55 C 32 50 42 46 50 63 C 58 46 68 50 75 55 C 70 40 56 32 50 15 Z" fill="#D97706" />
          <path d="M 50 63 L 50 90" stroke="#D97706" strokeWidth="5" />
          <path d="M 10 63 C 30 60 40 80 50 80 C 60 80 70 60 90 63 C 75 88 25 88 10 63 Z" fill="#D97706" />
        </svg>
      </div>
    );
  }

  if (key.includes('maribank')) {
    return (
      <div className={`${className} rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center p-1 shrink-0`}>
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
          <circle cx="50" cy="42" r="32" fill="#E85D04" />
          <circle cx="50" cy="42" r="28" fill="none" stroke="white" strokeWidth="3" />
          <text x="50" y="52" textAnchor="middle" fill="white" fontSize="32" fontWeight="800" fontFamily="sans-serif">M</text>
          <path d="M 12 70 C 25 60 35 80 50 70 C 65 60 75 80 88 70 C 75 90 25 90 12 70 Z" fill="#D97706" />
        </svg>
      </div>
    );
  }

  if (key.includes('gotyme')) {
    return (
      <div className={`${className} rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center p-1 shrink-0`}>
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
          <path d="M 32 30 C 18 30 18 70 32 70 C 45 70 45 52 35 52 L 48 52 C 48 78 12 78 12 30 C 12 18 50 18 32 30 Z" fill="#44403C" />
          <circle cx="68" cy="50" r="22" stroke="#44403C" strokeWidth="12" fill="none" />
          <path d="M 68 28 L 84 20 M 74 32 L 88 28 M 78 40 L 90 38" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (key.includes('cash')) {
    return (
      <div className={`${className} rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center p-1.5 shrink-0`}>
        <Banknote className="w-5 h-5 text-amber-500" />
      </div>
    );
  }

  return (
    <div className={`${className} rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center p-1.5 shrink-0`}>
      <Building2 className="w-5 h-5 text-amber-500" />
    </div>
  );
};

const GlassLogoPicker = ({ selectedLogo, onSelect, isLight }: { selectedLogo: string; onSelect: (id: string) => void; isLight: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = LOGO_OPTIONS.find(opt => opt.id === selectedLogo) || LOGO_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full ${
          isLight ? 'bg-stone-100 border-stone-300 text-stone-800 hover:bg-stone-200' : 'bg-stone-900 border-stone-700 text-stone-200 hover:bg-stone-800'
        } border rounded-2xl p-2.5 flex items-center justify-between text-xs focus:outline-none transition`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <BankLogo logoKey={selectedOption.id} className="w-6 h-6" />
          <span className="font-semibold truncate">{selectedOption.name}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute top-full left-0 right-0 mt-2 ${
          isLight ? 'bg-white border-stone-300 shadow-xl' : 'bg-stone-900 border-stone-700 shadow-xl'
        } border rounded-2xl p-1.5 z-50 max-h-60 overflow-y-auto space-y-1`}>
          {LOGO_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                onSelect(opt.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                selectedLogo === opt.id 
                  ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30' 
                  : isLight ? 'text-stone-700 hover:bg-stone-100' : 'text-stone-300 hover:bg-stone-800/60'
              }`}
            >
              <BankLogo logoKey={opt.id} className="w-6 h-6" />
              <span>{opt.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [accounts, setAccounts] = useState<Account[]>(PRESET_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bills, setBills] = useState<Bill[]>(DEFAULT_BILLS);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(DEFAULT_SAVINGS_GOALS);
  const [budgets, setBudgets] = useState<CategoryBudget[]>(DEFAULT_BUDGETS);
  const [debts, setDebts] = useState<Debt[]>(DEFAULT_DEBTS);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // PRIVACY MODE & PIN LOCK STATE
  const [privacyMode, setPrivacyMode] = useState<boolean>(false);
  const [securityPin, setSecurityPin] = useState<string>('');
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');

  // USER NAME & ONBOARDING
  const [userName, setUserName] = useState<string>('');
  const [inputName, setInputName] = useState<string>('');
  const [onboardingStep, setOnboardingStep] = useState<number>(0);

  // ONBOARDING CUSTOM ACCOUNT ADDER STATE
  const [showAddCustomOnboarding, setShowAddCustomOnboarding] = useState(false);
  const [obAccName, setObAccName] = useState('');
  const [obAccLogo, setObAccLogo] = useState('generic');
  const [obAccType, setObAccType] = useState<'Savings' | 'Wallet' | 'Cash'>('Wallet');
  const [obAccRawBal, setObAccRawBal] = useState('');

  // TUTORIAL SLIDE-OVER STATE
  const [showTutorialModal, setShowTutorialModal] = useState<boolean>(false);

  const [editingAccId, setEditingAccId] = useState<string | null>(null);
  const [editAccName, setEditAccName] = useState('');
  const [editAccType, setEditAccType] = useState<'Savings' | 'Wallet' | 'Cash'>('Wallet');
  const [editAccLogo, setEditAccLogo] = useState('generic');

  const [newAccName, setNewAccName] = useState('');
  const [newAccType, setNewAccType] = useState<'Savings' | 'Wallet' | 'Cash'>('Wallet');
  const [newAccLogo, setNewAccLogo] = useState('generic');
  const [newAccBal, setNewAccBal] = useState('');

  const [newBillName, setNewBillName] = useState('');
  const [newBillAmount, setNewBillAmount] = useState('');
  const [newBillDueDate, setNewBillDueDate] = useState('');
  const [newBillCategory, setNewBillCategory] = useState('Bills & Utilities');
  const [newBillFreq, setNewBillFreq] = useState<'One-time' | 'Weekly' | 'Bi-weekly' | 'Monthly'>('Monthly');
  const [newBillDuration, setNewBillDuration] = useState('0');

  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalCurrent, setGoalCurrent] = useState('');
  const [goalDate, setGoalDate] = useState('');
  const [goalCategory, setGoalCategory] = useState('General');

  // BUDGET FORM STATE
  const [budgetCategory, setBudgetCategory] = useState('Groceries');
  const [budgetLimitVal, setBudgetLimitVal] = useState('');

  // DEBT FORM STATE
  const [debtName, setDebtName] = useState('');
  const [debtTotal, setDebtTotal] = useState('');
  const [debtRemaining, setDebtRemaining] = useState('');
  const [debtAPR, setDebtAPR] = useState('');
  const [debtMonthly, setDebtMonthly] = useState('');
  const [debtDue, setDebtDue] = useState('');

  const [desc, setDesc] = useState('');
  const [rawAmount, setRawAmount] = useState('');
  const [type, setType] = useState<'Expense' | 'Income' | 'Transfer'>('Expense');
  const [selectedCategory, setSelectedCategory] = useState<string>('Essentials');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [fromAccount, setFromAccount] = useState<string>('');
  const [toAccount, setToAccount] = useState<string>('');

  const [txTypeFilter, setTxTypeFilter] = useState<'All' | 'Income' | 'Expense' | 'Transfer'>('All');
  const [selectedMonth, setSelectedMonth] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [dateFilter, setDateFilter] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('oriana_v29_theme') as 'dark' | 'light';
    const savedTx = localStorage.getItem('oriana_v29_tx');
    const savedBills = localStorage.getItem('oriana_v29_bills');
    const savedAccs = localStorage.getItem('oriana_v29_accs');
    const savedGoals = localStorage.getItem('oriana_v29_goals');
    const savedBudgets = localStorage.getItem('oriana_v29_budgets');
    const savedDebts = localStorage.getItem('oriana_v29_debts');
    const savedName = localStorage.getItem('oriana_v29_username');
    const savedPin = localStorage.getItem('oriana_v29_pin');

    if (savedTheme) setTheme(savedTheme);
    if (savedTx) setTransactions(JSON.parse(savedTx));
    if (savedBills) setBills(JSON.parse(savedBills));
    if (savedAccs) setAccounts(JSON.parse(savedAccs));
    if (savedGoals) setSavingsGoals(JSON.parse(savedGoals));
    if (savedBudgets) setBudgets(JSON.parse(savedBudgets));
    if (savedDebts) setDebts(JSON.parse(savedDebts));
    
    if (savedPin) {
      setSecurityPin(savedPin);
      setIsLocked(true);
    }

    if (savedName) {
      setUserName(savedName);
      setOnboardingStep(3);
    } else {
      setOnboardingStep(0);
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('oriana_v29_theme', theme);
      localStorage.setItem('oriana_v29_tx', JSON.stringify(transactions));
      localStorage.setItem('oriana_v29_bills', JSON.stringify(bills));
      localStorage.setItem('oriana_v29_accs', JSON.stringify(accounts));
      localStorage.setItem('oriana_v29_goals', JSON.stringify(savingsGoals));
      localStorage.setItem('oriana_v29_budgets', JSON.stringify(budgets));
      localStorage.setItem('oriana_v29_debts', JSON.stringify(debts));
      if (userName) localStorage.setItem('oriana_v29_username', userName);
      if (securityPin) localStorage.setItem('oriana_v29_pin', securityPin);
    }
  }, [theme, transactions, bills, accounts, savingsGoals, budgets, debts, userName, securityPin, isLoaded]);

  useEffect(() => {
    if (accounts.length > 0 && !fromAccount) {
      const active = accounts.filter(a => a.selected !== false);
      if (active.length > 0) {
        setFromAccount(active[0].name);
        if (active.length > 1) setToAccount(active[1].name);
      }
    }
  }, [accounts, fromAccount]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const fmt = (val: number) => {
    if (privacyMode) return '₱••••••';
    return `₱${val.toLocaleString()}`;
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) return;
    setUserName(inputName.trim());
    setOnboardingStep(1);
  };

  const toggleAccountSelection = (id: string) => {
    setAccounts(accounts.map(a => a.id === id ? { ...a, selected: !a.selected } : a));
  };

  const handleAddOnboardingCustomAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!obAccName.trim()) return;
    const parsedVal = obAccRawBal ? parseFloat(obAccRawBal) : 0;
    const newAcc: Account = {
      id: Date.now().toString(),
      name: obAccName.trim(),
      type: obAccType,
      logoKey: obAccLogo,
      startingBalance: isNaN(parsedVal) ? 0 : parsedVal,
      selected: true,
    };
    setAccounts([...accounts, newAcc]);
    setObAccName('');
    setObAccRawBal('');
    setShowAddCustomOnboarding(false);
  };

  const handleFinishOnboarding = () => {
    const activeAccounts = accounts.filter(a => a.selected !== false);
    setAccounts(activeAccounts.length > 0 ? activeAccounts : accounts);
    setOnboardingStep(3);
  };

  const handleAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setRawAmount(value);
  };

  const formattedDisplayAmount = rawAmount ? `₱${parseInt(rawAmount, 10).toLocaleString()}` : '';

  const getAccountBalance = (accName: string, starting: number) => {
    let bal = starting;
    transactions.forEach(tx => {
      if (tx.type === 'Income' && tx.fromAccount === accName) bal += tx.amount;
      if (tx.type === 'Expense' && tx.fromAccount === accName) bal -= tx.amount;
      if (tx.type === 'Transfer') {
        if (tx.fromAccount === accName) bal -= tx.amount;
        if (tx.toAccount === accName) bal += tx.amount;
      }
    });
    return bal;
  };

  const getAccountLogoKey = (accName: string) => {
    const acc = accounts.find(a => a.name === accName);
    return acc ? acc.logoKey : accName;
  };

  const activeAccounts = accounts.filter(a => a.selected !== false);
  const totalNetWorth = activeAccounts.reduce((acc, a) => acc + getAccountBalance(a.name, a.startingBalance), 0);
  const totalIncome = transactions.filter(t => t.type === 'Income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'Expense').reduce((acc, t) => acc + t.amount, 0);
  const totalFlow = totalIncome + totalExpense;
  const incomePct = totalFlow > 0 ? Math.round((totalIncome / totalFlow) * 100) : 50;
  const expensePct = totalFlow > 0 ? Math.round((totalExpense / totalFlow) * 100) : 50;

  const sortedBills = [...bills].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const upcomingBills = sortedBills.filter(b => !b.isPaid);

  const getCategorySpending = (catName: string) => {
    return transactions
      .filter(t => t.type === 'Expense' && t.category.toLowerCase() === catName.toLowerCase())
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const handlePayBillAndLog = (bill: Bill) => {
    if (activeAccounts.length === 0) return;
    const targetAccount = activeAccounts[0].name;

    const newTx: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      description: `Paid Bill: ${bill.name}`,
      amount: bill.amount,
      type: 'Expense',
      category: bill.category || 'Bills & Utilities',
      fromAccount: targetAccount,
    };

    setTransactions([newTx, ...transactions]);
    toggleBill(bill.id);
  };

  const handleExportJSON = () => {
    const data = {
      userName,
      accounts,
      transactions,
      bills,
      savingsGoals,
      budgets,
      debts,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oriana_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.accounts) setAccounts(data.accounts);
        if (data.transactions) setTransactions(data.transactions);
        if (data.bills) setBills(data.bills);
        if (data.savingsGoals) setSavingsGoals(data.savingsGoals);
        if (data.budgets) setBudgets(data.budgets);
        if (data.debts) setDebts(data.debts);
        if (data.userName) setUserName(data.userName);
        alert('Data successfully restored!');
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleExportCSV = () => {
    let csv = 'ID,Date,Description,Type,Category,Amount,From Account,To Account\n';
    transactions.forEach(t => {
      csv += `"${t.id}","${t.date}","${t.description}","${t.type}","${t.category}",${t.amount},"${t.fromAccount}","${t.toAccount || ''}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oriana_transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === securityPin) {
      setIsLocked(false);
      setPinInput('');
    } else {
      alert('Incorrect passcode.');
    }
  };

  const handleSetPin = () => {
    const pin = prompt('Set a 4-digit security PIN passcode (Leave empty to remove):');
    if (pin === null) return;
    if (pin === '') {
      setSecurityPin('');
      localStorage.removeItem('oriana_v29_pin');
      alert('PIN passcode removed.');
    } else if (pin.length >= 4) {
      setSecurityPin(pin);
      localStorage.setItem('oriana_v29_pin', pin);
      alert('Security PIN passcode set!');
    } else {
      alert('PIN must be at least 4 digits.');
    }
  };

  const handleUpdateBalance = (accId: string, valString: string) => {
    const cleanDigits = valString.replace(/[^0-9]/g, '');
    const parsedVal = cleanDigits === '' ? 0 : parseFloat(cleanDigits);
    setAccounts(accounts.map(a => a.id === accId ? { ...a, startingBalance: isNaN(parsedVal) ? 0 : parsedVal } : a));
  };

  const handleStartEditAccount = (acc: Account) => {
    setEditingAccId(acc.id);
    setEditAccName(acc.name);
    setEditAccType(acc.type);
    setEditAccLogo(acc.logoKey || 'generic');
  };

  const handleSaveEditAccount = (accId: string) => {
    const oldAcc = accounts.find(a => a.id === accId);
    if (!oldAcc) return;

    const oldName = oldAcc.name;
    const newName = editAccName.trim() || oldName;

    setAccounts(accounts.map(a => a.id === accId ? { ...a, name: newName, type: editAccType, logoKey: editAccLogo } : a));

    if (oldName !== newName) {
      setTransactions(transactions.map(tx => ({
        ...tx,
        fromAccount: tx.fromAccount === oldName ? newName : tx.fromAccount,
        toAccount: tx.toAccount === oldName ? newName : tx.toAccount,
      })));

      if (fromAccount === oldName) setFromAccount(newName);
      if (toAccount === oldName) setToAccount(newName);
    }

    setEditingAccId(null);
  };

  const handleDeleteAccount = (accId: string) => {
    const accToDelete = accounts.find(a => a.id === accId);
    if (!accToDelete) return;
    setAccounts(accounts.filter(a => a.id !== accId));
    if (fromAccount === accToDelete.name && accounts.length > 1) {
      const remaining = accounts.filter(a => a.id !== accId);
      setFromAccount(remaining[0]?.name || '');
    }
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName || !newAccBal) return;
    const newId = Date.now().toString();
    setAccounts([...accounts, { id: newId, name: newAccName, type: newAccType, logoKey: newAccLogo, startingBalance: parseFloat(newAccBal), selected: true }]);
    setNewAccName('');
    setNewAccBal('');
    setNewAccLogo('generic');
  };

  const handleAddBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBillName || !newBillAmount) return;
    setBills([...bills, {
      id: Date.now().toString(),
      name: newBillName,
      amount: parseFloat(newBillAmount),
      dueDate: newBillDueDate || new Date().toISOString().split('T')[0],
      category: newBillCategory,
      isPaid: false,
      frequency: newBillFreq,
      durationMonths: parseInt(newBillDuration) || 0,
    }]);
    setNewBillName('');
    setNewBillAmount('');
    setNewBillDueDate('');
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalName || !goalTarget) return;
    setSavingsGoals([...savingsGoals, {
      id: Date.now().toString(),
      name: goalName,
      targetAmount: parseFloat(goalTarget),
      currentAmount: goalCurrent ? parseFloat(goalCurrent) : 0,
      targetDate: goalDate || '2026-12-31',
      category: goalCategory || 'General'
    }]);
    setGoalName('');
    setGoalTarget('');
    setGoalCurrent('');
    setGoalDate('');
  };

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!budgetLimitVal) return;
    const limit = parseFloat(budgetLimitVal);
    const existingIndex = budgets.findIndex(b => b.category === budgetCategory);
    if (existingIndex >= 0) {
      const updated = [...budgets];
      updated[existingIndex].limit = limit;
      setBudgets(updated);
    } else {
      setBudgets([...budgets, { category: budgetCategory, limit }]);
    }
    setBudgetLimitVal('');
  };

  const handleAddDebt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debtName || !debtRemaining || !debtMonthly) return;
    setDebts([...debts, {
      id: Date.now().toString(),
      name: debtName,
      totalBalance: debtTotal ? parseFloat(debtTotal) : parseFloat(debtRemaining),
      remainingBalance: parseFloat(debtRemaining),
      interestRate: debtAPR ? parseFloat(debtAPR) : 0,
      monthlyPayment: parseFloat(debtMonthly),
      dueDate: debtDue || '2026-12-31',
    }]);
    setDebtName('');
    setDebtTotal('');
    setDebtRemaining('');
    setDebtAPR('');
    setDebtMonthly('');
    setDebtDue('');
  };

  const handlePayDebt = (debtId: string, amount: number) => {
    setDebts(debts.map(d => {
      if (d.id === debtId) {
        const nextRem = Math.max(0, d.remainingBalance - amount);
        return { ...d, remainingBalance: nextRem };
      }
      return d;
    }));
  };

  const deleteDebt = (id: string) => {
    setDebts(debts.filter(d => d.id !== id));
  };

  const updateGoalProgress = (id: string, delta: number) => {
    setSavingsGoals(savingsGoals.map(g => {
      if (g.id === id) {
        const nextVal = Math.max(0, g.currentAmount + delta);
        return { ...g, currentAmount: nextVal };
      }
      return g;
    }));
  };

  const deleteGoal = (id: string) => {
    setSavingsGoals(savingsGoals.filter(g => g.id !== id));
  };

  const deleteBill = (id: string) => {
    setBills(bills.filter(b => b.id !== id));
  };

  const toggleBill = (id: string) => {
    setBills(bills.map(b => b.id === id ? { ...b, isPaid: !b.isPaid } : b));
  };

  const handleAddTx = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(rawAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    const finalCategory = type === 'Transfer' 
      ? 'Transfer' 
      : selectedCategory === 'Custom...' 
        ? (customCategory.trim() || 'General') 
        : selectedCategory;

    setTransactions([{
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      description: desc || (type === 'Transfer' ? `Transfer to ${toAccount}` : finalCategory),
      amount: parsedAmount,
      type,
      category: finalCategory,
      fromAccount,
      toAccount: type === 'Transfer' ? toAccount : undefined,
    }, ...transactions]);

    setDesc('');
    setRawAmount('');
    setCustomCategory('');
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const filteredTransactions = transactions.filter(tx => {
    if (txTypeFilter !== 'All' && tx.type !== txTypeFilter) return false;
    if (dateFilter && tx.date !== dateFilter) return false;
    if (selectedMonth !== 'All') {
      const txDate = new Date(tx.date);
      if ((txDate.getMonth() + 1).toString() !== selectedMonth || txDate.getFullYear() !== selectedYear) return false;
    }
    return true;
  });

  const MONTHS = [
    { num: 'All', name: 'All Time' },
    { num: '1', name: 'January' },
    { num: '2', name: 'February' },
    { num: '3', name: 'March' },
    { num: '4', name: 'April' },
    { num: '5', name: 'May' },
    { num: '6', name: 'June' },
    { num: '7', name: 'July' },
    { num: '8', name: 'August' },
    { num: '9', name: 'September' },
    { num: '10', name: 'October' },
    { num: '11', name: 'November' },
    { num: '12', name: 'December' },
  ];

  if (!isLoaded) return null;

  const isLight = theme === 'light';

  // SECURITY PIN LOCK SCREEN
  if (isLocked && securityPin) {
    return (
      <div className={`min-h-screen w-full flex items-center justify-center p-6 ${isLight ? 'bg-stone-100 text-stone-900' : 'bg-stone-950 text-stone-100'}`}>
        <form onSubmit={handleUnlock} className={`p-8 rounded-3xl border ${isLight ? 'bg-white border-amber-200' : 'bg-stone-900 border-amber-500/20'} space-y-6 max-w-sm w-full text-center shadow-2xl`}>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-amber-500 uppercase">ORIANA LOCKED</h2>
            <p className={`text-xs ${isLight ? 'text-stone-500' : 'text-stone-400'} mt-1`}>Enter your 4-digit security passcode</p>
          </div>
          <input
            type="password"
            maxLength={6}
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            className={`w-full text-center text-2xl tracking-widest font-bold p-3 rounded-2xl border ${
              isLight ? 'bg-stone-100 border-stone-300' : 'bg-stone-950 border-stone-800'
            } outline-none focus:border-amber-500`}
            autoFocus
          />
          <button type="submit" className="w-full bg-amber-500 text-stone-950 font-black py-3 rounded-2xl text-xs">Unlock Space</button>
        </form>
      </div>
    );
  }

  // USER-FORWARD FULL SCREEN ONBOARDING EXPERIENCE
  if (onboardingStep < 3) {
    return (
      <div className={`min-h-screen w-full flex flex-col items-center justify-center p-6 font-sans transition-colors duration-300 ${
        isLight ? 'bg-[#FAFAF9] text-stone-900' : 'bg-[#0C0A09] text-stone-100'
      }`}>
        <div className="w-full max-w-xl space-y-6">
          
          <div className={`w-full ${isLight ? 'bg-white border-amber-200/80 shadow-md' : 'bg-stone-900/90 border-amber-500/20 shadow-xl'} border rounded-3xl p-8 space-y-6`}>
            
            {/* SUBTLE BRAND HEADER AT TOP */}
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center p-1.5 shrink-0">
                  <OrianaLogoMark className="w-full h-full" />
                </div>
                <div>
                  <h1 className="text-xs font-black tracking-wider text-amber-500 uppercase leading-none">ORIANA</h1>
                  <p className={`text-[9px] ${isLight ? 'text-stone-500' : 'text-stone-400'} font-bold uppercase tracking-widest mt-0.5`}>
                    by Judimer
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full">
                Step {onboardingStep + 1} of 3
              </span>
            </div>

            {/* STEP 1: NAME INPUT */}
            {onboardingStep === 0 && (
              <form onSubmit={handleNameSubmit} className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black tracking-tight text-amber-500">First off, what should we call you?</h2>
                  <p className={`text-xs ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                    Let’s set up your space.
                  </p>
                </div>

                <input
                  type="text"
                  placeholder="Enter your name or nickname..."
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  className={`w-full ${
                    isLight ? 'bg-stone-100 border-stone-300 text-stone-900 focus:border-amber-500' : 'bg-stone-950 border-stone-800 text-stone-100 focus:border-amber-500'
                  } border rounded-2xl p-4 text-base font-semibold outline-none transition`}
                  autoFocus
                  required
                />

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black py-4 rounded-2xl text-sm transition shadow-sm"
                >
                  Continue ➔
                </button>
              </form>
            )}

            {/* STEP 2: USER-FIRST WELCOME & MEANING OF ORIANA */}
            {onboardingStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h2 className="text-3xl font-black tracking-tight text-amber-500">
                    Welcome, {userName}! ✨
                  </h2>

                  {/* MEANING OF ORIANA BOX */}
                  <div className={`p-3.5 rounded-2xl border ${isLight ? 'bg-amber-50/80 border-amber-200' : 'bg-amber-500/10 border-amber-500/20'} flex items-center gap-3`}>
                    <Sunrise className="w-5 h-5 text-amber-500 shrink-0" />
                    <p className={`text-xs ${isLight ? 'text-amber-900' : 'text-amber-200'} font-medium`}>
                      <strong>Oriana</strong> comes from Latin meaning <em>"sunrise"</em> or <em>"golden dawn"</em> — representing a clean, golden start to your financial journey.
                    </p>
                  </div>

                  <p className={`text-sm leading-relaxed ${isLight ? 'text-stone-800' : 'text-stone-200'} font-medium pt-2`}>
                    Hey! I’m Judimer — creator of <strong>Oriana</strong>.
                  </p>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-stone-600' : 'text-stone-300'}`}>
                    I built this tool because I needed a simple, honest way to track my money without all the confusion. Whether you’re managing daily expenses, saving for big goals, or just figuring it all out as you go — Oriana is here to help you stay on track.
                  </p>
                </div>

                <button
                  onClick={() => setOnboardingStep(2)}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black py-4 rounded-2xl text-sm transition shadow-sm"
                >
                  Configure Accounts ➔
                </button>
              </div>
            )}

            {/* STEP 3: PRE-EXISTING & CUSTOM ACCOUNTS SELECTOR */}
            {onboardingStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-amber-500">Set Up Your Accounts</h2>
                  <p className={`text-xs ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                    Select which accounts you use and set your initial balances.
                  </p>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {accounts.map(acc => {
                    const isSelected = acc.selected !== false;
                    const displayFormatted = acc.startingBalance > 0 ? `₱${acc.startingBalance.toLocaleString()}` : '';

                    return (
                      <div key={acc.id} className={`p-3.5 rounded-2xl border transition flex items-center justify-between ${
                        isSelected 
                          ? isLight ? 'bg-amber-50/60 border-amber-300' : 'bg-amber-500/10 border-amber-500/30'
                          : isLight ? 'bg-stone-50 border-stone-200 opacity-60' : 'bg-stone-950 border-stone-800 opacity-60'
                      }`}>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleAccountSelection(acc.id)}
                            className="w-4 h-4 accent-amber-500 rounded cursor-pointer shrink-0"
                          />
                          <BankLogo logoKey={acc.logoKey} name={acc.name} className="w-7 h-7" />
                          <span className="text-xs font-bold">{acc.name}</span>
                        </div>

                        {isSelected && (
                          <div className="relative w-28">
                            <input
                              type="text"
                              value={displayFormatted}
                              onChange={(e) => handleUpdateBalance(acc.id, e.target.value)}
                              placeholder="₱0"
                              className={`w-full text-right p-1.5 rounded-xl border text-xs font-black text-amber-500 outline-none ${
                                isLight ? 'bg-white border-stone-300' : 'bg-stone-900 border-stone-700'
                              }`}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* ADD CUSTOM ACCOUNT TOGGLE */}
                {!showAddCustomOnboarding ? (
                  <button
                    type="button"
                    onClick={() => setShowAddCustomOnboarding(true)}
                    className={`w-full py-2.5 rounded-2xl border border-dashed border-amber-500/40 text-xs text-amber-500 font-bold hover:bg-amber-500/10 transition flex items-center justify-center gap-2`}
                  >
                    <PlusCircle className="w-4 h-4" /> Add Custom Account
                  </button>
                ) : (
                  <form onSubmit={handleAddOnboardingCustomAccount} className={`p-4 rounded-2xl border ${
                    isLight ? 'bg-stone-100 border-stone-300' : 'bg-stone-950 border-stone-800'
                  } space-y-3`}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-amber-500">New Custom Account</span>
                      <button type="button" onClick={() => setShowAddCustomOnboarding(false)} className="text-xs text-stone-400 hover:text-rose-400">✕</button>
                    </div>

                    <input
                      type="text"
                      placeholder="Account Name (e.g. UnionBank, BDO Payroll)"
                      value={obAccName}
                      onChange={(e) => setObAccName(e.target.value)}
                      className={`w-full p-2.5 rounded-xl border text-xs font-semibold outline-none ${
                        isLight ? 'bg-white border-stone-300' : 'bg-stone-900 border-stone-700'
                      }`}
                      required
                    />

                    <GlassLogoPicker selectedLogo={obAccLogo} onSelect={setObAccLogo} isLight={isLight} />

                    <input
                      type="text"
                      placeholder="Initial Balance (₱)"
                      value={obAccRawBal ? `₱${parseInt(obAccRawBal, 10).toLocaleString()}` : ''}
                      onChange={(e) => setObAccRawBal(e.target.value.replace(/[^0-9]/g, ''))}
                      className={`w-full p-2.5 rounded-xl border text-xs font-bold text-amber-500 outline-none ${
                        isLight ? 'bg-white border-stone-300' : 'bg-stone-900 border-stone-700'
                      }`}
                    />

                    <button
                      type="submit"
                      className="w-full bg-amber-500 text-stone-950 font-black py-2 rounded-xl text-xs transition"
                    >
                      Save Account
                    </button>
                  </form>
                )}

                <div className="pt-2 space-y-3 text-center">
                  <button
                    onClick={handleFinishOnboarding}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black py-4 rounded-2xl text-sm transition shadow-sm"
                  >
                    Enter Dashboard ➔
                  </button>
                  <p className={`text-[11px] font-bold ${isLight ? 'text-amber-800' : 'text-amber-400/90'} italic tracking-wide`}>
                    "Every peso has a purpose. Let’s make yours count."
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    );
  }

  const glassCardClass = isLight
    ? "bg-white border border-amber-200/80 shadow-sm transition duration-200"
    : "bg-stone-900/90 border border-amber-500/20 shadow-md transition duration-200";

  const subGlassClass = isLight
    ? "bg-amber-50/50 border border-amber-200/60"
    : "bg-stone-950/70 border border-amber-500/15";

  const textPrimary = isLight ? "text-stone-900" : "text-stone-100";
  const textSecondary = isLight ? "text-stone-500" : "text-stone-400";
  const inputBgClass = isLight
    ? "bg-stone-100 border-stone-300 text-stone-900 focus:border-amber-500"
    : "bg-stone-950 border-stone-800 text-stone-100 focus:border-amber-500";

  return (
    <div className={`min-h-screen flex flex-col md:flex-row font-sans selection:bg-amber-500/30 selection:text-amber-200 relative transition-colors duration-300 ${
      isLight ? 'bg-[#FAFAF9] text-stone-800' : 'bg-[#0C0A09] text-stone-100'
    }`}>
      
      <style jsx global>{`
        @media print {
          body { background-color: white !important; color: black !important; }
          aside, button, select, input, .no-print { display: none !important; }
          main { padding: 0 !important; max-width: 100% !important; }
          .print-container { background: white !important; color: black !important; border: none !important; box-shadow: none !important; }
          .print-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .print-table th, .print-table td { border: 1px solid #ddd; padding: 8px; text-align: left; color: black !important; }
          .print-header { margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
        }
      `}</style>

      {/* HIDDEN FILE INPUT FOR RESTORE */}
      <input type="file" ref={fileInputRef} onChange={handleImportJSON} accept=".json" className="hidden" />

      {/* SIDEBAR */}
      <aside className={`group relative p-4 transition-all duration-300 flex flex-col justify-between shrink-0 z-20 no-print ${
        isLight ? 'bg-white border-r border-amber-200/70' : 'bg-stone-950 border-r border-amber-500/20'
      } ${isCollapsed ? 'w-full md:w-20 items-center' : 'w-full md:w-64'}`}>
        
        <div className="space-y-6 w-full">
          
          <div className="flex items-center justify-between min-h-[40px] relative">
            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
              <div className="relative w-10 h-10 shrink-0 flex items-center justify-center">
                <div className={`w-10 h-10 rounded-2xl ${isLight ? 'bg-amber-50 border-amber-200' : 'bg-stone-900 border-amber-500/30'} border flex items-center justify-center p-2 transition-opacity duration-200 ${
                  isCollapsed ? 'group-hover:opacity-0' : 'opacity-100'
                }`}>
                  <OrianaLogoMark className="w-full h-full" />
                </div>

                {isCollapsed && (
                  <button
                    onClick={() => setIsCollapsed(false)}
                    className="absolute inset-0 w-10 h-10 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center z-30"
                    title="Expand Sidebar"
                  >
                    <PanelLeftOpen className="w-5 h-5" />
                  </button>
                )}
              </div>

              {!isCollapsed && (
                <div>
                  <h1 className="text-base font-black tracking-wider text-amber-500 uppercase font-sans leading-none">
                    ORIANA
                  </h1>
                  <p className="text-[10px] tracking-wider text-amber-600/80 font-bold uppercase mt-1">by Judimer</p>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                onClick={() => setIsCollapsed(true)}
                className={`p-2 rounded-xl ${textSecondary} hover:text-amber-500 hover:bg-stone-200/50 transition`}
                title="Collapse Sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}
          </div>

          {!isCollapsed ? (
            <div className={`${isLight ? 'bg-amber-50/80 border-amber-200' : 'bg-stone-900/80 border-amber-500/20'} border p-4 rounded-2xl space-y-1 w-full relative`}>
              <div className="flex justify-between items-center">
                <div className={`flex items-center gap-1.5 text-xs ${textSecondary} font-medium`}>
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span>Total Net Worth</span>
                </div>
                <button onClick={() => setPrivacyMode(!privacyMode)} className="text-amber-500 p-1 hover:bg-amber-500/10 rounded-lg">
                  {privacyMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="text-2xl font-black text-amber-500">{fmt(totalNetWorth)}</div>
            </div>
          ) : (
            <div className={`p-2.5 ${isLight ? 'bg-amber-50/80 border-amber-200' : 'bg-stone-900/80 border-amber-500/20'} border rounded-2xl text-center w-full`} title={`Total Net Worth: ${fmt(totalNetWorth)}`}>
              <Coins className="w-5 h-5 text-amber-500 mx-auto" />
            </div>
          )}

          <nav className="space-y-1 w-full">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'budgets', label: 'Budget Limits', icon: PieChart },
              { id: 'savings', label: 'Savings Goals', icon: Target },
              { id: 'debts', label: 'Debt Payoff', icon: CreditCard, badge: debts.filter(d => d.remainingBalance > 0).length },
              { id: 'transactions', label: 'Transactions', icon: History },
              { id: 'accounts', label: 'Manage Accounts', icon: Wallet },
              { id: 'bills', label: 'Bills & Subscriptions', icon: Receipt, badge: upcomingBills.length },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black shadow-sm'
                      : isLight ? 'text-stone-600 hover:text-stone-900 hover:bg-amber-100/50' : 'text-stone-300 hover:text-white hover:bg-stone-900'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    {!isCollapsed && <span>{tab.label}</span>}
                  </div>
                  {!isCollapsed && tab.badge !== undefined && tab.badge > 0 && (
                    <span className="bg-rose-500/20 text-rose-400 font-bold text-[10px] px-2 py-0.5 rounded-full border border-rose-500/30">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-amber-500/20 w-full space-y-2">
          
          {!isCollapsed && (
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                onClick={handleExportJSON}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border ${isLight ? 'bg-stone-100 border-stone-300 text-stone-700' : 'bg-stone-900 border-stone-800 text-stone-300'} text-[10px] font-bold hover:border-amber-500`}
                title="Backup Data"
              >
                <Download className="w-3 h-3 text-amber-500" /> Backup
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border ${isLight ? 'bg-stone-100 border-stone-300 text-stone-700' : 'bg-stone-900 border-stone-800 text-stone-300'} text-[10px] font-bold hover:border-amber-500`}
                title="Restore Data"
              >
                <Upload className="w-3 h-3 text-amber-500" /> Restore
              </button>
            </div>
          )}

          {!isCollapsed && userName && (
            <div className={`p-2.5 rounded-2xl ${isLight ? 'bg-amber-100/50' : 'bg-stone-900'} border border-amber-500/20 flex items-center justify-between text-xs`}>
              <div className="flex items-center gap-2 truncate">
                <User className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-semibold truncate">{userName}</span>
              </div>
              <button
                onClick={handleSetPin}
                className={`p-1 ${securityPin ? 'text-amber-500' : textSecondary} hover:text-amber-500 rounded-lg`}
                title={securityPin ? "Passcode PIN Active" : "Set Security Passcode PIN"}
              >
                <Shield className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={() => setTheme(isLight ? 'dark' : 'light')}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-2.5 rounded-2xl border transition-all ${
              isLight ? 'bg-stone-100 border-stone-300 text-stone-800 hover:bg-stone-200' : 'bg-stone-900 border-stone-800 text-stone-200 hover:bg-stone-800'
            }`}
            title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
          >
            <div className="flex items-center gap-2.5">
              {isLight ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-amber-400" />}
              {!isCollapsed && <span className="text-xs font-semibold">{isLight ? 'Light Gold' : 'Dark Gold'}</span>}
            </div>
            {!isCollapsed && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-500 border border-amber-500/30">
                {isLight ? 'Light' : 'Dark'}
              </span>
            )}
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-8 space-y-6 overflow-y-auto max-w-7xl z-10 pb-20">
        
        {/* ==================== DYNAMIC TIME GREETING ==================== */}
        {userName && (
          <div className={`${glassCardClass} rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r ${
            isLight ? 'from-amber-500/10 via-amber-500/5 to-transparent' : 'from-amber-500/15 via-amber-500/5 to-transparent'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center p-2 shrink-0">
                <Sun className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h2 className={`text-base sm:text-lg font-bold ${textPrimary}`}>
                  {getGreeting()}, Welcome back to Oriana, <span className="text-amber-500 font-black">{userName}</span>!
                </h2>
                <p className={`text-xs ${textSecondary}`}>Ready to manage your financial flow today?</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPrivacyMode(!privacyMode)}
                className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                  privacyMode 
                    ? 'bg-amber-500 text-stone-950 border-amber-500' 
                    : `${isLight ? 'bg-stone-200 text-stone-800' : 'bg-stone-800 text-stone-200'} border-amber-500/20`
                }`}
                title="Toggle Hide Sensitive Amounts"
              >
                {privacyMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span className="hidden sm:inline">{privacyMode ? 'Unblur' : 'Blur'}</span>
              </button>

              <button
                onClick={() => setActiveTab('transactions')}
                className="px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500 font-bold text-xs hover:bg-amber-500 hover:text-stone-950 transition shrink-0 self-start sm:self-auto"
              >
                Log Transaction ➔
              </button>
            </div>
          </div>
        )}

        {/* ==================== TAB 1: DASHBOARD ==================== */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-6">
              
              <section className={`${glassCardClass} rounded-2xl p-6 space-y-4`}>
                <div className="flex justify-between items-center border-b border-amber-500/20 pb-3">
                  <h2 className={`text-md font-bold ${textPrimary} flex items-center gap-2`}>
                    <Wallet className="w-5 h-5 text-amber-500" /> Remaining Balance
                  </h2>
                  <span className={`text-xs ${textSecondary} font-medium`}>{activeAccounts.length} active accounts</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeAccounts.map((acc) => {
                    const bal = getAccountBalance(acc.name, acc.startingBalance);
                    return (
                      <div key={acc.id} className={`${subGlassClass} rounded-2xl p-4 flex items-center justify-between transition shadow-sm`}>
                        <div className="flex items-center gap-3">
                          <BankLogo logoKey={acc.logoKey} name={acc.name} />
                          <div>
                            <span className={`text-xs font-semibold ${textPrimary} block`}>{acc.name}</span>
                            <span className={`text-lg font-black ${textPrimary}`}>{fmt(bal)}</span>
                            <span className={`text-[10px] ${textSecondary} block`}>Base: {fmt(acc.startingBalance)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className={`${glassCardClass} rounded-2xl p-6 space-y-4`}>
                <div className="flex justify-between items-center border-b border-amber-500/20 pb-3">
                  <h3 className={`font-bold ${textPrimary} text-sm flex items-center gap-2`}>
                    <Scale className="w-5 h-5 text-amber-500" /> Income vs Expense Ratio
                  </h3>
                  <span className={`text-xs ${textSecondary} font-medium`}>Overall Cash Flow</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl">
                    <span className="text-[10px] text-amber-500 uppercase font-bold tracking-wider flex items-center justify-center gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5" /> Total Income
                    </span>
                    <span className="text-lg font-black text-amber-500 mt-1 block">{fmt(totalIncome)}</span>
                  </div>

                  <div className="bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl">
                    <span className="text-[10px] text-rose-400 uppercase font-bold tracking-wider flex items-center justify-center gap-1">
                      <ArrowDownRight className="w-3.5 h-3.5" /> Total Expense
                    </span>
                    <span className="text-lg font-black text-rose-400 mt-1 block">{fmt(totalExpense)}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-amber-500">Income: {incomePct}%</span>
                    <span className="text-rose-400">Expense: {expensePct}%</span>
                  </div>
                  
                  <div className={`w-full ${isLight ? 'bg-stone-200' : 'bg-stone-950'} h-3 rounded-full overflow-hidden flex border border-amber-500/20`}>
                    <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${incomePct}%` }} />
                    <div className="bg-rose-400 h-full transition-all duration-300" style={{ width: `${expensePct}%` }} />
                  </div>
                </div>
              </section>

            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              
              <section className={`${glassCardClass} rounded-2xl p-5 space-y-4`}>
                <h3 className={`font-bold ${textPrimary} text-sm flex items-center gap-2`}>
                  <PlusCircle className="w-4 h-4 text-amber-500" /> Quick Transaction Log
                </h3>

                <form onSubmit={handleAddTx} className="space-y-3">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className={`w-full ${inputBgClass} rounded-2xl p-2.5 text-xs outline-none`}
                  >
                    <option value="Expense">Expense (-)</option>
                    <option value="Income">Income (+)</option>
                    <option value="Transfer">Transfer (➔)</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Amount (₱)"
                    value={formattedDisplayAmount}
                    onChange={handleAmountInputChange}
                    className={`w-full ${inputBgClass} border-amber-500/40 rounded-2xl p-3 text-sm text-amber-500 font-black outline-none`}
                    required
                  />

                  {type !== 'Transfer' && (
                    <div className="space-y-1">
                      <label className={`block text-[10px] ${textSecondary} uppercase tracking-wider font-semibold flex items-center gap-1`}>
                        <Tag className="w-3 h-3 text-amber-500" /> Category
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className={`w-full ${inputBgClass} rounded-2xl p-2.5 text-xs outline-none`}
                      >
                        {CATEGORY_PRESETS.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>

                      {selectedCategory === 'Custom...' && (
                        <input
                          type="text"
                          placeholder="Type custom category..."
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          className={`w-full ${inputBgClass} border-amber-500/40 rounded-2xl p-2.5 mt-1.5 text-xs outline-none`}
                          required
                        />
                      )}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className={`block text-[10px] ${textSecondary} uppercase tracking-wider font-semibold`}>From Account</label>
                    <select
                      value={fromAccount}
                      onChange={(e) => setFromAccount(e.target.value)}
                      className={`w-full ${inputBgClass} rounded-2xl p-2.5 text-xs outline-none`}
                    >
                      {activeAccounts.map(a => (
                        <option key={a.id} value={a.name}>
                          {a.name} — {fmt(getAccountBalance(a.name, a.startingBalance))}
                        </option>
                      ))}
                    </select>
                  </div>

                  {type === 'Transfer' && (
                    <div className="space-y-1">
                      <label className={`block text-[10px] ${textSecondary} uppercase tracking-wider font-semibold`}>To Account</label>
                      <select
                        value={toAccount}
                        onChange={(e) => setToAccount(e.target.value)}
                        className={`w-full ${inputBgClass} rounded-2xl p-2.5 text-xs outline-none`}
                      >
                        {activeAccounts.filter(a => a.name !== fromAccount).map(a => (
                          <option key={a.id} value={a.name}>
                            {a.name} — {fmt(getAccountBalance(a.name, a.startingBalance))}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder="Description (e.g. Food, Savings deposit)"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className={`w-full ${inputBgClass} rounded-2xl p-2.5 text-xs outline-none`}
                  />

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black py-2.5 rounded-2xl text-xs transition duration-200 shadow-sm"
                  >
                    Save Transaction
                  </button>
                </form>
              </section>

              <section className={`${glassCardClass} rounded-2xl p-5 space-y-4`}>
                <div className="flex justify-between items-center border-b border-amber-500/20 pb-3">
                  <h3 className={`font-bold ${textPrimary} text-sm flex items-center gap-2`}>
                    <AlertCircle className="w-4 h-4 text-amber-500" /> Upcoming Bills
                  </h3>
                  <button onClick={() => setActiveTab('bills')} className="text-xs text-amber-500 hover:underline flex items-center gap-1 font-semibold">
                    Manage Bills <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {upcomingBills.slice(0, 3).map(bill => (
                    <div key={bill.id} className={`${subGlassClass} p-3.5 rounded-2xl flex items-center justify-between shadow-sm`}>
                      <div>
                        <div className={`text-xs font-semibold ${textPrimary}`}>{bill.name}</div>
                        <div className={`text-[10px] ${textSecondary} mt-0.5`}>Due: <span className="text-amber-500 font-medium">{bill.dueDate}</span> • {bill.category}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-500">{fmt(bill.amount)}</span>
                        <button
                          onClick={() => handlePayBillAndLog(bill)}
                          className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-amber-500 text-stone-950 hover:bg-amber-400 transition"
                          title="1-Click Pay & Log Expense"
                        >
                          Pay & Log
                        </button>
                      </div>
                    </div>
                  ))}
                  {upcomingBills.length === 0 && (
                    <div className="text-xs text-amber-500 text-center py-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl font-medium">
                      🎉 All bills are paid!
                    </div>
                  )}
                </div>
              </section>

            </div>

          </div>
        )}

        {/* ==================== TAB 2: BUDGET LIMITS ==================== */}
        {activeTab === 'budgets' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`lg:col-span-2 ${glassCardClass} rounded-2xl p-6 space-y-6`}>
              <div>
                <h2 className={`text-lg font-bold ${textPrimary} flex items-center gap-2`}>
                  <PieChart className="w-5 h-5 text-amber-500" /> Category Budget Caps & Limits
                </h2>
                <p className={`text-xs ${textSecondary}`}>Monitor monthly limits and prevent overspending</p>
              </div>

              <div className="space-y-4">
                {budgets.map(b => {
                  const spent = getCategorySpending(b.category);
                  const pct = Math.min(100, Math.round((spent / b.limit) * 100));
                  const isOver = spent > b.limit;
                  const isNear = pct >= 80 && !isOver;

                  return (
                    <div key={b.category} className={`${subGlassClass} p-4 rounded-2xl space-y-2`}>
                      <div className="flex justify-between items-center">
                        <span className={`text-xs font-bold ${textPrimary}`}>{b.category}</span>
                        <div className="text-right">
                          <span className={`text-xs font-black ${isOver ? 'text-rose-400' : isNear ? 'text-amber-500' : 'text-emerald-400'}`}>
                            {fmt(spent)}
                          </span>
                          <span className={`text-[10px] ${textSecondary}`}> / {fmt(b.limit)}</span>
                        </div>
                      </div>

                      <div className={`w-full ${isLight ? 'bg-stone-200' : 'bg-stone-950'} h-2.5 rounded-full overflow-hidden border border-amber-500/20`}>
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            isOver ? 'bg-rose-500' : isNear ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${pct}%` }} 
                        />
                      </div>

                      <div className="flex justify-between text-[10px]">
                        <span className={`${isOver ? 'text-rose-400 font-bold' : isNear ? 'text-amber-500 font-bold' : textSecondary}`}>
                          {isOver ? '🚨 Over Budget Cap!' : isNear ? '⚠️ Approaching Limit' : 'On Track'}
                        </span>
                        <span className="text-amber-500 font-bold">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`${glassCardClass} rounded-2xl p-6 space-y-4 h-fit`}>
              <h3 className={`text-md font-bold ${textPrimary} flex items-center gap-2`}>
                <PlusCircle className="w-5 h-5 text-amber-500" /> Set Category Cap
              </h3>

              <form onSubmit={handleAddBudget} className="space-y-4">
                <div>
                  <label className={`block text-xs ${textSecondary} mb-1`}>Category</label>
                  <select
                    value={budgetCategory}
                    onChange={(e) => setBudgetCategory(e.target.value)}
                    className={`w-full ${inputBgClass} rounded-2xl p-3 text-xs outline-none`}
                  >
                    {CATEGORY_PRESETS.filter(c => c !== 'Income' && c !== 'Custom...').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-xs ${textSecondary} mb-1`}>Monthly Limit Cap (₱)</label>
                  <input
                    type="number"
                    placeholder="e.g. 10000"
                    value={budgetLimitVal}
                    onChange={(e) => setBudgetLimitVal(e.target.value)}
                    className={`w-full ${inputBgClass} rounded-2xl p-3 text-sm outline-none`}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black py-3 rounded-2xl text-xs"
                >
                  Save Budget Cap
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: DEBT PAYOFF TRACKER ==================== */}
        {activeTab === 'debts' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`lg:col-span-2 ${glassCardClass} rounded-2xl p-6 space-y-6`}>
              <div>
                <h2 className={`text-lg font-bold ${textPrimary} flex items-center gap-2`}>
                  <CreditCard className="w-5 h-5 text-amber-500" /> Loan & Credit Card Payoff Tracker
                </h2>
                <p className={`text-xs ${textSecondary}`}>Track remaining balances, interest rates, and projected completion dates</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {debts.map(d => {
                  const paid = Math.max(0, d.totalBalance - d.remainingBalance);
                  const pct = Math.min(100, Math.round((paid / d.totalBalance) * 100));
                  const monthsLeft = d.monthlyPayment > 0 ? Math.ceil(d.remainingBalance / d.monthlyPayment) : 0;

                  return (
                    <div key={d.id} className={`${subGlassClass} p-5 rounded-2xl space-y-4`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className={`text-base font-bold ${textPrimary}`}>{d.name}</h4>
                          <span className="text-[10px] text-amber-500 font-semibold">{d.interestRate}% APR Interest Rate</span>
                        </div>
                        <button onClick={() => deleteDebt(d.id)} className={`${textSecondary} hover:text-rose-400 text-xs`}>✕</button>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className={textSecondary}>Remaining</span>
                          <span className="font-black text-rose-400">{fmt(d.remainingBalance)}</span>
                        </div>
                        <div className={`w-full ${isLight ? 'bg-stone-200' : 'bg-stone-950'} h-2.5 rounded-full overflow-hidden border border-amber-500/20`}>
                          <div className="bg-amber-500 h-full rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                        </div>
                        <div className={`flex justify-between text-[10px] ${textSecondary} mt-1`}>
                          <span>Paid: {fmt(paid)}</span>
                          <span>Total: {fmt(d.totalBalance)}</span>
                        </div>
                      </div>

                      <div className={`p-2.5 rounded-xl ${isLight ? 'bg-stone-100' : 'bg-stone-950'} text-[11px] space-y-1`}>
                        <div className="flex justify-between">
                          <span className={textSecondary}>Monthly Payment:</span>
                          <span className="font-bold text-amber-500">{fmt(d.monthlyPayment)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={textSecondary}>Est. Completion:</span>
                          <span className="font-bold">{monthsLeft} months remaining</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePayDebt(d.id, d.monthlyPayment)}
                          className="flex-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black py-2 rounded-xl text-xs transition"
                        >
                          Log Payment
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`${glassCardClass} rounded-2xl p-6 space-y-4 h-fit`}>
              <h3 className={`text-md font-bold ${textPrimary} flex items-center gap-2`}>
                <PlusCircle className="w-5 h-5 text-amber-500" /> Add Debt or Loan
              </h3>

              <form onSubmit={handleAddDebt} className="space-y-3">
                <input
                  type="text"
                  placeholder="Debt Name (e.g. Credit Card)"
                  value={debtName}
                  onChange={(e) => setDebtName(e.target.value)}
                  className={`w-full ${inputBgClass} rounded-2xl p-3 text-xs outline-none`}
                  required
                />
                <input
                  type="number"
                  placeholder="Total Balance (₱)"
                  value={debtTotal}
                  onChange={(e) => setDebtTotal(e.target.value)}
                  className={`w-full ${inputBgClass} rounded-2xl p-3 text-xs outline-none`}
                />
                <input
                  type="number"
                  placeholder="Current Remaining (₱)"
                  value={debtRemaining}
                  onChange={(e) => setDebtRemaining(e.target.value)}
                  className={`w-full ${inputBgClass} rounded-2xl p-3 text-xs outline-none`}
                  required
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="Interest Rate (% APR)"
                  value={debtAPR}
                  onChange={(e) => setDebtAPR(e.target.value)}
                  className={`w-full ${inputBgClass} rounded-2xl p-3 text-xs outline-none`}
                />
                <input
                  type="number"
                  placeholder="Est. Monthly Payment (₱)"
                  value={debtMonthly}
                  onChange={(e) => setDebtMonthly(e.target.value)}
                  className={`w-full ${inputBgClass} rounded-2xl p-3 text-xs outline-none`}
                  required
                />

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black py-3 rounded-2xl text-xs shadow-sm"
                >
                  Track Debt Payoff
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: SAVINGS GOALS ==================== */}
        {activeTab === 'savings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h3 className={`text-md font-bold ${textPrimary} flex items-center gap-2`}>
                  <Target className="w-5 h-5 text-amber-500" /> Active Savings Targets
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savingsGoals.map(goal => {
                    const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                    const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

                    return (
                      <div key={goal.id} className={`${glassCardClass} rounded-2xl p-5 space-y-4`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <span className={`text-[10px] ${isLight ? 'bg-amber-100 border-amber-300' : 'bg-stone-950 border-amber-500/30'} border px-2.5 py-0.5 rounded-full text-amber-500 font-semibold uppercase`}>
                              {goal.category}
                            </span>
                            <h4 className={`text-base font-bold ${textPrimary} mt-1.5`}>{goal.name}</h4>
                            <p className={`text-[11px] ${textSecondary}`}>Target Date: {goal.targetDate}</p>
                          </div>
                          <button onClick={() => deleteGoal(goal.id)} className={`${textSecondary} hover:text-rose-400 text-xs`}>✕</button>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-medium">
                            <span className={textSecondary}>Saved: {fmt(goal.currentAmount)}</span>
                            <span className="text-amber-500 font-bold">{pct}%</span>
                          </div>

                          <div className={`w-full ${isLight ? 'bg-stone-200' : 'bg-stone-950'} h-2.5 rounded-full overflow-hidden border border-amber-500/20`}>
                            <div className="bg-amber-500 h-full rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                          </div>

                          <div className={`flex justify-between text-[11px] ${textSecondary}`}>
                            <span>Remaining: {fmt(remaining)}</span>
                            <span>Target: {fmt(goal.targetAmount)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-amber-500/20">
                          <button
                            onClick={() => updateGoalProgress(goal.id, 1000)}
                            className={`flex-1 ${isLight ? 'bg-amber-100 hover:bg-amber-200 text-stone-900' : 'bg-stone-950 hover:bg-stone-800 text-amber-500'} border border-amber-500/30 text-xs py-1.5 rounded-xl font-bold transition`}
                          >
                            + ₱1,000
                          </button>
                          <button
                            onClick={() => updateGoalProgress(goal.id, 5000)}
                            className={`flex-1 ${isLight ? 'bg-amber-100 hover:bg-amber-200 text-stone-900' : 'bg-stone-950 hover:bg-stone-800 text-amber-500'} border border-amber-500/30 text-xs py-1.5 rounded-xl font-bold transition`}
                          >
                            + ₱5,000
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={`${glassCardClass} rounded-2xl p-6 space-y-4 h-fit`}>
                <h3 className={`text-md font-bold ${textPrimary} flex items-center gap-2`}>
                  <PlusCircle className="w-5 h-5 text-amber-500" /> Create New Savings Goal
                </h3>

                <form onSubmit={handleAddGoal} className="space-y-4">
                  <div>
                    <label className={`block text-xs ${textSecondary} mb-1`}>Goal Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Travel, Emergency Fund"
                      value={goalName}
                      onChange={(e) => setGoalName(e.target.value)}
                      className={`w-full ${inputBgClass} rounded-2xl p-3 text-sm focus:outline-none`}
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-xs ${textSecondary} mb-1`}>Target Amount (₱)</label>
                    <input
                      type="number"
                      placeholder="100000"
                      value={goalTarget}
                      onChange={(e) => setGoalTarget(e.target.value)}
                      className={`w-full ${inputBgClass} rounded-2xl p-3 text-sm focus:outline-none`}
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-xs ${textSecondary} mb-1`}>Initial Saved Amount (₱)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={goalCurrent}
                      onChange={(e) => setGoalCurrent(e.target.value)}
                      className={`w-full ${inputBgClass} rounded-2xl p-3 text-sm focus:outline-none`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs ${textSecondary} mb-1`}>Target Completion Date</label>
                    <input
                      type="date"
                      value={goalDate}
                      onChange={(e) => setGoalDate(e.target.value)}
                      className={`w-full ${inputBgClass} rounded-2xl p-3 text-sm focus:outline-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black py-3 rounded-2xl text-sm transition shadow-sm"
                  >
                    Add Goal Target
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 5: TRANSACTIONS ==================== */}
        {activeTab === 'transactions' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="space-y-6 no-print">
              <div className={`${glassCardClass} rounded-2xl p-4 space-y-3`}>
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                  <span className={`text-xs font-semibold ${textSecondary} uppercase tracking-wider flex items-center gap-1`}>
                    <CalendarIcon className="w-3.5 h-3.5 text-amber-500" /> Year
                  </span>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className={`bg-transparent border border-amber-500/30 rounded-xl px-2 py-1 text-xs text-amber-500 font-bold outline-none`}
                  >
                    <option value={2026}>2026</option>
                    <option value={2025}>2025</option>
                    <option value={2024}>2024</option>
                  </select>
                </div>

                <div className="space-y-1">
                  {MONTHS.map(m => (
                    <button
                      key={m.num}
                      onClick={() => setSelectedMonth(m.num)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                        selectedMonth === m.num 
                          ? 'bg-amber-500 text-stone-950 font-black shadow-sm' 
                          : `${textSecondary} hover:bg-stone-200/50 hover:text-stone-900`
                      }`}
                    >
                      <span>{m.num === 'All' ? m.name : `${m.name} ${selectedYear}`}</span>
                      {selectedMonth === m.num && <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={`lg:col-span-3 ${glassCardClass} rounded-2xl p-6 space-y-6 print-container`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-amber-500/20 pb-4 no-print">
                <div>
                  <h2 className={`text-lg font-bold ${textPrimary}`}>Transaction History</h2>
                  <p className={`text-xs ${textSecondary}`}>
                    Showing logs for: <span className="text-amber-500 font-semibold">{selectedMonth === 'All' ? 'All Time' : `${MONTHS.find(m => m.num === selectedMonth)?.name} ${selectedYear}`}</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 font-bold px-3 py-1.5 rounded-xl text-xs transition"
                  >
                    <Download className="w-3.5 h-3.5" /> CSV
                  </button>

                  <button
                    onClick={handlePrintPDF}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black px-3.5 py-1.5 rounded-xl text-xs transition shadow-sm"
                  >
                    <Printer className="w-4 h-4" /> Save / Print PDF
                  </button>

                  <div className={`flex ${isLight ? 'bg-stone-200' : 'bg-stone-950'} p-1 rounded-xl border border-amber-500/20 text-xs`}>
                    {(['All', 'Income', 'Expense', 'Transfer'] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => setTxTypeFilter(f)}
                        className={`px-3 py-1 rounded-lg font-semibold transition ${
                          txTypeFilter === f ? 'bg-amber-500 text-stone-950 font-black' : `${textSecondary} hover:text-stone-900`
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {filteredTransactions.length === 0 ? (
                <div className={`text-center py-16 ${textSecondary} text-sm ${isLight ? 'bg-stone-100' : 'bg-stone-950'} rounded-2xl border border-dashed border-amber-500/20`}>
                  No transactions found matching your filter.
                </div>
              ) : (
                <div className="space-y-3 no-print">
                  {filteredTransactions.map(tx => (
                    <div key={tx.id} className={`${subGlassClass} p-4 rounded-2xl flex items-center justify-between shadow-sm`}>
                      <div className="flex items-center gap-3.5">
                        <BankLogo logoKey={getAccountLogoKey(tx.fromAccount)} name={tx.fromAccount} />
                        <div>
                          <div className={`text-sm font-semibold ${textPrimary}`}>{tx.description}</div>
                          <div className={`text-xs ${textSecondary} mt-0.5`}>
                            {tx.date} • {tx.type === 'Transfer' ? `${tx.fromAccount} ➔ ${tx.toAccount}` : tx.fromAccount} • <span className="text-amber-500 font-medium">{tx.category}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`text-sm font-black ${
                          tx.type === 'Income' ? 'text-amber-500' : tx.type === 'Expense' ? 'text-rose-400' : 'text-sky-400'
                        }`}>
                          {tx.type === 'Expense' ? '-' : tx.type === 'Income' ? '+' : ''}{fmt(tx.amount)}
                        </div>
                        <span className={`text-[10px] ${textSecondary} uppercase tracking-wider block font-semibold`}>{tx.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 6: MANAGE ACCOUNTS ==================== */}
        {activeTab === 'accounts' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`lg:col-span-2 ${glassCardClass} rounded-2xl p-6 space-y-6`}>
              <div>
                <h2 className={`text-lg font-bold ${textPrimary}`}>Customize & Manage Accounts</h2>
                <p className={`text-xs ${textSecondary}`}>Rename accounts, select logo icons, edit categories, or remove accounts</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {accounts.map((acc) => {
                  const isEditing = editingAccId === acc.id;
                  const displayBal = acc.startingBalance > 0 ? `₱${acc.startingBalance.toLocaleString()}` : '';

                  return (
                    <div key={acc.id} className={`${subGlassClass} p-5 rounded-2xl space-y-4 shadow-sm`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                          <BankLogo logoKey={isEditing ? editAccLogo : acc.logoKey} name={isEditing ? editAccName : acc.name} />
                          
                          {isEditing ? (
                            <div className="space-y-2 flex-1">
                              <input
                                type="text"
                                value={editAccName}
                                onChange={(e) => setEditAccName(e.target.value)}
                                className={`w-full ${inputBgClass} border-amber-500/40 rounded-xl px-2.5 py-1 text-xs font-bold outline-none`}
                                placeholder="Account Name"
                              />
                              <GlassLogoPicker selectedLogo={editAccLogo} onSelect={setEditAccLogo} isLight={isLight} />
                              <select
                                value={editAccType}
                                onChange={(e) => setEditAccType(e.target.value as any)}
                                className={`w-full ${inputBgClass} rounded-xl px-2 py-1 text-[10px] text-amber-500 font-semibold outline-none`}
                              >
                                <option value="Wallet">Wallet / Payroll</option>
                                <option value="Savings">Savings Stash</option>
                                <option value="Cash">Physical Cash</option>
                              </select>
                            </div>
                          ) : (
                            <div className="truncate">
                              <span className={`font-bold ${textPrimary} text-md block truncate`}>{acc.name}</span>
                              <span className="text-[10px] text-amber-500 font-semibold uppercase">{acc.type || 'Wallet'}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSaveEditAccount(acc.id)}
                                className="p-1.5 bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 rounded-xl transition border border-amber-500/40"
                                title="Save Changes"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingAccId(null)}
                                className={`p-1.5 ${isLight ? 'bg-stone-200 text-stone-600' : 'bg-stone-800 text-stone-400'} hover:text-rose-400 rounded-xl transition`}
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleStartEditAccount(acc)}
                                className={`p-1.5 ${textSecondary} hover:text-amber-500 hover:bg-stone-200/50 rounded-xl transition`}
                                title="Edit Account"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteAccount(acc.id)}
                                className={`p-1.5 ${textSecondary} hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition`}
                                title="Delete Account"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className={`block text-xs ${textSecondary} mb-1`}>Current Balance</label>
                        <input
                          type="text"
                          value={displayBal}
                          onChange={(e) => handleUpdateBalance(acc.id, e.target.value)}
                          placeholder="₱0"
                          className={`w-full ${inputBgClass} rounded-2xl p-3 text-amber-500 font-bold text-lg focus:outline-none`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`${glassCardClass} rounded-2xl p-6 space-y-4 h-fit`}>
              <h2 className={`text-lg font-bold ${textPrimary} flex items-center gap-2`}>
                <PlusCircle className="w-5 h-5 text-amber-500" /> Add Custom Account
              </h2>

              <form onSubmit={handleAddAccount} className="space-y-4">
                <div>
                  <label className={`block text-xs ${textSecondary} mb-1`}>Account Name</label>
                  <input
                    type="text"
                    placeholder="e.g. GCash, Maya, BDO"
                    value={newAccName}
                    onChange={(e) => setNewAccName(e.target.value)}
                    className={`w-full ${inputBgClass} rounded-2xl p-3 text-sm focus:outline-none`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-xs ${textSecondary} mb-1`}>Account Logo / Icon</label>
                  <GlassLogoPicker selectedLogo={newAccLogo} onSelect={setNewAccLogo} isLight={isLight} />
                </div>

                <div>
                  <label className={`block text-xs ${textSecondary} mb-1`}>Category</label>
                  <select
                    value={newAccType}
                    onChange={(e) => setNewAccType(e.target.value as any)}
                    className={`w-full ${inputBgClass} rounded-2xl p-3 text-sm focus:outline-none`}
                  >
                    <option value="Wallet">Wallet / Payroll</option>
                    <option value="Savings">Savings Stash</option>
                    <option value="Cash">Physical Cash</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs ${textSecondary} mb-1`}>Starting Balance (₱)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={newAccBal}
                    onChange={(e) => setNewAccBal(e.target.value)}
                    className={`w-full ${inputBgClass} rounded-2xl p-3 text-sm focus:outline-none`}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black py-3 rounded-2xl text-sm transition shadow-sm"
                >
                  Create Account
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ==================== TAB 7: BILLS & RECURRING ==================== */}
        {activeTab === 'bills' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`${glassCardClass} rounded-2xl p-6 space-y-4`}>
              <h2 className={`text-lg font-bold ${textPrimary} flex items-center gap-2`}>
                <PlusCircle className="w-5 h-5 text-amber-500" /> Add Scheduled / Recurring Bill
              </h2>

              <form onSubmit={handleAddBill} className="space-y-3">
                <div>
                  <label className={`block text-xs ${textSecondary} mb-1`}>Bill Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Electricity, Fiber Internet"
                    value={newBillName}
                    onChange={(e) => setNewBillName(e.target.value)}
                    className={`w-full ${inputBgClass} rounded-2xl p-3 text-xs outline-none`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-xs ${textSecondary} mb-1`}>Amount (₱)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={newBillAmount}
                    onChange={(e) => setNewBillAmount(e.target.value)}
                    className={`w-full ${inputBgClass} rounded-2xl p-3 text-xs outline-none`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-xs ${textSecondary} mb-1`}>Recurring Frequency</label>
                  <select
                    value={newBillFreq}
                    onChange={(e) => setNewBillFreq(e.target.value as any)}
                    className={`w-full ${inputBgClass} rounded-2xl p-2.5 text-xs outline-none`}
                  >
                    <option value="One-time">One-time Bill</option>
                    <option value="Weekly">Weekly Recurring</option>
                    <option value="Bi-weekly">Bi-weekly Recurring</option>
                    <option value="Monthly">Monthly Recurring</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs ${textSecondary} mb-1`}>Duration Limit</label>
                  <select
                    value={newBillDuration}
                    onChange={(e) => setNewBillDuration(e.target.value)}
                    className={`w-full ${inputBgClass} rounded-2xl p-2.5 text-xs outline-none`}
                  >
                    <option value="0">Indefinite (Until cancelled)</option>
                    <option value="3">3 Cycles / Months</option>
                    <option value="6">6 Cycles / Months</option>
                    <option value="12">12 Cycles / Months</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs ${textSecondary} mb-1`}>Due Date</label>
                  <input
                    type="date"
                    value={newBillDueDate}
                    onChange={(e) => setNewBillDueDate(e.target.value)}
                    className={`w-full ${inputBgClass} rounded-2xl p-3 text-xs outline-none`}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black py-3 rounded-2xl text-xs transition shadow-sm"
                >
                  Save Bill Schedule
                </button>
              </form>
            </div>

            <div className={`lg:col-span-2 ${glassCardClass} rounded-2xl p-6 space-y-4`}>
              <div className="flex justify-between items-center border-b border-amber-500/20 pb-4">
                <div>
                  <h2 className={`text-lg font-bold ${textPrimary}`}>Bills & Subscriptions Schedule</h2>
                  <p className={`text-xs ${textSecondary}`}>1-click option to log payments directly into transactions</p>
                </div>
                <span className={`text-xs ${isLight ? 'bg-stone-100 border-stone-300' : 'bg-stone-950 border-stone-800'} px-3 py-1.5 rounded-2xl border text-amber-500 font-bold`}>
                  {sortedBills.length} total bills
                </span>
              </div>

              <div className="space-y-3">
                {sortedBills.map((bill) => (
                  <div key={bill.id} className={`${subGlassClass} p-4 rounded-2xl flex items-center justify-between shadow-sm`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${textPrimary} text-md`}>{bill.name}</span>
                        {bill.frequency && bill.frequency !== 'One-time' && (
                          <span className="text-[9px] bg-amber-500/15 border border-amber-500/30 text-amber-500 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <RefreshCw className="w-2.5 h-2.5" /> {bill.frequency}
                          </span>
                        )}
                      </div>
                      <div className={`text-xs ${textSecondary} mt-0.5`}>Due Date: <span className="text-amber-500 font-medium">{bill.dueDate}</span> • {bill.category}</div>
                      <div className="text-md font-black text-amber-500 mt-1">{fmt(bill.amount)}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!bill.isPaid && (
                        <button
                          onClick={() => handlePayBillAndLog(bill)}
                          className="px-3 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-stone-950 transition shadow-sm"
                        >
                          Pay & Log Expense
                        </button>
                      )}

                      <button
                        onClick={() => toggleBill(bill.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                          bill.isPaid 
                            ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' 
                            : `${isLight ? 'bg-stone-200 text-stone-800' : 'bg-stone-800 text-stone-200'} hover:bg-amber-500 hover:text-stone-950 border border-amber-500/20`
                        }`}
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        {bill.isPaid ? 'Paid' : 'Mark Paid'}
                      </button>

                      <button
                        onClick={() => deleteBill(bill.id)}
                        className={`p-2 ${textSecondary} hover:text-rose-400 transition hover:bg-stone-200/50 rounded-xl`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ==================== BOTTOM RIGHT TUTORIAL / HELP BUTTON ==================== */}
      <button
        onClick={() => setShowTutorialModal(true)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black shadow-lg hover:scale-105 active:scale-95 transition duration-200 flex items-center justify-center border-2 border-stone-900 group"
        title="Oriana Quick Tutorial Guide"
      >
        <span className="text-xl font-black group-hover:hidden">?</span>
        <BookOpen className="w-5 h-5 hidden group-hover:block text-stone-950" />
      </button>

      {/* TUTORIAL MODAL */}
      {showTutorialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-xl max-h-[85vh] overflow-y-auto ${
            isLight ? 'bg-white border-amber-200 text-stone-900 shadow-2xl' : 'bg-stone-900 border-amber-500/30 text-stone-100 shadow-2xl'
          } border rounded-3xl p-6 sm:p-8 space-y-6 relative`}>
            
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center p-2 text-amber-500">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-amber-500">Oriana Quick Guide</h3>
                  <p className={`text-xs ${textSecondary}`}>How to get the most out of your budget tracker</p>
                </div>
              </div>
              <button
                onClick={() => setShowTutorialModal(false)}
                className={`p-2 rounded-xl ${textSecondary} hover:text-amber-500 hover:bg-stone-200/50 transition`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              <div className={`${subGlassClass} p-4 rounded-2xl space-y-1.5`}>
                <h4 className="font-bold text-amber-500 flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" /> 1. Dashboard & Net Worth
                </h4>
                <p className={`${textSecondary} leading-relaxed`}>
                  Your <strong>Total Net Worth</strong> automatically sums up all balances across your connected e-wallets, bank accounts, and cash stash.
                </p>
              </div>

              <div className={`${subGlassClass} p-4 rounded-2xl space-y-1.5`}>
                <h4 className="font-bold text-amber-500 flex items-center gap-2">
                  <PieChart className="w-4 h-4" /> 2. Category Budget Caps
                </h4>
                <p className={`${textSecondary} leading-relaxed`}>
                  Set monthly caps on dining out, groceries, or shopping. Progress bars warn you when approaching or exceeding limits.
                </p>
              </div>

              <div className={`${subGlassClass} p-4 rounded-2xl space-y-1.5`}>
                <h4 className="font-bold text-amber-500 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> 3. Debt Payoff Tracker
                </h4>
                <p className={`${textSecondary} leading-relaxed`}>
                  Track loans and credit card balances with interest rate tracking and projected completion timeline estimates.
                </p>
              </div>

              <div className={`${subGlassClass} p-4 rounded-2xl space-y-1.5`}>
                <h4 className="font-bold text-amber-500 flex items-center gap-2">
                  <Receipt className="w-4 h-4" /> 4. 1-Click Pay & Log
                </h4>
                <p className={`${textSecondary} leading-relaxed`}>
                  Pay scheduled bills in 1 click using the <strong>Pay & Log Expense</strong> button to instantly deduct the balance and log the expense.
                </p>
              </div>

            </div>

            <button
              onClick={() => setShowTutorialModal(false)}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black py-3.5 rounded-2xl text-xs transition shadow-sm"
            >
              Got it, close guide!
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
