import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  MoreHorizontal, 
  Plus, 
  Search, 
  Trash, 
  UserPlus 
} from 'lucide-react';
import { Label } from '@/components/ui/label';

// Data pengguna sampel
const sampleUsers = [
  { id: 1, name: 'Budi Santoso', email: 'budi.santoso@efarina.tv', role: 'admin', department: 'Management', status: 'active' },
  { id: 2, name: 'Siti Rahma', email: 'siti.rahma@efarina.tv', role: 'editor', department: 'Produksi', status: 'active' },
  { id: 3, name: 'Ahmad Rizki', email: 'ahmad.rizki@efarina.tv', role: 'finance', department: 'Keuangan', status: 'active' },
  { id: 4, name: 'Dewi Lestari', email: 'dewi.lestari@efarina.tv', role: 'user', department: 'Marketing', status: 'inactive' },
  { id: 5, name: 'Farhan Aditya', email: 'farhan.aditya@efarina.tv', role: 'editor', department: 'Produksi', status: 'active' },
  { id: 6, name: 'Indah Permata', email: 'indah.permata@efarina.tv', role: 'user', department: 'HR', status: 'active' },
  { id: 7, name: 'Hendra Wijaya', email: 'hendra.wijaya@efarina.tv', role: 'finance', department: 'Keuangan', status: 'inactive' },
];

// Fungsi untuk mendapatkan warna badge sesuai peran
const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case 'admin': return 'destructive';
    case 'editor': return 'secondary';
    case 'finance': return 'default';
    case 'user': return 'outline';
    default: return 'default';
  }
};

const getStatusBadgeVariant = (status: string) => {
  return status === 'active' ? 'secondary' : 'outline';
};

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter pengguna berdasarkan kata kunci pencarian
  const filteredUsers = sampleUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Manajemen Pengguna</h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Tambah Pengguna
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Pengguna Baru</DialogTitle>
              <DialogDescription>
                Masukkan informasi pengguna baru untuk sistem Efarina TV Finance.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nama
                </Label>
                <Input id="name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input id="email" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">
                  Departemen
                </Label>
                <Input id="department" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Peran
                </Label>
                <Input id="role" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Batal</Button>
              </DialogClose>
              <Button type="submit">Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
          <CardDescription>
            Kelola pengguna yang memiliki akses ke sistem Efarina TV Finance
          </CardDescription>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Cari pengguna..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead>Departemen</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                      {user.role === 'admin' && 'Admin'}
                      {user.role === 'editor' && 'Editor'}
                      {user.role === 'finance' && 'Keuangan'}
                      {user.role === 'user' && 'Pengguna'}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(user.status)} className="capitalize">
                      {user.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash className="h-4 w-4 mr-2" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
