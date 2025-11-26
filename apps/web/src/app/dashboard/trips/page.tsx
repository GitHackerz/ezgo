'use client';

import { Plus, Calendar } from 'lucide-react';
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

const trips = [
  { id: '1', route: 'Tunis - Sousse Express', departure: '08:00 AM', bus: 'TUN-1234', driver: 'Ahmed Ben Ali', seats: '45/50', status: 'SCHEDULED' },
  { id: '2', route: 'Sfax - Gabès', departure: '10:30 AM', bus: 'TUN-5678', driver: 'Mohamed Trabelsi', seats: '30/45', status: 'IN_PROGRESS' },
  { id: '3', route: 'Bizerte - Tunis', departure: '02:00 PM', bus: 'TUN-9012', driver: 'Karim Jebali', seats: '50/55', status: 'SCHEDULED' },
];

export default function TripsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trip Schedule</h1>
          <p className="text-muted-foreground">
            Manage and monitor all scheduled trips
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Trip
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline">
          <Calendar className="mr-2 h-4 w-4" />
          Today
        </Button>
        <Button variant="outline">This Week</Button>
        <Button variant="outline">This Month</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Route</TableHead>
              <TableHead>Departure</TableHead>
              <TableHead>Bus</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Seats</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trips.map((trip) => (
              <TableRow key={trip.id}>
                <TableCell className="font-medium">{trip.route}</TableCell>
                <TableCell>{trip.departure}</TableCell>
                <TableCell>{trip.bus}</TableCell>
                <TableCell>{trip.driver}</TableCell>
                <TableCell>{trip.seats}</TableCell>
                <TableCell>
                  <Badge variant={trip.status === 'IN_PROGRESS' ? 'default' : 'secondary'}>
                    {trip.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">View</Button>
                  <Button variant="ghost" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
