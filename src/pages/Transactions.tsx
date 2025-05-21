
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  ArrowUpDown, 
  Download, 
  Filter, 
  Plus, 
  Search, 
  SlidersHorizontal 
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for transactions
const mockTransactions = [
  { 
    id: '1', 
    date: '2024-05-19', 
    description: 'Pembayaran Iklan Toyota', 
    category: 'Pendapatan Iklan', 
    amount: 15000000, 
    type: 'income',
    status: 'completed' 
  },
  { 
    id: '2', 
    date: '2024-05-18', 
    description: 'Pembayaran Gaji Karyawan', 
    category: 'Gaji & Kompensasi', 
    amount: 25000000, 
    type: 'expense',
    status: 'completed' 
  },
  { 
    id: '3', 
    date: '2024-05-17', 
    description: 'Pembayaran Sewa Studio', 
    category: 'Fasilitas', 
    amount: 8000000, 
    type: 'expense',
    status: 'completed' 
  },
  { 
    id: '4', 
    date: '2024-05-15', 
    description: 'Pendapatan Program "Morning Show"', 
    category: 'Pendapatan Program', 
    amount: 12000000, 
    type: 'income',
    status: 'pending' 
  },
  { 
    id: '5', 
    date: '2024-05-14', 
    description: 'Pembelian Peralatan Kamera', 
    category: 'Peralatan', 
    amount: 7500000, 
    type: 'expense',
    status: 'completed' 
  },
  { 
    id: '6', 
    date: '2024-05-12', 
    description: 'Pendapatan Sponsor Event', 
    category: 'Pendapatan Sponsor', 
    amount: 20000000, 
    type: 'income',
    status: 'completed' 
  },
  { 
    id: '7', 
    date: '2024-05-10', 
    description: 'Pembayaran Listrik Studio', 
    category: 'Utilitas', 
    amount: 4500000, 
    type: 'expense',
    status: 'pending' 
  },
  { 
    id: '8', 
    date: '2024-05-08', 
    description: 'Pembelian Perlengkapan Kantor', 
    category: 'Supplies', 
    amount: 2300000, 
    type: 'expense',
    status: 'pending' 
  },
  { 
    id: '9', 
    date: '2024-05-05', 
    description: 'Pendapatan Iklan Lazada', 
    category: 'Pendapatan Iklan', 
    amount: 18000000, 
    type: 'income',
    status: 'completed' 
  },
  { 
    id: '10', 
    date: '2024-05-02', 
    description: 'Biaya Transportasi Crew', 
    category: 'Transportasi', 
    amount: 3500000, 
    type: 'expense',
    status: 'completed' 
  }
];

const TransactionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [transactionType, setTransactionType] = useState<string | undefined>(undefined);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Transaksi</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Transaksi Baru
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">Semua</TabsTrigger>
            <TabsTrigger value="income">Pemasukan</TabsTrigger>
            <TabsTrigger value="expense">Pengeluaran</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari transaksi..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      
        <Card>
          <CardContent className="p-0">
            <TabsContent value="all" className="mt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Tanggal</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Jumlah</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTransactions
                    .filter(transaction => 
                      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((transaction) => (
                    <TableRow key={transaction.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell className="font-medium">{transaction.description}</TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell>
                        <div className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          transaction.status === 'completed' 
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        )}>
                          {transaction.status === 'completed' ? 'Selesai' : 'Pending'}
                        </div>
                      </TableCell>
                      <TableCell className={cn(
                        "text-right font-medium",
                        transaction.type === 'income' ? "text-green-600" : "text-red-600"
                      )}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {new Intl.NumberFormat('id-ID', { 
                          style: 'currency', 
                          currency: 'IDR',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        }).format(transaction.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="income" className="mt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Tanggal</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Jumlah</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTransactions
                    .filter(transaction => transaction.type === 'income' && 
                      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((transaction) => (
                    <TableRow key={transaction.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell className="font-medium">{transaction.description}</TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell>
                        <div className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          transaction.status === 'completed' 
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        )}>
                          {transaction.status === 'completed' ? 'Selesai' : 'Pending'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium text-green-600">
                        +
                        {new Intl.NumberFormat('id-ID', { 
                          style: 'currency', 
                          currency: 'IDR',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        }).format(transaction.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="expense" className="mt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Tanggal</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Jumlah</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTransactions
                    .filter(transaction => transaction.type === 'expense' && 
                      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((transaction) => (
                    <TableRow key={transaction.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell className="font-medium">{transaction.description}</TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell>
                        <div className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          transaction.status === 'completed' 
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        )}>
                          {transaction.status === 'completed' ? 'Selesai' : 'Pending'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium text-red-600">
                        -
                        {new Intl.NumberFormat('id-ID', { 
                          style: 'currency', 
                          currency: 'IDR',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        }).format(transaction.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default TransactionsPage;
