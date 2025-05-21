
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart, BarChart2, Download, FileText, PieChart } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

// Mock data for reports
const monthlyFinancial = [
  { name: 'Jan', pendapatan: 120000000, pengeluaran: 95000000, profit: 25000000 },
  { name: 'Feb', pendapatan: 125000000, pengeluaran: 98000000, profit: 27000000 },
  { name: 'Mar', pendapatan: 130000000, pengeluaran: 102000000, profit: 28000000 },
  { name: 'Apr', pendapatan: 140000000, pengeluaran: 105000000, profit: 35000000 },
  { name: 'May', pendapatan: 135000000, pengeluaran: 100000000, profit: 35000000 },
];

const categoryIncome = [
  { name: 'Pendapatan Iklan', value: 65000000 },
  { name: 'Pendapatan Program', value: 45000000 },
  { name: 'Pendapatan Sponsor', value: 35000000 },
  { name: 'Lainnya', value: 10000000 },
];

const categoryExpense = [
  { name: 'Gaji & Kompensasi', value: 45000000 },
  { name: 'Fasilitas', value: 22000000 },
  { name: 'Peralatan', value: 18000000 },
  { name: 'Marketing', value: 12000000 },
  { name: 'Operasional', value: 15000000 },
];

const profitTrend = [
  { name: 'Q1 2023', value: 65000000 },
  { name: 'Q2 2023', value: 72000000 },
  { name: 'Q3 2023', value: 68000000 },
  { name: 'Q4 2023', value: 77000000 },
  { name: 'Q1 2024', value: 80000000 },
  { name: 'Q2 2024', value: 85000000 },
];

const ReportsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Laporan</h1>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Ekspor PDF
        </Button>
      </div>
      
      <Tabs defaultValue="financial" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="financial">
            <BarChart2 className="mr-2 h-4 w-4" />
            Keuangan
          </TabsTrigger>
          <TabsTrigger value="income">
            <PieChart className="mr-2 h-4 w-4" />
            Pendapatan
          </TabsTrigger>
          <TabsTrigger value="expense">
            <FileText className="mr-2 h-4 w-4" />
            Pengeluaran
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6 space-y-6">
          <TabsContent value="financial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Laporan Keuangan Bulanan 2024</CardTitle>
                <CardDescription>
                  Perbandingan pendapatan dan pengeluaran per bulan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={monthlyFinancial}
                      margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis 
                        tickFormatter={(value) => new Intl.NumberFormat('id-ID', { 
                          notation: 'compact',
                          compactDisplay: 'short',
                          maximumFractionDigits: 1
                        }).format(value)} 
                      />
                      <Tooltip 
                        formatter={(value) => new Intl.NumberFormat('id-ID', { 
                          style: 'currency', 
                          currency: 'IDR',
                          minimumFractionDigits: 0 
                        }).format(Number(value))}
                      />
                      <Legend />
                      <Bar dataKey="pendapatan" name="Pendapatan" fill="#4ade80" />
                      <Bar dataKey="pengeluaran" name="Pengeluaran" fill="#f87171" />
                      <Bar dataKey="profit" name="Profit" fill="#60a5fa" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tren Profit</CardTitle>
                <CardDescription>
                  Perkembangan profit per kuartal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={profitTrend}
                      margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis 
                        tickFormatter={(value) => new Intl.NumberFormat('id-ID', { 
                          notation: 'compact',
                          compactDisplay: 'short',
                          maximumFractionDigits: 1
                        }).format(value)} 
                      />
                      <Tooltip 
                        formatter={(value) => new Intl.NumberFormat('id-ID', { 
                          style: 'currency', 
                          currency: 'IDR',
                          minimumFractionDigits: 0 
                        }).format(Number(value))}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="value" name="Profit" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="income" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Perincian Pendapatan</CardTitle>
                <CardDescription>
                  Distribusi pendapatan berdasarkan kategori
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={categoryIncome}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 130, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" 
                        tickFormatter={(value) => new Intl.NumberFormat('id-ID', { 
                          notation: 'compact',
                          compactDisplay: 'short',
                          maximumFractionDigits: 1
                        }).format(value)}
                      />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip 
                        formatter={(value) => new Intl.NumberFormat('id-ID', { 
                          style: 'currency', 
                          currency: 'IDR',
                          minimumFractionDigits: 0 
                        }).format(Number(value))}
                      />
                      <Legend />
                      <Bar dataKey="value" name="Jumlah" fill="#4ade80" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="expense" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Perincian Pengeluaran</CardTitle>
                <CardDescription>
                  Distribusi pengeluaran berdasarkan kategori
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={categoryExpense}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 130, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number"
                        tickFormatter={(value) => new Intl.NumberFormat('id-ID', { 
                          notation: 'compact',
                          compactDisplay: 'short',
                          maximumFractionDigits: 1
                        }).format(value)} 
                      />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip 
                        formatter={(value) => new Intl.NumberFormat('id-ID', { 
                          style: 'currency', 
                          currency: 'IDR',
                          minimumFractionDigits: 0 
                        }).format(Number(value))}
                      />
                      <Legend />
                      <Bar dataKey="value" name="Jumlah" fill="#f87171" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
