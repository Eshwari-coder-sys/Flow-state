import Link from 'next/link';
import Header from '@/components/layout/header';
import StatsCards from '@/components/dashboard/stats-cards';
import BloodTypeChart from '@/components/dashboard/blood-type-chart';
import InventoryTable from '@/components/dashboard/inventory-table';
import type { InventoryItem } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const mockInventory: InventoryItem[] = [
  { id: '1', bloodType: 'A+', quantity: 25, expiryDate: '2024-09-15', status: 'Available' },
  { id: '2', bloodType: 'O-', quantity: 10, expiryDate: '2024-08-05', status: 'Expiring Soon' },
  { id: '3', bloodType: 'B+', quantity: 18, expiryDate: '2024-10-01', status: 'Available' },
  { id: '4', bloodType: 'AB+', quantity: 5, expiryDate: '2024-08-20', status: 'Low' },
  { id: '5', bloodType: 'O+', quantity: 40, expiryDate: '2024-09-28', status: 'Available' },
  { id: '6', bloodType: 'A-', quantity: 12, expiryDate: '2024-10-10', status: 'Available' },
  { id: '7', bloodType: 'B-', quantity: 8, expiryDate: '2024-08-12', status: 'Low' },
  { id: '8', bloodType: 'AB-', quantity: 3, expiryDate: '2024-09-02', status: 'Expiring Soon' },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <Header title="Dashboard" />
      <main className="grid flex-1 gap-8 p-4 md:p-6">
        <StatsCards inventory={mockInventory} />

        <Card className="bg-primary/10 border-primary/40">
          <CardHeader>
            <CardTitle>Emergency Donor Search</CardTitle>
            <CardDescription>
              In urgent need of a specific blood type? Search our registry to find nearby registered donors.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/find-donors">
                <Search className="mr-2" />
                Find a Donor
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Inventory Details</CardTitle>
            </CardHeader>
            <CardContent>
              <InventoryTable data={mockInventory} />
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Blood Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <BloodTypeChart data={mockInventory} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
