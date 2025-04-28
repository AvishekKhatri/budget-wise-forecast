
import React from 'react';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import TransactionList from '@/components/TransactionList';
import BudgetOverview from '@/components/BudgetOverview';
import PredictionChart from '@/components/PredictionChart';

const Index: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6 mb-10">
        <Dashboard />
        
        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            <PredictionChart />
            <BudgetOverview />
          </div>
          
          {/* Right column */}
          <div>
            <TransactionList />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
