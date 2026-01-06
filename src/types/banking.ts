export interface Account {
  id: string;
  type: 'spending' | 'savings';
  name: string;
  balance: number;
  available: number;
  accountNumber: string;
  routingNumber: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  type: 'credit' | 'debit';
  category: TransactionCategory;
  merchant: string;
  description: string;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  isFlagged?: boolean;
}

export type TransactionCategory = 
  | 'groceries'
  | 'dining'
  | 'transport'
  | 'utilities'
  | 'entertainment'
  | 'shopping'
  | 'health'
  | 'income'
  | 'transfer'
  | 'subscription'
  | 'other';

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  icon: string;
}

export interface Card {
  id: string;
  type: 'debit' | 'credit';
  lastFour: string;
  expiryDate: string;
  cardholderName: string;
  isLocked: boolean;
  dailyLimit: number;
  atmLimit: number;
}

export interface SpendingInsight {
  category: TransactionCategory;
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
}

export interface FraudAlert {
  id: string;
  transactionId: string;
  type: 'unusual_amount' | 'unusual_location' | 'unusual_merchant' | 'rapid_transactions';
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: string;
  isResolved: boolean;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  isAutopay: boolean;
  status: 'upcoming' | 'paid' | 'overdue';
}

export interface CreditScore {
  score: number;
  rating: 'poor' | 'fair' | 'good' | 'excellent';
  lastUpdated: string;
  factors: {
    paymentHistory: number;
    creditUtilization: number;
    creditAge: number;
    newCredit: number;
    creditMix: number;
  };
  trend: 'up' | 'down' | 'stable';
  changeAmount: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
