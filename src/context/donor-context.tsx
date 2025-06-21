
"use client";

import type { Donor, BloodUnit } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { addDays, format } from 'date-fns';

interface BloodBankContextType {
  donors: Donor[];
  addDonor: (donor: Omit<Donor, 'id' | 'lastDonation'>) => void;
  inventory: BloodUnit[];
  addInventoryItem: (item: { bloodType: BloodUnit['bloodType'], quantity: number }) => void;
  requestBlood: (bloodType: BloodUnit['bloodType'], units: number) => void;
}

const BloodBankContext = createContext<BloodBankContextType | undefined>(undefined);

export function DonorProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [inventory, setInventory] = useState<BloodUnit[]>([]);

  const addDonor = (newDonorData: Omit<Donor, 'id' | 'lastDonation'>) => {
    const newDonor: Donor = {
      ...newDonorData,
      id: (donors.length + 1).toString(),
      lastDonation: new Date().toISOString().split('T')[0],
    };
    setDonors((prevDonors) => [newDonor, ...prevDonors]);
  };
  
  const addInventoryItem = (newItemData: { bloodType: BloodUnit['bloodType'], quantity: number }) => {
      setInventory(prevInventory => {
          const newUnits: BloodUnit[] = [];
          const expiryDate = format(addDays(new Date(), 42), 'yyyy-MM-dd');
          
          for (let i = 0; i < newItemData.quantity; i++) {
              newUnits.push({
                  id: `unit-${Date.now()}-${Math.random()}`,
                  bloodType: newItemData.bloodType,
                  expiryDate: expiryDate,
                  status: 'Available'
              });
          }
          
          return [...newUnits, ...prevInventory];
      });
  };

  const requestBlood = (bloodType: BloodUnit['bloodType'], units: number) => {
      setInventory(prevInventory => {
          const updatedInventory = [...prevInventory];
          
          const availableUnits = updatedInventory.filter(unit => unit.bloodType === bloodType && unit.status === 'Available');
          
          if (availableUnits.length < units) {
              toast({
                  variant: "destructive",
                  title: "Inventory Alert",
                  description: `Could not fulfill the entire request. Only ${availableUnits.length} units of ${bloodType} available.`,
              });
              return prevInventory; // Don't change anything if request can't be fulfilled
          }

          // Sort by expiry date to use oldest blood first
          availableUnits.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

          for (let i = 0; i < units; i++) {
              const unitToReserve = availableUnits[i];
              const originalUnitIndex = updatedInventory.findIndex(u => u.id === unitToReserve.id);
              if (originalUnitIndex > -1) {
                  updatedInventory[originalUnitIndex].status = 'Reserved';
              }
          }
          
          return updatedInventory;
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
