import Header from '@/components/layout/header';
import DonorTable from '@/components/dashboard/donor-table';
import type { Donor } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const mockDonors: Donor[] = [
  { id: '1', fullName: 'John Smith', email: 'john.s@example.com', phone: '555-123-4567', bloodType: 'O+', address: '123 Main St', city: 'Springfield', state: 'IL', country: 'USA', lastDonation: new Date('2024-05-10') },
  { id: '2', fullName: 'Jane Doe', email: 'jane.d@example.com', phone: '555-987-6543', bloodType: 'A-', address: '456 Oak Ave', city: 'Shelbyville', state: 'IL', country: 'USA', lastDonation: new Date('2024-06-20') },
  { id: '3', fullName: 'Peter Jones', email: 'peter.j@example.com', phone: '555-555-1212', bloodType: 'B+', address: '789 Pine Ln', city: 'Springfield', state: 'MA', country: 'USA', lastDonation: new Date('2024-04-01') },
  { id: '4', fullName: 'Mary Johnson', email: 'mary.j@example.com', phone: '555-345-6789', bloodType: 'AB+', address: '101 Maple Dr', city: 'Capital City', state: 'CA', country: 'USA', lastDonation: new Date('2024-07-02') },
  { id: '5', fullName: 'David Williams', email: 'david.w@example.com', phone: '555-234-5678', bloodType: 'O-', address: '212 Birch Rd', city: 'Springfield', state: 'IL', country: 'USA', lastDonation: new Date('2024-03-15') },
  { id: '6', fullName: 'Sarah Brown', email: 'sarah.b@example.com', phone: '555-876-5432', bloodType: 'A+', address: '333 Cedar Ct', city: 'Toronto', state: 'ON', country: 'Canada', lastDonation: new Date('2024-06-30') },
  { id: '7', fullName: 'Michael Davis', email: 'michael.d@example.com', phone: '555-111-2222', bloodType: 'B-', address: '456 Elm St', city: 'Vancouver', state: 'BC', country: 'Canada', lastDonation: new Date('2024-07-11') },
  { id: '8', fullName: 'Linda Miller', email: 'linda.m@example.com', phone: '555-333-4444', bloodType: 'O+', address: '789 Oak Blvd', city: 'Springfield', state: 'MA', country: 'USA', lastDonation: new Date('2024-02-28') },
];

export default function FindDonorsPage() {
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
            <DonorTable data={mockDonors} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
