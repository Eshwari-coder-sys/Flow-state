
"use client";

import type { Donor, InventoryItem } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { addDays, format } from 'date-fns';

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
  const [donors, setDonors] = useState<Donor[]>([]);
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
          const expiryDate = format(addDays(new Date(), 42), 'yyyy-MM-dd');
          
          const existingItemIndex = newInventory.findIndex(
            (item) => item.bloodType === newItemData.bloodType && item.expiryDate === expiryDate
          );
  
          if (existingItemIndex > -1) {
            newInventory[existingItemIndex].quantity += newItemData.quantity;
          } else {
            const newItem: InventoryItem = {
              ...newItemData,
              id: `inv-${Date.now()}-${Math.random()}`,
              expiryDate: expiryDate,
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
