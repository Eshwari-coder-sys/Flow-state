import { Droplets, TrendingUp, AlertTriangle, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { InventoryItem } from '@/lib/types';

interface StatsCardsProps {
  inventory: InventoryItem[];
}

export default function StatsCards({ inventory }: StatsCardsProps) {
  const totalUnits = inventory.reduce((acc, item) => acc + item.quantity, 0);
  const expiringSoon = inventory.filter(item => item.status === 'Expiring Soon').length;
  const lowStock = inventory.filter(item => item.status === 'Low').length;
  const bloodTypes = new Set(inventory.map(item => item.bloodType)).size;

  const stats = [
    { title: 'Total Units', value: totalUnits, icon: Droplets, description: 'Across all blood types' },
    { title: 'Blood Types', value: bloodTypes, icon: Users, description: 'Unique types in stock' },
    { title: 'Expiring Soon', value: expiringSoon, icon: AlertTriangle, description: 'Units expiring in <15 days' },
    { title: 'Low Stock', value: lowStock, icon: TrendingUp, description: 'Types with low units', isWarning: true },
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
