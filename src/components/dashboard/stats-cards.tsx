
import { Droplets, TrendingUp, AlertTriangle, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { InventoryItem } from '@/lib/types';
import { differenceInDays } from 'date-fns';

interface StatsCardsProps {
  inventory: InventoryItem[];
}

const EXPIRY_THRESHOLD_DAYS = 15;
const LOW_STOCK_THRESHOLD = 10;

export default function StatsCards({ inventory }: StatsCardsProps) {
  const totalUnits = inventory.reduce((acc, item) => acc + item.quantity, 0);

  const expiringSoonItems = inventory.filter(item => differenceInDays(new Date(item.expiryDate), new Date()) < EXPIRY_THRESHOLD_DAYS);
  const expiringSoonUnits = expiringSoonItems.reduce((sum, item) => sum + item.quantity, 0);

  const lowStockItems = inventory.filter(item => item.quantity < LOW_STOCK_THRESHOLD);
  
  const bloodTypesInStock = new Set(inventory.map(item => item.bloodType)).size;

  const stats = [
    { title: 'Total Units', value: totalUnits, icon: Droplets, description: 'Across all blood types' },
    { title: 'Blood Types in Stock', value: bloodTypesInStock, icon: Users, description: 'Unique types in stock' },
    { title: 'Expiring Units', value: expiringSoonUnits, icon: AlertTriangle, description: `In the next ${EXPIRY_THRESHOLD_DAYS} days` },
    { title: 'Low Stock Items', value: lowStockItems.length, icon: TrendingUp, description: `Items with < ${LOW_STOCK_THRESHOLD} units`, isWarning: true },
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
