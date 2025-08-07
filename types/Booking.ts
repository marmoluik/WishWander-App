export interface BookingInfo {
  id: string;
  type: 'flight' | 'hotel';
  provider: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  confirmationNumber?: string;
  link?: string;
}
