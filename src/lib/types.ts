export type InventoryItem = {
    id: string;
    bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    quantity: number;
    expiryDate: Date;
    status: 'Available' | 'Low' | 'Expiring Soon';
};
