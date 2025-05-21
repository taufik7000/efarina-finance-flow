
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Plus } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

// Data acara sampel
const sampleEvents = [
  { id: 1, title: 'Rapat Manajemen', date: new Date(2025, 4, 22, 10, 0), type: 'meeting', duration: '2 jam' },
  { id: 2, title: 'Perencanaan Anggaran', date: new Date(2025, 4, 22, 14, 0), type: 'finance', duration: '3 jam' },
  { id: 3, title: 'Pembahasan Konten', date: new Date(2025, 4, 24, 9, 0), type: 'content', duration: '1 jam' },
  { id: 4, title: 'Wawancara Tamu', date: new Date(2025, 4, 25, 13, 0), type: 'interview', duration: '1.5 jam' },
  { id: 5, title: 'Evaluasi Program', date: new Date(2025, 4, 26, 15, 0), type: 'meeting', duration: '2 jam' },
];

// Fungsi untuk mendapatkan warna badge sesuai tipe acara
const getBadgeVariant = (type: string) => {
  switch (type) {
    case 'meeting': return 'default';
    case 'finance': return 'destructive';
    case 'content': return 'secondary';
    case 'interview': return 'outline';
    default: return 'default';
  }
};

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Filter acara untuk tanggal yang dipilih
  const eventsOnSelectedDate = selectedDate 
    ? sampleEvents.filter(event => 
        event.date.getDate() === selectedDate.getDate() && 
        event.date.getMonth() === selectedDate.getMonth() && 
        event.date.getFullYear() === selectedDate.getFullYear()
      )
    : [];

  const handleDateSelect = (date: Date | undefined) => {
    setDate(date);
    setSelectedDate(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Jadwal</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Acara
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Jadwal Bulanan</CardTitle>
            <CardDescription>Lihat dan atur jadwal kegiatan bulanan Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-center">
                <Button variant="outline" size="icon" onClick={() => setDate(prev => prev && new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="mx-4 text-lg font-medium">
                  {date && format(date, 'MMMM yyyy', { locale: id })}
                </div>
                <Button variant="outline" size="icon" onClick={() => setDate(prev => prev && new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                month={date}
                className="rounded-md border mx-auto"
                locale={id}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Acara Hari Ini</CardTitle>
            <CardDescription>
              {selectedDate ? format(selectedDate, 'EEEE, d MMMM yyyy', { locale: id }) : 'Pilih tanggal'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {eventsOnSelectedDate.length > 0 ? (
              <div className="space-y-4">
                {eventsOnSelectedDate.map((event) => (
                  <div key={event.id} className="border rounded-md p-3 hover:bg-accent transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{event.title}</h3>
                      <Badge variant={getBadgeVariant(event.type)}>
                        {event.type === 'meeting' && 'Rapat'}
                        {event.type === 'finance' && 'Keuangan'}
                        {event.type === 'content' && 'Konten'}
                        {event.type === 'interview' && 'Wawancara'}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{format(event.date, 'HH:mm')} ({event.duration})</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Tidak ada acara yang dijadwalkan untuk tanggal ini</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarPage;
