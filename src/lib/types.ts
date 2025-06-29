export type BloodUnit = {
    id: string;
    bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    expiryDate: string;
    status: 'Available' | 'Reserved';
    bloodBankName: string;
    bloodBankAddress: string;
};

export type Donor = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  address: string;
  city: string;
  state: string;
  country: string;
  lastDonation: string;
  bloodBankName: string;
  bloodBankAddress: string;
};
