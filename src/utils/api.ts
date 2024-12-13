import type { Reservation } from '../types';

export async function submitReservation(reservation: Omit<Reservation, 'id'>): Promise<{ success: boolean; message: string }> {
  // Simulate API call with 1 second delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real application, this would be an actual API call
  // For now, we'll simulate a successful response
  return {
    success: true,
    message: 'Reservación confirmada exitosamente',
  };
}