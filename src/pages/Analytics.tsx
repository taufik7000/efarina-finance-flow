
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
import { 
  BarChart, 
  BarChart2, 
  Download, 
  LineChart,
  PieChart,
  TrendingUp
} from 'lucide-react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

// Data analitik pemirsa
const viewershipData = [
  { month: 'Jan', viewers: 250000, engagement: 42, revenue: 175000000 },
  { month: 'Feb', viewers: 280000, engagement: 45, revenue: 190000000 },
  { month: 'Mar', viewers: 300000, engagement: 48, revenue: 210000000 },
  { month: 'Apr', viewers: 320000, engagement: 52, revenue: 225000000 },
  { month: 'May', viewers: 350000, engagement: 55, revenue: 245000000 },
];

// Data demografi pemirsa
const demographicData = [
  { name: '18-24', value: 25 },
  { name: '25-34', value: 35 },
  { name: '35-44', value: 20 },
  { name: '45-54', value: 15 },
  { name: 'Other', value: 5 },
];

// Data konten populer
const contentData = [
  { name: 'Berita', value: 40 },
  { name: 'Hiburan', value: 25 },
  { name: 'Talk Show', value: 15 },
  { name: 'Dokumenter', value: 12 },
  { name: 'Lainnya', value: 8 },
];

// Warna untuk chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];

const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Analitik</h1>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Ekspor Data
        </Button>
      </div>
      
      <Tabs defaultValue="viewers" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="viewers">
            <BarChart2 className="mr-2 h-4 w-4" />
            Jumlah Pemirsa
          </TabsTrigger>
          <TabsTrigger value="engagement">
            <TrendingUp className="mr-2 h-4 w-4" />
            Keterlibatan
          </TabsTrigger>
          <TabsTrigger value="demographics">
            <PieChart className="mr-2 h-4 w-4" />
            Demografi
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6 space-y-6">
          <TabsContent value="viewers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trend Jumlah Pemirsa</CardTitle>
                <CardDescription>
                  Jumlah rata-rata pemirsa bulanan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={viewershipData}
                      margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis 
                        tickFormatter={(value) => new Intl.NumberFormat('id-ID', { 
                          notation: 'compact',
                          compactDisplay: 'short',
                          maximumFractionDigits: 1
                        }).format(value)}
                      />
                      <Tooltip 
                        formatter={(value) => new Intl.NumberFormat('id-ID').format(Number(value)) + ' pemirsa'}
                      />
                      <Legend />
                      <Bar dataKey="viewers" name="Jumlah Pemirsa" fill="#60a5fa" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Pendapatan vs Jumlah Pemirsa</CardTitle>
                <CardDescription>
                  Korelasi antara jumlah pemirsa dan pendapatan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={viewershipData}
                      margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis 
                        yAxisId="left"
                        tickFormatter={(value) => new Intl.NumberFormat('id-ID', { 
                          notation: 'compact',
                          compactDisplay: 'short',
                          maximumFractionDigits: 1
                        }).format(value)}
                      />
                      <YAxis 
                        yAxisId="right"
                        orientation="right"
                        tickFormatter={(value) => new Intl.NumberFormat('id-ID', { 
                          notation: 'compact',
                          style: 'currency',
                          currency: 'IDR',
                          maximumFractionDigits: 1
                        }).format(value)}
                      />
                      <Tooltip />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="viewers" 
                        name="Jumlah Pemirsa" 
                        stroke="#60a5fa" 
                        activeDot={{ r: 8 }}
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="revenue" 
                        name="Pendapatan (IDR)" 
                        stroke="#4ade80" 
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="engagement" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tingkat Keterlibatan</CardTitle>
                <CardDescription>
                  Persentase keterlibatan pemirsa per bulan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={viewershipData}
                      margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis 
                        domain={[35, 60]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="engagement" 
                        name="Keterlibatan" 
                        stroke="#f472b6" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="demographics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Demografi Usia Pemirsa</CardTitle>
                  <CardDescription>
                    Distribusi pemirsa berdasarkan kelompok usia
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={demographicData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {demographicData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Preferensi Konten</CardTitle>
                  <CardDescription>
                    Distribusi preferensi konten pemirsa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={contentData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {contentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
