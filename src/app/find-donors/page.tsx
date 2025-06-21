
"use client";

import Header from '@/components/layout/header';
import DonorTable from '@/components/dashboard/donor-table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useDonors } from '@/context/donor-context';

export default function FindDonorsPage() {
  const { donors } = useDonors();

  return (
    <div className="flex flex-col gap-8">
      <Header title="Donor Network" />
      <main className="grid flex-1 gap-8 p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Donor Network Registry</CardTitle>
            <CardDescription>
              Search our network of registered donors. In case of emergencies or low stock, you can contact them directly to request donations.
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
