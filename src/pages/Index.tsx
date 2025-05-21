
import React from 'react';
import StatCard from '@/components/dashboard/StatCard';
import TransactionsTable, { Transaction } from '@/components/dashboard/TransactionsTable';
import IncomeExpenseChart from '@/components/dashboard/IncomeExpenseChart';
import ExpenseCategoryChart from '@/components/dashboard/ExpenseCategoryChart';
import { ArrowDownIcon, ArrowUpIcon, CreditCard, DollarSign, LineChart, Wallet } from 'lucide-react';

// Mock data - in a real app this would come from an API
const mockTransactions: Transaction[] = [
  { 
    id: '1', 
    date: '2024-05-19', 
    description: 'Pembayaran Iklan Toyota', 
    category: 'Pendapatan Iklan', 
    amount: 15000000, 
    type: 'income' 
  },
  { 
    id: '2', 
    date: '2024-05-18', 
    description: 'Pembayaran Gaji Karyawan', 
    category: 'Gaji & Kompensasi', 
    amount: 25000000, 
    type: 'expense' 
  },
  { 
    id: '3', 
    date: '2024-05-17', 
    description: 'Pembayaran Sewa Studio', 
    category: 'Fasilitas', 
    amount: 8000000, 
    type: 'expense' 
  },
  { 
    id: '4', 
    date: '2024-05-15', 
    description: 'Pendapatan Program "Morning Show"', 
    category: 'Pendapatan Program', 
    amount: 12000000, 
    type: 'income' 
  },
  { 
    id: '5', 
    date: '2024-05-14', 
    description: 'Pembelian Peralatan Kamera', 
    category: 'Peralatan', 
    amount: 7500000, 
    type: 'expense' 
  },
];

const incomeExpenseData = [
  { month: 'Jan', income: 120000000, expense: 95000000 },
  { month: 'Feb', income: 125000000, expense: 98000000 },
  { month: 'Mar', income: 130000000, expense: 102000000 },
  { month: 'Apr', income: 140000000, expense: 105000000 },
  { month: 'May', income: 135000000, expense: 100000000 },
];

const expenseCategoryData = [
  { name: 'Gaji & Kompensasi', value: 45000000, color: '#f87171' },
  { name: 'Fasilitas', value: 22000000, color: '#60a5fa' },
  { name: 'Peralatan', value: 18000000, color: '#4ade80' },
  { name: 'Marketing', value: 12000000, color: '#c084fc' },
  { name: 'Operasional', value: 15000000, color: '#fbbf24' },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard Keuangan</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Pendapatan Bulan Ini"
          value="Rp 135.000.000"
          icon={<DollarSign className="h-4 w-4" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Total Pengeluaran Bulan Ini"
          value="Rp 100.000.000"
          icon={<Wallet className="h-4 w-4" />}
          trend={{ value: 5, isPositive: false }}
        />
        <StatCard
          title="Laba Bersih"
          value="Rp 35.000.000"
          icon={<LineChart className="h-4 w-4" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Transaksi Pending"
          value="7 Transaksi"
          icon={<CreditCard className="h-4 w-4" />}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <IncomeExpenseChart data={incomeExpenseData} />
        <ExpenseCategoryChart data={expenseCategoryData} />
      </div>
      
      <TransactionsTable transactions={mockTransactions} />
    </div>
  );
};

export default Dashboard;
