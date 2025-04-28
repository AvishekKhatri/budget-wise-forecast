
import React from 'react';
import Layout from '@/components/Layout';
import BudgetOverview from '@/components/BudgetOverview';

const Budgets: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6 mb-10">
        <h1 className="text-2xl font-bold">Budget Management</h1>
        <p className="text-muted-foreground">Track and manage your spending categories</p>
        <BudgetOverview />
      </div>
    </Layout>
  );
};

export default Budgets;
