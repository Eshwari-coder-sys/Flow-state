
"use client";

import Header from '@/components/layout/header';
import DonorTable from '@/components/dashboard/donor-table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useDonors } from '@/context/donor-context';

export default function FindDonorsPage() {
  const { donors } = useDonors();

  return (
    <div className="flex flex-col gap-8">
      <Header title="Find Donors" />
      <main className="grid flex-1 gap-8 p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Donor Registry</CardTitle>
            <CardDescription>
              Search and filter our list of registered donors for emergency blood requests. Contact information is provided for immediate access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DonorTable data={donors} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
