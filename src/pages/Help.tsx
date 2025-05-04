
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

const Help: React.FC = () => {
  const { toast } = useToast();
  const [supportMessage, setSupportMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supportMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      toast({
        title: "Support request sent",
        description: "We'll get back to you soon!"
      });
      setSupportMessage('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Layout>
      <div className="space-y-6 mb-10">
        <h1 className="text-2xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground">Get answers and assistance with BudgetWise</p>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Quick answers to common questions</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How do I create a budget?</AccordionTrigger>
                    <AccordionContent>
                      To create a budget, go to the Budgets page and click "Create New Budget". 
                      You can then set categories and spending limits for each category.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>How do I connect my bank account?</AccordionTrigger>
                    <AccordionContent>
                      Navigate to Accounts page and click "Connect Account". You'll be guided through 
                      our secure connection process to link your bank accounts.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Is my financial data secure?</AccordionTrigger>
                    <AccordionContent>
                      Yes! We use bank-level encryption and never store your account credentials. 
                      Your security is our top priority.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>Need more help? Send us a message</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSupportSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="support-message">Your Message</Label>
                    <Textarea 
                      id="support-message" 
                      placeholder="Describe your issue or question..." 
                      className="min-h-[120px]"
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Help;
