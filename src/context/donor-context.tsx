
"use client";

import type { Donor, InventoryItem } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

// The initial mock data for donors.
const mockDonors: Donor[] = [
  { id: '1', fullName: 'Rajesh Kumar', email: 'rajesh.k@example.com', phone: '98-1234-5678', bloodType: 'O+', address: '123 Marine Drive', city: 'Mumbai', state: 'Maharashtra', country: 'India', lastDonation: '2024-05-10' },
  { id: '2', fullName: 'Priya Sharma', email: 'priya.s@example.com', phone: '99-9876-5432', bloodType: 'A-', address: '456 Connaught Place', city: 'Delhi', state: 'Delhi', country: 'India', lastDonation: '2024-06-20' },
  { id: '3', fullName: 'Amit Patel', email: 'amit.p@example.com', phone: '97-5551-2121', bloodType: 'B+', address: '789 MG Road', city: 'Bangalore', state: 'Karnataka', country: 'India', lastDonation: '2024-04-01' },
  { id: '4', fullName: 'Sunita Rao', email: 'sunita.r@example.com', phone: '96-3456-7890', bloodType: 'AB+', address: '101 Anna Salai', city: 'Chennai', state: 'Tamil Nadu', country: 'India', lastDonation: '2024-07-02' },
  { id: '5', fullName: 'Vikram Singh', email: 'vikram.s@example.com', phone: '95-2345-6789', bloodType: 'O-', address: '212 Jubilee Hills', city: 'Hyderabad', state: 'Telangana', country: 'India', lastDonation: '2024-03-15' },
  { id: '6', fullName: 'Anjali Gupta', email: 'anjali.g@example.com', phone: '94-8765-4321', bloodType: 'A+', address: '333 Park Street', city: 'Kolkata', state: 'West Bengal', country: 'India', lastDonation: '2024-06-30' },
  { id: '7', fullName: 'Sanjay Verma', email: 'sanjay.v@example.com', phone: '93-1112-2222', bloodType: 'B-', address: '456 FC Road', city: 'Pune', state: 'Maharashtra', country: 'India', lastDonation: '2024-07-11' },
  { id: '8', fullName: 'Meera Nair', email: 'meera.n@example.com', phone: '92-3334-4444', bloodType: 'O+', address: '789 CG Road', city: 'Ahmedabad', state: 'Gujarat', country: 'India', lastDonation: '2024-02-28' },
  { id: '9', fullName: 'Arun Joshi', email: 'arun.j@example.com', phone: '91-4445-5555', bloodType: 'A+', address: '111 MI Road', city: 'Jaipur', state: 'Rajasthan', country: 'India', lastDonation: '2024-01-20' },
];

// The initial mock data for inventory.
const mockInventory: InventoryItem[] = [
    { id: 'inv-1', bloodType: 'O+', quantity: 35, expiryDate: '2024-09-15' },
    { id: 'inv-2', bloodType: 'A+', quantity: 22, expiryDate: '2024-09-20' },
    { id: 'inv-3', bloodType: 'B+', quantity: 18, expiryDate: '2024-08-28' },
    { id: 'inv-4', bloodType: 'AB+', quantity: 7, expiryDate: '2024-08-15' },
    { id: 'inv-5', bloodType: 'O-', quantity: 12, expiryDate: '2024-09-02' },
    { id: 'inv-6', bloodType: 'A-', quantity: 9, expiryDate: '2024-08-22' },
    { id: 'inv-7', bloodType: 'B-', quantity: 4, expiryDate: '2024-08-19' },
    { id: 'inv-8', bloodType: 'A+', quantity: 10, expiryDate: '2024-08-25' },
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
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);

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
