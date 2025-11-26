'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const bookings = [
  { id: '1', passenger: 'Sarah Mansour', trip: 'Tunis - Sousse', date: 'Dec 1, 2025', seat: 'A12', amount: '15.00 TND', status: 'CONFIRMED' },
  { id: '2', passenger: 'Youssef Khelifi', trip: 'Sfax - Gabès', date: 'Dec 1, 2025', seat: 'B05', amount: '12.00 TND', status: 'PENDING' },
  { id: '3', passenger: 'Amira Bouazizi', trip: 'Bizerte - Tunis', date: 'Dec 2, 2025', seat: 'C08', amount: '8.00 TND', status: 'CONFIRMED' },
];

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">
            View and manage all passenger bookings
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">Total Bookings</div>
          <div className="text-2xl font-bold">1,234</div>
          <div className="text-xs text-green-600">+12% from last month</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">Confirmed</div>
          <div className="text-2xl font-bold">987</div>
          <div className="text-xs text-muted-foreground">80% of total</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">Pending</div>
          <div className="text-2xl font-bold">147</div>
          <div className="text-xs text-muted-foreground">12% of total</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">Cancelled</div>
          <div className="text-2xl font-bold">100</div>
          <div className="text-xs text-red-600">8% of total</div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Passenger</TableHead>
              <TableHead>Trip</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Seat</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.passenger}</TableCell>
                <TableCell>{booking.trip}</TableCell>
                <TableCell>{booking.date}</TableCell>
                <TableCell>{booking.seat}</TableCell>
                <TableCell>{booking.amount}</TableCell>
                <TableCell>
                  <Badge variant={booking.status === 'CONFIRMED' ? 'default' : 'secondary'}>
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
