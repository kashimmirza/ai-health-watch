import { useState, useMemo } from 'react';
import type { 
  Account, 
  Transaction, 
  SavingsGoal, 
  Card, 
  SpendingInsight, 
  FraudAlert,
  Bill,
  CreditScore
} from '@/types/banking';

// Mock data generator
const generateMockData = () => {
  const accounts: Account[] = [
    {
      id: 'acc-1',
      type: 'spending',
      name: 'Spending Account',
      balance: 4823.67,
      available: 4823.67,
      accountNumber: '****4521',
      routingNumber: '****7890',
    },
    {
      id: 'acc-2',
      type: 'savings',
      name: 'Savings Account',
      balance: 12450.00,
      available: 12450.00,
      accountNumber: '****4522',
      routingNumber: '****7890',
    },
  ];

  const transactions: Transaction[] = [
    { id: 't1', accountId: 'acc-1', amount: 2450.00, type: 'credit', category: 'income', merchant: 'Direct Deposit', description: 'Payroll - TechCorp Inc', date: '2026-01-06T09:00:00Z', status: 'completed' },
    { id: 't2', accountId: 'acc-1', amount: 127.43, type: 'debit', category: 'groceries', merchant: 'Whole Foods', description: 'Weekly groceries', date: '2026-01-05T14:30:00Z', status: 'completed' },
    { id: 't3', accountId: 'acc-1', amount: 45.00, type: 'debit', category: 'dining', merchant: 'Chipotle', description: 'Lunch with team', date: '2026-01-05T12:15:00Z', status: 'completed' },
    { id: 't4', accountId: 'acc-1', amount: 89.99, type: 'debit', category: 'subscription', merchant: 'Netflix', description: 'Monthly subscription', date: '2026-01-04T00:00:00Z', status: 'completed' },
    { id: 't5', accountId: 'acc-1', amount: 1250.00, type: 'debit', category: 'utilities', merchant: 'City Apartments', description: 'Rent payment', date: '2026-01-01T00:00:00Z', status: 'completed' },
    { id: 't6', accountId: 'acc-1', amount: 34.50, type: 'debit', category: 'transport', merchant: 'Uber', description: 'Ride to airport', date: '2025-12-31T18:00:00Z', status: 'completed' },
    { id: 't7', accountId: 'acc-1', amount: 199.00, type: 'debit', category: 'shopping', merchant: 'Amazon', description: 'Electronics purchase', date: '2025-12-30T10:00:00Z', status: 'completed' },
    { id: 't8', accountId: 'acc-1', amount: 850.00, type: 'debit', category: 'shopping', merchant: 'Luxury Store', description: 'Unusual large purchase', date: '2026-01-05T23:45:00Z', status: 'completed', isFlagged: true },
    { id: 't9', accountId: 'acc-2', amount: 500.00, type: 'credit', category: 'transfer', merchant: 'Transfer', description: 'Weekly savings transfer', date: '2026-01-03T00:00:00Z', status: 'completed' },
    { id: 't10', accountId: 'acc-1', amount: 15.99, type: 'debit', category: 'entertainment', merchant: 'Spotify', description: 'Premium subscription', date: '2026-01-02T00:00:00Z', status: 'completed' },
  ];

  const savingsGoals: SavingsGoal[] = [
    { id: 'sg1', name: 'Emergency Fund', targetAmount: 10000, currentAmount: 7500, icon: '🛡️' },
    { id: 'sg2', name: 'Vacation', targetAmount: 3000, currentAmount: 1200, deadline: '2026-06-01', icon: '✈️' },
    { id: 'sg3', name: 'New Car', targetAmount: 15000, currentAmount: 3750, deadline: '2027-01-01', icon: '🚗' },
  ];

  const cards: Card[] = [
    {
      id: 'card-1',
      type: 'debit',
      lastFour: '4521',
      expiryDate: '08/28',
      cardholderName: 'ALEX JOHNSON',
      isLocked: false,
      dailyLimit: 2500,
      atmLimit: 500,
    },
  ];

  const fraudAlerts: FraudAlert[] = [
    {
      id: 'fa1',
      transactionId: 't8',
      type: 'unusual_amount',
      severity: 'high',
      message: 'Large purchase detected at Luxury Store - $850.00. This is 3x higher than your typical shopping amount.',
      timestamp: '2026-01-05T23:46:00Z',
      isResolved: false,
    },
  ];

  const bills: Bill[] = [
    { id: 'b1', name: 'City Apartments', amount: 1250.00, dueDate: '2026-02-01', category: 'Rent', isAutopay: true, status: 'upcoming' },
    { id: 'b2', name: 'Electric Company', amount: 145.00, dueDate: '2026-01-15', category: 'Utilities', isAutopay: false, status: 'upcoming' },
    { id: 'b3', name: 'Internet Provider', amount: 79.99, dueDate: '2026-01-20', category: 'Utilities', isAutopay: true, status: 'upcoming' },
    { id: 'b4', name: 'Phone Bill', amount: 85.00, dueDate: '2026-01-18', category: 'Utilities', isAutopay: false, status: 'upcoming' },
    { id: 'b5', name: 'Netflix', amount: 15.99, dueDate: '2026-02-04', category: 'Subscription', isAutopay: true, status: 'upcoming' },
  ];

  const creditScore: CreditScore = {
    score: 742,
    rating: 'good',
    lastUpdated: '2026-01-05',
    factors: {
      paymentHistory: 95,
      creditUtilization: 23,
      creditAge: 72,
      newCredit: 85,
      creditMix: 78,
    },
    trend: 'up',
    changeAmount: 12,
  };

  return { accounts, transactions, savingsGoals, cards, fraudAlerts, bills, creditScore };
};

export const useBankingData = () => {
  const [data] = useState(generateMockData);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [cardLocked, setCardLocked] = useState(false);

  const spendingInsights = useMemo<SpendingInsight[]>(() => {
    const spending = data.transactions
      .filter(t => t.type === 'debit' && t.accountId === 'acc-1')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const total = Object.values(spending).reduce((a, b) => a + b, 0);

    return Object.entries(spending)
      .map(([category, amount]) => {
        const trends: Array<'up' | 'down' | 'stable'> = ['up', 'down', 'stable'];
        const randomTrend = trends[Math.floor(Math.random() * 2)] as 'up' | 'down';
        return {
          category: category as SpendingInsight['category'],
          amount,
          percentage: Math.round((amount / total) * 100),
          trend: randomTrend,
          changePercent: Math.round(Math.random() * 20),
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [data.transactions]);

  const totalBalance = useMemo(() => 
    data.accounts.reduce((sum, acc) => sum + acc.balance, 0),
    [data.accounts]
  );

  const monthlySpending = useMemo(() => 
    data.transactions
      .filter(t => t.type === 'debit' && t.accountId === 'acc-1')
      .reduce((sum, t) => sum + t.amount, 0),
    [data.transactions]
  );

  return {
    ...data,
    spendingInsights,
    totalBalance,
    monthlySpending,
    balanceVisible,
    setBalanceVisible,
    cardLocked,
    setCardLocked,
  };
};
