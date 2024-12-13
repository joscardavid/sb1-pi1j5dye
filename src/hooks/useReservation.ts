import { useState } from 'react';
import type { Table } from '../types';

interface UseReservationReturn {
  selectedDate: Date;
  selectedTime: string | null;
  selectedTable: Table | null;
  setSelectedDate: (date: Date) => void;
  setSelectedTime: (time: string | null) => void;
  setSelectedTable: (table: Table | null) => void;
  resetSelection: () => void;
}

export function useReservation(): UseReservationReturn {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const resetSelection = () => {
    setSelectedDate(new Date());
    setSelectedTime(null);
    setSelectedTable(null);
  };

  return {
    selectedDate,
    selectedTime,
    selectedTable,
    setSelectedDate,
    setSelectedTime,
    setSelectedTable,
    resetSelection,
  };
}