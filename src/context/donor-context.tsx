
"use client";

import type { Donor } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode } from 'react';

// The initial mock data for donors.
const mockDonors: Donor[] = [
  { id: '1', fullName: 'John Smith', email: 'john.s@example.com', phone: '555-123-4567', bloodType: 'O+', address: '123 Main St', city: 'Springfield', state: 'IL', country: 'USA', lastDonation: '2024-05-10' },
  { id: '2', fullName: 'Jane Doe', email: 'jane.d@example.com', phone: '555-987-6543', bloodType: 'A-', address: '456 Oak Ave', city: 'Shelbyville', state: 'IL', country: 'USA', lastDonation: '2024-06-20' },
  { id: '3', fullName: 'Peter Jones', email: 'peter.j@example.com', phone: '555-555-1212', bloodType: 'B+', address: '789 Pine Ln', city: 'Springfield', state: 'MA', country: 'USA', lastDonation: '2024-04-01' },
  { id: '4', fullName: 'Mary Johnson', email: 'mary.j@example.com', phone: '555-345-6789', bloodType: 'AB+', address: '101 Maple Dr', city: 'Capital City', state: 'CA', country: 'USA', lastDonation: '2024-07-02' },
  { id: '5', fullName: 'David Williams', email: 'david.w@example.com', phone: '555-234-5678', bloodType: 'O-', address: '212 Birch Rd', city: 'Springfield', state: 'IL', country: 'USA', lastDonation: '2024-03-15' },
  { id: '6', fullName: 'Sarah Brown', email: 'sarah.b@example.com', phone: '555-876-5432', bloodType: 'A+', address: '333 Cedar Ct', city: 'Toronto', state: 'ON', country: 'Canada', lastDonation: '2024-06-30' },
  { id: '7', fullName: 'Michael Davis', email: 'michael.d@example.com', phone: '555-111-2222', bloodType: 'B-', address: '456 Elm St', city: 'Vancouver', state: 'BC', country: 'Canada', lastDonation: '2024-07-11' },
  { id: '8', fullName: 'Linda Miller', email: 'linda.m@example.com', phone: '555-333-4444', bloodType: 'O+', address: '789 Oak Blvd', city: 'Springfield', state: 'MA', country: 'USA', lastDonation: '2024-02-28' },
  { id: '9', fullName: 'Robert Wilson', email: 'robert.w@example.com', phone: '555-444-5555', bloodType: 'A+', address: '111 Pine St', city: 'Springfield', state: 'IL', country: 'USA', lastDonation: '2024-01-20' },
];


interface DonorContextType {
  donors: Donor[];
  addDonor: (donor: Omit<Donor, 'id' | 'lastDonation'>) => void;
}

const DonorContext = createContext<DonorContextType | undefined>(undefined);

export function DonorProvider({ children }: { children: ReactNode }) {
  const [donors, setDonors] = useState<Donor[]>(mockDonors);

  const addDonor = (newDonorData: Omit<Donor, 'id' | 'lastDonation'>) => {
    const newDonor: Donor = {
      ...newDonorData,
      id: (donors.length + 1).toString(),
      lastDonation: new Date().toISOString().split('T')[0], // Set last donation to today
    };
    setDonors((prevDonors) => [newDonor, ...prevDonors]);
  };

  return (
    <DonorContext.Provider value={{ donors, addDonor }}>
      {children}
    </DonorContext.Provider>
  );
}

export function useDonors() {
  const context = useContext(DonorContext);
  if (context === undefined) {
    throw new Error('useDonors must be used within a DonorProvider');
  }
  return context;
}
