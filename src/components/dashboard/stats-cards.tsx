
import { Droplets, TrendingUp, AlertTriangle, Users, Archive } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Donor, BloodUnit } from '@/lib/types';
import { differenceInDays } from 'date-fns';

interface StatsCardsProps {
  inventory: BloodUnit[];
  donors: Donor[];
}

const EXPIRY_THRESHOLD_DAYS = 15;

export default function StatsCards({ inventory, donors }: StatsCardsProps) {
  const availableUnits = inventory.filter(item => item.status === 'Available');
  const totalAvailableUnits = availableUnits.length;

  const expiringSoonItems = availableUnits.filter(item => differenceInDays(new Date(item.expiryDate), new Date()) < EXPIRY_THRESHOLD_DAYS);
  const expiringSoonUnits = expiringSoonItems.length;

  const reservedUnits = inventory.filter(item => item.status === 'Reserved').length;
  
  const totalDonors = donors.length;

  const stats = [
    { title: 'Available Units', value: totalAvailableUnits, icon: Droplets, description: 'Across all blood types' },
    { title: 'Total Donors', value: totalDonors, icon: Users, description: 'Registered in the system' },
    { title: 'Expiring Soon', value: expiringSoonUnits, icon: AlertTriangle, description: `Units expiring in < ${EXPIRY_THRESHOLD_DAYS} days` },
    { title: 'Reserved Units', value: reservedUnits, icon: Archive, description: 'Units reserved for requests' },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
