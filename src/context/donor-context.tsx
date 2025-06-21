
"use client";

import type { Donor, InventoryItem } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

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


interface BloodBankContextType {
  donors: Donor[];
  addDonor: (donor: Omit<Donor, 'id' | 'lastDonation'>) => void;
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  requestBlood: (bloodType: InventoryItem['bloodType'], units: number) => void;
}

const BloodBankContext = createContext<BloodBankContextType | undefined>(undefined);

export function DonorProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [donors, setDonors] = useState<Donor[]>(mockDonors);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const addDonor = (newDonorData: Omit<Donor, 'id' | 'lastDonation'>) => {
    const newDonor: Donor = {
      ...newDonorData,
      id: (donors.length + 1).toString(),
      lastDonation: new Date().toISOString().split('T')[0],
    };
    setDonors((prevDonors) => [newDonor, ...prevDonors]);
  };
  
  const addInventoryItem = (newItemData: Omit<InventoryItem, 'id'>) => {
      setInventory(prevInventory => {
          const newInventory = [...prevInventory];
          const existingItemIndex = newInventory.findIndex(
            (item) => item.bloodType === newItemData.bloodType && item.expiryDate === newItemData.expiryDate
          );
  
          if (existingItemIndex > -1) {
            newInventory[existingItemIndex].quantity += newItemData.quantity;
          } else {
            const newItem: InventoryItem = {
              ...newItemData,
              id: `inv-${Date.now()}-${Math.random()}`
            };
            newInventory.unshift(newItem);
          }
          return newInventory;
      });
  };

  const requestBlood = (bloodType: InventoryItem['bloodType'], units: number) => {
      setInventory(prevInventory => {
          const updatedInventory = JSON.parse(JSON.stringify(prevInventory));
          let unitsToFulfill = units;

          updatedInventory.sort((a: InventoryItem, b: InventoryItem) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

          for (const item of updatedInventory) {
              if (item.bloodType === bloodType && item.quantity > 0) {
                  const take = Math.min(unitsToFulfill, item.quantity);
                  item.quantity -= take;
                  unitsToFulfill -= take;
                  if (unitsToFulfill === 0) break;
              }
          }

          if (unitsToFulfill > 0) {
              toast({
                  variant: "destructive",
                  title: "Inventory Alert",
                  description: `Could not fulfill the entire request. Short by ${unitsToFulfill} units of ${bloodType}.`,
              });
          }
          
          return updatedInventory.filter((item: InventoryItem) => item.quantity > 0);
      });
  };


  return (
    <BloodBankContext.Provider value={{ donors, addDonor, inventory, addInventoryItem, requestBlood }}>
      {children}
    </BloodBankContext.Provider>
  );
}

export function useDonors() {
  const context = useContext(BloodBankContext);
  if (context === undefined) {
    throw new Error('useDonors must be used within a DonorProvider');
  }
  return context;
}
