
import React from 'react';
import Layout from '@/components/Layout';
import PredictionChart from '@/components/PredictionChart';

const Forecast: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6 mb-10">
        <h1 className="text-2xl font-bold">Spending Forecast</h1>
        <p className="text-muted-foreground">Predictive analysis of your future expenses</p>
        <PredictionChart />
      </div>
    </Layout>
  );
};

export default Forecast;
