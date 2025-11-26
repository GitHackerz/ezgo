'use client';

import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Mock data - replace with API call
const buses = [
  { id: '1', plateNumber: 'TUN-1234', model: 'Mercedes Sprinter', capacity: 50, status: 'ACTIVE', lastUpdated: '2 mins ago' },
  { id: '2', plateNumber: 'TUN-5678', model: 'Volvo 9700', capacity: 45, status: 'ACTIVE', lastUpdated: '5 mins ago' },
  { id: '3', plateNumber: 'TUN-9012', model: 'Scania Touring', capacity: 55, status: 'MAINTENANCE', lastUpdated: '1 hour ago' },
];

export default function FleetPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fleet Management</h1>
          <p className="text-muted-foreground">
            Manage your bus fleet and track real-time locations
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Bus
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by plate number or model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plate Number</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {buses.map((bus) => (
              <TableRow key={bus.id}>
                <TableCell className="font-medium">{bus.plateNumber}</TableCell>
                <TableCell>{bus.model}</TableCell>
                <TableCell>{bus.capacity} seats</TableCell>
                <TableCell>
                  <Badge variant={bus.status === 'ACTIVE' ? 'default' : 'secondary'}>
                    {bus.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{bus.lastUpdated}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Edit</Button>
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
