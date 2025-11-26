'use client';

import { Plus, MapPin } from 'lucide-react';
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

const routes = [
  { id: '1', name: 'Tunis - Sousse Express', origin: 'Tunis', destination: 'Sousse', distance: '140 km', trips: 12, isActive: true },
  { id: '2', name: 'Sfax - Gabès', origin: 'Sfax', destination: 'Gabès', distance: '120 km', trips: 8, isActive: true },
  { id: '3', name: 'Bizerte - Tunis', origin: 'Bizerte', destination: 'Tunis', distance: '65 km', trips: 15, isActive: false },
];

export default function RoutesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Routes</h1>
          <p className="text-muted-foreground">
            Manage your bus routes and stops
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Route
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Route Name</TableHead>
              <TableHead>Origin</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Distance</TableHead>
              <TableHead>Active Trips</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {routes.map((route) => (
              <TableRow key={route.id}>
                <TableCell className="font-medium">{route.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {route.origin}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {route.destination}
                  </div>
                </TableCell>
                <TableCell>{route.distance}</TableCell>
                <TableCell>{route.trips} trips</TableCell>
                <TableCell>
                  <Badge variant={route.isActive ? 'default' : 'secondary'}>
                    {route.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
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
