
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Accounts: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6 mb-10">
        <h1 className="text-2xl font-bold">Accounts</h1>
        <p className="text-muted-foreground">Manage your connected financial accounts</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Checking Account</CardTitle>
              <CardDescription>Primary Bank</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$3,254.67</div>
              <div className="text-sm text-muted-foreground mt-2">
                Available Balance
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Savings Account</CardTitle>
              <CardDescription>Primary Bank</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,458.32</div>
              <div className="text-sm text-muted-foreground mt-2">
                Available Balance
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Accounts;
