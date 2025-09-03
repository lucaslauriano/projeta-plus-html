'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  CreditCard,
  DollarSign,
  TrendingUp,
  Users,
} from 'lucide-react';
import Button1ContentPage from '@/components/button-content';

export default function DashboardPage() {
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold font-sans'>Dashboard</h1>
          <p className='text-muted-foreground font-serif'>
            Welcome back! Heres your billing overview.
          </p>
        </div>
        <Badge variant='secondary' className='bg-primary/10 text-primary'>
          Pro Plan
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Button1ContentPage />
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium font-serif'>
              Monthly Revenue
            </CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold font-sans'>$12,450</div>
            <p className='text-xs text-muted-foreground'>
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium font-serif'>
              Active Subscriptions
            </CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold font-sans'>1,234</div>
            <p className='text-xs text-muted-foreground'>+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium font-serif'>
              Conversion Rate
            </CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold font-sans'>3.2%</div>
            <p className='text-xs text-muted-foreground'>
              +0.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium font-serif'>
              Failed Payments
            </CardTitle>
            <CreditCard className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold font-sans'>23</div>
            <p className='text-xs text-muted-foreground'>
              -15% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='font-sans'>Recent Transactions</CardTitle>
            <CardDescription className='font-serif'>
              Latest billing activity
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {[
              {
                customer: 'Acme Corp',
                amount: '$299',
                status: 'Paid',
                time: '2 hours ago',
              },
              {
                customer: 'TechStart Inc',
                amount: '$99',
                status: 'Paid',
                time: '4 hours ago',
              },
              {
                customer: 'Design Co',
                amount: '$199',
                status: 'Failed',
                time: '6 hours ago',
              },
              {
                customer: 'Dev Agency',
                amount: '$499',
                status: 'Paid',
                time: '8 hours ago',
              },
            ].map((transaction, i) => (
              <div key={i} className='flex items-center justify-between'>
                <div>
                  <p className='font-medium font-serif'>
                    {transaction.customer}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {transaction.time}
                  </p>
                </div>
                <div className='text-right'>
                  <p className='font-medium font-sans'>{transaction.amount}</p>
                  <Badge
                    variant={
                      transaction.status === 'Paid' ? 'default' : 'destructive'
                    }
                    className='text-xs'
                  >
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='font-sans'>Quick Actions</CardTitle>
            <CardDescription className='font-serif'>
              Common billing tasks
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-3'>
            <Button
              className='w-full justify-start bg-transparent'
              variant='outline'
            >
              <CreditCard className='mr-2 h-4 w-4' />
              Create Invoice
            </Button>
            <Button
              className='w-full justify-start bg-transparent'
              variant='outline'
            >
              <Users className='mr-2 h-4 w-4' />
              Add Customer
            </Button>
            <Button
              className='w-full justify-start bg-transparent'
              variant='outline'
            >
              <BarChart3 className='mr-2 h-4 w-4' />
              View Reports
            </Button>
            <Button
              className='w-full justify-start bg-transparent'
              variant='outline'
            >
              <DollarSign className='mr-2 h-4 w-4' />
              Manage Plans
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
