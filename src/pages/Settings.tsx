
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { BellRing, Check, Globe, Image, Key, Lock, Save, ShieldCheck, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Schema untuk validasi form profil
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Nama harus minimal 2 karakter',
  }),
  email: z.string().email({
    message: 'Email tidak valid',
  }),
  bio: z.string().max(160).optional(),
});

// Schema untuk validasi form keamanan
const securityFormSchema = z.object({
  currentPassword: z.string().min(8, {
    message: 'Kata sandi harus minimal 8 karakter',
  }),
  newPassword: z.string().min(8, {
    message: 'Kata sandi baru harus minimal 8 karakter',
  }),
  confirmPassword: z.string().min(8, {
    message: 'Konfirmasi kata sandi harus minimal 8 karakter',
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Kata sandi baru dan konfirmasi kata sandi tidak cocok",
  path: ["confirmPassword"],
});

const SettingsPage = () => {
  const { toast } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  
  // Form untuk profil
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "Budi Santoso",
      email: "budi.santoso@efarina.tv",
      bio: "Manajer Keuangan di Efarina TV",
    },
  });

  // Form untuk keamanan
  const securityForm = useForm<z.infer<typeof securityFormSchema>>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Handler untuk submit form profil
  function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    toast({
      title: "Profil berhasil diperbarui",
      description: "Perubahan profil telah disimpan",
    });
  }

  // Handler untuk submit form keamanan
  function onSecuritySubmit(values: z.infer<typeof securityFormSchema>) {
    toast({
      title: "Kata sandi berhasil diperbarui",
      description: "Kata sandi baru telah disimpan",
    });
    securityForm.reset();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Pengaturan</h1>
      </div>
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account">
            <User className="mr-2 h-4 w-4" />
            Akun
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <BellRing className="mr-2 h-4 w-4" />
            Notifikasi
          </TabsTrigger>
          <TabsTrigger value="security">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Keamanan
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Profil</CardTitle>
              <CardDescription>
                Kelola informasi profil Anda untuk akun ini.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-8">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Nama yang akan ditampilkan di profil Anda.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Email yang digunakan untuk login dan notifikasi.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Deskripsi singkat tentang diri Anda.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Perubahan
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Avatar Profil</CardTitle>
              <CardDescription>
                Upload atau ubah avatar Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-12 w-12 text-gray-500" />
              </div>
              <Button variant="outline">
                <Image className="mr-2 h-4 w-4" />
                Upload Avatar Baru
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferensi Notifikasi</CardTitle>
              <CardDescription>
                Kelola cara Anda ingin diberi tahu saat sesuatu terjadi.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Notifikasi Aplikasi</Label>
                  <p className="text-sm text-muted-foreground">
                    Terima notifikasi tentang aktivitas akun Anda.
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emails">Email Pemasaran</Label>
                  <p className="text-sm text-muted-foreground">
                    Terima email tentang fitur baru dan pembaruan lainnya.
                  </p>
                </div>
                <Switch
                  id="emails"
                  checked={marketingEmails}
                  onCheckedChange={setMarketingEmails}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => {
                toast({
                  title: "Pengaturan notifikasi disimpan",
                  description: "Preferensi notifikasi Anda telah diperbarui",
                })
              }}>
                <Save className="mr-2 h-4 w-4" />
                Simpan Perubahan
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ganti Kata Sandi</CardTitle>
              <CardDescription>
                Perbarui kata sandi Anda untuk keamanan yang lebih baik.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...securityForm}>
                <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-8">
                  <FormField
                    control={securityForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kata Sandi Saat Ini</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={securityForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kata Sandi Baru</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={securityForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Konfirmasi Kata Sandi</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">
                    <Key className="mr-2 h-4 w-4" />
                    Perbarui Kata Sandi
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Autentikasi Dua Faktor</CardTitle>
              <CardDescription>
                Tambahkan lapisan keamanan ekstra ke akun Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="2fa">Aktifkan 2FA</Label>
                  <p className="text-sm text-muted-foreground">
                    Lindungi akun Anda dengan autentikasi dua faktor.
                  </p>
                </div>
                <Switch
                  id="2fa"
                  checked={twoFactorAuth}
                  onCheckedChange={setTwoFactorAuth}
                />
              </div>
              {twoFactorAuth && (
                <div className="p-4 rounded-md bg-accent">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-efarina-600" />
                    <p className="text-sm font-medium">Autentikasi dua faktor diaktifkan</p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => {
                  toast({
                    title: "Pengaturan keamanan disimpan",
                    description: "Pengaturan 2FA Anda telah diperbarui",
                  });
                }}
              >
                <Lock className="mr-2 h-4 w-4" />
                Simpan Pengaturan Keamanan
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
