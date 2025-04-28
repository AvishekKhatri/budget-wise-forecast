
import React from 'react';
import Layout from '@/components/Layout';
import TransactionList from '@/components/TransactionList';

const Transactions: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6 mb-10">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">Review and manage your transaction history</p>
        <TransactionList />
      </div>
    </Layout>
  );
};

export default Transactions;
