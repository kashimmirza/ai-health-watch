import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Moon, Sun, ChevronRight, Shield, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBankingData } from '@/hooks/useBankingData';
import { BalanceCard } from '@/components/banking/BalanceCard';
import { TransactionList } from '@/components/banking/TransactionList';
import { SavingsGoals } from '@/components/banking/SavingsGoals';
import { VirtualCard } from '@/components/banking/VirtualCard';
import { SpendingInsights } from '@/components/banking/SpendingInsights';
import { FraudAlerts } from '@/components/banking/FraudAlerts';
import { CreditScoreCard } from '@/components/banking/CreditScoreCard';
import { BillTracker } from '@/components/banking/BillTracker';
import { AIChatbot } from '@/components/banking/AIChatbot';
import { BottomNav } from '@/components/banking/BottomNav';
import { toast } from 'sonner';

type TabType = 'home' | 'accounts' | 'card' | 'insights' | 'profile';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isDark, setIsDark] = useState(false);
  const [resolvedAlerts, setResolvedAlerts] = useState<string[]>([]);
  
  const {
    accounts,
    transactions,
    savingsGoals,
    cards,
    fraudAlerts,
    bills,
    creditScore,
    spendingInsights,
    monthlySpending,
    balanceVisible,
    setBalanceVisible,
    cardLocked,
    setCardLocked,
  } = useBankingData();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleResolveAlert = (id: string) => {
    setResolvedAlerts(prev => [...prev, id]);
  };

  const handleLockCard = () => {
    setCardLocked(true);
    toast.success('Card has been locked for your security');
  };

  const spendingAccount = accounts.find(a => a.type === 'spending');
  const savingsAccount = accounts.find(a => a.type === 'savings');
  const activeAlerts = fraudAlerts.filter(a => !resolvedAlerts.includes(a.id));

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Balance overview */}
            {spendingAccount && (
              <BalanceCard
                balance={spendingAccount.balance}
                available={spendingAccount.available}
                type="spending"
                visible={balanceVisible}
                onToggleVisibility={() => setBalanceVisible(!balanceVisible)}
              />
            )}
            
            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-success" />
                  <span className="text-xs text-muted-foreground">Credit Score</span>
                </div>
                <p className="text-2xl font-bold font-display">{creditScore.score}</p>
                <p className="text-xs text-success">+{creditScore.changeAmount} this month</p>
              </div>
              
              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Savings</span>
                </div>
                <p className="text-2xl font-bold font-display">
                  {balanceVisible 
                    ? `$${(savingsAccount?.balance || 0).toLocaleString()}`
                    : '••••••'
                  }
                </p>
                <p className="text-xs text-primary">3 active goals</p>
              </div>
            </div>
            
            {/* Fraud alerts (if any) */}
            {activeAlerts.length > 0 && (
              <FraudAlerts
                alerts={activeAlerts}
                onResolve={handleResolveAlert}
                onLockCard={handleLockCard}
              />
            )}
            
            {/* Recent transactions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold font-display">Recent Activity</h2>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('accounts')}>
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <TransactionList
                transactions={transactions.filter(t => t.accountId === 'acc-1')}
                balanceVisible={balanceVisible}
              />
            </div>
            
            {/* Savings goals preview */}
            <SavingsGoals goals={savingsGoals} balanceVisible={balanceVisible} />
          </motion.div>
        );

      case 'accounts':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <h1 className="text-2xl font-bold font-display">Accounts</h1>
            
            {/* Spending account */}
            {spendingAccount && (
              <BalanceCard
                balance={spendingAccount.balance}
                available={spendingAccount.available}
                type="spending"
                visible={balanceVisible}
                onToggleVisibility={() => setBalanceVisible(!balanceVisible)}
              />
            )}
            
            {/* Savings account */}
            {savingsAccount && (
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground uppercase tracking-wider">
                    Savings Account
                  </span>
                </div>
                <p className="text-3xl font-bold font-display mb-4">
                  {balanceVisible
                    ? `$${savingsAccount.balance.toLocaleString()}`
                    : '••••••'
                  }
                </p>
                <SavingsGoals goals={savingsGoals} balanceVisible={balanceVisible} />
              </div>
            )}
            
            {/* All transactions */}
            <div>
              <h2 className="text-lg font-semibold font-display mb-4">All Transactions</h2>
              <TransactionList
                transactions={transactions}
                showAll
                balanceVisible={balanceVisible}
              />
            </div>
          </motion.div>
        );

      case 'card':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <h1 className="text-2xl font-bold font-display">Card</h1>
            
            {cards[0] && (
              <VirtualCard
                card={cards[0]}
                isLocked={cardLocked}
                onToggleLock={() => setCardLocked(!cardLocked)}
              />
            )}
            
            {/* Fraud alerts */}
            {activeAlerts.length > 0 && (
              <FraudAlerts
                alerts={activeAlerts}
                onResolve={handleResolveAlert}
                onLockCard={handleLockCard}
              />
            )}
            
            {/* Bill tracker */}
            <BillTracker bills={bills} balanceVisible={balanceVisible} />
          </motion.div>
        );

      case 'insights':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <h1 className="text-2xl font-bold font-display">Insights</h1>
            
            {/* Spending insights */}
            <SpendingInsights
              insights={spendingInsights}
              monthlySpending={monthlySpending}
              balanceVisible={balanceVisible}
            />
            
            {/* Credit score */}
            <CreditScoreCard creditScore={creditScore} />
          </motion.div>
        );

      case 'profile':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <h1 className="text-2xl font-bold font-display">Profile</h1>
            
            {/* Profile card */}
            <div className="glass-card p-6 rounded-xl text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
                <span className="text-3xl text-white font-bold">AJ</span>
              </div>
              <h2 className="text-xl font-semibold">Alex Johnson</h2>
              <p className="text-muted-foreground">alex.johnson@email.com</p>
              <p className="text-sm text-muted-foreground mt-1">Member since 2024</p>
            </div>
            
            {/* Quick settings */}
            <div className="space-y-2">
              {[
                { icon: Shield, label: 'Security Settings' },
                { icon: Bell, label: 'Notifications' },
                { icon: Sparkles, label: 'AI Preferences' },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className="w-full glass-card p-4 rounded-xl flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-primary" />
                    <span className="font-medium">{label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border safe-area-top">
        <div className="flex items-center justify-between p-4 max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg">ChimeAI</h1>
              <p className="text-xs text-muted-foreground">Smart Banking</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {activeAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                  {activeAlerts.length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="p-4 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>

      {/* AI Chatbot */}
      <AIChatbot />

      {/* Bottom navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
