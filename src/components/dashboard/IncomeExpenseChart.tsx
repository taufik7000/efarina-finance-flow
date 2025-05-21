
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils';

type ChartData = {
  month: string;
  income: number;
  expense: number;
};

type IncomeExpenseChartProps = {
  data: ChartData[];
  className?: string;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 p-3 border border-border rounded-lg shadow-lg">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-green-500">
          Pendapatan: {new Intl.NumberFormat('id-ID', { 
            style: 'currency', 
            currency: 'IDR',
            minimumFractionDigits: 0 
          }).format(payload[0].value)}
        </p>
        <p className="text-sm text-red-500">
          Pengeluaran: {new Intl.NumberFormat('id-ID', { 
            style: 'currency', 
            currency: 'IDR',
            minimumFractionDigits: 0 
          }).format(payload[1].value)}
        </p>
      </div>
    );
  }
  return null;
};

const IncomeExpenseChart = ({ data, className }: IncomeExpenseChartProps) => {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>Pendapatan & Pengeluaran 2024</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis 
              tickFormatter={(value) => 
                new Intl.NumberFormat('id-ID', { 
                  notation: 'compact',
                  compactDisplay: 'short'
                }).format(value)
              }
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="income" 
              name="Pendapatan" 
              stroke="#10b981" 
              fill="#10b981" 
              fillOpacity={0.2} 
            />
            <Area 
              type="monotone" 
              dataKey="expense" 
              name="Pengeluaran" 
              stroke="#ef4444" 
              fill="#ef4444" 
              fillOpacity={0.2} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default IncomeExpenseChart;
