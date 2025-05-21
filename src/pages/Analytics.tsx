
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
import { LineChart, PieChart, BarChart2, Download, Calendar } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar
} from 'recharts';

// Mock data for analytics
const performanceData = [
  { month: 'Jan', viewers: 250000, engagement: 180000, revenue: 120000000 },
  { month: 'Feb', viewers: 280000, engagement: 210000, revenue: 125000000 },
  { month: 'Mar', viewers: 300000, engagement: 230000, revenue: 130000000 },
  { month: 'Apr', viewers: 340000, engagement: 260000, revenue: 140000000 },
  { month: 'May', viewers: 320000, engagement: 240000, revenue: 135000000 },
];

const channelPerformance = [
  { name: 'Berita', viewers: 150000, revenue: 45000000 },
  { name: 'Hiburan', viewers: 180000, revenue: 55000000 },
  { name: 'Olahraga', viewers: 90000, revenue: 30000000 },
  { name: 'Lifestyle', viewers: 50000, revenue: 20000000 },
  { name: 'Dokumenter', viewers: 30000, revenue: 15000000 },
];

const audienceData = [
  { name: '18-24', value: 15 },
  { name: '25-34', value: 30 },
  { name: '35-44', value: 25 },
  { name: '45-54', value: 20 },
  { name: '55+', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A4DE6C'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Analitik</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Pilih Periode
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Ekspor Analitik
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Viewers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">320,000</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <span>↑ 12% dari bulan lalu</span>
            </p>
            <div className="mt-4 h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <Line type="monotone" dataKey="viewers" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tingkat Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">240,000</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <span>↑ 8% dari bulan lalu</span>
            </p>
            <div className="mt-4 h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <Line type="monotone" dataKey="engagement" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendapatan Iklan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 135,000,000</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <span>↑ 5% dari bulan lalu</span>
            </p>
            <div className="mt-4 h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">
            <LineChart className="mr-2 h-4 w-4" />
            Performa
          </TabsTrigger>
          <TabsTrigger value="content">
            <BarChart2 className="mr-2 h-4 w-4" />
            Konten
          </TabsTrigger>
          <TabsTrigger value="audience">
            <PieChart className="mr-2 h-4 w-4" />
            Audiens
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6 space-y-6">
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performa Bulanan</CardTitle>
                <CardDescription>
                  Viewers, engagement, dan pendapatan iklan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={performanceData}
                      margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" 
                        tickFormatter={(value) => new Intl.NumberFormat('id-ID', { 
                          notation: 'compact',
                          compactDisplay: 'short'
                        }).format(value)} 
                      />
                      <YAxis yAxisId="right" orientation="right" 
                        tickFormatter={(value) => new Intl.NumberFormat('id-ID', { 
                          style: 'currency', 
                          currency: 'IDR',
                          notation: 'compact',
                          compactDisplay: 'short'
                        }).format(value)} 
                      />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="viewers" name="Viewers" stroke="#0ea5e9" strokeWidth={2} />
                      <Line yAxisId="left" type="monotone" dataKey="engagement" name="Engagement" stroke="#8b5cf6" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" dataKey="revenue" name="Pendapatan" stroke="#10b981" strokeWidth={2} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performa Berdasarkan Kategori Konten</CardTitle>
                <CardDescription>
                  Viewers dan pendapatan per kategori program
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={channelPerformance}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#0ea5e9"
                        tickFormatter={(value) => new Intl.NumberFormat('id-ID', { 
                          notation: 'compact',
                          compactDisplay: 'short'
                        }).format(value)} 
                      />
                      <YAxis yAxisId="right" orientation="right" stroke="#10b981"
                        tickFormatter={(value) => new Intl.NumberFormat('id-ID', { 
                          style: 'currency', 
                          currency: 'IDR',
                          notation: 'compact',
                          compactDisplay: 'short'
                        }).format(value)} 
                      />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="viewers" name="Viewers" fill="#0ea5e9" />
                      <Bar yAxisId="right" dataKey="revenue" name="Pendapatan" fill="#10b981" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="audience" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Demografi Audiens</CardTitle>
                <CardDescription>
                  Distribusi penonton berdasarkan kelompok usia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={audienceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {audienceData.map((entry, index) => (
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
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
