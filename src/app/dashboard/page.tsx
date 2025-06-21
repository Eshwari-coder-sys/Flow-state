
"use client";

import Link from 'next/link';
import Header from '@/components/layout/header';
import StatsCards from '@/components/dashboard/stats-cards';
import BloodTypeChart from '@/components/dashboard/blood-type-chart';
import InventoryTable from '@/components/dashboard/inventory-table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useDonors } from '@/context/donor-context';

export default function DashboardPage() {
  const { inventory, donors } = useDonors();

  return (
    <div className="flex flex-col gap-8">
      <Header title="Dashboard" />
      <main className="grid flex-1 gap-8 p-4 md:p-6">
        <StatsCards inventory={inventory} donors={donors} />

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
              <InventoryTable data={inventory} />
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Blood Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <BloodTypeChart data={inventory} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
