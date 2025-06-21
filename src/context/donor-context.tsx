
"use client";

import type { Donor, BloodUnit } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { addDays, format } from 'date-fns';

interface BloodBankContextType {
  donors: Donor[];
  addDonor: (donor: Omit<Donor, 'id' | 'lastDonation'>) => void;
  inventory: BloodUnit[];
  addInventoryItem: (item: { bloodType: BloodUnit['bloodType'], quantity: number, bloodBankName: string, bloodBankAddress: string }) => void;
  requestBlood: (bloodType: BloodUnit['bloodType'], units: number) => boolean;
  fulfillRequestByDonor: (donor: Donor) => void;
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
  
  const addInventoryItem = (newItemData: { bloodType: BloodUnit['bloodType'], quantity: number, bloodBankName: string, bloodBankAddress: string }) => {
      setInventory(prevInventory => {
          const newUnits: BloodUnit[] = [];
          const expiryDate = format(addDays(new Date(), 42), 'yyyy-MM-dd');
          
          for (let i = 0; i < newItemData.quantity; i++) {
              newUnits.push({
                  id: `unit-${Date.now()}-${Math.random()}`,
                  bloodType: newItemData.bloodType,
                  expiryDate: expiryDate,
                  status: 'Available',
                  bloodBankName: newItemData.bloodBankName,
                  bloodBankAddress: newItemData.bloodBankAddress,
              });
          }
          
          return [...newUnits, ...prevInventory];
      });
  };

  const requestBlood = (bloodType: BloodUnit['bloodType'], units: number): boolean => {
      const availableUnits = inventory.filter(unit => unit.bloodType === bloodType && unit.status === 'Available');
      
      if (availableUnits.length < units) {
          toast({
              variant: "destructive",
              title: "Inventory Alert",
              description: `Could not fulfill the entire request. Only ${availableUnits.length} units of ${bloodType} available.`,
          });
          return false;
      }
      
      setInventory(prevInventory => {
          const updatedInventory = [...prevInventory];
          
          const currentAvailableUnits = updatedInventory.filter(unit => unit.bloodType === bloodType && unit.status === 'Available');
          
          currentAvailableUnits.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

          for (let i = 0; i < units; i++) {
              const unitToReserve = currentAvailableUnits[i];
              if (unitToReserve) {
                const originalUnitIndex = updatedInventory.findIndex(u => u.id === unitToReserve.id);
                if (originalUnitIndex > -1) {
                    updatedInventory[originalUnitIndex].status = 'Reserved';
                }
              }
          }
          
          return updatedInventory;
      });

      const matchingDonors = donors.filter(
        (donor) => donor.bloodType === bloodType
      );
      toast({
        title: "Request Submitted & Units Reserved!",
        description: `An alert has been sent to ${matchingDonors.length} matching donor(s) with blood type ${bloodType} to encourage new donations.`,
      });
      
      return true;
  };

  const fulfillRequestByDonor = (donor: Donor) => {
    addInventoryItem({
      bloodType: donor.bloodType,
      quantity: 1,
      bloodBankName: donor.bloodBankName,
      bloodBankAddress: donor.bloodBankAddress,
    });

    setDonors(prevDonors =>
      prevDonors.map(d =>
        d.id === donor.id
          ? { ...d, lastDonation: new Date().toISOString().split('T')[0] }
          : d
      )
    );

    toast({
      title: "Request Accepted & Met Successfully!",
      description: `Thank you, ${donor.fullName}. Your donation has been recorded in the inventory.`,
    });
  };

  return (
    <BloodBankContext.Provider value={{ donors, addDonor, inventory, addInventoryItem, requestBlood, fulfillRequestByDonor }}>
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
